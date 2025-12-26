"use client"

import { subscribedData, subscriptionsGet } from "@/ApiCall/Subscription";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"


const Image_URL = "https://green-owl-255815.hostingersite.com/";


const faqs = [
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the charges accordingly.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and for Enterprise plans, we also offer invoicing.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes! You can try our Basic plan free for 14 days with no credit card required. Upgrade anytime to access more features.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Absolutely. You can cancel your subscription at any time from your account settings. You'll retain access until the end of your billing period.",
  },
  {
    question: "Do you offer discounts for annual plans?",
    answer:
      "Yes! Annual plans save you 20% compared to monthly billing. The discount is automatically applied when you choose yearly billing.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "All plans include email support. Business and Enterprise plans get priority support with faster response times, and Enterprise includes a dedicated account manager.",
  },
]

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


async function handleRazorpayPayment(plan, billingPeriod, router) {

  const res = await loadRazorpay();
  

  if (!res) {
    alert("Razorpay SDK failed to load");
    return;
  }
  
  const amount =
  billingPeriod === "yearly"
  ? getDisplayPrice(plan, "yearly")
  : getDisplayPrice(plan, "monthly");

  const options = {
    key: "rzp_test_RLPCBCYerPsEnt", 
    amount: amount * 100, // Razorpay works in paise
    currency: "INR",
    name: "Alphonic Crm",
    description: `${plan.type} (${billingPeriod}) plan`,
    handler: async function (response) {
      const payload = {
        plan_id: plan.id,
        plan_type: plan.type,
        billing_type: billingPeriod,
        amount: amount,
        transaction_id: response.razorpay_payment_id,
        payment_status: true
      };
      
      const resData =  await subscribedData(payload);
      if(resData?.status === "success"){
        alert("Subscription successful!");
        router.push("/company");
      } else {
        alert("Subscription failed. Please try again.");
      }

    },
    theme: {
      color: "#d4f1f4",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}


function getDisplayPrice(plan, billingPeriod) {
  const basePrice = Number(plan.price); // convert string → number


  // If plan itself is yearly
  if (plan.billing_type === "yearly") {
    if (billingPeriod === "monthly") {
      return Math.round(basePrice / 12);
    }
    return basePrice;
  }

  // If plan itself is monthly
  if (billingPeriod === "yearly") {
    const discount = plan.discount_per_year || 0;
    const yearlyPrice = basePrice * 12;
    return Math.round(yearlyPrice - (yearlyPrice * discount) / 100);
  }

  return basePrice;
}
function getSavingsPercent(plan) {
  // Case 1: backend already gives discount
  if (plan.discount_per_year) {
    return Number(plan.discount_per_year);
  }

  // Case 2: calculate from monthly → yearly
  if (plan.monthly_price && plan.yearly_price) {
    const monthlyTotal = plan.monthly_price * 12;
    const yearlyTotal = plan.yearly_price;
    return Math.round(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100);
  }

  return 0;
}
function getHighestSavingsPercent(plan) {
  // Case 1: backend already gives discount
  if (plan?.discount_per_year) {
    return Number(plan.discount_per_year);
  }

  // Case 2: calculate from monthly → yearly prices
  if (plan?.monthly_price && plan?.yearly_price) {
    const monthlyTotal = Number(plan.monthly_price) * 12;
    const yearlyTotal = Number(plan.yearly_price);

    if (monthlyTotal > yearlyTotal) {
      return Math.round(
        ((monthlyTotal - yearlyTotal) / monthlyTotal) * 100
      );
    }
  }

  return 0;
}

  function getMaxSavingsPercent(plans = []) {
  return plans.reduce((max, plan) => {
    const percent = getHighestSavingsPercent(plan);
    return percent > max ? percent : max;
  }, 0);
}


function PricingCard({ plan, billingPeriod }) {
  const router = useRouter();
  const [paying, setPaying] = useState(false);
 const displayPrice = getDisplayPrice(plan, billingPeriod);
  const savingsPercent = getSavingsPercent(plan);
  return (
    <div
      className="position-relative rounded-4 p-4 d-flex flex-column h-100 overflow-hidden"
      style={{
        backgroundColor: plan.bgcolor,
        color: plan.textColor,
        backgroundImage: `url('${Image_URL}/${plan.bg_image}')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom right",
      }}
    >
      {/* Popular Badge */}
      {plan.is_popular === "true" && (
        <div className="position-absolute top-0 end-0">
          <div
            className="bg-dark text-white px-4 py-2 small fw-medium"
            style={{
              transform: "rotate(45deg) translate(28px, -8px)",
              fontSize: "0.75rem",
              borderRadius: "8px",
            }}
          >
            Most popular
          </div>
        </div>
      )}

      <h2 className="mb-3 fs-16 fw-semibold">{plan.type}</h2>

      {/* Price */}
      <div className="mb-2 d-flex align-items-baseline gap-2">
        <span className="display-4 fw-bold">₹{displayPrice}</span>
         {billingPeriod === "yearly" && savingsPercent > 0 && (
    <span className="small fw-medium text-warning">
      SAVE {savingsPercent}%
    </span>
  )}
      </div>

      <p className="mb-3 small opacity-75">
        per user/{billingPeriod === "yearly" ? "year" : "month"}
      </p>

      <p className="mb-4 small lh-base">{plan.description}</p>



<button
  className="btn btn-outline-dark w-100 border-2 fw-medium mb-4"
  disabled={paying}
  onClick={async () => {
    setPaying(true);
    await handleRazorpayPayment(plan, billingPeriod,router);
    setPaying(false);
  }}
>
  {paying ? "Processing..." : plan.button_text}
</button>
      

      {/* Features */}
      <div className="mt-auto">
        <p className="small fw-semibold mb-2">What's included:</p>
        <ul className="list-unstyled small">
          {plan.features?.map((feature) => (
            <li key={feature.id} className="mb-2 d-flex align-items-start">
              <svg className="me-2 flex-shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.485 1.929a1 1 0 0 1 .102 1.411l-7.5 9a1 1 0 0 1-1.474.08l-3.5-3.5a1 1 0 0 1 1.414-1.414l2.705 2.705 6.842-8.21a1 1 0 0 1 1.411-.102z" />
              </svg>
              <span>{feature.feature_name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="accordion" id="faqAccordion">
      {faqs.map((faq, index) => (
        <div key={index} className="accordion-item border-0 mb-3">
          <h3 className="accordion-header">
            <button
              className={`accordion-button ${openIndex === index ? "" : "collapsed"} bg-light shadow-sm rounded-3`}
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="fw-semibold">{faq.question}</span>
            </button>
          </h3>
          <div className={`accordion-collapse collapse ${openIndex === index ? "show" : ""}`}>
            <div className="accordion-body pt-3 pb-4">{faq.answer}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Page() {


  const [billingPeriod, setBillingPeriod] = useState("yearly");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
    const savingsPercent = getMaxSavingsPercent(plans);

  const companies = [
    ["Company A", "Company B", "Company C", "Company B"],
    ["Company D", "Company E", "Company F", "Company B"],
    ["Company G", "Company H", "Company I", "Company B"],
  ];

  useEffect(() => {
  const loadPlans = async () => {
    try {
      const res = await subscriptionsGet();

      if (res?.success && res?.data) {
        // Convert object → array
        const normalizedPlans = Object.entries(res.data).map(
          ([planType, plansArray]) => ({
            type: planType,
            ...plansArray[0], // assuming 1 plan per type
          })
        );

        setPlans(normalizedPlans);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  loadPlans();
}, []);

    useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % companies.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);
  

  
  return (
    <div className="min-vh-100 p-4 p-md-5 d-flex align-items-center ">
      {console.log("plan data", plans)}

        {loading && <p>Loading plans...</p>}

        {!loading && (
          <>

            <div className="container">
        <section className="py-5 text-center" >
        <div className="container py-5">
          <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-4">
            <small className="fw-medium text-white">Save upto {savingsPercent}% with annual billing</small>
          </div>
          <h1 className="display-3 fw-bold mb-4">Plans and Pricing</h1>
          <p className="lead text-muted mb-5 mx-auto" style={{ maxWidth: "700px" }}>
            Get started immediately for free. Upgrade for more credits, usage and collaboration.
            <br />
            Choose the perfect plan for your team's needs.
          </p>

          <div className="btn-group border rounded-3 shadow-sm" role="group">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`btn px-4 py-2 fw-medium ${billingPeriod === "monthly" ? "btn-dark" : "btn-light text-dark"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`btn px-4 py-2 fw-medium ${billingPeriod === "yearly" ? "btn-dark" : "btn-light text-dark"}`}
            >
              Yearly
               <span className="badge bg-warning text-dark ms-1 fs-10" >upto {savingsPercent}%</span>
             
            </button>
          </div>
        </div>
      </section>
        <div className="row g-4">
          {plans?.map((plan) => (
            <div key={plan.name} className="col-12 col-md-6 col-lg-3">
              <PricingCard plan={plan} billingPeriod={billingPeriod} />
            </div>
          ))}
        </div>

          
      <section className="py-5 mt-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Compare Plans</h2>
            <p className="lead text-muted">Find the perfect fit for your team</p>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold py-3">Features</th>
                  <th className="text-center fw-semibold py-3">Basic</th>
                  <th className="text-center fw-semibold py-3">Advanced</th>
                  <th className="text-center fw-semibold py-3">Business</th>
                  <th className="text-center fw-semibold py-3">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Team Members</td>
                  <td className="text-center">3</td>
                  <td className="text-center">10</td>
                  <td className="text-center">25</td>
                  <td className="text-center">Unlimited</td>
                </tr>
                <tr>
                  <td>Storage</td>
                  <td className="text-center">10GB</td>
                  <td className="text-center">100GB</td>
                  <td className="text-center">500GB</td>
                  <td className="text-center">Unlimited</td>
                </tr>
                <tr>
                  <td>Workflow Automation</td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-success">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-success">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-success">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-success">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>API Access</td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-muted">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-success">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-success">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-success">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Priority Support</td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-muted">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-muted">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-success">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-success">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Advanced Analytics</td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-muted">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-muted">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-success">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-success">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>SSO Authentication</td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-muted">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-muted">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-success">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </td>
                  <td className="text-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-success">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      
            <section className="py-5">
        <div className="container text-center">
          <p className="text-muted mb-4 fw-semibold">Trusted by over 10,000 teams worldwide</p>
          <div id="companyCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {companies.map((companyGroup, index) => (
                <div key={index} className={`carousel-item ${index === currentSlide ? "active" : ""}`}>
                  <div className="row align-items-center justify-content-center g-4 py-3">
                    {companyGroup.map((company, companyIndex) => (
                      <div key={companyIndex} className="col-6 col-md-3">
                        <div className="p-4 bg-light rounded-3 text-muted fw-semibold shadow-sm">{company}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + companies.length) % companies.length)}
              style={{ width: "5%", filter: "invert(1)" }}
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % companies.length)}
              style={{ width: "5%", filter: "invert(1)" }}
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>

          </div>
        </div>
      </section>

      
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold mb-3">Frequently Asked Questions</h2>
                <p className="lead text-muted">Everything you need to know about our pricing</p>
              </div>
              <FAQ />
            </div>
          </div>
        </div>
      </section>

    
      <section className="py-5 my-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="display-5 fw-bold mb-4">Ready to get started?</h2>
              <p className="lead text-muted mb-4">
                Join thousands of teams already using our platform to streamline their workflows
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <button className="btn btn-dark btn-lg px-5">Start free trial</button>
                <button className="btn btn-outline-dark btn-lg px-5">Contact sales</button>
              </div>
              <p className="small text-muted mt-3">No initial payment required • Cancel anytime • 14-day free trial</p>
            </div>
          </div>
        </div>
      </section>

      </div>
          </>
        )}
     
    </div>
  )
}

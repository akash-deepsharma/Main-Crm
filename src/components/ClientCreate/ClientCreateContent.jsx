'use client'
import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import TabProjectType from './TabProjectType'
import TabProjectSettings from './TabProjectSettings';
import TabProjectBudget from './TabProjectBudget';
import TabProjectAssigned from './TabProjectAssigned';
import TabAttachement from './TabAttachement';
import TabCompleted from './TabCompleted';
import { useSearchParams } from 'next/navigation';
const TabProjectDetails = dynamic(() => import('./TabProjectDetails'), { ssr: false })
const TabProjectTarget = dynamic(() => import('./TabProjectTarget'), { ssr: false })

const steps = [
    { name: "Type", required: true }, 
    { name: "Organisation Details", required: true }, 
    { name: "Financial Approval / Paying Authority Details", required: false },
    { name: "Consignee", required: false },  
    { name: "Service Details", required: false },
    { name: "Attachment", required: false },
    { name: "Completed", required: false } 
];
const BASE_URL = 'https://green-owl-255815.hostingersite.com/api';


const ProjectCreateContent = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(false)
     const [token, setToken] = useState(null);
       const [tableData, setTableData] = useState([]);
    const projectDetailsRef = useRef(null)
       const [loading, setLoading] = useState(false)
       const settingsRef = useRef(null)
       const budgetRef = useRef(null)
       const serviceDetailRef = useRef(null)
       const attachmentRef = useRef(null)
       const [submittedSteps, setSubmittedSteps] = useState({
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        });

    const [formData, setFormData] = useState({
        projectType: "",
        projectManage: "",
        projectBudgets: "",
        budgetsSpend: "",
        ProjectTarget: "",
        budgetsSpend: "",
    });

    const validateFields = () => {
    const { projectType } = formData;

    // Only step 0 is required
    if (currentStep === 0 && projectType === "") {
        setError(true);
        return false;
    }

        return true;
    };

  const handleNext = async (e) => {
  e.preventDefault()

  // STEP 0 validation
  if (currentStep === 0) {
    if (!validateFields()) return
    setSubmittedSteps(prev => ({ ...prev, 0: true }))
  }

  // STEP 1 submit
  if (currentStep === 1) {
    const success = await projectDetailsRef.current?.submit()
    if (!success) return
    setSubmittedSteps(prev => ({ ...prev, 1: true }))
  }

  // STEP 2 submit (Settings)
  if (currentStep === 2) {
    const success = await settingsRef.current?.submit()
    if (!success) return
    setSubmittedSteps(prev => ({ ...prev, 2: true }))
  }
    if (currentStep === 3) {
    const success = await budgetRef.current?.submit()
    console.log(`what is the staturs ${currentStep}`, success)

    if (!success) return
    setSubmittedSteps(prev => ({ ...prev, 3: true }))
  }
   if (currentStep === 4) {
    const success = await serviceDetailRef.current?.submit()
    console.log(`what is the staturs ${currentStep}`, success)
    if (!success) return
    setSubmittedSteps(prev => ({ ...prev, 4: true }))
  }

    if (currentStep === 5) {
    const success = await attachmentRef.current?.submit()
    if (!success) return
    setSubmittedSteps(prev => ({ ...prev, 5: true }))
  }

  setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
}

    // Handle prev button click
    const handlePrev = (e) => {
        e.preventDefault()
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    // Handle tab click to change step
  const handleTabClick = (e, index) => {
  e.preventDefault()

  // Prevent jumping ahead without submit
  for (let i = 0; i < index; i++) {
    if (steps[i].required && !submittedSteps[i]) {
      alert(`Please complete "${steps[i].name}" first`)
      return
    }
  }

  setCurrentStep(index)
}


const previtems = [
    {
        id: 1,
        product: "",
        qty: 0,
        price: 0
    },
]
const [items, setItems] = useState(previtems);


    
    const handleInputChange = (id, field, value) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                if (field === 'qty' || field === 'price') {
                    updatedItem.total = updatedItem.qty * updatedItem.price;
                }
                return updatedItem;
            }
            return item;
        });
        setItems(updatedItems);
    };

    const subTotal = items.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.price * currentValue.qty);
    }, 0);

    const vat = (subTotal * 0.1).toFixed(2)
    const vatNumber = Number(vat);
    const total = Number(subTotal + vatNumber).toFixed(2)
  const [clientId, setClientId] = useState(null);

useEffect(() => {
//   const id = sessionStorage.getItem("selected_company");
  const ClientId = localStorage.getItem("client_id");
  setClientId(ClientId);
}, []);



  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const client_id = searchParams.get('client_id');
  const compid = searchParams.get('company_id');

  useEffect(() => {
    if (!token || !compid) return;

    const fetchClients = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          company_id: compid,
          client_type: type,
          client_id: client_id,
        });

        const response = await fetch(
          `${BASE_URL}/client/view?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        console.log("client view api data", result)

        if (!result?.status) {
          console.error(result?.message || 'API Error');
          return;
        }

        const Client_details = {
            formData: {
          client_type: result.data.client_type ?? "GeM",
          client_id: result.data.client_id ?? null,
          contract_no: result.data.contract_no,
          bid_no: result.data.bid_no,
          service_start_date: result.data.service_start_date,
          service_end_date: result.data.service_end_date,
          customer_name: result.data.customer_name,
          type: result.data.type,
          ministry: result.data.ministry,
          department: result.data.department,
          department_nickname: result.data.department_nickname,
          organisation_name: result.data.organisation_name,
          office_zone: result.data.office_zone,
          buyer_name: result.data.buyer_name,
          designation: result.data.designation,
          contact_no: result.data.contact_no,
          email: result.data.email,
          gstin: result.data.gstin,
          address: result.data.address,
          gst_percentage: result.data.gst_percentage,
          apply_gst: Boolean(result.data.apply_gst),
          apply_cgst_sgst: Boolean(result.data.apply_cgst_sgst),
            },
            startDate: new Date().toISOString(),
        };
        localStorage.setItem(
          "Client_details",
          JSON.stringify(Client_details)
        );


        const financial = result.data.financial_approval;

        const Financial_Approval = {
        formData: {
            client_id: financial.client_id,
            ifd_concurrence: financial.ifd_concurrence,
            designation_admin_approval: financial.designation_admin_approval,
            designation_financial_approval: financial.designation_financial_approval,
            role: financial.role,
            payment_mode: financial.payment_mode,
            designation: financial.designation,
            email: financial.email,
            gstin: financial.gstin,
            address: financial.address,
        },
        };

        localStorage.setItem(
        "Financial_Approval",
        JSON.stringify(Financial_Approval)
        );

        const consignees = result.data.consignees || [];

const ConsigneeData = {
  consignees: consignees.map((consignee, cIndex) => ({
    id: consignee.id ?? cIndex + 1,

    items: (consignee.designations || []).map((d, dIndex) => ({
      id: d.id ?? dIndex + 1 ,
      designation: d.name ?? "",
      experience: d.experience_in_years ?? "",
      qualification: d.qualification ?? "",
      skill: d.skill ?? "",
      resources: d.hire_employee ?? "",
    })),

    modalOpen: false,
    editingRowId: null,

    modalData: {
      designation: "",
      experience: "",
      qualification: "",
      skill: "",
      resources: "",
    },

    consignee_name: consignee.consignee_name ?? "",
    consigness_designation: consignee.consigness_designation ?? "",
    consignee_contact_no: consignee.consignee_contact_no ?? "",
    consignee_email: consignee.consignee_email ?? "",
    consignee_gstin: consignee.consignee_gstin ?? "",
    consignee_addess: consignee.consignee_addess ?? "",

    dealing_hand_name: consignee.dealing_hand_name ?? "",
    dealing_designation: consignee.dealing_designation ?? "",
    dealing_contact: consignee.dealing_contact ?? "",
    dealing_email: consignee.dealing_email ?? "",
  })),
};

localStorage.setItem(
  "Consignee",
  JSON.stringify(ConsigneeData)
);


       const servicesData = {
  services: result.data.services ?? [],
  totals: result.data.totals ?? {},
  savedAt: new Date().toISOString(),
};

localStorage.setItem(
  "Client_Services",
  JSON.stringify(servicesData)
);

      localStorage.setItem(
        "Client_Services",
        JSON.stringify(result.data.services)
      );


      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [token, compid]);






    return (
       
        <div className="col-lg-12">
            <div className="card border-top-0">
                <div className="card-body p-0 wizard" id="project-create-steps">
                    <div className='steps clearfix'>
                        <ul role="tablist">
                            {steps.map((step, index) => (
                                <li
                                    key={index}
                                    className={`${currentStep === index ? "current" : ""} ${currentStep === index && error ? "error" : ""}`}
                                    onClick={(e) => handleTabClick(e, index)}
                                >
                                    <a href="#" className='d-block fw-bold'>{step.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="content clearfix">
                        {currentStep === 0 && <TabProjectType setFormData={setFormData} formData={formData} error={error} setError={setError} />}
                        {currentStep === 1 && <TabProjectDetails ref={projectDetailsRef} clientId={clientId}  clientType={formData.projectType} onNext={() => setCurrentStep(prev => prev + 0)} />}
                        {currentStep === 2 && (<TabProjectSettings ref={settingsRef} clientId={clientId} />)}
                        {currentStep === 3 && <TabProjectBudget ref={budgetRef} setFormData={setFormData} formData={formData} error={error} setError={setError} />}
                        {currentStep === 4 && <TabProjectTarget ref={serviceDetailRef} clientId={clientId}/>}
                        {currentStep === 5 && <TabAttachement ref={attachmentRef} clientId={clientId}/>}
                        {currentStep === 6 && <TabCompleted />} 
                    </div>

                   
                    <div className="actions clearfix">
                        <ul>
                            <li className={`${currentStep === 0 ? "disabled" : ""} ${currentStep === steps.length - 1 ? "d-none" : ""}`} onClick={handlePrev} disabled={currentStep === 0}>
                            <a href="#">Previous</a>
                            </li>
                            <li className={`${currentStep === steps.length - 1 ? "d-none" : ""}`} onClick={handleNext} disabled={currentStep === steps.length - 1}>
                            <a href="#">{loading ? 'Saving...' : 'Next'}</a>
                            </li>
                        </ul>
                        </div>
                </div>
            </div>
            
        </div>

    )
}

export default ProjectCreateContent
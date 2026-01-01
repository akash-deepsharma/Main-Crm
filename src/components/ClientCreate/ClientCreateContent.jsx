'use client'
import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import TabProjectType from './TabProjectType'
import TabProjectSettings from './TabProjectSettings';
import TabProjectBudget from './TabProjectBudget';
import TabProjectAssigned from './TabProjectAssigned';
import TabAttachement from './TabAttachement';
import TabCompleted from './TabCompleted';
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

const ProjectCreateContent = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(false)
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
  const ClientId = sessionStorage.getItem("client_id");
  setClientId(ClientId);
}, []);

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
                        {currentStep === 2 && (
                        <TabProjectSettings ref={settingsRef} clientId={clientId} />
                        )}
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
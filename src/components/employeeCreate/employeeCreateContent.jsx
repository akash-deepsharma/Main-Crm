'use client'
import React, {  useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import TabAttachement from './TabAttachement';
import TabCompleted from './TabCompleted';
import TabEmployeeType from './TabEmployeeType';
import TabEmployeeEducation from './TabEmployeeEducation';
import TabFamilyBank from './TabFamilyBank';
const TabEmployeeDetails = dynamic(() => import('./TabEmployeeDetails'), { ssr: false })
const TabAddressDetails = dynamic(() => import('./TabAddressDetails'), { ssr: false })

const steps = [
    { name: "Type", required: true }, // Step 0 → Required
    { name: "Employee Details", required: true }, // Step 1
    { name: "Education Details", required: false }, // Step 2
    { name: "Family / Bank Details", required: false },  // Step 3 → Not required anymore
    { name: "Address Details", required: false },  // Step 5
    { name: "Attachment", required: false }, // Step 6
    { name: "Completed", required: false }  // Step 7
];

const EmployeeCreateContent = () => {

    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
     const employeeDetailsRef = useRef(null)
     const employeeEductaionRef = useRef(null)
     const familyBankRef = useRef(null)
     const AddressRef = useRef(null)
     const employeeAttachmentRef = useRef(null)
     const [clientId, setClientId] = useState(null);
    const [submittedSteps, setSubmittedSteps] = useState({
            0: false,
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            });
    const [formData, setFormData] = useState({
        employeeType: "",
        projectManage: "",
        projectBudgets: "",
        budgetsSpend: "",
    });

useEffect(() => {
//   const id = sessionStorage.getItem("selected_company");
  const ClientId = localStorage.getItem("client_id");
  setClientId(ClientId);
}, []);
    const validateFields = () => {
    const { employeeType } = formData;

    // Only step 0 is required
    if (currentStep === 0 && employeeType === "") {
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
    const success = await employeeDetailsRef.current?.submit()
    if (!success) return
    setSubmittedSteps(prev => ({ ...prev, 1: true }))
  }

  // STEP 2 submit (Settings)
  if (currentStep === 2) {
    const success = await employeeEductaionRef.current?.submit()
    if (!success) return
    setSubmittedSteps(prev => ({ ...prev, 2: true }))
  }
    if (currentStep === 3) {
    const success = await familyBankRef.current?.submit()
    console.log(`what is the staturs ${currentStep}`, success)

    if (!success) return
    setSubmittedSteps(prev => ({ ...prev, 3: true }))
  }
   if (currentStep === 4) {
    const success = await AddressRef.current?.submit()
    console.log(`what is the staturs ${currentStep}`, success)
    if (!success) return
    setSubmittedSteps(prev => ({ ...prev, 4: true }))
  }

    if (currentStep === 5) {
    const success = await employeeAttachmentRef.current?.submit()
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
                        {currentStep === 0 && <TabEmployeeType setFormData={setFormData} formData={formData} error={error} setError={setError}  onSelectType={() => {
                            setSubmittedSteps(prev => ({ ...prev, 0: true }));
                            setCurrentStep(1);
                          }} />}
                        {currentStep === 1 && <TabEmployeeDetails ref={employeeDetailsRef} clientId={clientId}  clientType={formData.employeeType}  onNext={() => setCurrentStep(prev => prev + 0)}/>}
                        {currentStep === 2 && <TabEmployeeEducation ref={employeeEductaionRef} clientId={clientId}/>}
                        {currentStep === 3 && <TabFamilyBank ref={familyBankRef} clientId={clientId}  setFormData={setFormData} formData={formData} error={error} setError={setError} />}
                        {currentStep === 4 && <TabAddressDetails  ref={AddressRef} error={error} setError={setError}/>}
                        {currentStep === 5 && <TabAttachement ref={employeeAttachmentRef}  error={error} setError={setError} />}
                        {currentStep === 6 && <TabCompleted />}
                    </div>

                    {/* Buttons */}
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

export default EmployeeCreateContent
'use client'
import React, { useState } from 'react'
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
    { name: "Type", required: true },     // Step 0 → Required
    { name: "Organisation Details", required: true }, // Step 1
    { name: "Financial Approval / Paying Authority Details", required: false },// Step 2
    { name: "Consignee", required: false },  // Step 3 → Not required anymore
    // { name: "Assigned", required: false },// Step 4 → Not required anymore
    { name: "Service Details", required: false },  // Step 5
    { name: "Attachment", required: false },// Step 6
    { name: "Completed", required: false }  // Step 7
];

const ProjectCreateContent = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(false)
    const [formData, setFormData] = useState({
        projectType: "",
        projectManage: "",
        projectBudgets: "",
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

    const handleNext = (e) => {
        e.preventDefault()
        if (validateFields()) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };

    // Handle prev button click
    const handlePrev = (e) => {
        e.preventDefault()
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    // Handle tab click to change step
   const handleTabClick = (e, index) => {
    e.preventDefault();

    // If you are leaving a required step, validate
    if (steps[currentStep].required && !validateFields()) {
        return;
    }

    // Otherwise allow navigation freely
    setCurrentStep(index);
};


const previtems = [
    {
        id: 1,
        product: "",
        qty: 0,
        price: 0
    },
]
const [items, setItems] = useState(previtems);

    const addItem = () => {
        const newItem = {
            id: items.length + 1,
            product: '',
            qty: 1,
            price: 0
        };
        setItems([...items, newItem]);
    };

    const removeItem =()=>{
        items.pop()
      
        setItems(items)
    }
    
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
                        {currentStep === 1 && <TabProjectDetails />}
                        {currentStep === 2 && <TabProjectSettings />}
                        {currentStep === 3 && <TabProjectBudget setFormData={setFormData} formData={formData} error={error} setError={setError} />}
                        {/* {currentStep === 4 && <TabProjectAssigned />} */}
                        {currentStep === 4 && <TabProjectTarget />}
                        {currentStep === 5 && <TabAttachement />}
                        {currentStep === 6 && <TabCompleted />}
                    </div>

                    {/* Buttons */}
                    <div className="actions clearfix">
                        <ul>
                            <li className={`${currentStep === 0 ? "disabled" : ""} ${currentStep === steps.length - 1 ? "d-none" : ""}`} onClick={(e) => handlePrev(e)} disabled={currentStep === 0}>
                                <a href="#">Previous</a>
                            </li>
                            <li className={`${currentStep === steps.length - 1 ? "d-none" : ""}`} onClick={(e) => handleNext(e)} disabled={currentStep === steps.length - 1}>
                                <a href="#">Next</a>
                            </li>
                        </ul>

                    </div>
                </div>
            </div>
            
        </div>

    )
}

export default ProjectCreateContent
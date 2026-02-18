'use client'
import React, { useEffect, useRef, useState } from 'react'
import TabAttachement from './TabAttachement';
import TabCompleted from './TabCompleted';
import TabType from './TabType';

const steps = [
    { name: "Type", required: true }, 
    { name: "Attachment", required: false }, 
    { name: "Completed", required: false }  
];

const UploadDocument = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [clientId, setClientId] = useState(null);
    const [clientType, setClientType] = useState(""); // Add clientType state
    const employeeAttachmentRef = useRef();
    const [submittedSteps, setSubmittedSteps] = useState({
        0: false,
        1: false,
        2: false,
    });
    const [formData, setFormData] = useState({
        employeeType: "",
        projectManage: "",
        projectBudgets: "",
        budgetsSpend: "",
    });

    useEffect(() => {
        const ClientId = localStorage.getItem("client_id");
        setClientId(ClientId);
    }, []);

    // Update clientType when employeeType changes
    useEffect(() => {
        if (formData.employeeType) {
            setClientType(formData.employeeType);
        }
    }, [formData.employeeType]);

    const validateFields = () => {
        const { employeeType } = formData;
        if (currentStep === 0 && employeeType === "") {
            setError(true);
            return false;
        }
        setError(false);
        return true;
    };

    const handleNext = async (e) => {
        e.preventDefault();

        if (currentStep === 0) {
            if (!validateFields()) return;
            setSubmittedSteps(prev => ({ ...prev, 0: true }));
        }

        if (currentStep === 1) {
            if (employeeAttachmentRef.current) {
                const success = await employeeAttachmentRef.current.submit();
                if (!success) return;
                setSubmittedSteps(prev => ({ ...prev, 1: true }));
            }
        }

        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    const handlePrev = (e) => {
        e.preventDefault();
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleTabClick = (e, index) => {
        e.preventDefault();

        for (let i = 0; i < index; i++) {
            if (steps[i].required && !submittedSteps[i]) {
                alert(`Please complete "${steps[i].name}" first`);
                return;
            }
        }

        setCurrentStep(index);
    };

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
                        {currentStep === 0 && (
                            <TabType 
                                setFormData={setFormData} 
                                formData={formData} 
                                error={error} 
                                setError={setError}  
                                onSelectType={() => {
                                    setSubmittedSteps(prev => ({ ...prev, 0: true }));
                                    setCurrentStep(1);
                                }} 
                            />
                        )}
                        {currentStep === 1 && (
                            <TabAttachement 
                                ref={employeeAttachmentRef}
                                error={error} 
                                setError={setError}
                                clientType={clientType} // Pass clientType as prop
                            />
                        )}
                        {currentStep === 2 && <TabCompleted />}
                    </div>

                    <div className="actions clearfix">
                        <ul>
                            <li className={`${currentStep === 0 ? "disabled" : ""} ${currentStep === steps.length - 1 ? "d-none" : ""}`} onClick={handlePrev}>
                                <a href="#">Previous</a>
                            </li>
                            <li className={`${currentStep === steps.length - 1 ? "d-none" : ""}`} onClick={handleNext}>
                                <a href="#">{loading ? 'Saving...' : 'Next'}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UploadDocument;
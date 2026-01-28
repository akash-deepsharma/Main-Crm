// ProjectCreateContent.js - Modified version
'use client'
import React, { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import TabProjectType from './TabProjectType'
import TabProjectSettings from './TabProjectSettings';
import TabCompleted from './TabCompleted';

const TabProjectDetails = dynamic(() => import('./TabProjectDetails'), { ssr: false })

const steps = [
    { name: "Type", required: true },
    { name: "Select Client", required: true },
    { name: "Employees Data", required: true }, // Changed to required
    { name: "Completed", required: false } 
];

const ProjectCreateContent = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(false);
    const [stepErrors, setStepErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingResults, setProcessingResults] = useState(null);
    
    // Ref to hold the validation function from TabProjectSettings
    const processValidationRef = useRef(null);
    
    const [formData, setFormData] = useState({
        projectType: "",
        selectedClient: null,
        selectedMonth: "",
        selectedYear: "",
        projectManage: "",
        projectBudgets: "",
        budgetsSpend: "",
    });

    const validateFields = () => {
        const errors = {};
        
        if (currentStep === 0 && formData.projectType === "") {
            errors.step0 = "Project type is required";
        }
        
        if (currentStep === 1) {
            if (!formData.selectedClient) {
                errors.step1 = "Please select a client";
            }
            if (!formData.selectedMonth) {
                errors.step1Month = "Please select a month";
            }
            if (!formData.selectedYear) {
                errors.step1Year = "Please select a year";
            }
        }
        
        setStepErrors(errors);
        
        if (Object.keys(errors).length > 0) {
            setError(true);
            return false;
        }
        
        setError(false);
        return true;
    };

    const handleNext = async (e) => {
        e.preventDefault();
        setProcessingResults(null);
        
        // Special validation for step 1
        if (currentStep === 1) {
            if (!formData.selectedClient || !formData.selectedMonth || !formData.selectedYear) {
                const errors = {};
                if (!formData.selectedClient) errors.step1 = "Please select a client";
                if (!formData.selectedMonth) errors.step1Month = "Please select a month";
                if (!formData.selectedYear) errors.step1Year = "Please select a year";
                setStepErrors(errors);
                setError(true);
                return;
            }
            
            if (validateFields()) {
                setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
            }
        }
        
        // For step 2 (Employees Data), process before moving to next
        else if (currentStep === 2) {
            setIsProcessing(true);
            setStepErrors(prev => ({ ...prev, step2: null }));
            
            try {
                console.log("🔄 Step 2: Processing employees data...");
                
                // Call the process validation function if available
                if (processValidationRef.current) {
                    const result = await processValidationRef.current();
                    
                    console.log("📋 Process validation result:", result);
                    setProcessingResults(result);
                    
                    if (result.success) {
                        console.log("✅ Employee processing successful, moving to next step");
                        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
                    } else {
                        // Show error but don't proceed
                        console.log("❌ Employee processing failed");
                        setStepErrors(prev => ({
                            ...prev,
                            step2: result.message || "Failed to process employees. Please check and try again."
                        }));
                    }
                } else {
                    console.log("⚠️ No validation function available, proceeding anyway");
                    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
                }
            } catch (error) {
                console.error("🔥 Error during employee processing:", error);
                setStepErrors(prev => ({
                    ...prev,
                    step2: `Processing error: ${error.message}`
                }));
                setProcessingResults({
                    success: false,
                    message: error.message
                });
            } finally {
                setIsProcessing(false);
            }
        }
        
        // For other steps, just validate and proceed
        else if (validateFields()) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };

    const handlePrev = (e) => {
        e.preventDefault();
        setProcessingResults(null);
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleTabClick = (e, index) => {
        e.preventDefault();
        
        if (index !== currentStep && steps[currentStep].required) {
            if (!validateFields()) {
                return;
            }
        }
        
        setCurrentStep(index);
    };

    const handleFormDataUpdate = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (currentStep === 0 && field === 'projectType') {
            setStepErrors(prev => ({ ...prev, step0: null }));
        } else if (currentStep === 1) {
            if (field === 'selectedClient') {
                setStepErrors(prev => ({ ...prev, step1: null }));
            } else if (field === 'selectedMonth') {
                setStepErrors(prev => ({ ...prev, step1Month: null }));
            } else if (field === 'selectedYear') {
                setStepErrors(prev => ({ ...prev, step1Year: null }));
            }
        }
    };

    // Function to set the validation function from child
    const setProcessValidation = (validationFn) => {
        console.log("📝 Setting process validation function");
        processValidationRef.current = validationFn;
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
                                    className={`${currentStep === index ? "current" : ""} ${Object.keys(stepErrors).some(key => key.startsWith(`step${index}`)) ? "error" : ""}`}
                                    onClick={(e) => handleTabClick(e, index)}
                                >
                                    <a href="#" className='d-block fw-bold'>
                                        {step.name}
                                        {step.required && <span className="text-danger ms-1">*</span>}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="content clearfix ">
                        {currentStep === 0 && (
                            <TabProjectType 
                                setFormData={setFormData} 
                                formData={formData} 
                                error={stepErrors.step0} 
                                setError={(error) => setStepErrors(prev => ({ ...prev, step0: error }))}
                                onUpdate={handleFormDataUpdate}
                            />
                        )}
                        {currentStep === 1 && (
                            <TabProjectDetails 
                                formData={formData}
                                onUpdate={handleFormDataUpdate}
                                errors={stepErrors}
                                setError={(errors) => setStepErrors(prev => ({ ...prev, ...errors }))}
                            />
                        )}
                        {currentStep === 2 && (
                            <>
                                <TabProjectSettings 
                                    formData={formData}
                                    onNextStepValidation={setProcessValidation}
                                />
                                
                                {/* Processing Results Display */}
                                {/* {processingResults && (
                                    <div className={`alert ${processingResults.success ? 'alert-success' : 'alert-danger'} mt-3 mb-0`}>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <h6 className="mb-1">
                                                    {processingResults.success ? '✅ Processing Successful' : '❌ Processing Failed'}
                                                </h6>
                                                <p className="mb-1">{processingResults.message}</p>
                                                
                                                {processingResults.results && processingResults.results.length > 0 && (
                                                    <div className="mt-2">
                                                        <small>
                                                            <strong>Details:</strong>
                                                            <ul className="mb-0 mt-1">
                                                                <li>Total: {processingResults.results.length} employees</li>
                                                                <li>Successful: {processingResults.results.filter(r => r.success).length}</li>
                                                                <li>Failed: {processingResults.results.filter(r => !r.success).length}</li>
                                                            </ul>
                                                        </small>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )} */}
                                
                                {/* Step 2 Error */}
                                {stepErrors.step2 && (
                                    <div className="alert alert-danger mt-3 mb-0 d-flex align-items-center">
                                        <strong>Error:</strong> {stepErrors.step2}
                                    </div>
                                )}
                            </>
                        )}
                        {currentStep === 3 && <TabCompleted />}
                    </div>

                    {/* Buttons */}
                    <div className="actions clearfix mt-0 ">
                        <ul>
                            <li 
                                className={`${currentStep === 0 ? "disabled" : ""} ${currentStep === steps.length - 1 ? "d-none" : ""}`} 
                                onClick={handlePrev} 
                            >
                                <a href="#">Previous</a>
                            </li>
                            <li 
                                className={`${currentStep === steps.length - 1 ? "d-none" : ""}`} 
                                onClick={handleNext}
                                disabled={isProcessing}
                            >
                                <a href="#" className={`${isProcessing ? 'disabled' : ''} text-nowrap`}>
                                    {isProcessing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            {currentStep === 2 ? 'Processing Employees...' : 'Processing...'}
                                        </>
                                    ) : (
                                        <>
                                            {currentStep === 2 ? 'Process & Next' : 'Next'}
                                        </>
                                    )}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectCreateContent;
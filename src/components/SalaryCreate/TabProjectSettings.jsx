import React, { useState, useEffect, useRef } from 'react'
import AttandanceEmployeeUpdateTable from '../EmployeeSalaryList/AttandanceEmployeeUpdateTable ';

const TabProjectSettings = ({ formData, onNextStepValidation }) => {
    const [processFunction, setProcessFunction] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Function to handle process validation
    const handleProcessValidation = async () => {
        console.log("🔧 Starting process validation...");
        
        if (!processFunction) {
            console.log("⚠️ No process function available");
            return {
                success: false,
                message: "No processing function available"
            };
        }
        
        setIsSubmitting(true);
        
        try {
            console.log("🔄 Calling process function...");
            const result = await processFunction();
            console.log("📊 Process function result:", result);
            return result;
        } catch (error) {
            console.error("🔥 Error in process validation:", error);
            return {
                success: false,
                message: error.message || "Processing failed",
                error: error.message
            };
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Pass the validation function to parent
    useEffect(() => {
        console.log("📤 Passing validation function to parent");
        onNextStepValidation(handleProcessValidation);
    }, [processFunction, onNextStepValidation]);
    
    return (
        <section className="step-body mt-0 py-0 body current stepChange">
            <div className="mb-4">
                <h2 className="fs-16 fw-bold">Project Settings</h2>
                <div className="bg-light p-3 rounded mb-4">
                    <h3 className="fs-14 fw-semibold">Selected Details:</h3>
                    <ul className="mb-0">
                        <li>Project Type: <strong>{formData?.projectType || "Not selected"}</strong></li>
                        <li>Client: <strong>{formData?.selectedClient?.label || "Not selected"}</strong></li>
                        <li>Month: <strong>
                            {formData?.selectedMonth 
                                ? new Date(2000, parseInt(formData.selectedMonth) - 1).toLocaleString('default', { month: 'long' })
                                : "Not selected"
                            }
                        </strong></li>
                        <li>Year: <strong>{formData?.selectedYear || "Not selected"}</strong></li>
                    </ul>
                </div>
                
                {/* Instructions */}
                <div className="alert alert-warning">
                    <h6 className="mb-2">Instructions:</h6>
                    <ul className="mb-0">
                        <li>Review all employee records below</li>
                        <li>Set status to "Process" for employees to be included</li>
                        <li>Set status to "Hold" for employees to be excluded (requires reason)</li>
                        <li>Click "Process & Next" to submit all "Process" status employees</li>
                    </ul>
                </div>
            </div>
            
            <form id="project-settings">
                <fieldset>
                    <AttandanceEmployeeUpdateTable 
                        clientData={formData.selectedClient}
                        month={formData.selectedMonth}
                        year={formData.selectedYear}
                        projectType={formData.projectType}
                        onProcessDataSubmit={(fn) => {
                            console.log("📥 Received process function from child");
                            setProcessFunction(() => fn);
                        }}
                        isSubmittingProcess={isSubmitting}
                    />
                </fieldset>
            </form>
            
            {/* Status Indicator */}
            {isSubmitting && (
                <div className="alert alert-info mt-3">
                    <div className="d-flex align-items-center">
                        <div className="spinner-border spinner-border-sm me-3" role="status"></div>
                        <span>Processing employees data...</span>
                    </div>
                </div>
            )}
        </section>
    )
}

export default TabProjectSettings;
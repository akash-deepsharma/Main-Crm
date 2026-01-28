import React, { useState, useEffect, useRef, useCallback } from 'react'
import ClientMaterialUpdate from './ClientMaterialUpdate';

const TabProjectSettings = ({ formData, onNextStepValidation }) => {
    const [processFunction, setProcessFunction] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Function to receive the validation function from child
    const handleReceiveProcessFunction = useCallback((fn) => {
        setProcessFunction(() => fn);
    }, []);
    
    // Function to handle process validation
    const handleProcessValidation = async () => {
        
        if (!processFunction) {
            return {
                success: false,
                message: "No processing function available"
            };
        }
        
        setIsSubmitting(true);
        
        try {
            const result = await processFunction();
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
        if (onNextStepValidation) {
            onNextStepValidation(handleProcessValidation);
        }
    }, [processFunction, onNextStepValidation, handleProcessValidation]);
    
    return (
        <section className="step-body mt-0 py-0 body current stepChange">
            <form id="project-settings">
                <fieldset>
                    <ClientMaterialUpdate
                        clientData={formData.selectedClient}
                        month={formData.selectedMonth}
                        year={formData.selectedYear}
                        projectType={formData.projectType}
                        onProcessDataSubmit={handleReceiveProcessFunction}
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
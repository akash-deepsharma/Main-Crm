'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import TabProjectType from '../InvoiceCreate/TabProjectType'
import TabAttachement from '../InvoiceCreate/TabAttachement'
import TabProjectSettings from '../InvoiceCreate/TabProjectSettings'
import TabCompleted from '../InvoiceCreate/TabCompleted'

const TabProjectDetails = dynamic(() => import('../InvoiceCreate/TabProjectDetails'), { ssr: false })

const steps = [
  { name: "Type", required: true },
  { name: "Select Client", required: true },
  { name: "Dates", required: true },
  { name: "Client Invoice Data", required: true },
  { name: "Completed", required: false }
]

const ProjectCreateContent = () => {
  // 🔑 SHARED STATE
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedConsignee, setSelectedConsignee] = useState(null)

  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Month/year state to pass between steps
  const [attachmentData, setAttachmentData] = useState({
    month: "",
    year: "",
    dueDate: "",
    fileName: "",
    fileUrl: "",
    isUploaded: false
  })

  const [formData, setFormData] = useState({
    projectType: "",
    projectManage: "",
    projectBudgets: "",
    budgetsSpend: "",
  })

  const validateFields = () => {
    if (currentStep === 0 && !formData.projectType) {
      setError(true)
      return false
    }
    
    if (currentStep === 1 && !selectedClient) {
      setError(true)
      return false
    }
    
    if (currentStep === 2) {
      if (!attachmentData.month || !attachmentData.year || !attachmentData.dueDate) {
        setError(true)
        return false
      }
    }
    
    return true
  }

  const handleNext = async (e) => {
    e.preventDefault()
    
    // TEMPORARY: Force allow navigation from step 2 if data seems valid
    if (currentStep === 2 && attachmentData.month && attachmentData.year && attachmentData.dueDate) {
      setCurrentStep(3)
      setError(false)
      return
    }
    
    if (validateFields()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
      setError(false)
    } else {
      console.log('❌ Validation failed, not moving to next step')
    }
  }

  const handlePrev = (e) => {
    e.preventDefault()
    setCurrentStep(prev => Math.max(prev - 1, 0))
    setError(false)
  }

  const handleTabClick = (e, index) => {
    e.preventDefault()
    if (index > currentStep && steps[currentStep].required && !validateFields()) {
      return
    }
    setCurrentStep(index)
    setError(false)
  }

  // Handler for Attachment step data - Fixed version
  const handleAttachmentData = (data) => {
    setAttachmentData(prev => {
      // Only update if data has actually changed
      if (prev.month === data.month && 
          prev.year === data.year && 
          prev.dueDate === data.dueDate) {
        return prev
      }
      return {
        ...prev,
        ...data
      }
    })
    setError(false)
  }

  return (
    <div className="col-lg-12">
      <div className="card border-top-0">
        <div className="card-body p-0 wizard">

          {/* STEPS */}
          <div className="steps clearfix">
            <ul role="tablist">
              {steps.map((step, index) => (
                <li
                  key={index}
                  className={`${currentStep === index ? "current" : ""} ${error && currentStep === index ? "error" : ""}`}
                  onClick={(e) => handleTabClick(e, index)}
                >
                  <a href="#" className="d-block fw-bold">{step.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTENT */}
          <div className="content clearfix">
            {currentStep === 0 && (
              <TabProjectType
                formData={formData}
                setFormData={setFormData}
                error={error}
                setError={setError}
              />
            )}

            {currentStep === 1 && (
              <TabProjectDetails
                clientType={formData.projectType}
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
                selectedConsignee={selectedConsignee}
                setSelectedConsignee={setSelectedConsignee}
                setError={setError}
                error={error}
              />
            )}

            {currentStep === 2 && (
              <TabAttachement
                onDataChange={handleAttachmentData}
                currentStep={currentStep}
                initialData={attachmentData}  
                setError={setError}
                error={error}
              />
            )}

            {currentStep === 3 && (
              <TabProjectSettings
                clientType={formData.projectType}
                initialClient={selectedClient}
                initialConsignee={selectedConsignee}
                attachmentData={attachmentData}
              />
            )}

            {currentStep === 4 && <TabCompleted />}
          </div>

          {/* ACTIONS */}
          <div className="actions clearfix">
            <ul>
              <li
                className={`${currentStep === 0 ? "disabled" : ""}`}
                onClick={handlePrev}
              >
                <a href="#">Previous</a>
              </li>

              <li
                className={`${currentStep === steps.length - 1 ? "d-none" : ""}`}
                onClick={handleNext}
                disabled={isUploading}
              >
                <a href="#">
                  {isUploading ? "Uploading..." : "Next"}
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProjectCreateContent
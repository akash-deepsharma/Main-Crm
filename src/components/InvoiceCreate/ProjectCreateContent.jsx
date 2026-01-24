'use client'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import TabProjectType from './TabProjectType'
import TabProjectSettings from './TabProjectSettings'
import TabAttachement from './TabAttachement'
import TabCompleted from './TabCompleted'

const TabProjectDetails = dynamic(() => import('./TabProjectDetails'), { ssr: false })

const steps = [
  { name: "Type", required: true },
  { name: "Select Client", required: true },
  { name: "Attachment", required: false },
  { name: "Employees Data", required: false },
  { name: "Completed", required: false }
]

const ProjectCreateContent = () => {

  // 🔑 SHARED STATE
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedConsignee, setSelectedConsignee] = useState(null)

  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Add month/year state to pass between steps
  const [attachmentData, setAttachmentData] = useState({
    month: "",
    year: "",
    fileName: "",
    fileUrl: ""
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
    return true
  }

  const handleNext = async (e) => {
    e.preventDefault()
    
    // If current step is Attachment (step 2), handle upload first
    if (currentStep === 2) {
      await handleAttachmentNext()
    } else {
      // For other steps, normal validation
      if (validateFields()) {
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
      }
    }
  }

  const handlePrev = (e) => {
    e.preventDefault()
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handleTabClick = (e, index) => {
    e.preventDefault()
    if (steps[currentStep].required && !validateFields()) return
    setCurrentStep(index)
  }

  // Updated handler for Attachment step
  const handleAttachmentNext = async (uploadedData) => {
    if (uploadedData) {
      // Store uploaded data for next steps
      setAttachmentData(uploadedData)
    }
    
    if (validateFields()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
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
              />
            )}

            {currentStep === 2 && (
              <TabAttachement 
                onNext={handleAttachmentNext}
                setIsUploading={setIsUploading}
                currentStep={currentStep}
              />
            )}

            {currentStep === 3 && (
              <TabProjectSettings
                clientType={formData.projectType}
                initialClient={selectedClient}
                initialConsignee={selectedConsignee}
                attachmentData={attachmentData} // Pass month/year to next step
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
                  {currentStep === 2 && isUploading ? "Uploading..." : "Next"}
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
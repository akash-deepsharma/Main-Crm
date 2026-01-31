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
  { name: "Create Invoice", required: true },
  { name: "Completed", required: false }
]

const ProjectCreateContent = () => {
  // 🔑 SHARED STATE
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedConsignee, setSelectedConsignee] = useState(null)

  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [apiResponse, setApiResponse] = useState(null)
  const [apiStatus, setApiStatus] = useState(null) // 'loading', 'success', 'error'
  const [apiError, setApiError] = useState(null)

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

    // Function to get token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      // Try different possible token keys that might be used
      const token = localStorage.getItem('token')
      return token;
    }
    return null;
  };


  // Helper function to format date
  const formatDueDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  // Function to call the API
  const callCreateInvoiceAPI = async () => {
    // Validate required fields
    if (!selectedClient?.value) {
      setError('Client ID is required')
      return false
    }

    if (!attachmentData?.month) {
      setError('Month is required')
      return false
    }

    if (!attachmentData?.year) {
      setError('Year is required')
      return false
    }

    setIsUploading(true)
    setApiStatus('loading')
    setApiError(null)
     const token = getAuthToken();

    try {
      const payload = {
        client_id: selectedClient.value,
        month: attachmentData.month,
        year: attachmentData.year,
        due_date: formatDueDate(attachmentData.dueDate),
        client_type: formData.projectType
      }

      console.log('📤 Sending API request with payload:', payload)

      const response = await fetch('https://green-owl-255815.hostingersite.com/api/invoicecreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      console.log('✅ API Response:', data)
      
      setApiResponse(data)
      setApiStatus(data.status ? 'success' : 'error')
      
      if (!data.status) {
        setApiError(data.message || 'Failed to create invoice')
        return false
      }
      
      return true

    } catch (error) {
      console.error('❌ API Error:', error)
      setApiError(error.message)
      setApiStatus('error')
      return false
    } finally {
      setIsUploading(false)
    }
  }

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
    
    if (currentStep === 2 && attachmentData.month && attachmentData.year && attachmentData.dueDate) {
      setCurrentStep(3)
      setError(false)
      return
    }
    
    // If moving from "Create Invoice" step (step 3), call API first
    if (currentStep === 3) {
      const success = await callCreateInvoiceAPI()
      if (success) {
        setCurrentStep(4) // Move to Completed step only if API is successful
      }
      // If API fails, stay on current step to show error
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

  // Handler for Attachment step data
  const handleAttachmentData = (data) => {
    setAttachmentData(prev => {
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
                attachmentData={attachmentData}
                apiStatus={apiStatus}
                apiError={apiError}
                isUploading={isUploading}
              />
            )}

            {currentStep === 4 && (
              <TabCompleted 
                apiResponse={apiResponse}
                apiStatus={apiStatus}
                apiError={apiError}
              />
            )}
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
                  {isUploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creating Invoice...
                    </>
                  ) : currentStep === 3 ? "Create Invoice" : "Next"}
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
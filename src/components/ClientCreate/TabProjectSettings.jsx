'use client'

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { useRouter } from 'next/navigation'

const API_BASE = 'https://green-owl-255815.hostingersite.com/api'

const TabProjectSettings = forwardRef(({ clientId }, ref) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const client_id = localStorage.getItem('client_id')

  const [formData, setFormData] = useState({
    client_id: Number(client_id),
    ifd_concurrence: '',    
    designation_admin_approval: '',
    designation_financial_approval: '',
    role: '',
    payment_mode: '',
    designation: '',
    email: '',
    gstin: '',
    address: '',
  })

  // Payment mode options
  const paymentModeOptions = [
    'Online Transfer',
    'Cheque',
    'Cash',
    'Demand Draft',
    'NEFT',
    'RTGS',
    'IMPS',
    'UPI'
  ]

  // Role options
  const roleOptions = [
    'Financial Controller',
    'Accounts Manager',
    'Finance Officer',
    'Payable Executive',
    'Treasury Manager',
    'Chief Financial Officer'
  ]

  useEffect(() => {
    const company_id = localStorage.getItem('selected_company')
    if (!company_id) {
      alert('Company not selected')
      router.replace('/company')
    }
  }, [router])

  // GSTIN validation function
  const validateGSTIN = (gstin) => {
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    return gstinRegex.test(gstin)
  }

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Form validation function
  const validateForm = () => {
    const newErrors = {}

    // Required field validation
    const requiredFields = [
      'ifd_concurrence',
      'designation_admin_approval',
      'designation_financial_approval',
      'role',
      'payment_mode',
      'designation',
      'email',
      'gstin',
      'address'
    ]

    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`
      }
    })

    // Email validation
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    // GSTIN validation
    if (formData.gstin && !validateGSTIN(formData.gstin)) {
      newErrors.gstin = 'Invalid GSTIN format. Format: 22AAAAA0000A1Z5'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target
    const fieldValue = type === 'select-one' ? value : value
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }

    // Real-time validation for specific fields
    if (name === 'email' && value) {
      if (!validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'Invalid email format' }))
      }
    }

    if (name === 'gstin' && value) {
      if (!validateGSTIN(value)) {
        setErrors(prev => ({ ...prev, gstin: 'Invalid GSTIN format' }))
      }
    }
  }

  const handleSelectChange = (name, option) => {
    setFormData(prev => ({
      ...prev,
      [name]: option
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSaveAndNext = async () => {
    // Validate form before submission
    if (!validateForm()) {
      alert('Please fix all validation errors before proceeding.')
      return false
    }

    try {
      setLoading(true)

      const token = localStorage.getItem('token')
      if (!token) {
        alert('Authentication error')
        return false
      }

      if (!client_id) {
        alert('Client ID not found. Please complete previous steps.')
        return false
      }

      const payload = {
        client_id: Number(client_id),
        ifd_concurrence: formData.ifd_concurrence,
        designation_admin_approval: formData.designation_admin_approval,
        designation_financial_approval: formData.designation_financial_approval,
        role: formData.role,
        payment_mode: formData.payment_mode,
        designation: formData.designation,
        email: formData.email,
        gstin: formData.gstin,
        address: formData.address,
      }

      console.log('Submitting payload:', payload)

      const response = await fetch(
        `${API_BASE}/create/client/financial`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )

      const result = await response.json()
      console.log('Settings API response:', result)

      if (!response.ok || !result?.status) {
        const errorMessage = result?.message || result?.error || 'Failed to save financial details'
        throw new Error(errorMessage)
      }

      // Store in session storage for persistence
      localStorage.setItem('Financial_Approval', JSON.stringify({ formData }))
      
      return true
    } catch (err) {
      alert(`Error: ${err.message}`)
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem("Financial_Approval")
    if (saved) {
      const { formData } = JSON.parse(saved)
      setFormData(formData)
    }
  }, [])

  // Expose submit method to parent
  useImperativeHandle(ref, () => ({
    submit: handleSaveAndNext,
    validate: validateForm
  }))

  return (
    <section className="step-body mt-4 body current stepChange">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-5">
          <h2 className="fs-16 fw-bold">
            Financial Approval / Paying Authority Details
          </h2>
          <p className="text-muted">
            Your financial & paying authority details go here.
          </p>
          
          {/* Validation Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="alert alert-danger">
              <strong>Please fix the following errors:</strong>
              <ul className="mb-0 mt-2">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="row">
          {/* IFD Concurrence */}
          <div className="col-md-4 mb-4">
            <label className="form-label">IFD Concurrence *</label>
            <input
              type="text"
              className={`form-control ${errors.ifd_concurrence ? 'is-invalid' : ''}`}
              name="ifd_concurrence"
              value={formData.ifd_concurrence}
              onChange={handleChange}
              placeholder="Enter IFD concurrence details"
              required
            />
            {errors.ifd_concurrence && (
              <div className="invalid-feedback">{errors.ifd_concurrence}</div>
            )}
          </div>

          {/* Designation of Administrative Approval */}
          <div className="col-md-4 mb-4">
            <label className="form-label">
              Designation of Administrative Approval *
            </label>
            <input
              type="text"
              className={`form-control ${errors.designation_admin_approval ? 'is-invalid' : ''}`}
              name="designation_admin_approval"
              value={formData.designation_admin_approval}
              onChange={handleChange}
              placeholder="e.g., Director, Manager"
              required
            />
            {errors.designation_admin_approval && (
              <div className="invalid-feedback">{errors.designation_admin_approval}</div>
            )}
          </div>

          {/* Designation of Financial Approval */}
          <div className="col-md-4 mb-4">
            <label className="form-label">
              Designation of Financial Approval *
            </label>
            <input
              type="text"
              className={`form-control ${errors.designation_financial_approval ? 'is-invalid' : ''}`}
              name="designation_financial_approval"
              value={formData.designation_financial_approval}
              onChange={handleChange}
              placeholder="e.g., CFO, Finance Manager"
              required
            />
            {errors.designation_financial_approval && (
              <div className="invalid-feedback">{errors.designation_financial_approval}</div>
            )}
          </div>

          {/* Role */}
          <div className="col-md-4 mb-4">
            <label className="form-label">Role *</label>
            <select
              className={`form-select ${errors.role ? 'is-invalid' : ''}`}
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              {roleOptions.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
              <option value="other">Other (specify below)</option>
            </select>
            {errors.role && (
              <div className="invalid-feedback">{errors.role}</div>
            )}
            {formData.role === 'other' && (
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Specify role"
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              />
            )}
          </div>

          {/* Payment Mode */}
          <div className="col-md-4 mb-4">
            <label className="form-label">Payment Mode *</label>
            <select
              className={`form-select ${errors.payment_mode ? 'is-invalid' : ''}`}
              name="payment_mode"
              value={formData.payment_mode}
              onChange={handleChange}
              required
            >
              <option value="">Select Payment Mode</option>
              {paymentModeOptions.map(mode => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
              <option value="other">Other (specify below)</option>
            </select>
            {errors.payment_mode && (
              <div className="invalid-feedback">{errors.payment_mode}</div>
            )}
            {formData.payment_mode === 'other' && (
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Specify payment mode"
                onChange={(e) => setFormData(prev => ({ ...prev, payment_mode: e.target.value }))}
              />
            )}
          </div>

          {/* Designation */}
          <div className="col-md-4 mb-4">
            <label className="form-label">Designation *</label>
            <input
              type="text"
              className={`form-control ${errors.designation ? 'is-invalid' : ''}`}
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="e.g., Senior Manager"
              required
            />
            {errors.designation && (
              <div className="invalid-feedback">{errors.designation}</div>
            )}
          </div>

          {/* Email */}
          <div className="col-md-4 mb-4">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="financial@example.com"
              required
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          {/* GSTIN */}
          <div className="col-md-4 mb-4">
            <label className="form-label">GSTIN *</label>
            <input
              type="text"
              className={`form-control ${errors.gstin ? 'is-invalid' : ''}`}
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
              placeholder="22AAAAA0000A1Z5"
              pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
              maxLength="15"
              required
            />
            {errors.gstin && (
              <div className="invalid-feedback">{errors.gstin}</div>
            )}
            <small className="text-muted">Format: 22AAAAA0000A1Z5 (15 characters)</small>
          </div>

          {/* Address */}
          <div className="col-md-8 mb-4">
            <label className="form-label">Address *</label>
            <textarea
              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              placeholder="Enter complete address"
              required
            />
            {errors.address && (
              <div className="invalid-feedback">{errors.address}</div>
            )}
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="col-12 text-center mt-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Saving...</span>
              </div>
              <p className="mt-2">Saving financial details...</p>
            </div>
          )}

          {/* Client ID Info (for debugging) */}
          {/* <div className="col-12 mt-3">
            <div className="alert alert-info">
              <small>
                <strong>Client ID:</strong> {client_id || 'Not set'} 
                | <strong>Step 3 of 4</strong> | Financial Approval Details
              </small>
            </div>
          </div> */}  
        </div>
      </form>
    </section>
  )
})

export default TabProjectSettings
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
const client_id = sessionStorage.getItem('client_id')

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


useEffect(() => {
  const company_id = sessionStorage.getItem('selected_company')

  if (!company_id) {
    alert('Company not selected')
    router.replace('/company')
  }
}, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  
  const handleSaveAndNext = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem('token')
      if (!token ) {
        alert('Auth error')
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

      if (!result?.status) {
        throw new Error(result.message || 'Failed to save settings')
      }

      if (result?.status) {sessionStorage.setItem('Financial_Approval', JSON.stringify({ formData }))} 

      return true
    } catch (err) {
      alert(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    const saved = sessionStorage.getItem("Financial_Approval");
  
    if (saved) {
      const { formData } = JSON.parse(saved);
      setFormData(formData);
    }
  }, []);

  // ✅ expose submit
  useImperativeHandle(ref, () => ({
    submit: handleSaveAndNext,
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
        </div>

        <div className="row">

          <div className="col-md-4 mb-4">
            <label className="form-label">IFD Concurrence *</label>
            <input
              type="text"
              className="form-control"
              name="ifd_concurrence"
              value={formData.ifd_concurrence}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-4">
            <label className="form-label">
              Designation of Administrative Approval *
            </label>
            <input
              type="text"
              className="form-control"
              name="designation_admin_approval"
              value={formData.designation_admin_approval}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-4">
            <label className="form-label">
              Designation of Financial Approval *
            </label>
            <input
              type="text"
              className="form-control"
              name="designation_financial_approval"
              value={formData.designation_financial_approval}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-4">
            <label className="form-label">Role *</label>
            <input
              type="text"
              className="form-control"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-4">
            <label className="form-label">Payment Mode *</label>
            <input
              type="text"
              className="form-control"
              name="payment_mode"
              value={formData.payment_mode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-4">
            <label className="form-label">Designation *</label>
            <input
              type="text"
              className="form-control"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-4">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-4">
            <label className="form-label">GSTIN *</label>
            <input
              type="text"
              className="form-control"
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-8 mb-4">
            <label className="form-label">Address *</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          {loading && <p>Saving...</p>}
        </div>
      </form>
    </section>
  )
})

export default TabProjectSettings

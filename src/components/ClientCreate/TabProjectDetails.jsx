'use client'
import React, { useEffect, useState,forwardRef, useImperativeHandle } from 'react'
import DatePicker from 'react-datepicker'
import useDatePicker from '@/hooks/useDatePicker'
import { useRouter, useSearchParams } from 'next/navigation'

const API_BASE = 'https://green-owl-255815.hostingersite.com/api'

const TabProjectDetails = forwardRef(({ clientId, clientType }, ref) => {
    const { startDate, setStartDate, renderFooter } = useDatePicker()
    const [loading, setLoading] = useState(false)
   const router = useRouter();
   const client_Type = clientType
const searchParams = useSearchParams();
  const client_Id = searchParams.get('client_id');
  console.log( "clientId form url", client_Id)
useEffect(() => {
  const companyId = sessionStorage.getItem("selected_company");

  if (!companyId) {
    alert("Company not selected");
    router.replace("/company");
  }
}, [router]);

    const [formData, setFormData] = useState({
        client_type: client_Type,
        client_id: client_Id || null,
        contract_no: '',
        bid_no: '',
        service_start_date: '',
        service_end_date: '',
        customer_name: '',
        type: '',
        ministry: '',
        department: '',
        department_nickname: '',
        organisation_name: '',
        office_zone: '',
        buyer_name: '',
        designation: '',
        contact_no: '',
        email: '',
        gstin: '',
        address: '',
        gst_percentage: 18,
        apply_gst: false,
        apply_cgst_sgst: false,
    })

    useEffect(() => {
        setStartDate(new Date())
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'radio' ? checked : value
        }))
    }
    const formatDate = (date) => {
  if (!date) return null
  return new Date(date).toISOString().split('T')[0]
}



   const handleSaveAndNext = async (e) => {
//   e.preventDefault()

const token = localStorage.getItem('token')
const company_id = sessionStorage.getItem('selected_company')



if (!company_id) {
alert("Company not selected");
router.replace("/company");
return false;
}


if (!token) {
  alert('Auth error')
  return false
}
  try {
    setLoading(true)


    const payload = {
      user_id: 1,
      client_type: client_Type,
       client_id: client_Id || null,
      company_id: Number(company_id),
      contract_no: formData.contract_no,
      service_title: 'Service Contract', // REQUIRED by API
      onboard_date: formatDate(startDate),
      contract_generated_date: formatDate(startDate),
      bid_no: formData.bid_no,
      service_start_date: formatDate(formData.service_start_date),
      service_end_date: formatDate(formData.service_end_date),
      customer_name: formData.customer_name,
      type: formData.type,
      ministry: formData.ministry,
      department: formData.department,
      department_nickname: formData.department_nickname,
      organisation_name: formData.organisation_name,
      office_zone: formData.office_zone,
      buyer_name: formData.buyer_name,
      designation: formData.designation,
      contact_no: formData.contact_no,
      email: formData.email,
      gstin: formData.gstin,
      address: formData.address,
      gst_percentage: 18,
      apply_gst: formData.apply_gst,
      apply_cgst_sgst: formData.apply_cgst_sgst,
    }

    const response = await fetch(
      'https://green-owl-255815.hostingersite.com/api/create/client',
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
    if (!response.status ==="true") {
      console.error('API Error:', result)
      throw new Error(result.message || 'Validation failed')
    }
    if (result?.status && result?.data?.id) {
        sessionStorage.setItem("client_id", result.data.id.toString());
        sessionStorage.setItem(
            "Client_details",
            JSON.stringify({
            formData,
            startDate
            })
        );
    } 

console.log("Saved successfully", result);
    // ✅ MOVE TO NEXT STEP ONLY AFTER SUCCESS
    // onNext()
     if (!result?.status) {
      throw new Error(result.message || "Failed to save settings");
    }
    return true
  } catch (err) {
    alert(err.message)
    return false
  } finally {
    setLoading(false)
  }
}

useEffect(() => {
  const saved = sessionStorage.getItem("Client_details");

  if (saved) {
    const { formData, startDate } = JSON.parse(saved);
    setFormData(formData);
    setStartDate(new Date(startDate));
  }
}, []);


 useImperativeHandle(ref, () => ({
    submit: handleSaveAndNext
  }))


    return (
        <section className="step-body mt-4 body current stepChange">
            <form onSubmit={handleSaveAndNext}>
                <div className="row">

                    {/* CONTRACT NO */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Contract No *</label>
                        <input
                            type="text"
                            className="form-control"
                            name="contract_no"
                            value={formData.contract_no}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* ONBOARD DATE */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Onboard Date *</label>
                        <div className="w-100 p-0">
                        <DatePicker
                            selected={startDate}
                            onChange={setStartDate}
                            className="w-100"
                            calendarContainer={({ children }) => (
                                <div className="bg-white react-datepicker">
                                    {children}
                                    {renderFooter('start')}
                                </div>
                            )}
                        />
                        </div>
                    </div>

                    {/* BID NO */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Bid No *</label>
                        <input
                            type="text"
                            className="form-control"
                            name="bid_no"
                            value={formData.bid_no}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* SERVICE START */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Service Start Date *</label>
                        <input
                            type="date"
                            className="form-control"
                            name="service_start_date"
                            value={formData.service_start_date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* SERVICE END */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Service End Date *</label>
                        <input
                            type="date"
                            className="form-control"
                            name="service_end_date"
                            value={formData.service_end_date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* CUSTOMER NAME */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Customer Name *</label>
                        <input
                            type="text"
                            className="form-control"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* TYPE */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Type *</label>
                        <input
                            type="text"
                            className="form-control"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* MINISTRY */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Ministry *</label>
                        <input
                            type="text"
                            className="form-control"
                            name="ministry"
                            value={formData.ministry}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* DEPARTMENT */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Department *</label>
                        <input
                            type="text"
                            className="form-control"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* DEPARTMENT NICKNAME */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Department Nickname *</label>
                        <input
                            type="text"
                            className="form-control"
                            name="department_nickname"
                            value={formData.department_nickname}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* ORGANISATION */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Organisation Name *</label>
                        <input
                            type="text"
                            className="form-control"
                            name="organisation_name"
                            value={formData.organisation_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* OFFICE ZONE */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Office Zone</label>
                        <input
                            type="text"
                            className="form-control"
                            name="office_zone"
                            value={formData.office_zone}
                            onChange={handleChange}
                        />
                    </div>

                    {/* BUYER NAME */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Buyer Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="buyer_name"
                            value={formData.buyer_name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* DESIGNATION */}
                    <div className="col-md-3 mb-4">
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

                    {/* CONTACT */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Contact No *</label>
                        <input
                            type="text"
                            className="form-control"
                            name="contact_no"
                            value={formData.contact_no}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="col-md-3 mb-4">
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

                    {/* GSTIN */}
                    <div className="col-md-3 mb-4">
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

                    {/* ADDRESS */}
                    <div className="col-md-9 mb-4">
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

                    <div className=" col-3 form-check mb-3 ">
                        <input
                        className='form-check-input'
                            type="radio"
                            name="apply_gst"
                            id='apply_gst'
                            checked={formData.apply_gst}
                            onChange={handleChange}
                        /> <label htmlFor="apply_gst">Apply GST 18% </label>
                    </div>
                    <div className=" col-3 form-check mb-3">
                        <input
                        className='form-check-input'
                            type="radio"
                            name="apply_gst"
                            checked={formData.apply_cgst_sgst}
                            onChange={handleChange}
                        /> Apply CGST 9% / SGST 9%
                    </div>

                    

                </div>
            </form>
        </section>
    )
})

export default TabProjectDetails

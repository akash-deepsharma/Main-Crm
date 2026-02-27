'use client'
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import DatePicker from 'react-datepicker'
import useDatePicker from '@/hooks/useDatePicker'
import { useRouter, useSearchParams } from 'next/navigation'
 
const API_BASE = 'https://green-owl-255815.hostingersite.com/api'

const TabProjectDetails = forwardRef(({ clientId, clientType }, ref) => {
    const { startDate, setStartDate, renderFooter } = useDatePicker()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [client_Id, setClient_Id] = useState()
    const router = useRouter();
    const client_Type = clientType
    const searchParams = useSearchParams();
    
      useEffect(() => {
    const client_Id = localStorage.getItem('client_id') || searchParams.get('client_id');
    console.log("clientId from url", client_Id);
    setClient_Id(client_Id)
}, []);
    
    useEffect(() => {
        const companyId = localStorage.getItem("selected_company");
        if (!companyId) {
            alert("Company not selected");
            router.replace("/company");
        }
    }, [router]);
const handleGSTChange = (e) => {
    const { value } = e.target
    
    if (value === "gst") {
        setFormData(prev => ({
            ...prev,
            apply_gst: true,
            apply_cgst_sgst: false
        }))
    } else {
        setFormData(prev => ({
            ...prev,
            apply_gst: false,
            apply_cgst_sgst: true
        }))
    }
}


    
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
        apply_gst: true,
        apply_cgst_sgst: false,
        onboard_date: '', 
    })

    useEffect(() => {
        // Format today's date for the default onboard_date
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({
            ...prev,
            onboard_date: today
        }));
        setStartDate(new Date());
    }, [])

    // // GSTIN validation function
    // const validateGSTIN = (gstin) => {
    //     // Basic GSTIN format validation (15 characters, alphanumeric)
    //     const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    //     return gstinRegex.test(gstin);
    // }
    // GSTIN validation function - CORRECTED VERSION
const validateGSTIN = (gstin) => {
  if (!gstin) return false;

  const formatted = gstin.toUpperCase().trim();

  const gstinRegex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z][A-Z][0-9A-Z]$/;

  return formatted.length === 15 && gstinRegex.test(formatted);
};

    // // Phone number validation
    // const validatePhone = (phone) => {
    //     // Indian phone number validation (10 digits starting with 6-9)
    //     const phoneRegex = /^[6-9]\d{9}$/;
    //     return phoneRegex.test(phone);
    // }

        const validatePhone = (phone) => {
            // Trim and clean the input
            const cleaned = phone.trim();
            
            // If empty, return false
            if (!cleaned) return false;
            
            // Comprehensive Indian phone number patterns
            const patterns = {
                // Mobile: 10 digits starting with 6-9
                mobile: /^[6-9]\d{9}$/,
                
                // Mobile with country code: +91 or 91 prefix
                mobileWithCC: /^(?:\+91|91)[6-9]\d{9}$/,
                
                // Mobile with leading 0: 0 followed by 10-digit mobile
                mobileWithZero: /^0[6-9]\d{9}$/,
                
                // Landline with STD: 0 followed by 2-4 digit STD code + 6-8 digit number
                landline: /^0[1-9]\d{1,4}\d{6,8}$/,
                
                // Landline with STD and dash: 0XXX-XXXXXX format
                landlineWithDash: /^0[1-9]\d{1,4}-\d{6,8}$/,
                
                // Landline without STD: just the local number (less common)
                localNumber: /^[1-9]\d{5,7}$/
            };
            
            // Remove all spaces and special characters for validation
            const normalized = cleaned.replace(/[\s\-\(\)]/g, '');
            
            // Check against all patterns
            if (patterns.mobile.test(normalized)) return true;
            if (patterns.mobileWithCC.test(normalized)) return true;
            if (patterns.mobileWithZero.test(normalized)) return true;
            if (patterns.landline.test(normalized)) return true;
            if (patterns.landlineWithDash.test(cleaned)) return true;
            
            // Additional check for common landline formats
            if (cleaned.includes('-')) {
                const [std, number] = cleaned.split('-');
                if (std.length >= 2 && std.length <= 5 && number.length >= 6 && number.length <= 8) {
                    return true;
                }
            }
            
            return false;
        }

    // Email validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Date validation function
    const validateDates = () => {
        const newErrors = {};
        
        // Convert string dates to Date objects
        const onboardDate = formData.onboard_date ? new Date(formData.onboard_date) : null;
        const serviceStartDate = formData.service_start_date ? new Date(formData.service_start_date) : null;
        const serviceEndDate = formData.service_end_date ? new Date(formData.service_end_date) : null;

        // Service Start Date validation
        if (serviceStartDate && onboardDate) {
            if (serviceStartDate < onboardDate) {
                newErrors.service_start_date = "Service Start Date must be after Onboard Date";
            }
        }

        // Service End Date validation
        if (serviceEndDate && serviceStartDate) {
            if (serviceEndDate <= serviceStartDate) {
                newErrors.service_end_date = "Service End Date must be after Service Start Date";
            }
        }

        // GSTIN validation
        if (formData.gstin && !validateGSTIN(formData.gstin)) {
            newErrors.gstin = "Invalid GSTIN format. Format should be: 22AAAAA0000A1Z5";
        }

      // Phone validation with FIXED error message
if (formData.contact_no && !validatePhone(formData.contact_no)) {
    newErrors.contact_no = "Invalid phone number. Please enter a valid Indian mobile (10 digits starting with 6-9) or landline number with STD code";
}

        // Email validation
        if (formData.email && !validateEmail(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        
        // setFormData(prev => ({
        //     ...prev,
        //     [name]: type === 'radio' ? checked : value
        // }))
        // Keep your existing handleChange for other fields
            // const handleChange = (e) => {
            //     const { name, value, type, checked } = e.target
                
                // Don't handle GST fields here
                if (name === "radio") return
                
                // Handle other fields normally
                setFormData(prev => ({
                    ...prev,
                    [name]: type === 'radio' ? checked : value
                }))
            // }

        // Update startDate in useDatePicker when onboard_date changes
        if (name === 'onboard_date' && value) {
            setStartDate(new Date(value));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }

        // Validate dates in real-time when date fields change
        if (name === 'service_start_date' || name === 'service_end_date' || name === 'onboard_date') {
            setTimeout(() => validateDates(), 100);
        }

        // Validate GSTIN in real-time
        if (name === 'gstin') {
            if (value && !validateGSTIN(value)) {
                setErrors(prev => ({ ...prev, gstin: "Invalid GSTIN format. Format: 22AAAAA0000A1Z5" }))
            } else if (errors.gstin) {
                setErrors(prev => ({ ...prev, gstin: '' }))
            }
        }

        // Validate phone in real-time
        if (name === 'contact_no') {
            if (value && !validatePhone(value)) {
                setErrors(prev => ({ ...prev, contact_no: "Must be 10 digits starting with 6-9" }))
            } else if (errors.contact_no) {
                setErrors(prev => ({ ...prev, contact_no: '' }))
            }
        }

        // Validate email in real-time
        if (name === 'email') {
            if (value && !validateEmail(value)) {
                setErrors(prev => ({ ...prev, email: "Invalid email format" }))
            } else if (errors.email) {
                setErrors(prev => ({ ...prev, email: '' }))
            }
        }
    }

    const formatDate = (date) => {
        if (!date) return null
        return new Date(date).toISOString().split('T')[0]
    }


    

    const handleSaveAndNext = async (e) => {
        if (e) e.preventDefault()
        
        // Validate all fields before submission
        if (!validateDates()) {
            alert("Please fix the validation errors before proceeding.");
            return false;
        }

        // Check required fields
        const requiredFields = [
            'onboard_date', 'contract_no', 'bid_no', 'service_start_date', 'service_end_date',
            'customer_name', 'type', 'ministry', 'department', 'department_nickname',
            'organisation_name', 'designation', 'contact_no', 'email', 'gstin', 'address'
        ];

        const missingFields = requiredFields.filter(field => !formData[field]);
        if (missingFields.length > 0) {
            alert(`Please fill all required fields: ${missingFields.join(', ')}`);
            return false;
        }

        const token = localStorage.getItem('token')
        const company_id = localStorage.getItem('selected_company')

        if (!company_id) {
            router.replace("/company");
            return false;
        }

        if (!token) {
            alert('Authentication error');
            return false;
        } 

        try {
            setLoading(true)

            const payload = {
                user_id: 1,
                client_type: client_Type,
                client_id: client_Id || null,
                company_id: Number(company_id),
                contract_no: formData.contract_no,
                service_title: 'Service Contract', 
                onboard_date: formatDate(formData.onboard_date),
                contract_generated_date: formatDate(formData.onboard_date),
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
            console.log("payload client id", payload);
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
            
            if (!response.ok) {
                console.error('API Error:', result)
                throw new Error(result.message || 'Validation failed')
            }
            
            if (result?.status && result?.data?.id) {
                localStorage.setItem("client_id", result.data.id.toString());
                localStorage.setItem(
                    "Client_details",
                    JSON.stringify({
                        formData,
                    })
                );
            } 

            console.log("Saved successfully", result);
            
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
        const saved = localStorage.getItem("Client_details");
        if (saved) {
            const { formData } = JSON.parse(saved);
            setFormData(formData);
            if (formData.onboard_date) {
                setStartDate(new Date(formData.onboard_date));
            }
        }
    }, []);

    useImperativeHandle(ref, () => ({
        submit: handleSaveAndNext
    }))

    // Function to get minimum date for service start (tomorrow from onboard date)
    const getMinServiceStartDate = () => {
        if (!formData.onboard_date) return '';
        const minDate = new Date(formData.onboard_date);
        minDate.setDate(minDate.getDate() + 1);
        return minDate.toISOString().split('T')[0];
    }

    // Function to get minimum date for service end (tomorrow from service start)
    const getMinServiceEndDate = () => {
        if (!formData.service_start_date) return '';
        const minDate = new Date(formData.service_start_date);
        minDate.setDate(minDate.getDate() + 1);
        return minDate.toISOString().split('T')[0];
    }

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

                    {/* ONBOARD DATE - Changed to native date input */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Onboard Date *</label>
                        <input
                            type="date"
                            className="form-control"
                            name="onboard_date"
                            value={formData.onboard_date}
                            onChange={handleChange}
                            required
                        />
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

                    {/* SERVICE START DATE */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Service Start Date *</label>
                        <input
                            type="date"
                            className={`form-control ${errors.service_start_date ? 'is-invalid' : ''}`}
                            name="service_start_date"
                            value={formData.service_start_date}
                            onChange={handleChange}
                            min={getMinServiceStartDate()}
                            required
                        />
                        {errors.service_start_date && (
                            <div className="invalid-feedback">{errors.service_start_date}</div>
                        )}
                    </div>

                    {/* SERVICE END DATE */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Service End Date *</label>
                        <input
                            type="date"
                            className={`form-control ${errors.service_end_date ? 'is-invalid' : ''}`}
                            name="service_end_date"
                            value={formData.service_end_date}
                            onChange={handleChange}
                            min={getMinServiceEndDate()}
                            required
                        />
                        {errors.service_end_date && (
                            <div className="invalid-feedback">{errors.service_end_date}</div>
                        )}
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

                    {/* CONTACT NO */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Contact No *</label>
                        <input
                            type="tel"
                            className={`form-control ${errors.contact_no ? 'is-invalid' : ''}`}
                            name="contact_no"
                            value={formData.contact_no}
                            onChange={handleChange}
                            maxLength="15"
                            placeholder="Enter mobile (10 digits) or landline with STD"
                            required
                        />
                        {errors.contact_no && (
                            <div className="invalid-feedback">{errors.contact_no}</div>
                        )}
                    </div>

                    {/* EMAIL */}
                    <div className="col-md-3 mb-4">
                        <label className="form-label">Email *</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@domain.com"
                            required
                        />
                        {errors.email && (
                            <div className="invalid-feedback">{errors.email}</div>
                        )}
                    </div>

                    {/* GSTIN */}
                    <div className="col-md-3 mb-4">
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

                    {/* GST OPTIONS */}
                    {/* <div className="col-3 form-check mb-3">
                        <input
                            className='form-check-input'
                            type="radio"
                            name="apply_gst"
                            id='apply_gst'
                            checked={formData.apply_gst}
                            onChange={handleChange}
                        />
                        <label htmlFor="apply_gst" className="form-check-label">
                            Apply GST 18%
                        </label>
                    </div>
                    <div className="col-3 form-check mb-3">
                        <input
                            className='form-check-input'
                            type="radio"
                            name="apply_gst"
                            id='apply_cgst_sgst'
                            checked={formData.apply_cgst_sgst}
                            onChange={handleChange}
                        />
                        <label htmlFor="apply_cgst_sgst" className="form-check-label">
                            Apply CGST 9% / SGST 9%
                        </label>
                    </div> */}


<div className="col-3 form-check mb-3">
    <input
        className='form-check-input'
        type="radio"
        name="gst_type"                        // Same name
        value="gst"                             // Value to identify
        checked={formData.apply_gst}
        onChange={handleGSTChange}
    />
    <label htmlFor="apply_gst" className="form-check-label">
        Apply GST 18%
    </label>
</div>

<div className="col-3 form-check mb-3">
    <input
        className='form-check-input'
        type="radio"
        name="gst_type"                        // Same name
        value="cgst_sgst"                        // Value to identify
        checked={formData.apply_cgst_sgst}
        onChange={handleGSTChange}
    />
    <label htmlFor="apply_cgst_sgst" className="form-check-label">
        Apply CGST 9% / SGST 9%
    </label>
</div>
                    {/* Loading indicator */}
                    {loading && (
                        <div className="col-12 text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p>Saving client details...</p>
                        </div>
                    )}

                </div>
            </form>
        </section>
    )
})

export default TabProjectDetails
'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { FiCamera, FiEdit2 } from 'react-icons/fi'
import useImageUpload from '@/hooks/useImageUpload'

// Define initial state structure
const initialProfileData = {
    companyName: '',
    companyPhone: '',
    companyPan: '',
    companyTan: '',
    company_code: '',
    companyGst: '',
    companyEmail: '',
    client_type: '',
    address: '',
    state: '',
    city: '',
    zip_code: '',
    bankName: '',
    bankBranch: '',
    bankIfsc: '',
    bankAccount: '',
    aboutCompany: ''
}

const ProfileCreate = () => {
    const { handleImageUpload, uploadedImage } = useImageUpload()
    const [isEditMode, setIsEditMode] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [profileData, setProfileData] = useState(initialProfileData)
    const [logo, setLogo] = useState('')
    const [error, setError] = useState('')

    // Function to fetch company data
    const fetchCompanyData = useCallback(async () => {
        setIsLoading(true)
        setError('')
        
        try {
            const token = localStorage?.getItem('token');
            const selected_company = localStorage?.getItem('selected_company');
            
            if (!token || !selected_company) {
                console.warn('No authentication token or company ID found - using demo mode')
                // Demo mode with sample data
                setProfileData({
                    ...initialProfileData,
                    companyName: 'Demo Company Ltd.',
                    companyPhone: '+91 98765 43210',
                    companyPan: 'AAAPD5055K',
                    company_code: 'COMP001',
                    companyTan: '12345678901',
                    companyGst: '27AABPD5055K1Z0',
                    companyEmail: 'contact@democompany.com',
                    address: '123 Business Street, Tech Park',
                    client_type: 'corporate',
                    state: 'Maharashtra',
                    city: 'Mumbai',
                    zip_code: '400001',
                    bankName: 'State Bank of India',
                    bankBranch: 'Mumbai Main Branch',
                    bankIfsc: 'SBIN0000123',
                    bankAccount: '1234567890123456',
                    aboutCompany: 'Demo company profile for testing purposes.'
                })
                setLogo('/images/logo-abbr.png')
                return;
            }

            const response = await fetch(
                `https://green-owl-255815.hostingersite.com/api/company/getcompany?company_id=${selected_company}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    cache: 'no-cache'
                }
            )
            
            if (!response.ok) {
                throw new Error(`Failed to fetch company data: ${response.status}`)
            }

            const data = await response.json()
            
            if (!data.status) {
                throw new Error(data.message || 'Failed to load company data')
            }

            const company = data.data || {}
            
            // Map API response to form state
            const mappedData = {
                companyName: company.company_name || '',
                companyPhone: company.company_phone || '',
                companyPan: company.pan_number || '',
                company_code: company.company_code || '',
                companyTan: company.tan_number || '',
                companyGst: company.gst_number || '',
                companyEmail: company.company_business_email || company.email || '',
                address: company.address || '',
                client_type: company.client_type || '',
                state: company.state || '',
                city: company.city || '',
                zip_code: company.zip_code || '',
                bankName: company.bank_name || '',
                bankBranch: company.bank_branch || '',
                bankIfsc: company.ifsc_code || '',
                bankAccount: company.account_number || '',
                aboutCompany: company.company_about || company.about || company.description || ''
            }
            
            setProfileData(mappedData)
            
            // Set logo URL if exists
            if (company?.company_logo) {
                const logoUrl = `https://green-owl-255815.hostingersite.com/${company.company_logo}`
                setLogo(logoUrl)
            } else {
                setLogo('/images/logo-abbr.png')
            }
            
        } catch (error) {
            console.error('Error fetching company data:', error)
            setError(error.message || 'Failed to load company profile')
            // Keep existing data if there's an error during refetch
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Fetch data on component mount
    useEffect(() => {
        fetchCompanyData()
    }, [fetchCompanyData])

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setProfileData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        setError('')
        
        try {
            const token = localStorage.getItem('token')
            const selected_company = localStorage.getItem('selected_company')
            const user = localStorage.getItem('user')
            
            if (!token) {
                throw new Error('Authentication token not found! Please login again.')
            }

            if (!selected_company) {
                throw new Error('Company ID not found!')
            }

            let user_id = null
            try {
                const userData = user ? JSON.parse(user) : null
                user_id = userData?.id
            } catch (parseError) {
                console.warn('Failed to parse user data:', parseError)
            }

            // Validate required fields
            const requiredFields = ['companyName', 'companyEmail', 'companyPhone']
            const missingFields = requiredFields.filter(field => !profileData[field].trim())
            
            if (missingFields.length > 0) {
                throw new Error(`Please fill in required fields: ${missingFields.join(', ')}`)
            }

            // Map form fields to API expected format
            const updateData = {
                company_id: selected_company,
                user_id: user_id,
                company_name: profileData.companyName.trim(),
                company_phone: profileData.companyPhone.trim(),
                pan_number: profileData.companyPan.trim(),
                tan_number: profileData.companyTan.trim(),
                gst_number: profileData.companyGst.trim(),
                company_business_email: profileData.companyEmail.trim(),
                address: profileData.address.trim(),
                client_type: profileData.client_type,
                state: profileData.state.trim(),
                city: profileData.city.trim(),
                zip_code: profileData.zip_code.trim(),
                bank_name: profileData.bankName.trim(),
                bank_branch: profileData.bankBranch.trim(),
                ifsc_code: profileData.bankIfsc.trim(),
                account_number: profileData.bankAccount.trim(),
                company_about: profileData.aboutCompany.trim()
            }

            // Remove empty values
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === '') {
                    delete updateData[key]
                }
            })

            const response = await fetch(
                'https://green-owl-255815.hostingersite.com/api/company/update',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updateData)
                }
            )

            const result = await response.json()
            
            if (!result.status) {
                throw new Error(result.message || 'Failed to update profile')
            }

            // Success
            setIsEditMode(false)
            // Refresh data to show updated information
            await fetchCompanyData()
            
            // Show success message
            alert('Profile updated successfully!')
            
        } catch (error) {
            console.error('Error updating profile:', error)
            setError(error.message)
            alert(`Update failed: ${error.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setIsEditMode(false)
        fetchCompanyData() // Refetch to reset changes
        setError('')
    }

    const handleLogoChange = async (e) => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                // You might want to upload the logo to your server here
                // For now, create a local URL for preview
                const imageUrl = URL.createObjectURL(file)
                setLogo(imageUrl)
            } catch (error) {
                console.error('Error handling logo change:', error)
            }
        }
    }

    if (isLoading) {
        return (
            <div className="col-xl-12">
                <div className="card">
                    <div className="card-body text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 mb-0">Loading company profile...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="col-xl-12">
            <div className="card invoice-container">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        {isEditMode ? 'Update Company Profile' : 'Company Profile'}
                    </h5>
                    <div className="d-flex gap-2">
                        {!isEditMode ? (
                            <button 
                                className="btn btn-primary d-flex align-items-center gap-2"
                                onClick={() => setIsEditMode(true)}
                                disabled={isLoading}
                            >
                                <FiEdit2 size={16} />
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button 
                                    className="btn btn-outline-secondary"
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="btn btn-success d-flex align-items-center gap-2"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" />
                                            Saving...
                                        </>
                                    ) : 'Save Changes'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
                
                {error && !isLoading && (
                    <div className="alert alert-danger m-3" role="alert">
                        {error}
                    </div>
                )}
                
                <div className="card-body p-0">
                    {/* Profile View Mode */}
                    {!isEditMode ? (
                        <div className="p-4">
                            <div className="row mb-4">
                                <div className="col-md-3">
                                    <div className="text-center">
                                        <img 
                                            src={logo || uploadedImage || "/images/logo-abbr.png"} 
                                            className="img-fluid rounded-circle border" 
                                            alt="Company Logo" 
                                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                        />
                                        <div className="mt-2 text-muted">Company Logo</div>
                                    </div>
                                </div>
                                <div className="col-md-9">
                                    <h3 className="mb-3">{profileData.companyName || 'Not provided'}</h3>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p><strong>Phone:</strong> {profileData.companyPhone || 'Not provided'}</p>
                                            <p><strong>Email:</strong> {profileData.companyEmail || 'Not provided'}</p>
                                            <p><strong>PAN:</strong> {profileData.companyPan || 'Not provided'}</p>
                                            <p><strong>GST:</strong> {profileData.companyGst || 'Not provided'}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>TAN:</strong> {profileData.companyTan || 'Not provided'}</p>
                                            <p><strong>Company Code:</strong> {profileData.company_code || 'Not provided'}</p>
                                            <p><strong>Using for:</strong> {profileData.client_type ? profileData.client_type.charAt(0).toUpperCase() + profileData.client_type.slice(1) : 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-4" />

                            <div className="row mb-4">
                                <div className="col-12 mb-4">
                                    <h5 className="mb-3">Address</h5>
                                    <div className="bg-light p-3 rounded">
                                        <p className="mb-0">
                                            {profileData.address || 'No address provided'}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <h5 className="mb-3">City</h5>
                                    <div className="bg-light p-3 rounded">
                                        <p className="mb-0">
                                            {profileData.city || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <h5 className="mb-3">State</h5>
                                    <div className="bg-light p-3 rounded">
                                        <p className="mb-0">
                                            {profileData.state || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <h5 className="mb-3">Zip Code</h5>
                                    <div className="bg-light p-3 rounded">
                                        <p className="mb-0">
                                            {profileData.zip_code || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Show bank details only if available */}
                            {(profileData.bankName || profileData.bankIfsc || profileData.bankAccount) && (
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <h5 className="mb-3">Bank Details</h5>
                                        <div className="row">
                                            {profileData.bankName && (
                                                <div className="col-md-6">
                                                    <p><strong>Bank Name:</strong> {profileData.bankName}</p>
                                                </div>
                                            )}
                                            {profileData.bankBranch && (
                                                <div className="col-md-6">
                                                    <p><strong>Branch:</strong> {profileData.bankBranch}</p>
                                                </div>
                                            )}
                                            {profileData.bankIfsc && (
                                                <div className="col-md-6">
                                                    <p><strong>IFSC Code:</strong> {profileData.bankIfsc}</p>
                                                </div>
                                            )}
                                            {profileData.bankAccount && (
                                                <div className="col-md-6">
                                                    <p><strong>Account Number:</strong> {profileData.bankAccount}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="row">
                                <div className="col-12">
                                    <h5 className="mb-3">About Company</h5>
                                    <div className="bg-light p-3 rounded">
                                        <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                            {profileData.aboutCompany || 'No description available'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Edit Mode Form */
                        <>
                            <div className="px-4 pt-4">
                                <div className="d-md-flex align-items-center justify-content-between">
                                    <div className="mb-4 mb-md-0 your-brand">
                                        <label htmlFor='logoUpload' className="wd-100 ht-100 mb-0 position-relative overflow-hidden border border-gray-2 rounded d-block">
                                            <img 
                                                src={logo || uploadedImage || "/images/logo-abbr.png"} 
                                                className="upload-pic img-fluid rounded h-100 w-100" 
                                                alt="Company Logo" 
                                                style={{ objectFit: 'cover' }}
                                            />
                                            <div className="position-absolute start-50 top-50 end-0 bottom-0 translate-middle h-100 w-100 hstack align-items-center justify-content-center c-pointer upload-button bg-dark bg-opacity-25">
                                                <i className='camera-icon text-white'><FiCamera size={24} /></i>
                                            </div>
                                            <input 
                                                className="file-upload" 
                                                type="file" 
                                                accept="image/*" 
                                                id='logoUpload' 
                                                hidden 
                                                onChange={handleLogoChange} 
                                            />
                                        </label>
                                        <div className="fs-12 text-muted mt-2">* Upload your brand logo (Max 2MB)</div>
                                    </div>
                                    
                                    <div className="d-md-flex align-items-center justify-content-end gap-4">
                                        <div className="form-group mb-3 mb-md-0">
                                            <label className="form-label required">Company Name</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Company Name" 
                                                id="companyName"
                                                value={profileData.companyName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-3 mb-md-0">
                                            <label className="form-label required">Company Phone</label>
                                            <input 
                                                type="tel" 
                                                className="form-control" 
                                                placeholder="Company Phone" 
                                                id="companyPhone"
                                                value={profileData.companyPhone}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Company Type</label>
                                            <select
                                                className="form-control"
                                                id="client_type"
                                                value={profileData.client_type || ""}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Company Type</option>
                                                <option value="GeM">GeM</option>
                                                <option value="corporate">Corporate</option>
                                                <option value="both">Both</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <hr className="border-dashed" />
                            
                            <div className="px-4 row justify-content-between">
                                <div className="col-xl-4">
                                    <div className="form-group mb-3">
                                        <label htmlFor="companyPan" className="form-label">Company PAN</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="companyPan" 
                                            placeholder="Company PAN" 
                                            value={profileData.companyPan}
                                            onChange={handleInputChange}
                                            maxLength="10"
                                        />
                                    </div>
                                </div>
                                <div className="col-xl-4">
                                    <div className="form-group mb-3">
                                        <label htmlFor="companyTan" className="form-label">Company TAN</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="companyTan" 
                                            placeholder="Company TAN" 
                                            value={profileData.companyTan}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-xl-4">
                                    <div className="form-group mb-3">
                                        <label htmlFor="companyGst" className="form-label">Company GST</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="companyGst" 
                                            placeholder="Company GST" 
                                            value={profileData.companyGst}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <hr className="border-dashed" />
                            
                            <div className="row px-4">
                                <div className="col-12">
                                    <div className="form-group mb-3">
                                        <label htmlFor="companyEmail" className="form-label required">Company Email</label>
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            id="companyEmail" 
                                            placeholder="Email Address" 
                                            value={profileData.companyEmail}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="row">
                                        <div className="col-xl-6 mb-3">
                                            <label htmlFor="address" className="form-label">Address</label>
                                            <textarea
                                                className="form-control" 
                                                id="address" 
                                                placeholder="Enter Address" 
                                                rows="2"
                                                value={profileData.address}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-xl-2 mb-3">
                                            <label htmlFor="city" className="form-label">City</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="city" 
                                                placeholder="City" 
                                                value={profileData.city}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-xl-2 mb-3">
                                            <label htmlFor="state" className="form-label">State</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="state" 
                                                placeholder="State" 
                                                value={profileData.state}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-xl-2 mb-3">
                                            <label htmlFor="zip_code" className="form-label">Zip Code</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="zip_code" 
                                                placeholder="Zip code" 
                                                value={profileData.zip_code}
                                                onChange={handleInputChange}
                                                maxLength="6"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <hr className="border-dashed" />
                            
                            <div className="px-4">
                                <h5 className="mb-3">Bank Details</h5>
                                <div className="row">
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="bankName" className="form-label">Bank Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="bankName" 
                                            placeholder="Bank Name" 
                                            value={profileData.bankName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="bankBranch" className="form-label">Bank Branch</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="bankBranch" 
                                            placeholder="Bank Branch" 
                                            value={profileData.bankBranch}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="bankIfsc" className="form-label">Bank IFSC</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="bankIfsc" 
                                            placeholder="Bank IFSC" 
                                            value={profileData.bankIfsc}
                                            onChange={handleInputChange}
                                            maxLength="11"
                                        />
                                    </div>
                                    <div className="col-xl-6 mb-3">
                                        <label htmlFor="bankAccount" className="form-label">Bank Account</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="bankAccount" 
                                            placeholder="Enter Bank Account" 
                                            value={profileData.bankAccount}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <hr className="border-dashed" />
                            
                            <div className="px-4 pb-4">
                                <div className="form-group">
                                    <label htmlFor="aboutCompany" className="form-label">About Company</label>
                                    <textarea 
                                        rows={6} 
                                        className="form-control" 
                                        id="aboutCompany" 
                                        placeholder="Tell us about your company" 
                                        value={profileData.aboutCompany}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfileCreate
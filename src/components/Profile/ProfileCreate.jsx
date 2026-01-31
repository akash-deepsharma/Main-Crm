'use client'
import React, { useState, useEffect } from 'react'
import { FiCamera, FiEdit2 } from 'react-icons/fi'
import useImageUpload from '@/hooks/useImageUpload'

const ProfileCreate = () => {
    const { handleImageUpload, uploadedImage } = useImageUpload()
    const [isEditMode, setIsEditMode] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [profileData, setProfileData] = useState({
        companyName: '',
        companyPhone: '',
        companyPan: '',
        companyTan: '',
        company_code:'',
        companyGst: '',
        companyEmail: '',
        address: '',
        state:'',
        city:'',
        zip_code:'',
        bankName: '',
        bankBranch: '',
        bankIfsc: '',
        bankAccount: '',
        aboutCompany: ''
    })
    const [logo, setLogo] = useState('')

    // Function to fetch company data
    const fetchCompanyData = async () => {
        setIsLoading(true)
        try {
            const token = localStorage.getItem('token');
            const selected_company = localStorage.getItem('selected_company');
            
            console.log('Token:', token ? 'Exists' : 'Not found');
            console.log('Selected Company ID:', selected_company);
            
            if (!token) {
                console.error('No authentication token found');
                return;
            }
            
            if (!selected_company) {
                console.error('No company ID selected');
                return;
            }

            const response = await fetch(
                `https://green-owl-255815.hostingersite.com/api/company/getcompany?company_id=${selected_company}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            )

            console.log('Response status:', response.status)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log('Full API Response:', JSON.stringify(data, null, 2))
            
            if (data.status) {
                const company = data.data
                
               
                
                setProfileData({
                    companyName: company?.company_name,
                    companyPhone: company?.company_phone ,
                    companyPan: company?.pan_number,
                    company_code: company?.company_code,
                    companyTan: company?.tan_number,
                    companyGst: company?.gst_number,
                    companyEmail: company?.company_business_email || company?.email || '',
                    address: company?.address || '',
                    state: company?.state || '',
                    city: company?.city || '',
                    zip_code: company?.zip_code || '',
                    bankName: company?.bank_name || '',
                    bankBranch: company?.bank_branch || '',
                    bankIfsc: company?.ifsc_code || '',
                    bankAccount: company?.account_number || '',
                    aboutCompany: company?.company_about || company?.about || company?.description || ''
                })
                
                // Set logo URL if exists
                if (company?.company_logo) {
                    setLogo(`https://green-owl-255815.hostingersite.com/${company?.company_logo}`)
                }
            } else {
                console.error('API returned false status:', data.message)
            }
        } catch (error) {
            console.error('Error fetching company data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch data on component mount
    useEffect(() => {
        fetchCompanyData()
    }, [])

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setProfileData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const selected_company = localStorage.getItem('selected_company');
            const user = localStorage.getItem('user');
            const user_id = JSON.parse(user).id;
            console.log("user_id", user_id);
            if (!token) {
                alert('Authentication token not found! Please login again.');
                return;
            }

            // Map form fields to API expected format
            const updateData = {
                company_id: selected_company,
                user_id: user_id,
                company_name: profileData.companyName,
                company_phone: profileData.companyPhone,
                pan_number: profileData.companyPan,
                tan_number: profileData.companyTan,
                gst_number: profileData.companyGst,
                company_business_email: profileData.companyEmail,
                address: profileData.address,
                bank_name: profileData.bankName,
                bank_branch: profileData.bankBranch,
                ifsc_code: profileData.bankIfsc,
                account_number: profileData.bankAccount,
                company_about: profileData.aboutCompany
            }

            console.log('Sending update data:', updateData);
            
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
            console.log('Update Response:', result)
            
            if (result.status === true) {
                setIsEditMode(false)
                alert('Profile updated successfully!')
                // Refresh data to show updated information
                fetchCompanyData()
            } else {
                alert(`Update failed: ${result.message || 'Unknown error'}`)
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Error updating profile. Please check console for details.')
        }
    }

    const handleCancel = () => {
        setIsEditMode(false)
        fetchCompanyData() // Refetch to reset changes
    }

    if (isLoading) {
        return (
            <div className="col-xl-12">
                <div className="card">
                    <div className="card-body text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading company profile...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
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
                                >
                                    <FiEdit2 size={16} />
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button 
                                        className="btn btn-outline-secondary"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className="btn btn-success"
                                        onClick={handleSave}
                                    >
                                        Save Changes
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
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
                                        <h3 className="mb-3">{profileData?.companyName}</h3>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p><strong>Phone:</strong> {profileData?.companyPhone}</p>
                                                <p><strong>Email:</strong> {profileData?.companyEmail}</p>
                                                <p><strong>PAN:</strong> {profileData?.companyPan}</p>
                                                <p><strong>GST:</strong> {profileData?.companyGst}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <p><strong>TAN:</strong> {profileData?.companyTan}</p>
                                                <p><strong>Company Code:</strong> {profileData?.company_code}</p>
                                                {/* <p><strong>LinkedIn:</strong> Not available</p> */}
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
                                                {profileData?.address || 'No address provided'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <h5 className="mb-3">City</h5>
                                        <div className="bg-light p-3 rounded">
                                            <p className="mb-0">
                                                {profileData?.addrcityess || 'No address provided'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <h5 className="mb-3">State</h5>
                                        <div className="bg-light p-3 rounded">
                                            <p className="mb-0">
                                                {profileData?.state || 'No address provided'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <h5 className="mb-3">Zip Code</h5>
                                        <div className="bg-light p-3 rounded">
                                            <p className="mb-0">
                                                {profileData?.zip_code || 'No address provided'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Show bank details only if available */}
                                {(profileData?.bankName || profileData?.bankIfsc || profileData?.bankAccount) && (
                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <h5 className="mb-3">Bank Details</h5>
                                            <div className="row">
                                                {profileData.bankName && (
                                                    <div className="col-md-6">
                                                        <p><strong>Bank Name:</strong> {profileData?.bankName}</p>
                                                    </div>
                                                )}
                                                {profileData.bankBranch && (
                                                    <div className="col-md-6">
                                                        <p><strong>Branch:</strong> {profileData?.bankBranch}</p>
                                                    </div>
                                                )}
                                                {profileData.bankIfsc && (
                                                    <div className="col-md-6">
                                                        <p><strong>IFSC Code:</strong> {profileData?.bankIfsc}</p>
                                                    </div>
                                                )}
                                                {profileData.bankAccount && (
                                                    <div className="col-md-6">
                                                        <p><strong>Account Number:</strong> {profileData?.bankAccount}</p>
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
                                            <p className="mb-0">{profileData?.aboutCompany || 'No description available'}</p>
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
                                            <label htmlFor='img' className="wd-100 ht-100 mb-0 position-relative overflow-hidden border border-gray-2 rounded">
                                                <img src={logo || uploadedImage || "/images/logo-abbr.png"} className="upload-pic img-fluid rounded h-100 w-100" alt="Uploaded" />
                                                <div className="position-absolute start-50 top-50 end-0 bottom-0 translate-middle h-100 w-100 hstack align-items-center justify-content-center c-pointer upload-button">
                                                    <i aria-hidden="true" className='camera-icon'><FiCamera size={16} /></i>
                                                </div>
                                                <input className="file-upload" type="file" accept="image/*" id='img' hidden onChange={handleImageUpload} />
                                            </label>
                                            <div className="fs-12 text-muted">* Upload your brand logo</div>
                                        </div>
                                        <div className="d-md-flex align-items-center justify-content-end gap-4">
                                            <div className="form-group mb-3 mb-md-0">
                                                <label className="form-label">Company Name:</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="Company Name" 
                                                    id="companyName"
                                                    value={profileData.companyName}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Company Phone:</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="Company Phone" 
                                                    id="companyPhone"
                                                    value={profileData.companyPhone}
                                                    onChange={handleInputChange}
                                                />
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
                                                value={profileData?.companyPan}
                                                onChange={handleInputChange}
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
                                                value={profileData?.companyTan}
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
                                                value={profileData?.companyGst}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <hr className="border-dashed" />
                                <div className="row px-4 justify-content-between">
                                    <div className="col-xl-12 mb-4 mb-sm-0">
                                        <div className="form-group row mb-3">
                                            <label htmlFor="companyEmail" className="col-sm-3 col-form-label">Company Email</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="email" 
                                                    className="form-control" 
                                                    id="companyEmail" 
                                                    placeholder="Email Address" 
                                                    value={profileData?.companyEmail}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className='row'>
                                            <div className="col-xl-4">
                                            <div className="form-group mb-3">
                                                <label htmlFor="address" className="form-label">Address</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="address" 
                                                    placeholder="Enter Address" 
                                                    value={profileData?.address}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-3">
                                            <div className="form-group mb-3">
                                                <label htmlFor="City" className="form-label">City</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="City" 
                                                    placeholder="City" 
                                                    value={profileData?.city}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-3">
                                            <div className="form-group mb-3">
                                                <label htmlFor="State" className="form-label">State</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="State" 
                                                    placeholder="State" 
                                                    value={profileData?.state}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-2">
                                            <div className="form-group mb-3">
                                                <label htmlFor="Zip" className="form-label">Zip code</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="Zip" 
                                                    placeholder="Zip code" 
                                                    value={profileData?.zip_code}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        </div>
                                    </div>
                                    <div className="col-xl-12 mb-4 mt-4 mb-sm-0">
                                        <h5 className="mb-3">Bank Details</h5>
                                        <div className="form-group row mb-3">
                                            <label htmlFor="bankName" className="col-sm-3 col-form-label">Bank Name</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="bankName" 
                                                    placeholder="Bank Name" 
                                                    value={profileData?.bankName}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label htmlFor="bankBranch" className="col-sm-3 col-form-label">Bank Branch</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="bankBranch" 
                                                    placeholder="Bank Branch" 
                                                    value={profileData?.bankBranch}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label htmlFor="bankIfsc" className="col-sm-3 col-form-label">Bank IFSC</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="bankIfsc" 
                                                    placeholder="Bank IFSC" 
                                                    value={profileData?.bankIfsc}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label htmlFor="bankAccount" className="col-sm-3 col-form-label">Bank Account</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    id="bankAccount" 
                                                    placeholder="Enter Bank Account" 
                                                    value={profileData?.bankAccount}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="border-dashed" />
                                <div className="px-4 pb-4">
                                    <div className="form-group">
                                        <label htmlFor="aboutCompany" className="form-label">About Company:</label>
                                        <textarea 
                                            rows={6} 
                                            className="form-control" 
                                            id="aboutCompany" 
                                            placeholder="Tell us about your company" 
                                            value={profileData?.aboutCompany}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileCreate
'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { FiCamera, FiEdit2, FiEye, FiKey, FiTrash2, FiUser, FiX, FiCheck, FiXCircle, FiUserCheck, FiUserX } from 'react-icons/fi'

// Define initial state structure
const initialProfileData = {
    companyName: '',
    companyStamp: '',
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

// Initial user form state
const initialUserForm = {
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    role_type: 'subscriber'
}

// Initial change password form state
const initialChangePasswordForm = {
    new_password: '',
    confirm_new_password: ''
}

const ProfileCreate = () => {
    const [isEditMode, setIsEditMode] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [profileData, setProfileData] = useState(initialProfileData)
    const [logo, setLogo] = useState('')
    const [stamp, setStamp] = useState('')
    const [error, setError] = useState('')
    const [isUploadingLogo, setIsUploadingLogo] = useState(false)
    const [isUploadingStamp, setIsUploadingStamp] = useState(false)
    
    // User form state
    const [showUserForm, setShowUserForm] = useState(false)
    const [userForm, setUserForm] = useState(initialUserForm)
    const [isAddingUser, setIsAddingUser] = useState(false)
    const [userError, setUserError] = useState('')
    const [userSuccess, setUserSuccess] = useState('')
    
    // Users list state
    const [companyUsers, setCompanyUsers] = useState([])
    const [isLoadingUsers, setIsLoadingUsers] = useState(false)
    
    // Modal states
    const [showUserDetailsModal, setShowUserDetailsModal] = useState(false)
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [changePasswordForm, setChangePasswordForm] = useState(initialChangePasswordForm)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState('')
    
    // Status change state
    const [isChangingStatus, setIsChangingStatus] = useState(false)

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
                    companyStamp: '',
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
                setStamp('/images/logo-abbr.png')
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

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Non-JSON response:', text.substring(0, 200));
                throw new Error('Server returned non-JSON response');
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
                companyStamp: company.company_stamp || '',
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
                const logoUrl = `https://green-owl-255815.hostingersite.com/${company?.company_logo}`
                setLogo(logoUrl)
            } else {
                setLogo('/images/logo-abbr.png')
            }
            
            // Set stamp URL if exists
            if (company?.company_stamp) {
                const stampUrl = `https://green-owl-255815.hostingersite.com/${company?.company_stamp}`
                setStamp(stampUrl)
            } else {
                setStamp('/images/logo-abbr.png')
            }
            
        } catch (error) {
            console.error('Error fetching company data:', error)
            setError(error.message || 'Failed to load company profile')
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Function to fetch company users
    const fetchCompanyUsers = useCallback(async () => {
        setIsLoadingUsers(true)
        try {
            const token = localStorage?.getItem('token');
            const selected_company = localStorage?.getItem('selected_company');
            
            if (!token || !selected_company) {
                console.warn('No authentication token or company ID found')
                return;
            }

            const response = await fetch(
                `https://green-owl-255815.hostingersite.com/api/getcompanyuser?company_id=${selected_company}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    cache: 'no-cache'
                }
            )
            
            if (!response.ok) {
                throw new Error(`Failed to fetch company users: ${response.status}`)
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Non-JSON response:', text.substring(0, 200));
                throw new Error('Server returned non-JSON response');
            }

            const data = await response.json()
            
            if (data.status) {
                setCompanyUsers(data.data || [])
            } else {
                console.warn('Failed to load company users:', data.message)
            }
            
        } catch (error) {
            console.error('Error fetching company users:', error)
        } finally {
            setIsLoadingUsers(false)
        }
    }, [])

    // Fetch data on component mount
    useEffect(() => {
        fetchCompanyData()
        fetchCompanyUsers()
    }, [fetchCompanyData, fetchCompanyUsers])

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setProfileData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const handleUserFormChange = (e) => {
        const { name, value } = e.target
        setUserForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePasswordFormChange = (e) => {
        const { name, value } = e.target
        setChangePasswordForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Upload image to server - generic function for both logo and stamp
    const uploadImageToServer = async (file, type = 'logo') => {
        const token = localStorage.getItem('token')
        const selected_company = localStorage.getItem('selected_company')
        
        if (!token || !selected_company) {
            throw new Error('Authentication required')
        }

        const formData = new FormData()
        formData.append('company_id', selected_company)
        
        if (type === 'logo') {
            formData.append('company_logo', file)
        } else if (type === 'stamp') {
            formData.append('company_stamp', file)
        }

        // Try different possible endpoints
        const endpoints = [
            `https://green-owl-255815.hostingersite.com/api/company/upload-${type}`,
            `https://green-owl-255815.hostingersite.com/api/company/upload`,
            `https://green-owl-255815.hostingersite.com/api/company/update-${type}`,
            `https://green-owl-255815.hostingersite.com/api/company/update`
        ]

        let lastError = null;
        
        for (const endpoint of endpoints) {
            try {
                console.log(`Trying endpoint: ${endpoint}`);
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData
                })

                // Check if response is JSON
                const contentType = response.headers.get('content-type');
                let result;
                
                if (contentType && contentType.includes('application/json')) {
                    result = await response.json();
                } else {
                    const text = await response.text();
                    console.warn(`Non-JSON response from ${endpoint}:`, text.substring(0, 200));
                    
                    // If it's not JSON but response is ok, assume success
                    if (response.ok) {
                        console.log(`Upload successful to ${endpoint} (non-JSON response)`);
                        return { success: true, message: 'Upload successful' };
                    } else {
                        throw new Error(`Server returned non-JSON response: ${response.status}`);
                    }
                }

                if (result.status) {
                    console.log(`Upload successful to ${endpoint}`, result);
                    return result.data || result;
                } else {
                    throw new Error(result.message || `Failed to upload ${type}`);
                }
            } catch (error) {
                console.warn(`Failed with endpoint ${endpoint}:`, error.message);
                lastError = error;
                continue; // Try next endpoint
            }
        }

        // If all endpoints failed
        throw lastError || new Error(`Failed to upload ${type}: No working endpoint found`);
    }

    const uploadLogoToServer = async (file) => {
        setIsUploadingLogo(true)
        try {
            const result = await uploadImageToServer(file, 'logo')
            
            // Update logo URL with the new one from server
            if (result?.company_logo) {
                const logoUrl = `https://green-owl-255815.hostingersite.com/${result.company_logo}`
                setLogo(logoUrl)
            }
            
            return result
        } catch (error) {
            console.error('Error uploading logo:', error)
            throw error
        } finally {
            setIsUploadingLogo(false)
        }
    }

    // Upload stamp to server
    const uploadStampToServer = async (file) => {
        setIsUploadingStamp(true)
        try {
            const result = await uploadImageToServer(file, 'stamp')
            
            // Update stamp URL with the new one from server
            if (result?.company_stamp) {
                const stampUrl = `https://green-owl-255815.hostingersite.com/${result.company_stamp}`
                setStamp(stampUrl)
            }
            
            return result
        } catch (error) {
            console.error('Error uploading stamp:', error)
            throw error
        } finally {
            setIsUploadingStamp(false)
        }
    }

    // Alternative: Update stamp via the main update endpoint
    const updateStampViaUpdateAPI = async (file) => {
        setIsUploadingStamp(true)
        try {
            const token = localStorage.getItem('token')
            const selected_company = localStorage.getItem('selected_company')
            
            if (!token || !selected_company) {
                throw new Error('Authentication required')
            }

            const formData = new FormData()
            formData.append('company_id', selected_company)
            
            // Try both field names
            formData.append('company_stamp', file)
            formData.append('stamp', file)

            const response = await fetch(
                'https://green-owl-255815.hostingersite.com/api/company/update',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData
                }
            )

            // Check content type
            const contentType = response.headers.get('content-type');
            let result;
            
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                console.warn('Non-JSON response from update:', text.substring(0, 200));
                
                if (response.ok) {
                    console.log('Stamp update successful (non-JSON response)');
                    // Refresh data to get updated stamp
                    await fetchCompanyData();
                    return { success: true };
                } else {
                    throw new Error(`Server error: ${response.status}`);
                }
            }

            if (result.status) {
                console.log('Stamp update successful via update API', result);
                // Refresh data
                await fetchCompanyData();
                return result.data || result;
            } else {
                throw new Error(result.message || 'Failed to update stamp');
            }
        } catch (error) {
            console.error('Error updating stamp via update API:', error)
            throw error
        } finally {
            setIsUploadingStamp(false)
        }
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

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            let result;
            
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                console.error('Non-JSON response:', text.substring(0, 200));
                throw new Error('Server returned non-JSON response');
            }
            
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
                // Validate file size (max 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    alert('File size must be less than 2MB')
                    return
                }

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please upload an image file')
                    return
                }

                // Create local preview
                const imageUrl = URL.createObjectURL(file)
                setLogo(imageUrl)

                // Upload to server
                await uploadLogoToServer(file)
                alert('Logo uploaded successfully!')
                
            } catch (error) {
                console.error('Error handling logo change:', error)
                alert(`Failed to upload logo: ${error.message}`)
                // Keep the preview but mark it as not saved
            }
        }
    }

    const handleStampChange = async (e) => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                // Validate file size (max 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    alert('File size must be less than 2MB')
                    return
                }

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please upload an image file')
                    return
                }

                // Create local preview
                const imageUrl = URL.createObjectURL(file)
                setStamp(imageUrl)

                // Try different upload methods
                try {
                    // First try the specific upload endpoint
                    await uploadStampToServer(file)
                    alert('Stamp uploaded successfully!')
                } catch (uploadError) {
                    console.log('Specific upload failed, trying update API:', uploadError.message)
                    
                    // Fallback to update API
                    await updateStampViaUpdateAPI(file)
                    alert('Stamp updated successfully via update API!')
                }
                
            } catch (error) {
                console.error('Error handling stamp change:', error)
                
                // More user-friendly error message
                if (error.message.includes('DOCTYPE') || error.message.includes('<html')) {
                    alert('Server configuration error. Stamp was saved locally but not on server. Please contact support.')
                } else {
                    alert(`Failed to upload stamp: ${error.message}`)
                }
                
                // Keep the preview but mark it as not saved
            }
        }
    }

    // Handle Add User form submission
    const handleAddUser = async (e) => {
        e.preventDefault()
        setIsAddingUser(true)
        setUserError('')
        setUserSuccess('')

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

            // Get user_id from localStorage user object
            let user_id = null
            try {
                const userData = user ? JSON.parse(user) : null
                user_id = userData?.id
                
                if (!user_id) {
                    throw new Error('User ID not found in user data')
                }
                
                console.log('User data from localStorage:', userData)
                console.log('User ID extracted:', user_id)
            } catch (parseError) {
                console.error('Failed to parse user data:', parseError)
                throw new Error('Failed to get user information. Please login again.')
            }

            // Validate required fields
            const requiredFields = ['name', 'email', 'password', 'confirm_password']
            const missingFields = requiredFields.filter(field => !userForm[field].trim())
            
            if (missingFields.length > 0) {
                throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`)
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(userForm.email)) {
                throw new Error('Please enter a valid email address')
            }

            // Validate password match
            if (userForm.password !== userForm.confirm_password) {
                throw new Error('Passwords do not match')
            }

            // Validate password length
            if (userForm.password.length < 6) {
                throw new Error('Password must be at least 6 characters long')
            }

            // Prepare user data for subusercreate API
            const userData = {
                name: userForm.name.trim(),
                email: userForm.email.trim(),
                password: userForm.password,
                confirm_password: userForm.confirm_password,
                role_type: userForm.role_type,
                user_id: user_id,
                company_id: selected_company
            }

            console.log('Adding sub-user with data:', userData)

            // Make API call to add sub-user using subusercreate endpoint
            const response = await fetch(
                'https://green-owl-255815.hostingersite.com/api/subusercreate',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData)
                }
            )

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            let result;
            
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                console.error('Non-JSON response:', text.substring(0, 200));
                throw new Error('Server returned non-JSON response');
            }

            console.log('Sub-user creation response:', result)
            
            if (!result.status) {
                throw new Error(result.message || 'Failed to add user')
            }

            // Success
            setUserSuccess('User added successfully!')
            setUserForm(initialUserForm)
            setShowUserForm(false)
            
            // Refresh users list
            await fetchCompanyUsers()
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setUserSuccess('')
            }, 3000)
            
        } catch (error) {
            console.error('Error adding sub-user:', error)
            setUserError(error.message)
        } finally {
            setIsAddingUser(false)
        }
    }

    // Open user details modal
    const openUserDetailsModal = (user) => {
        setSelectedUser(user)
        setShowUserDetailsModal(true)
    }

    // Open change password modal
    const openChangePasswordModal = (user) => {
        setSelectedUser(user)
        setChangePasswordForm(initialChangePasswordForm)
        setPasswordError('')
        setPasswordSuccess('')
        setShowChangePasswordModal(true)
    }

    // Handle change password
    const handleChangePassword = async (e) => {
        e.preventDefault()
        setIsChangingPassword(true)
        setPasswordError('')
        setPasswordSuccess('')

        try {
            if (!selectedUser) {
                throw new Error('No user selected')
            }

            const token = localStorage.getItem('token')
            
            if (!token) {
                throw new Error('Authentication token not found! Please login again.')
            }

            // Validate password fields
            if (!changePasswordForm.new_password.trim()) {
                throw new Error('Please enter new password')
            }

            if (!changePasswordForm.confirm_new_password.trim()) {
                throw new Error('Please confirm new password')
            }

            if (changePasswordForm.new_password !== changePasswordForm.confirm_new_password) {
                throw new Error('Passwords do not match')
            }

            if (changePasswordForm.new_password.length < 6) {
                throw new Error('Password must be at least 6 characters long')
            }

            // Prepare data for API
            const passwordData = {
                user_id: selectedUser.id,
                new_password: changePasswordForm.new_password
            }

            console.log('Changing password with data:', passwordData)

            // Make API call to change password
            const response = await fetch(
                'https://green-owl-255815.hostingersite.com/api/changepassword2',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(passwordData)
                }
            )

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            let result;
            
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                console.error('Non-JSON response:', text.substring(0, 200));
                throw new Error('Server returned non-JSON response');
            }

            console.log('Change password response:', result)
            
            if (!result.status) {
                throw new Error(result.message || 'Failed to change password')
            }

            // Success
            setPasswordSuccess('Password changed successfully!')
            setChangePasswordForm(initialChangePasswordForm)
            
            // Clear success message and close modal after 2 seconds
            setTimeout(() => {
                setPasswordSuccess('')
                setShowChangePasswordModal(false)
            }, 2000)
            
        } catch (error) {
            console.error('Error changing password:', error)
            setPasswordError(error.message)
        } finally {
            setIsChangingPassword(false)
        }
    }

    const handleChangeStatus = async (user, newStatus) => {
        if (!window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} user ${user.name}?`)) {
            return;
        }

        setIsChangingStatus(true)
        try {
            const token = localStorage.getItem('token')
            
            if (!token) {
                throw new Error('Authentication token not found! Please login again.')
            }

            // Make API call to change status
            const response = await fetch(
                `https://green-owl-255815.hostingersite.com/api/changestatus?user_id=${user.id}&status=${newStatus}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                }
            )

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            let result;
            
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                console.error('Non-JSON response:', text.substring(0, 200));
                throw new Error('Server returned non-JSON response');
            }

            console.log('Change status response:', result)
            
            if (!result.status) {
                throw new Error(result.message || 'Failed to change user status')
            }

            // Success - update local state
            setCompanyUsers(prevUsers => 
                prevUsers.map(u => 
                    u.id === user.id 
                        ? { ...u, status: newStatus } 
                        : u
                )
            )
            
            // Show success message
            alert(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`)
            
        } catch (error) {
            console.error('Error changing user status:', error)
            alert(`Failed to change status: ${error.message}`)
        } finally {
            setIsChangingStatus(false)
        }
    }

    // Close all modals
    const closeAllModals = () => {
        setShowUserDetailsModal(false)
        setShowChangePasswordModal(false)
        setSelectedUser(null)
        setChangePasswordForm(initialChangePasswordForm)
        setPasswordError('')
        setPasswordSuccess('')
    }

    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-success';
            case 'inactive':
                return 'bg-danger';
            default:
                return 'bg-secondary';
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
            {/* Company Profile Card */}
            <div className="card invoice-container mb-4">
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
                                            src={logo || "/images/logo-abbr.png"} 
                                            className="img-fluid rounded-circle border" 
                                            alt="Company Logo" 
                                            style={{ width: '150px', height: '150px', objectFit: 'fill' }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/logo-abbr.png'
                                            }}
                                        />
                                        <div className="mt-2 text-muted">Company Logo</div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="text-center">
                                        <img 
                                            src={stamp || "/images/stamp-placeholder.png"} 
                                            className="img-fluid rounded border" 
                                            alt="Company Stamp" 
                                            style={{ width: '150px', height: '150px', objectFit: 'fill' }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/stamp-placeholder.png'
                                            }}
                                        />
                                        <div className="mt-2 text-muted">Company Stamp (in png formate)</div>
                                    </div>
                                </div>
                                <div className="col-md-6">
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
                                            {profileData?.address || 'No address provided'}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <h5 className="mb-3">City</h5>
                                    <div className="bg-light p-3 rounded">
                                        <p className="mb-0">
                                            {profileData?.city || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <h5 className="mb-3">State</h5>
                                    <div className="bg-light p-3 rounded">
                                        <p className="mb-0">
                                            {profileData?.state || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <h5 className="mb-3">Zip Code</h5>
                                    <div className="bg-light p-3 rounded">
                                        <p className="mb-0">
                                            {profileData?.zip_code || 'Not provided'}
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
                                            {profileData?.bankName && (
                                                <div className="col-md-6">
                                                    <p><strong>Bank Name:</strong> {profileData?.bankName}</p>
                                                </div>
                                            )}
                                            {profileData?.bankBranch && (
                                                <div className="col-md-6">
                                                    <p><strong>Branch:</strong> {profileData?.bankBranch}</p>
                                                </div>
                                            )}
                                            {profileData?.bankIfsc && (
                                                <div className="col-md-6">
                                                    <p><strong>IFSC Code:</strong> {profileData?.bankIfsc}</p>
                                                </div>
                                            )}
                                            {profileData?.bankAccount && (
                                                <div className="col-md-6">
                                                    <p><strong>Account Number:</strong> {profileData?.bankAccount}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="row">
                                <div className="col-12 mb-3">
                                    <h5 className="mb-3">About Company</h5>
                                    <div className="bg-light p-3 rounded">
                                        <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                            {profileData?.aboutCompany || 'No description available'}
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
                                    {/* Logo Upload Section */}
                                    <div className="mb-4 mb-md-0">
                                        <label htmlFor='logoUpload' className="wd-100 ht-100 mb-0 position-relative overflow-hidden border border-gray-2 rounded d-block">
                                            <img 
                                                src={logo || "/images/logo-abbr.png"} 
                                                className="upload-pic img-fluid rounded h-100 w-100" 
                                                alt="Company Logo" 
                                                style={{ objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/images/logo-abbr.png'
                                                }}
                                            />
                                            <div className="position-absolute start-50 top-50 end-0 bottom-0 translate-middle h-100 w-100 hstack align-items-center justify-content-center c-pointer upload-button bg-dark bg-opacity-25">
                                                {isUploadingLogo ? (
                                                    <span className="spinner-border spinner-border-sm text-white" role="status" />
                                                ) : (
                                                    <i className='camera-icon text-white'><FiCamera size={24} /></i>
                                                )}
                                            </div>
                                            <input 
                                                className="file-upload" 
                                                type="file" 
                                                accept="image/*" 
                                                id='logoUpload' 
                                                hidden 
                                                onChange={handleLogoChange} 
                                                disabled={isUploadingLogo}
                                            />
                                        </label>
                                        <div className="fs-12 text-muted mt-2">* Upload your brand logo (Max 2MB)</div>
                                    </div>
                                    
                                    {/* Stamp Upload Section */}
                                    <div className="mb-4 mb-md-0">
                                        <label htmlFor='stampUpload' className="wd-100 ht-100 mb-0 position-relative overflow-hidden border border-gray-2 rounded d-block">
                                            <img 
                                                src={stamp || "/images/stamp-placeholder.png"} 
                                                className="upload-pic img-fluid rounded h-100 w-100" 
                                                alt="Company Stamp" 
                                                style={{ objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/images/stamp-placeholder.png'
                                                }}
                                            />
                                            <div className="position-absolute start-50 top-50 end-0 bottom-0 translate-middle h-100 w-100 hstack align-items-center justify-content-center c-pointer upload-button bg-dark bg-opacity-25">
                                                {isUploadingStamp ? (
                                                    <span className="spinner-border spinner-border-sm text-white" role="status" />
                                                ) : (
                                                    <i className='camera-icon text-white'><FiCamera size={24} /></i>
                                                )}
                                            </div>
                                            <input 
                                                className="file-upload" 
                                                type="file" 
                                                accept="image/*" 
                                                id='stampUpload' 
                                                hidden 
                                                onChange={handleStampChange} 
                                                disabled={isUploadingStamp}
                                            />
                                        </label>
                                        <div className="fs-12 text-muted mt-2">* Upload your Company Stamp (Max 2MB)</div>
                                    </div>
                                    
                                    {/* Company Info Fields */}
                                    <div className="d-md-flex align-items-center justify-content-end gap-4">
                                        <div className="form-group mb-3 mb-md-0">
                                            <label className="form-label required">Company Name</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Company Name" 
                                                id="companyName"
                                                value={profileData?.companyName}
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
                                                value={profileData?.companyPhone}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Company Type</label>
                                            <select
                                                className="form-control"
                                                id="client_type"
                                                value={profileData?.client_type || ""}
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

            {/* User Management Section */}
            <div className="card invoice-container mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">User Management</h5>
                    <button 
                        className="btn btn-danger"
                        onClick={() => setShowUserForm(!showUserForm)}
                    >
                        {showUserForm ? 'Cancel' : 'Add User'}
                    </button>
                </div>
                
                <div className="card-body">
                    {userSuccess && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            {userSuccess}
                            <button type="button" className="btn-close" onClick={() => setUserSuccess('')}></button>
                        </div>
                    )}
                    
                    {userError && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            {userError}
                            <button type="button" className="btn-close" onClick={() => setUserError('')}></button>
                        </div>
                    )}
                    
                    {showUserForm && (
                        <form onSubmit={handleAddUser} className="p-3 border rounded mb-4">
                            <h5 className="mb-3">Add New User</h5>
                            
                            <div className="mb-3">
                                <label className="form-label required">Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Enter name"
                                    name="name"
                                    value={userForm.name}
                                    onChange={handleUserFormChange}
                                    required
                                />
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label required">Email</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    placeholder="Enter email"
                                    name="email"
                                    value={userForm.email}
                                    onChange={handleUserFormChange}
                                    required
                                />
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label required">Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        placeholder="Enter password"
                                        name="password"
                                        value={userForm.password}
                                        onChange={handleUserFormChange}
                                        required
                                    />
                                </div>
                                
                                <div className="col-md-6 mb-3">
                                    <label className="form-label required">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        placeholder="Confirm password"
                                        name="confirm_password"
                                        value={userForm.confirm_password}
                                        onChange={handleUserFormChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label">Role Type</label>
                                <select
                                    className="form-control"
                                    name="role_type"
                                    value={userForm.role_type}
                                    onChange={handleUserFormChange}
                                >
                                    <option value="subscriber">Subscriber</option>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="employee">Employee</option>
                                </select>
                                <small className="text-muted">Default: Subscriber</small>
                            </div>
                            
                            <button 
                                type="submit" 
                                className="btn btn-primary w-100"
                                disabled={isAddingUser}
                            >
                                {isAddingUser ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Adding User...
                                    </>
                                ) : 'Add User'}
                            </button>
                        </form>
                    )}
                    
                    {/* Users Table */}
                    <div className="mt-4">
                        <h5 className="mb-3">Company Users ({companyUsers.length})</h5>
                        
                        {isLoadingUsers ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2 mb-0">Loading users...</p>
                            </div>
                        ) : companyUsers.length === 0 ? (
                            <div className="text-center p-4 border rounded">
                                <p className="text-muted mb-0">No users found. Click "Add User" to add new users.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Joined Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {companyUsers.map((user, index) => (
                                            <tr key={user.id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar avatar-sm me-2">
                                                            <div className="avatar-title bg-primary text-white rounded-circle">
                                                                <FiUser size={14} />
                                                            </div>
                                                        </div>
                                                        <span>{user.name}</span>
                                                    </div>
                                                </td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <span className={`badge ${user.role_type === 'admin' ? 'bg-danger' : 'bg-info'}`}>
                                                        {user.role_type}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${getStatusBadgeColor(user.status || 'active')}`}>
                                                        {user.status || 'active'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {new Date(user.created_at).toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button 
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => openUserDetailsModal(user)}
                                                            title="View Details"
                                                        >
                                                            <FiEye size={14} />
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-outline-warning"
                                                            onClick={() => openChangePasswordModal(user)}
                                                            title="Change Password"
                                                        >
                                                            <FiKey size={14} />
                                                        </button>
                                                        {user.status === 'active' || !user.status ? (
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleChangeStatus(user, 'inactive')}
                                                                title="Deactivate User"
                                                                disabled={isChangingStatus}
                                                            >
                                                                <FiUserX size={14} />
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                className="btn btn-sm btn-outline-success"
                                                                onClick={() => handleChangeStatus(user, 'active')}
                                                                title="Activate User"
                                                                disabled={isChangingStatus}
                                                            >
                                                                <FiUserCheck size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* User Details Modal */}
            {showUserDetailsModal && selectedUser && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">User Details</h5>
                                <button type="button" className="btn-close" onClick={closeAllModals}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-4 text-center mb-3">
                                        <div className="avatar avatar-xl mb-2">
                                            <div className="avatar-title bg-primary text-white rounded-circle">
                                                <FiUser size={24} />
                                            </div>
                                        </div>
                                        <h6>{selectedUser.name}</h6>
                                        <span className={`badge ${selectedUser.role_type === 'admin' ? 'bg-danger' : 'bg-info'}`}>
                                            {selectedUser.role_type}
                                        </span>
                                        <div className="mt-2">
                                            <span className={`badge ${getStatusBadgeColor(selectedUser.status || 'active')}`}>
                                                {selectedUser.status || 'active'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="mb-3">
                                            <label className="form-label text-muted">Email</label>
                                            <p className="mb-0">{selectedUser.email}</p>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-muted">Phone</label>
                                            <p className="mb-0">{selectedUser.phone || 'Not provided'}</p>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-muted">User ID</label>
                                            <p className="mb-0">{selectedUser.id}</p>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-muted">Company ID</label>
                                            <p className="mb-0">{selectedUser.company_id}</p>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-muted">Parent ID</label>
                                            <p className="mb-0">{selectedUser.parent_id || 'N/A'}</p>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-muted">Joined Date</label>
                                            <p className="mb-0">
                                                {new Date(selectedUser.created_at).toLocaleDateString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-muted">Last Updated</label>
                                            <p className="mb-0">
                                                {new Date(selectedUser.updated_at).toLocaleDateString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-warning"
                                    onClick={() => {
                                        setShowUserDetailsModal(false)
                                        openChangePasswordModal(selectedUser)
                                    }}
                                >
                                    <FiKey className="me-2" />
                                    Change Password
                                </button>
                                {selectedUser.status === 'active' || !selectedUser.status ? (
                                    <button 
                                        type="button" 
                                        className="btn btn-danger"
                                        onClick={() => {
                                            setShowUserDetailsModal(false)
                                            handleChangeStatus(selectedUser, 'inactive')
                                        }}
                                        disabled={isChangingStatus}
                                    >
                                        <FiUserX className="me-2" />
                                        Deactivate User
                                    </button>
                                ) : (
                                    <button 
                                        type="button" 
                                        className="btn btn-success"
                                        onClick={() => {
                                            setShowUserDetailsModal(false)
                                            handleChangeStatus(selectedUser, 'active')
                                        }}
                                        disabled={isChangingStatus}
                                    >
                                        <FiUserCheck className="me-2" />
                                        Activate User
                                    </button>
                                )}
                                <button type="button" className="btn btn-secondary" onClick={closeAllModals}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showChangePasswordModal && selectedUser && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Change Password for {selectedUser.name}</h5>
                                <button type="button" className="btn-close" onClick={closeAllModals}></button>
                            </div>
                            <form onSubmit={handleChangePassword}>
                                <div className="modal-body">
                                    {passwordSuccess && (
                                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                                            {passwordSuccess}
                                            <button type="button" className="btn-close" onClick={() => setPasswordSuccess('')}></button>
                                        </div>
                                    )}
                                    
                                    {passwordError && (
                                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                            {passwordError}
                                            <button type="button" className="btn-close" onClick={() => setPasswordError('')}></button>
                                        </div>
                                    )}
                                    
                                    <div className="mb-3">
                                        <label className="form-label required">New Password</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            placeholder="Enter new password"
                                            name="new_password"
                                            value={changePasswordForm.new_password}
                                            onChange={handlePasswordFormChange}
                                            required
                                        />
                                        <small className="text-muted">Password must be at least 6 characters long</small>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label className="form-label required">Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            placeholder="Confirm new password"
                                            name="confirm_new_password"
                                            value={changePasswordForm.confirm_new_password}
                                            onChange={handlePasswordFormChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="alert alert-info">
                                        <small>
                                            <FiKey className="me-1" />
                                            You are changing password for <strong>{selectedUser.name}</strong> ({selectedUser.email})
                                        </small>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={isChangingPassword}
                                    >
                                        {isChangingPassword ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Changing Password...
                                            </>
                                        ) : 'Change Password'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={closeAllModals}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileCreate
'use client'
import React, { useEffect, useState } from 'react'
import SelectDropdown from '@/components/shared/SelectDropdown'
import { FiAlertTriangle } from 'react-icons/fi';

const TabProjectDetails = ({ formData, onUpdate, errors, setError }) => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [clients, setClients] = useState([]);
    const [loadingClients, setLoadingClients] = useState(false);
    
    const clientType = formData?.projectType;
    
    // Initialize from formData if available
    useEffect(() => {
        if (formData.selectedMonth) {
            setSelectedMonth(formData.selectedMonth);
        }
        if (formData.selectedYear) {
            setSelectedYear(formData.selectedYear);
        }
    }, [formData.selectedMonth, formData.selectedYear]);

    const months = [
        { value: 'January', label: 'January' },
        { value: 'February', label: 'February' },
        { value: 'March', label: 'March' },
        { value: 'April', label: 'April' },
        { value: 'May', label: 'May' },
        { value: 'June', label: 'June' },
        { value: 'July', label: 'July' },
        { value: 'August', label: 'August' },
        { value: 'September', label: 'September' },
        { value: 'October', label: 'October' },
        { value: 'November', label: 'November' },
        { value: 'December', label: 'December' }
    ];

    // Function to get month name from month number
    const getMonthNameFromNumber = (monthNumber) => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[parseInt(monthNumber) - 1] || '';
    };

    // Function to get month number from name
    const getMonthNumberFromName = (monthName) => {
        const monthMap = {
            'January': '01', 'February': '02', 'March': '03', 'April': '04',
            'May': '05', 'June': '06', 'July': '07', 'August': '08',
            'September': '09', 'October': '10', 'November': '11', 'December': '12'
        };
        return monthMap[monthName] || '';
    };

    // Generate years (current year and next 10 years)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => ({
        value: String(currentYear + i),
        label: String(currentYear + i)
    }));

    // Fetch clients from API
    const fetchClients = async (type, companyId) => {
        try {
            setLoadingClients(true);
            const token = localStorage.getItem('token');

            const res = await fetch(
                `https://green-owl-255815.hostingersite.com/api/client/empl/view?client_type=${type}&company_id=${companyId}`,
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const result = await res.json();

            if (result?.status && Array.isArray(result.data)) {
                const options = result.data.map(c => ({
                    value: c.id,
                    label: c.contract_no || c.name || `Client ${c.id}`,
                    ...c // Include all client data if needed
                }));

                setClients(options);
                
                // If there's only one client, auto-select it
                if (options.length === 1) {
                    handleClientSelect(options[0]);
                }
            } else {
                // If API returns empty or error, use static clients as fallback
                console.warn('No clients from API, using static data');
                setClients(staticClients);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
            // Fallback to static clients on error
            setClients(staticClients);
        } finally {
            setLoadingClients(false);
        }
    };

    useEffect(() => {
        // Set default month and year if not already set
        const currentDate = new Date();
        
        if (!formData.selectedMonth) {
            // Get current month name (e.g., "January", "February", etc.)
            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            const defaultMonth = monthNames[currentDate.getMonth()]; // Get month name
            setSelectedMonth(defaultMonth);
            onUpdate('selectedMonth', defaultMonth); // Send month name
        }
        
        if (!formData.selectedYear) {
            const defaultYear = String(currentDate.getFullYear());
            setSelectedYear(defaultYear);
            onUpdate('selectedYear', defaultYear);
        }
        
        // Fetch clients when component mounts if clientType exists
        const companyId = sessionStorage.getItem('selected_company');
        
        if (clientType && companyId) {
            fetchClients(clientType, companyId);
        } else {
            // If no clientType or companyId, use static clients
            setClients(staticClients);
        }
    }, [clientType]); // Re-run when clientType changes

    // Also watch for selected_company changes
    useEffect(() => {
        const handleStorageChange = () => {
            const companyId = sessionStorage.getItem('selected_company');
            if (clientType && companyId) {
                fetchClients(clientType, companyId);
            }
        };

        // Listen for storage changes (in case selected_company changes elsewhere)
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [clientType]);

    const handleClientSelect = (opt) => {
        if (opt && opt.value) {
            if (onUpdate) {
                onUpdate('selectedClient', opt);
            }
            if (setError) {
                setError({ step1: null });
            }
        } else {
            if (onUpdate) {
                onUpdate('selectedClient', null);
            }
        }
    };

    const handleMonthChange = (e) => {
        const month = e.target.value;
        setSelectedMonth(month);
        
        if (onUpdate) {
            onUpdate('selectedMonth', month); // Send month name
        }
        
        if (setError) {
            setError({ step1Month: null });
        }
    };

    const handleYearChange = (e) => {
        const year = e.target.value;
        setSelectedYear(year);
        
        if (onUpdate) {
            onUpdate('selectedYear', year);
        }
        
        if (setError) {
            setError({ step1Year: null });
        }
    };

    // Helper function to show all errors for this step
    const getAllErrors = () => {
        const errorMessages = [];
        if (errors.step1) errorMessages.push(errors.step1);
        if (errors.step1Month) errorMessages.push(errors.step1Month);
        if (errors.step1Year) errorMessages.push(errors.step1Year);
        return errorMessages;
    };

    const errorMessages = getAllErrors();

    return (
        <section className="step-body mt-4 body current stepChange h-100">
            <form id="project-details">
                <fieldset>
                    <div className="mb-5">
                        <h2 className="fs-16 fw-bold">Select Client, Month & Year</h2>
                        <p className="text-muted">All fields are required to proceed.</p>
                        
                        {errorMessages.length > 0 && (
                            <div className="alert alert-danger mt-2 py-2 px-3">
                                <div className="d-flex align-items-center mb-1">
                                    <FiAlertTriangle className="me-2" />
                                    <span className="fw-semibold">Please fix the following errors:</span>
                                </div>
                                <ul className="mb-0 ps-3">
                                    {errorMessages.map((msg, index) => (
                                        msg && <li key={index}>{msg}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <fieldset>
                        <div className="row mb-5 pb-5">
                            {/* Select Client */}
                            <div className="col-lg-3 mb-4">
                                <label className="fw-semibold text-dark">
                                    Select Client <span className="text-danger">*</span>
                                </label>

                                <SelectDropdown
                                    options={clients}
                                    selectedOption={formData.selectedClient}
                                    defaultSelect="Select Client"
                                    onSelectOption={handleClientSelect}
                                    error={!!errors.step1}
                                    isLoading={loadingClients}
                                    loadingText="Loading clients..."
                                />
                                {loadingClients && (
                                    <small className="text-muted">Fetching clients from API...</small>
                                )}
                                {errors.step1 && (
                                    <small className="text-danger">{errors.step1}</small>
                                )}
                            </div>

                            {/* Month Selector */}
                            <div className="col-lg-2 mb-4">
                                <label className="fw-semibold text-dark">
                                    Select Month <span className="text-danger">*</span>
                                </label>
                                <select
                                    className={`form-select ${errors.step1Month ? 'is-invalid' : ''}`}
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                >
                                    <option value="">Select Month</option>
                                    {months.map(month => (
                                        <option key={month.value} value={month.value}>
                                            {month.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.step1Month && (
                                    <small className="text-danger">{errors.step1Month}</small>
                                )}
                            </div>

                            {/* Year Selector */}
                            <div className="col-lg-2 mb-4">
                                <label className="fw-semibold text-dark">
                                    Select Year <span className="text-danger">*</span>
                                </label>
                                <select
                                    className={`form-select ${errors.step1Year ? 'is-invalid' : ''}`}
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                >
                                    <option value="">Select Year</option>
                                    {years.map(year => (
                                        <option key={year.value} value={year.value}>
                                            {year.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.step1Year && (
                                    <small className="text-danger">{errors.step1Year}</small>
                                )}
                            </div>

                            {/* Display selected month-year */}
                            <div className="col-lg-3 mb-4 d-flex align-items-end">
                                <div className="p-2 bg-light rounded">
                                    <small className="text-muted">
                                        Selected: {selectedMonth && selectedYear 
                                            ? `${selectedMonth} ${selectedYear}`
                                            : 'Not selected'}
                                    </small>
                                </div>
                            </div>
                        </div>   
                    </fieldset>
                </fieldset>
            </form>
        </section>
    )
}

export default TabProjectDetails;
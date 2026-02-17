'use client';
import React, { useState, memo, useEffect, useCallback } from 'react'
import Table from '@/components/shared/table/Table';
import { FiEye } from 'react-icons/fi'
import { useSearchParams, useRouter } from 'next/navigation'; 

const BASE_URL = 'https://green-owl-255815.hostingersite.com/api';

const AttandanceEmployeeTable = ({ selectedMonth }) => {
    const [salaryData, setSalaryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clientInfo, setClientInfo] = useState(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const clientId = searchParams.get('client_id');
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const type = searchParams.get('type');
    const [token, setToken] = useState(null)
    const [compid, setCompid] = useState(null)

    // Get token & company id on component mount
    useEffect(() => {
        setToken(localStorage.getItem('token'));
        setCompid(localStorage.getItem('selected_company'));
    }, []);

    // 👉 fetchSalaryData ko useCallback se wrap karo
    const fetchSalaryData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Check if we have required data
            if (!token || !compid) {
                console.log('Waiting for token or company ID...');
                return;
            }

            console.log('Fetching salary data for:', { 
                clientId, 
                month, 
                year, 
                type,
                companyId: compid 
            });
            
            // 👉 Agar month aur year available nahi hai to selectedMonth use karo
            let apiMonth = month;
            let apiYear = year;
            
            if (!apiMonth || !apiYear) {
                if (selectedMonth) {
                    apiMonth = selectedMonth.toLocaleString('en-US', { month: 'long' });
                    apiYear = selectedMonth.getFullYear().toString();
                } else {
                    const now = new Date();
                    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    apiMonth = prevMonth.toLocaleString('en-US', { month: 'long' });
                    apiYear = prevMonth.getFullYear().toString();
                }
                console.log('Using month/year:', apiMonth, apiYear);
            }
            
            const params = new URLSearchParams({
                company_id: compid,
                client_type: type || '',
                client_id: clientId || '',
                month: apiMonth.toLowerCase(),
                year: apiYear
            });
            
            console.log('API URL:', `${BASE_URL}/employee/salaries?${params.toString()}`);
            
            const response = await fetch(
                `${BASE_URL}/employee/salaries?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
 
            const result = await response.json();
            console.log("API Response:", result);
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (result.status && result.data) {
                // Store client info
                if (result.data.client) {
                    setClientInfo(result.data.client);
                }
                
                // Format the API salary data to match your table structure
                const formattedData = result.data.salary.map((item, index) => {
                    // Extract employee details
                    const employee = item.employee || {};
                    const employeeName = employee.name || 'Unknown Employee';
                    const employeeId = employee.rand_id || `EMP${String(item.id || index + 1).padStart(4, '0')}`;
                    
                    // Parse bank details
                    let bankDetails = {};
                    try {
                        if (employee.bank_details) {
                            bankDetails = JSON.parse(employee.bank_details);
                        }
                    } catch (e) {
                        console.log('Error parsing bank details:', e);
                    }
                    
                    // Parse family details
                    let familyDetails = {};
                    try {
                        if (employee.family_details) {
                            familyDetails = JSON.parse(employee.family_details);
                        }
                    } catch (e) {
                        console.log('Error parsing family details:', e);
                    }
                    
                    // Calculate total salary based on your table columns
                    const totalBasic = parseFloat(item.basic_salary) || 0;
                    const annualBonus = parseFloat(item.bonus) || 0;
                    const pfEmployer12 = parseFloat(item.epf) || 0; // EPF from employer
                    const esicEmployer075 = parseFloat(item.esi) * 0.75 || 0; // Assuming ESI calculation
                    const pfEmployer13 = parseFloat(item.employee_epfo) || 0; // Employee EPFO contribution
                    const esicEmployer325 = parseFloat(item.esi) * 3.25 || 0; // ESI calculation
                    
                    // Calculate total salary (basic + bonus - deductions)
                    const totalSalary = totalBasic + annualBonus - (pfEmployer12 + esicEmployer075 + pfEmployer13 + esicEmployer325);
                    
                    return {
                        id: item.id || index + 1,
                        
                        // Employee ID field (as object for display)
                        'employee-id': {
                            name: employeeId,
                            email: employee.email || ''
                        },
                        
                        // Employee name field (as object for display)
                        'employee-name': {
                            title: employeeName,
                            img: employee.profile_image || '/images/brand/app-store.png'
                        },
                        
                        // Designation mapping (271 = STP Operator, 272 = Pump Operator, etc.)
                        designation: item.designation_id === 271 ? 'STP Operator' : 
                                     item.designation_id === 272 ? 'Pump Operator' : 
                                     `Designation ${item.designation_id}`,
                        
                        // Salary status mapping
                        salary_status: item.status === 'processing' ? 'Process' : 
                                       item.status === 'paid' ? 'Paid' : 
                                       item.status === 'hold' ? 'Hold' : 'Process',
                        
                        // ESI and EPF details
                        esi_no: employee.ipn_no || 'N/A',
                        epf_uan_no: employee.uan_no || 'N/A',
                        
                        // Attendance and days calculation
                        month_days: '30', // Default month days (you might need to calculate this)
                        days: item.present_days?.toString() || '0', // Present days
                        // Extra_hr: item.overtime?.toString() || '0', // Extra hours
                        
                        // Salary calculation fields
                        rate: item.min_daily_wages?.toString() || '0',
                        total_basic: totalBasic.toFixed(2),
                        annual_bonus: annualBonus.toFixed(2),
                        // pf_12: pfEmployer12.toFixed(2),
                        // esic_75: esicEmployer075.toFixed(2),
                        // pf_13: pfEmployer13.toFixed(2),
                        // esic_325: esicEmployer325.toFixed(2),
                        // total_salary: totalSalary.toFixed(2),
                        
                        // Additional fields for salary slip view
                        'employee-rand-id': employeeId,
                        'employee_name': employeeName,
                        'present_days': item.present_days || 0,
                        'extra_hours': item?.extra_hr || 0,
                        'month_year': `${item.month} ${item.year}`,
                        'gross_salary': item.gross_salary || '0',
                        'allowance': item.allowance || '0',
                        'overtime_amount': item.overtime_amount || '0',
                        'bank_account': bankDetails.account_no || 'N/A',
                        'bank_ifsc': bankDetails.ifsc || 'N/A',
                        'bank_name': bankDetails.bank_name || 'N/A',
                        'father_name': familyDetails.father_name || 'N/A',
                        'raw_data': item ,// Store raw data for debugging
                        'esic_75': item.employee_esi, // Store raw data for debugging
                        'esic_325': item.esi, // Store raw data for debugging
                        'pf_12': item.epf, // Store raw data for debugging
                        'pf_13': item.employee_epfo // Store raw data for debugging
                    };
                });
                
                console.log('Formatted Data for table:', formattedData);
                setSalaryData(formattedData);
            } else {
                console.log('No data found or API returned false status');
                setSalaryData([]);
                if (result.message) {
                    throw new Error(result.message);
                }
            }
        } catch (error) {
            console.error('Error fetching salary data:', error);
            setError(error.message || 'Failed to fetch salary data');
            setSalaryData([]);
        } finally {
            setLoading(false);
        }
    }, [clientId, month, year, type, token, compid, selectedMonth]);

    // 👉 useEffect ko update karo
    useEffect(() => {
        if (token && compid) {
            console.log('Calling fetchSalaryData...');
            fetchSalaryData();
        }
    }, [token, compid, fetchSalaryData]);

    const columns = [
        {
            accessorKey: 'id',
            header: ({ table }) => {
                const checkboxRef = React.useRef(null);

                useEffect(() => {
                    if (checkboxRef.current) {
                        checkboxRef.current.indeterminate = table.getIsSomeRowsSelected();
                    }
                }, [table.getIsSomeRowsSelected()]);

                return (
                    <input
                        type="checkbox"
                        className="custom-table-checkbox"
                        ref={checkboxRef}
                        checked={table.getIsAllRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                );
            },
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    className="custom-table-checkbox"
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            meta: {
                headerClassName: 'width-30',
            },
        },
        {
            accessorKey: 'employee-id',
            header: () => 'Employee ID',
            cell: (info) => {
                const employee = info.getValue();
                // Safely get the name
                let employeeName = '';
                let employeeEmail = '';
                
                if (typeof employee === 'object' && employee !== null) {
                    employeeName = employee.name || employee.title || employee.id || 'Unknown';
                    employeeEmail = employee.email || '';
                } else if (typeof employee === 'string') {
                    employeeName = employee;
                } else {
                    employeeName = 'Unknown';
                }
                
                const firstNameLetter = (employeeName || '').charAt(0)?.toUpperCase() || '?';
                
                return (
                    <div className="hstack gap-3">
                        <div className="text-white avatar-text user-avatar-text avatar-md">
                            {firstNameLetter}
                        </div>
                        <div>
                            <span className="text-truncate-1-line">{employeeName}</span>
                            {employeeEmail && (
                                <small className="fs-12 fw-normal text-muted d-block">{employeeEmail}</small>
                            )}
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: 'employee-name',
            header: () => 'Employee Name',
            cell: (info) => {
                const employee = info.getValue();
                let employeeName = '';
                let employeeImage = '/images/brand/app-store.png';
                
                if (typeof employee === 'object' && employee !== null) {
                    employeeName = employee.title || employee.name || 'N/A';
                    employeeImage = employee.img || '/images/brand/app-store.png';
                } else if (typeof employee === 'string') {
                    employeeName = employee;
                } else {
                    employeeName = 'N/A';
                }
                
                return (
                    <div className="hstack gap-4">
                        <div className="avatar-image border-0">
                            <img src={employeeImage} alt={employeeName} className="img-fluid" />
                        </div>
                        <div>
                            <span className="text-truncate-1-line">{employeeName}</span>
                        </div>
                    </div>
                )
            },
            meta: {
                className: 'project-name-td'
            }
        },
        {
            accessorKey: 'designation',
            header: () => 'DESIGNATION',
        }, 
        {
            accessorKey: 'salary_status',
            header: () => 'Salary Status',
            cell: info => {
                const status = info.getValue();
                let badgeClass = "badge mx-3 fs-16";

                if (typeof status === 'string') {
                    if (status.toLowerCase() === "hold") {
                        badgeClass += " bg-soft-danger text-danger";
                    } else if (status.toLowerCase() === "process") {
                        badgeClass += " bg-soft-primary text-primary";
                    } else if (status.toLowerCase() === "paid") {
                        badgeClass += " bg-soft-success text-success";
                    } else {
                        badgeClass += " bg-soft-warning text-warning";
                    }
                } else {
                    badgeClass += " bg-soft-warning text-warning";
                }

                return <span className={badgeClass}>{status || 'Process'}</span>;
            },
        },      
        {
            accessorKey: 'esi_no',
            header: () => 'ESI NO',
        }, 
        {
            accessorKey: 'epf_uan_no',
            header: () => 'EPF UAN NO',
        },
        {   
            accessorKey: 'month_days',
            header: () => 'MONTH DAYS',
        }, 
        {
            accessorKey: 'days',
            header: () => 'Days',
        },
        {
            accessorKey: 'rate',
            header: () => 'RATE',
        },
        {
            accessorKey: 'extra_hours',
            header: () => 'Extra Hr',
        },
        {
            accessorKey: 'overtime_amount',
            header: () => 'Extra Hr Amount',
        },
         {
            accessorKey: 'total_basic',
            header: () => 'TOTAL BASIC',
        },
         {
            accessorKey: 'annual_bonus',
            header: () => 'ANNUAL BONUS',
        },
         {
            accessorKey: 'pf_12',
            header: () => 'PF E\'R 12%',
        },
         {
            accessorKey: 'esic_75',
            header: () => 'ESIC E\'R 0.75%',
        },
         {
            accessorKey: 'pf_13',
            header: () => 'PF E\'R 13%',
        },
         {
            accessorKey: 'esic_325',
            header: () => 'ESIC E\'R 3.25%',
        },
         {
            accessorKey: 'gross_salary',
            header: () => 'TOTAL SALARY',
        },
        {
            accessorKey: 'actions',
            header: () => "Actions",
            cell: ({ row }) => {
                const employeeData = row.original;
                return (
                    <div className="hstack gap-2 justify-content-end">
                        <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleSalarySlip(employeeData)}
                            title="View Salary Slip"
                        >
                            <FiEye className="me-1" /> View Salary
                        </button>
                    </div>
                );
            },
            meta: {
                headerClassName: 'text-end'
            }
        },
    ];

    const handleSalarySlip = (employeeData) => {
        let slipMonth = month;
        let slipYear = year;

        // 👉 agar month / year missing ho to selectedMonth use karo
        if (!slipMonth || !slipYear) {
            if (selectedMonth) {
                slipMonth = selectedMonth.toLocaleString('en-US', { month: 'long' });
                slipYear = selectedMonth.getFullYear().toString();
            } else {
                const now = new Date();
                const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                slipMonth = prevMonth.toLocaleString('en-US', { month: 'long' });
                slipYear = prevMonth.getFullYear().toString();
            }
        }

        const queryParams = new URLSearchParams({
            client_id: clientId,
            employee_id: employeeData?.raw_data?.employee?.id,
            month: slipMonth,
            year: slipYear,
        }).toString();

        router.push(`/salary/salary-slip?${queryParams}`);
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading salary data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                <strong>Error loading salary data:</strong> {error}
                <button 
                    className="btn btn-sm btn-outline-danger ms-3"
                    onClick={fetchSalaryData}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!salaryData || salaryData.length === 0) {
        const displayMonth = month || (selectedMonth ? selectedMonth.toLocaleString('en-US', { month: 'long' }) : 'N/A');
        const displayYear = year || (selectedMonth ? selectedMonth.getFullYear().toString() : 'N/A');
        
        return (
            <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5>Salary Records</h5>
                    <div className="bg-light p-2 rounded">
                        <small className="text-muted">
                            Month: <strong>{displayMonth}</strong>, 
                            Year: <strong>{displayYear}</strong>
                        </small>
                    </div>
                </div>
                <div className="alert alert-info" role="alert">
                    No salary records found for this client for {displayMonth} {displayYear}.
                    <button 
                        className="btn btn-sm btn-outline-info ms-3"
                        onClick={fetchSalaryData}
                    >
                        Check Again
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            {clientInfo && (
                <div className="alert alert-light mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="mb-1">Contract: {clientInfo.contract_no}</h6>
                            <p className="mb-0 text-muted">{clientInfo.service_title}</p>
                        </div>
                        <div className="text-end">
                            <small className="text-muted">
                                Month: <strong>{month || (selectedMonth ? selectedMonth.toLocaleString('en-US', { month: 'long' }) : 'N/A')}</strong> | 
                                Year: <strong>{year || (selectedMonth ? selectedMonth.getFullYear().toString() : 'N/A')}</strong>
                            </small>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5>Salary Records ({salaryData.length} Employees)</h5>
                <div className="hstack gap-2">
                    <button 
                        className="btn btn-primary btn-sm"
                        onClick={fetchSalaryData}
                        disabled={loading}
                    >
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>
            </div>
            <Table 
                data={salaryData} 
                columns={columns} 
            />
        </>
    )
}

export default memo(AttandanceEmployeeTable);
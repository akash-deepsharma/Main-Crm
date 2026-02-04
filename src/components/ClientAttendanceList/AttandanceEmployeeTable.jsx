'use client';
import React, { useState, memo, useEffect } from 'react'
import Table from '@/components/shared/table/Table';
import { FiEye } from 'react-icons/fi'
import { useSearchParams, useRouter } from 'next/navigation'; 

const AttandanceEmployeeTable = ({ }) => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const clientId = searchParams.get('client_id');
    const month = searchParams.get('month');
    const year = searchParams.get('year');


    useEffect(() => {
        if (clientId) {
            fetchAttendanceData();
        }
    }, [clientId]);

    const fetchAttendanceData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            console.log("token is here", token);
            if (!token) {
                throw new Error('Authentication token not found');
            }

            console.log('Fetching attendance for client ID:', clientId);
            
            const response = await fetch(
                `https://green-owl-255815.hostingersite.com/api/client-wise-attendance?client_id=${clientId}&month=${month}&year=${year}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('API Response:', result);

            if (result.status && result.data) {
                // Format the API data to match your table structure
                const formattedData = result.data.map(item => ({
                    id: item.id,
                    employee: {
                        id: item.employee_rand_id,
                        name: item.employee_name,
                        email: item.employee?.email || `${item.employee_name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
                        img: item.employee?.img || null
                    },
                    'employee-id': item.employee_id,
                    'employee-rand-id': item.employee_rand_id, // New field for salary slip
                    'employee-name': {
                        title: item.employee_name,
                        img: item.employee?.img || null
                    },
                    // Designation data from API - check both post and employee.designation
                    designation: item.employee?.designation?.name || 
                                (item.post === "271" ? "STP Operator" : 
                                 item.post === "272" ? "Pump Operator" : 
                                 `Post ${item.post}`) || 'Not specified',
                    designation_details: item.employee?.designation || {
                        id: item.post,
                        name: item.employee?.designation?.name || 'Not specified'
                    },
                    present_days: item.total || 0,
                    extra_hours: item.extra_hr || 0,
                    month: item.month || 'N/A',
                    year: item.year || 'N/A',
                    // Monthly attendance summary - combining month and year
                    month_year: `${item.month || 'N/A'} ${item.year || ''}`.trim(),
                    // Daily attendance data for detailed view
                    daily_attendance: {
                        day_1: item.day_1 || '',
                        day_2: item.day_2 || '',
                        day_3: item.day_3 || '',
                        day_4: item.day_4 || '',
                        day_5: item.day_5 || '',
                        day_6: item.day_6 || '',
                        day_7: item.day_7 || '',
                        day_8: item.day_8 || '',
                        day_9: item.day_9 || '',
                        day_10: item.day_10 || '',
                        day_11: item.day_11 || '',
                        day_12: item.day_12 || '',
                        day_13: item.day_13 || '',
                        day_14: item.day_14 || '',
                        day_15: item.day_15 || '',
                        day_16: item.day_16 || '',
                        day_17: item.day_17 || '',
                        day_18: item.day_18 || '',
                        day_19: item.day_19 || '',
                        day_20: item.day_20 || '',
                        day_21: item.day_21 || '',
                        day_22: item.day_22 || '',
                        day_23: item.day_23 || '',
                        day_24: item.day_24 || '',
                        day_25: item.day_25 || '',
                        day_26: item.day_26 || '',
                        day_27: item.day_27 || '',
                        day_28: item.day_28 || '',
                        day_29: item.day_29 || '',
                        day_30: item.day_30 || '',
                        day_31: item.day_31 || '',
                    }
                }));
                
                console.log('Formatted Data:', formattedData);
                setAttendanceData(formattedData);
            } else {
                console.log('No data found or API returned false status');
                setAttendanceData([]);
                if (result.message) {
                    throw new Error(result.message);
                }
            }
        } catch (error) {
            console.error('Error fetching attendance data:', error);
            setError(error.message || 'Failed to fetch attendance data');
            setAttendanceData([]);
        } finally {
            setLoading(false);
        }
    };

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
            accessorKey: 'employee',
            header: () => 'Employee',
            cell: (info) => {
                const employee = info.getValue();
                const firstNameLetter = employee?.name?.charAt(0)?.toUpperCase() || '?';
                return (
                    <div className="hstack gap-3">
                        {employee?.img ? (
                            <div className="avatar-image avatar-md">
                                <img src={employee.img} alt={employee.name} className="img-fluid" />
                            </div>
                        ) : (
                            <div className="text-white avatar-text user-avatar-text avatar-md bg-primary">
                                {firstNameLetter}
                            </div>
                        )}
                        <div>
                            <span className="text-truncate-1-line d-block">{employee?.name || 'Unknown'}</span>
                            <small className="fs-12 fw-normal text-muted">{employee?.email || 'No email'}</small>
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: 'employee-id',
            header: () => 'Employee ID',
            cell: (info) => (
                <span className="text-muted">{info.getValue() || 'N/A'}</span>
            )
        },
        {
            accessorKey: 'designation',
            header: () => 'Designation',
            cell: (info) => (
                <span>{info.getValue() || 'Not specified'}</span>
            )
        },
        {
            accessorKey: 'present_days',
            header: () => 'Present Days',
            cell: (info) => (
                <span className="badge bg-success">{info.getValue()} Days</span>
            )
        },
        {
            accessorKey: 'extra_hours',
            header: () => 'Extra Hours',
            cell: (info) => (
                <span className="badge bg-warning">{info.getValue()} Hrs</span>
            )
        },
        {
            accessorKey: 'month_year',
            header: () => 'Month',
            cell: (info) => (
                <span>{info.getValue() || 'N/A'}</span>
            )
        },
        {
            accessorKey: 'actions',
            header: () => "Actions",
            cell: info => (
                <div className="hstack gap-2 justify-content-end">
                    {/* <button 
                        className="btn btn-info btn-sm"
                        onClick={() => handleViewDetails(info.row.original)}
                        title="View Attendance Details"
                    >
                        <FiEye className="me-1" /> View
                    </button> */}
                    <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSalarySlip(info.row.original)}
                        title="Generate Salary Slip"
                    >
                        Salary Slip
                    </button>
                </div>
            ),
            meta: {
                headerClassName: 'text-end'
            }
        },
    ];

    const handleViewDetails = (employeeData) => {
        // Get designation details
        const designationDetails = employeeData.designation_details;
        const designationInfo = designationDetails ? 
            `${designationDetails.name} (${designationDetails.skill || 'N/A'})` : 
            employeeData.designation;

        // Show daily attendance details
        const dailyAttendance = employeeData.daily_attendance;
        const daysWithData = Object.entries(dailyAttendance)
            .filter(([day, status]) => status === 'p' || status === 'a')
            .map(([day, status]) => {
                const dayNum = parseInt(day.replace('day_', ''));
                return `Day ${dayNum}: ${status === 'p' ? '✅ Present' : '❌ Absent'}`;
            })
            .join('\n');
        
        // Additional information from designation
        const additionalInfo = designationDetails ? 
            `\nDesignation Details:
            Skill: ${designationDetails.skill || 'N/A'}
            Qualification: ${designationDetails.qualification || 'N/A'}
            Experience: ${designationDetails.experience_in_years || '0'} years` : '';
        
        alert(
            `📊 Attendance Details for ${employeeData.employee.name}\n\n` +
            `👤 Employee ID: ${employeeData['employee-id']}\n` +
            `💼 Designation: ${designationInfo}\n` +
            `📅 Month: ${employeeData.month_year}\n` +
            `✅ Present Days: ${employeeData.present_days}\n` +
            `⏰ Extra Hours: ${employeeData.extra_hours} Hrs\n` +
            `${additionalInfo}\n\n` +
            `📋 Daily Attendance:\n${daysWithData || 'No attendance recorded for this month'}`
        );
    };
const handleSalarySlip = (employeeData) => {
    let month = searchParams.get('month')
    let year = searchParams.get('year')

    // 👉 agar month / year missing ho to current set karo
    if (!month || !year) {
        const now = new Date()
        month = now.toLocaleString('en-US', { month: 'long' }) // January
        year = now.getFullYear() // 2026
    }

    const queryParams = new URLSearchParams({
        client_id: clientId,
        employee_id:
            employeeData['employee-rand-id'] || employeeData['employee-id'],
        employee_name: employeeData.employee.name,
        month: month,
        year: year,
        present_days: employeeData.present_days,
        extra_hours: employeeData.extra_hours,
        designation: employeeData.designation
    }).toString()

    router.push(`/salary/salary-slip?${queryParams}`)
}


    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading attendance data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                <strong>Error loading attendance data:</strong> {error}
                <button 
                    className="btn btn-sm btn-outline-danger ms-3"
                    onClick={fetchAttendanceData}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!attendanceData || attendanceData.length === 0) {
        return (
            <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5>Attendance Records</h5>
                    <button 
                        className="btn btn-primary btn-sm"
                        onClick={fetchAttendanceData}
                        disabled={loading}
                    >
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>
                <div className="alert alert-info" role="alert">
                    No attendance records found for this client.
                    <button 
                        className="btn btn-sm btn-outline-info ms-3"
                        onClick={fetchAttendanceData}
                    >
                        Check Again
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5>Attendance Records ({attendanceData.length})</h5>
                <div className="hstack gap-2">
                    <div className="bg-light p-2 rounded">
                        <small className="text-muted">Client ID: <strong>{clientId}</strong></small>
                    </div>
                    <button 
                        className="btn btn-primary btn-sm"
                        onClick={fetchAttendanceData}
                        disabled={loading}
                    >
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>
            </div>
            <Table 
                data={attendanceData} 
                columns={columns} 
            />
        </>
    )
}

export default AttandanceEmployeeTable;
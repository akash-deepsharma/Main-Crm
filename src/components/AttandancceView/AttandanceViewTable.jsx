'use client';
import React, { useState, memo, useEffect, useCallback } from 'react'
import Table from '@/components/shared/table/Table';
import { FiEye, FiCheck, FiX, FiCalendar, FiRefreshCw } from 'react-icons/fi'
import { useSearchParams, useRouter } from 'next/navigation'; 

const AttandanceViewTable = ({ selectedMonth }) => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const clientId = searchParams.get('client_id');
    const employee_id = searchParams.get('employee_id');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    // Check if month/year parameters exist
    const hasDateParams = month && year;

    // 👉 fetchAttendanceData ko useCallback se wrap karo
    const fetchAttendanceData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            // Build API URL based on whether month/year are provided
            let apiUrl = `https://green-owl-255815.hostingersite.com/api/attendance-single-empployee?client_id=${clientId}&employee_id=${employee_id}`;
            
            // Only add month/year if they exist
            if (month && year) {
                apiUrl += `&month=${month}&year=${year}`;
                console.log(`Fetching attendance for ${month} ${year}`);
            } else {
                console.log('Fetching attendance without month/year filters');
            }
            
            console.log('API URL:', apiUrl);
            
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('API Response:', result);

            if (result.status && result.data) {
                // Format the API data to match your table structure
                const formattedData = result.data.map(item => {
                    // Determine month/year from data if not filtered
                    const dataMonth = month || item.month || 'N/A';
                    const dataYear = year || item.year || 'N/A';
                    
                    return {
                        id: item.id,
                        employee: {
                            id: item.employee_rand_id,
                            name: item.employee_name,
                            email: item.employee?.email || `${item.employee_name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
                            img: item.employee?.img || null
                        },
                        'employee-id': item.employee_id,
                        'employee-rand-id': item.employee_rand_id,
                        'employee-name': {
                            title: item.employee_name,
                            img: item.employee?.img || null
                        },
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
                        month: dataMonth,
                        year: dataYear,
                        month_year: `${dataMonth} ${dataYear}`.trim(),
                        // 👉 Daily attendance directly format karo
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
                    }
                });
                
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
    }, [clientId, month, year, employee_id]);

    // 👉 useEffect ko update karo
    useEffect(() => {
        if (clientId) {
            console.log('Calling fetchAttendanceData with:', { clientId, month, year });
            fetchAttendanceData();
        }
    }, [clientId, month, year, fetchAttendanceData]);

    // 👉 Helper function to render attendance status
    const renderAttendanceStatus = (status) => {
        if (status === 'p' || status === 'P') {
            return <span className="badge bg-success"><FiCheck /></span>;
        } else if (status === 'a' || status === 'A') {
            return <span className="badge bg-danger"><FiX /> Absent</span>;
        } else if (status === 'l' || status === 'L') {
            return <span className="badge bg-warning">L</span>;
        } else if (status === 'h' || status === 'H') {
            return <span className="badge bg-info">H</span>;
        } else {
            return <span className="badge bg-muted">-</span>;
        }
    };

    // 👉 Day-wise columns generate karo
    const generateDayColumns = () => {
        // If no month selected, show all 31 days
        let maxDays = 31;
        
        // If month is selected, calculate actual days
        if (month && year) {
            try {
                const monthIndex = new Date(Date.parse(month + " 1, 2000")).getMonth();
                const yearInt = parseInt(year);
                maxDays = new Date(yearInt, monthIndex + 1, 0).getDate();
            } catch (error) {
                console.error('Error calculating days in month:', error);
            }
        }
        
        const dayColumns = [];
        
        for (let day = 1; day <= maxDays; day++) {
            const dayKey = `day_${day}`;
            dayColumns.push({
                accessorKey: dayKey,
                header: () => (
                    <div className="text-center">
                        <div className="fw-bold">{day}</div>
                        {month && year && (
                            <small className="text-muted">{getDayName(day, month, year)}</small>
                        )}
                    </div>
                ),
                cell: (info) => {
                    const dailyData = info.row.original.daily_attendance;
                    const status = dailyData ? dailyData[dayKey] : '';
                    return (
                        <div className="text-center">
                            {renderAttendanceStatus(status)}
                        </div>
                    );
                },
                meta: {
                    headerClassName: 'text-center',
                    cellClassName: 'text-center'
                }
            });
        }
        
        return dayColumns;
    };

    // 👉 Helper function to get day name
    const getDayName = (day, monthStr, yearStr) => {
        try {
            const monthIndex = new Date(Date.parse(monthStr + " 1, 2000")).getMonth();
            const year = parseInt(yearStr) || new Date().getFullYear();
            const date = new Date(year, monthIndex, day);
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } catch {
            return '';
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
        // 👉 Day-wise attendance columns add karo
        ...generateDayColumns(),
        {
            accessorKey: 'present_days',
            header: () => 'Total Present',
            cell: (info) => (
                <span className="badge bg-success fw-bold">{info.getValue()} Days</span>
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
            header: () => 'Month/Year',
            cell: (info) => (
                <span className="badge bg-info">{info.getValue()}</span>
            )
        },
    ];

    const handleClearFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('month');
        params.delete('year');
        router.push(`?${params.toString()}`);
    };

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
                    <div className="hstack gap-2">
                        <div className="bg-light p-2 rounded">
                            <small className="text-muted">
                                {hasDateParams ? (
                                    <>Month: <strong>{month}</strong>, Year: <strong>{year}</strong></>
                                ) : (
                                    <>Showing all records (no date filter)</>
                                )}
                            </small>
                        </div>
                        {hasDateParams && (
                            <button
                                onClick={handleClearFilters}
                                className="btn btn-outline-secondary btn-sm"
                            >
                                <FiRefreshCw /> Clear Date Filter
                            </button>
                        )}
                    </div>
                </div>
                <div className="alert alert-info" role="alert">
                    {hasDateParams ? (
                        <>No attendance records found for {month} {year}.</>
                    ) : (
                        <>No attendance records found.</>
                    )}
                    <button 
                        className="btn btn-sm btn-outline-info ms-3"
                        onClick={fetchAttendanceData}
                    >
                        Refresh
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
                        <small className="text-muted">
                            Client ID: <strong>{clientId}</strong>
                            {hasDateParams && (
                                <> | Month: <strong>{month}</strong> | Year: <strong>{year}</strong></>
                            )}
                        </small>
                    </div>
                    
                    {hasDateParams && (
                        <button
                            onClick={handleClearFilters}
                            className="btn btn-outline-secondary btn-sm"
                        >
                            <FiRefreshCw /> Clear Date
                        </button>
                    )}
                    
                    <button 
                        className="btn btn-primary btn-sm"
                        onClick={fetchAttendanceData}
                        disabled={loading}
                    >
                        <FiRefreshCw /> {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
            </div>
            
            <div className="table-responsive">
                <Table 
                    data={attendanceData} 
                    columns={columns} 
                />
            </div>
            
            {/* 👉 Legend for attendance status */}
            <div className="mt-3 d-flex gap-3">
                <small className="text-muted">
                    <span className="badge bg-success me-1"><FiCheck /> Present</span> | 
                    <span className="badge bg-danger mx-1"><FiX /> Absent</span> | 
                    <span className="badge bg-warning mx-1">L = Leave</span> | 
                    <span className="badge bg-info mx-1">H = Holiday</span> | 
                    <span className="badge bg-muted mx-1"> - = No Data</span>
                </small>
            </div>
            
            {/* 👉 Info about current view */}
            <div className="mt-2">
                <small className="text-muted">
                    <FiCalendar className="me-1" />
                    {hasDateParams ? (
                        <>Showing data for <strong>{month} {year}</strong></>
                    ) : (
                        <>Showing all available attendance records</>
                    )}
                </small>
            </div>
        </>
    )
}

export default AttandanceViewTable;
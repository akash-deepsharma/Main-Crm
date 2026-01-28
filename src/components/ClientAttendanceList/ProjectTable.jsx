'use client'
import React, { useState, memo, useEffect } from 'react'
import Table from '@/components/shared/table/Table';
import { FiEdit3, FiEye, FiMoreHorizontal, FiTrash2, FiClock } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown';
import { useSearchParams, useRouter } from "next/navigation";

const TableCell = memo(({ options }) => {
    const { text, color } = options;
    return (
        <span className={`badge bg-soft-${color} text-${color} mx-3`}>
            {text}
        </span>
    );
});

const ProjectTable = () => {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  const searchParams = useSearchParams();

      const inputType = searchParams.get("type");
console.log('this is my type',inputType);
    useEffect(() => {
        fetchClientData();
    }, []);

    const fetchClientData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Get company_id and token from localStorage
            const company_id = localStorage.getItem('selected_company');
            const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
            
            if (!company_id) {
                throw new Error('Company ID not found in localStorage');
            }
            
            if (!token) {
                throw new Error('Authentication token not found');
            }
            
            // API URL with default client_type
            const apiUrl = `https://green-owl-255815.hostingersite.com/api/client-with-attendance?company_id=${company_id}&client_type=${inputType}`;
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.status && result.data) {
                // Transform API data to match table structure
                const transformedData = result.data.map((client) => {
                    // Determine status color based on your business logic
                    // This is an example - adjust based on your requirements
                    let statusColor = 'success';
                    let statusText = 'Updated';
                    
                    // Example logic: Check if contract dates are valid
                    const currentDate = new Date();
                    const endDate = new Date(client.service_end_date);
                    
                    // if (endDate < currentDate) {
                    //     statusColor = 'danger';
                    //     statusText = 'Expired';
                    // } else if (!client.contract_generated_date) {
                    //     statusColor = 'warning';
                    //     statusText = 'Pending';
                    // }
                    
                    return {
                        id: client.id,
                        "project-name": {
                            title: client.service_title || "Service Contract",
                            img: "/images/brand/app-store.png", // Default image
                            description: client.organisation_name || client.service_title
                        },
                        "customer": {
                            name: client.customer_name || client.buyer_name || "N/A",
                            img: "/images/avatar/1.png", // Default avatar
                            email: client.email
                        },
                        "phone": client.contact_no || "N/A",
                        "email": client.email || "N/A",
                        "organisation": client.organisation_name || "N/A",
                        "ministry": client.ministry || "N/A",
                        "onboard-date": formatMonth(client.onboard_date),
                        "assigned": { 
                            // You can add assignment logic here if needed
                            defaultSelect: 'Not Assigned'
                        },
                        "status": { 
                            defaultSelect: statusText, 
                            color: statusColor
                        }
                    };
                });
                
                setTableData(transformedData);
            } else {
                throw new Error('Invalid API response format');
            }
        } catch (err) {
            console.error('Error fetching client data:', err);
            setError(err.message);
            // You might want to show an error state or empty table
            setTableData([]);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to format date to month name
    const formatMonth = (dateString) => {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } catch (error) {
            return 'N/A';
        }
    };

    const actions = [
        { label: "Edit", icon: <FiEdit3 /> },
        { label: "Remind", icon: <FiClock /> },
        { type: "divider" },
        { label: "Delete", icon: <FiTrash2 />, },
    ];

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
            accessorKey: 'project-name',
            header: () => 'Client-name',
            cell: (info) => {
                const roles = info.getValue();
                return (
                    <div className="hstack gap-4">
                        <div className="avatar-image border-0">
                            <img src={roles?.img} alt="" className="img-fluid" />
                        </div>
                        <div>
                            <a href="projects-view.html" className="text-truncate-1-line">{roles?.title}</a>
                            <small className="fs-12 fw-normal text-muted text-truncate-1-line">{roles?.description}</small>
                        </div>
                    </div>
                )
            },
            meta: {
                className: 'project-name-td'
            }
        },
        {
            accessorKey: 'customer',
            header: () => 'Customer',
            cell: (info) => {
                const roles = info.getValue();
                return (
                    <a href="#" className="hstack gap-3">
                        {
                            roles?.img ?
                                <div className="avatar-image avatar-md">
                                    <img src={roles?.img} alt="" className="img-fluid" />
                                </div>
                                :
                                <div className="text-white avatar-text user-avatar-text avatar-md">
                                    {roles?.name ? roles.name.substring(0, 1) : 'N'}
                                </div>
                        }
                        <div>
                            <span className="text-truncate-1-line">{roles?.name || 'N/A'}</span>
                            <small className="fs-12 fw-normal text-muted">{roles?.email || ''}</small>
                        </div>
                    </a>
                )
            }
        },
        {
            accessorKey: 'phone',
            header: () => 'Phone',
        }, 
        {
            accessorKey: 'email',
            header: () => 'E-mail',
        },
        {
            accessorKey: 'organisation',
            header: () => 'Organisation Name',
        },
        {
            accessorKey: 'ministry',
            header: () => 'Ministry',
        }, 
        {
            accessorKey: 'onboard-date',
            header: () => 'Month',
        },
        {
            accessorKey: 'status',
            header: () => 'Status',
            cell: (info) => {
                const value = info.getValue();
                return <TableCell options={{ text: value.defaultSelect, color: value.color }} />;
            }
        },
        {
            accessorKey: 'actions',
            header: () => "Actions",
            cell: info => (
                <div className="hstack gap-2 justify-content-end">
                                    <a
                    href={`/attendance/view?client_id=${info.row.original.id}`}
                    className="avatar-text avatar-md"
                    >
                    <FiEye />
                    </a>
                    <Dropdown 
                        dropdownItems={actions} 
                        triggerClassName='avatar-md' 
                        triggerPosition={"0,21"} 
                        triggerIcon={<FiMoreHorizontal />} 
                    />
                </div>
            ),
            meta: {
                headerClassName: 'text-end'
            }
        },
    ];

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading client data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger">
                <h5>Error Loading Data</h5>
                <p>{error}</p>
                <button className="btn btn-sm btn-primary" onClick={fetchClientData}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <>
            <Table data={tableData} columns={columns} />
        </>
    )
}

export default ProjectTable;
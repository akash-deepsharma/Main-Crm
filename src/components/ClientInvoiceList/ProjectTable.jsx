'use client'
import React, { useState, memo, useEffect } from 'react'
import Table from '@/components/shared/table/Table';
import { FiAlertOctagon, FiArchive, FiClock, FiEdit3, FiEye, FiMoreHorizontal, FiPrinter, FiTrash2, FiRefreshCw } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown';
import SelectDropdown from '@/components/shared/SelectDropdown';
import Input from '../shared/Input';
import { taskAssigneeOptions } from '@/utils/options';
import { useParams, useSearchParams } from 'next/navigation';

const actions = [
    { label: "Edit", icon: <FiEdit3 /> },
    { label: "Remind", icon: <FiClock /> },
    { type: "divider" },    
    { label: "Delete", icon: <FiTrash2 /> },
];

const statusOptions = [
    { value: "bonus", label: "Bonus", color: "#3454d1", slug: "bonus" },
    { value: "arrer", label: "Arrer", color: "#ffa21d", slug: "arrer" },
    { value: "epfo", label: "EPFO", color: "#17c666", slug: "epfo" },
    { value: "esic", label: "ESIC", color: "#ea4d4d", slug: "esic" },
];

const assigned = taskAssigneeOptions;

const ProjectTable = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clientData, setClientData] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0); // For forcing refresh
    const searchParams = useSearchParams();
    
    // 从URL参数获取type
    const clientType = searchParams.get('type');

    // 从localStorage获取token和company_id
    const getAuthData = () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const company_id = localStorage.getItem('selected_company');
            return { token, company_id };
        }
        return { token: null, company_id: null };
    };

    // 获取客户端数据
    const fetchClientData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const { token, company_id } = getAuthData();
            
            if (!token || !company_id) {
                throw new Error('Authentication data not found in localStorage');
            }

            const API_URL = 'https://green-owl-255815.hostingersite.com/api/client-with-attendance';
            
            // 构建查询参数
            let queryParams = `company_id=${company_id}`;
            
            // 如果有clientType参数，则使用它，否则默认使用GeM
            if (clientType) {
                queryParams += `&client_type=${clientType}`;
            } else {
                queryParams += '&client_type=GeM';
            }
            
            const response = await fetch(
                `${API_URL}?${queryParams}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.status && result.data) {
                setClientData(result.data);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching client data:', err);
            setError(err.message || 'Failed to fetch data');
            setClientData([]);
        } finally {
            setLoading(false);
        }
    };

    // 初始加载数据 - 当clientType或refreshKey变化时重新获取
    useEffect(() => {
        fetchClientData();
    }, [refreshKey, clientType]);

    // 刷新数据函数
    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    // 根据clientType显示不同的标题
    const getTableTitle = () => {
        switch(clientType) {
            case 'corporate':
                return 'Corporate Clients';
            case 'GeM':
                return 'GeM Clients';
            case 'individual':
                return 'Individual Clients';
            default:
                return 'Clients';
        }
    };

   
    const formatTableData = (data) => {
        return data.map(item => ({
            id: item.id,
            "project-name": {
                title: item?.service_title ,
                img: "/images/brand/app-store.png", 
                description: item.contract_no || 'Contract',
            },
            customer: { 
                name: item.customer_name || 'N/A',
                img: "/images/avatar/1.png", 
                email: item.email || 'N/A'
            },
            phone: item.contact_no || 'N/A',
            email: item.email || 'N/A',
            organisation: item.organisation_name || 'N/A',
            ministry: item.ministry || 'N/A',
            department: item.department || 'N/A',
            contractNo: item.contract_no || 'N/A',
            serviceStartDate: item.service_start_date || 'N/A',
            serviceEndDate: item.service_end_date || 'N/A',
            onboardDate: item.onboard_date || 'N/A',
            clientType: item.client_type || clientType || 'N/A',
            rawData: item // 保留原始数据以备后用
        }));
    };

    const columns = [
        // CHECKBOX
        {
            accessorKey: 'id',
            header: ({ table }) => {
                const checkboxRef = React.useRef(null);
                useEffect(() => {
                    if (checkboxRef.current) {
                        checkboxRef.current.indeterminate =
                            table.getIsSomeRowsSelected();
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
            meta: { headerClassName: 'width-30' },
        },

        // CLIENT NAME / SERVICE TITLE
        {
            accessorKey: 'project-name',
            header: () => 'Service Title',
            cell: (info) => {
                const item = info.getValue();
                return (
                    <div className="hstack gap-4">
                        <div className="avatar-image border-0">
                            <img src={item?.img} alt="" className="img-fluid" />
                        </div>
                        <div>
                            <div className="text-truncate-1-line">{item?.title}</div>
                            <small className="text-muted">Contract: {item?.description}</small>
                        </div>
                    </div>
                );
            },
        },

        // CUSTOMER
        {
            accessorKey: 'customer',
            header: () => 'Customer',
            cell: (info) => {
                const customer = info.getValue();
                return (
                    <a href="#" className="hstack gap-3">
                        <div className="avatar-image avatar-md">
                            <img src={customer?.img} alt="" className="img-fluid" />
                        </div>
                        <div>
                            <span>{customer?.name}</span>
                            <small className="text-muted d-block">{customer?.email}</small>
                        </div>
                    </a>
                );
            }
        },

        { 
            accessorKey: 'organisation', 
            header: () => 'Organisation Name',
            cell: (info) => (
                <div className="text-truncate" style={{ maxWidth: '150px' }}>
                    {info.getValue()}
                </div>
            )
        },
        
        { 
            accessorKey: 'ministry', 
            header: () => 'Ministry',
            cell: (info) => (
                <div className="text-truncate" style={{ maxWidth: '150px' }}>
                    {info.getValue()}
                </div>
            )
        },
        
        { 
            accessorKey: 'department', 
            header: () => 'Department',
            cell: (info) => (
                <div className="text-truncate" style={{ maxWidth: '150px' }}>
                    {info.getValue()}
                </div>
            )
        },
        
        // CLIENT TYPE
        {
            accessorKey: 'clientType',
            header: () => 'Client Type',
            cell: (info) => {
                const type = info.getValue();
                let badgeClass = 'badge bg-secondary';
                
                switch(type?.toLowerCase()) {
                    case 'gem':
                        badgeClass = 'badge bg-primary';
                        break;
                    case 'corporate':
                        badgeClass = 'badge bg-success';
                        break;
                    case 'individual':
                        badgeClass = 'badge bg-warning';
                        break;
                }
                
                return <span className={badgeClass}>{type}</span>;
            }
        },
        
        { accessorKey: 'phone', header: () => 'Phone' },
        { 
            accessorKey: 'email', 
            header: () => 'E-mail',
            cell: (info) => (
                <div className="text-truncate" style={{ maxWidth: '200px' }}>
                    {info.getValue()}
                </div>
            )
        },

        // ONBOARD DATE
        {
            accessorKey: 'onboardDate',
            header: () => 'Onboard Date',
            cell: (info) => {
                const date = info.getValue();
                return date !== 'N/A' ? new Date(date).toLocaleDateString('en-IN') : 'N/A';
            }
        },

        // ACTIONS
        {
            accessorKey: 'actions',
            header: () => (
                <div className="d-flex align-items-center justify-content-end gap-2">
                    <button 
                        onClick={handleRefresh}
                        className="btn btn-link btn-sm p-0"
                        title="Refresh"
                        disabled={loading}
                    >
                        <FiRefreshCw className={loading ? 'spinning' : ''} />
                    </button>
                    <span>Actions</span>
                </div>
            ),
            cell: ({ row }) => {
                const client = row.original;

                return (
                    <div className="hstack gap-2 justify-content-end">
                     <a
  href={`/invoice/view?client_id=${client.id}`}
  className="avatar-text avatar-md"
>
  <FiEye />
</a>

                        {/* <a href={`/invoice/edit/${client.id}`} className="avatar-text avatar-md">
                            <FiEdit3 />
                        </a> */}
                        <Dropdown
                            dropdownItems={[
                                ...actions,
                                { 
                                    label: "View Details", 
                                    icon: <FiEye />,
                                    onClick: () => console.log('View details:', client.id)
                                }
                            ]}
                            triggerClassName="avatar-md"
                            triggerPosition={"0,21"}
                            triggerIcon={<FiMoreHorizontal />}
                        />
                    </div>
                );
            },
            meta: { headerClassName: 'text-end' },
        },
    ];

    // Loading state
    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading {getTableTitle()}...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="alert alert-danger">
                <div className="d-flex align-items-center">
                    <FiAlertOctagon className="me-2" />
                    <div>
                        <strong>Error loading data:</strong> {error}
                        <button 
                            onClick={handleRefresh}
                            className="btn btn-sm btn-outline-danger ms-3"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Empty state
    if (!clientData || clientData.length === 0) {
        return (
            <div className="text-center py-5">
                <FiArchive className="display-4 text-muted mb-3" />
                <h4>No {getTableTitle()} Found</h4>
                <p className="text-muted">There are no {getTableTitle()} in your company yet.</p>
                <button 
                    onClick={handleRefresh}
                    className="btn btn-primary"
                >
                    <FiRefreshCw className="me-1" /> Refresh
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>{getTableTitle()} ({clientData.length})</h4>
                <div>
                    <button 
                        onClick={handleRefresh}
                        className="btn btn-outline-primary btn-sm"
                        disabled={loading}
                    >
                        <FiRefreshCw className={loading ? 'spinning me-1' : 'me-1'} />
                        Refresh
                    </button>
                </div>
            </div>
            <Table data={formatTableData(clientData)} columns={columns} />
        </div>
    );
};

export default ProjectTable;
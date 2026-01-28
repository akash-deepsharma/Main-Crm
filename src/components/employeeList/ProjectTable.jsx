'use client'
import React, { useState, memo, useEffect } from 'react'
import Table from '@/components/shared/table/Table';
import { FiAlertOctagon, FiArchive, FiClock, FiEdit3, FiEye, FiMoreHorizontal, FiPrinter, FiTrash2 } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown';
import SelectDropdown from '@/components/shared/SelectDropdown';
import { useSearchParams } from 'next/navigation';

const BASE_URL = 'https://green-owl-255815.hostingersite.com/api';

const getActions = (employeeId, type, compid, deleteEmployee) => [
  {
    label: 'Edit',
    icon: <FiEdit3 />,
    onClick: () => {
      window.location.href = `/employees/create?type=${type}&employee_id=${employeeId}&company_id=${compid}`;
    },
  },
  {
    label: 'Print',
    icon: <FiPrinter />,
    onClick: () => window.print(),
  },
  {
    label: 'Remind',
    icon: <FiClock />,
  },
  { type: 'divider' },
  {
    label: 'Archive',
    icon: <FiArchive />,
  },
  {
    label: 'Report Spam',
    icon: <FiAlertOctagon />,
  },
  { type: 'divider' },
  {
    label: 'Delete',
    icon: <FiTrash2 />,
   onClick: () => deleteEmployee(employeeId),
  },
]; 

const StatusCell = memo(({ statusValue }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    
    const statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
    ];
    
    const defaultStatus = statusValue === "1" || statusValue === 1 
        ? { label: 'Active', value: 'active' }
        : { label: 'Inactive', value: 'inactive' };

    return (
        <SelectDropdown
            options={statusOptions}
            defaultSelect={defaultStatus}
            selectedOption={selectedOption}
            onSelectOption={(option) => setSelectedOption(option)}
        />
    );
});

const ProjectTable = () => {
    const [token, setToken] = useState(null);
    const [compid, setCompid] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setToken(localStorage.getItem('token'));
        setCompid(localStorage.getItem('selected_company'));
    }, []);

    const searchParams = useSearchParams();
    const type = searchParams.get('type');

    useEffect(() => {
        if (!token || !compid) return;

        const fetchEmployees = async () => {
            try {
                setLoading(true);

                const params = new URLSearchParams({
                    company_id: compid,
                    employee_type: type,
                });

                const response = await fetch(
                    `${BASE_URL}/employee/list?${params.toString()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const result = await response.json();
console.log( "empleoyee data view", result)
                if (!result?.status) {
                    console.error(result?.message || 'API Error');
                    return;
                }

                // ✅ Map API data to match table structure
                const mappedData = result.data.map((item) => ({
                    id: item.id,
                    rand_id: item.rand_id,
                    name: item.name,
                    mobile_no: item.mobile_no,
                    email: item.email,
                    designation: getDesignationLabel(item.designation),
                    organisation_name: item.client?.organisation_name || 'N/A',
                    contract_no: item.client?.contract_no || 'N/A',
                    consignee_name: item.consignee?.consignee_name || 'N/A',
                    created_at: formatDate(item.created_at),
                    status: item.status, // Store raw status for StatusCell component
                    profile_image: item.profile_image 
                        ? `${BASE_URL.replace('/api', '')}/${item.profile_image}`
                        : null,
                }));

                setTableData(mappedData);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [token, compid]);

    const deleteEmployee = async (employeeId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Authentication error");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this employee?")) {
            return;
        }
            console.log( "delete employeeId", employeeId)
        try {
            const response = await fetch(
                "https://green-owl-255815.hostingersite.com/api/employee/delete",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        employee_id: employeeId,
                    }),
                }
            );

            const result = await response.json();
                console.log("employee delete response", result)
            if (!result?.status) {
                throw new Error(result?.message || "Failed to delete employee");
            }

            alert("Employee deleted successfully");
            window.location.reload();
        } catch (err) {
            alert(err.message);
        }
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
    };

    // Helper function to get designation label (you might want to fetch this from another endpoint)
    const getDesignationLabel = (designationId) => {
        // This should map designation IDs to their labels
        // For now, return the ID as string or fetch from designation API
        return designationId?.toString() || 'N/A';
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
            id: 'employee_info',
            accessorKey: 'name',
            header: () => 'Employee',
            cell: (info) => {
                const employee = info.row.original;
                return (
                    <a href="#" className="hstack gap-3">
                        {employee.profile_image ? (
                            <div className="avatar-image avatar-md">
                                <img 
                                    src={employee.profile_image} 
                                    alt={employee.name} 
                                    className="img-fluid" 
                                />
                            </div>
                        ) : (
                            <div className="text-white avatar-text user-avatar-text avatar-md">
                                {employee.name?.substring(0, 1) || 'E'}
                            </div>
                        )}
                        <div>
                            <span className="text-truncate-1-line">{employee.name || 'N/A'}</span>
                            <small className="fs-12 fw-normal text-muted">{employee.rand_id || 'N/A'}</small>
                        </div>
                    </a>
                );
            }
        },
        {
            accessorKey: 'mobile_no',
            header: () => 'Phone',
            cell: (info) => info.getValue() || 'N/A',
        },
        {
            accessorKey: 'email',
            header: () => 'E-mail',
            cell: (info) => info.getValue() || 'N/A',
        },
        {
            accessorKey: 'designation',
            header: () => 'Designation',
            cell: (info) => info.getValue() || 'N/A',
        },
        {
            accessorKey: 'organisation_name',
            header: () => 'Client Name',
            cell: (info) => info.getValue() || 'N/A',
        },
        {
            accessorKey: 'contract_no',
            header: () => 'Client Contract',
            cell: (info) => info.getValue() || 'N/A',
        },
        {
            accessorKey: 'consignee_name',  
            header: () => 'Consignee Name',
            cell: (info) => info.getValue() || 'N/A',
        },
        {
            accessorKey: 'created_at',
            header: () => 'Onboard Date',
            cell: (info) => info.getValue() || 'N/A',
        },
        {
            id: 'status',
            accessorKey: 'status',
            header: () => 'Status',
            cell: (info) => <StatusCell statusValue={info.getValue()} />,
        },
        {
            id: 'actions',
            header: () => 'Actions',
            cell: (info) => {
                const employeeId = info.row.original.id;
                return (
                    <div className="hstack gap-2 justify-content-end">
                        <a 
                            href={`/employees/view?type=${type}&employee_id=${employeeId}`} 
                            className="avatar-text avatar-md"
                        >
                            <FiEye />
                        </a>
                        <Dropdown
                            dropdownItems={getActions(employeeId, type, compid, deleteEmployee)}
                            triggerClassNaclassName="avatar-md"
                            triggerPosition="0,21"
                            triggerIcon={<FiMoreHorizontal />}
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <>
            {loading ? (
                <div className="text-center p-4">Loading employees...</div>
            ) : (
                <Table 
                    data={tableData} 
                    columns={columns} 
                />
            )}
        </>
    );
};

export default ProjectTable;
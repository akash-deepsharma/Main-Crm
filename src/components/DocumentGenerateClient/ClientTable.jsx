'use client';

import React, { useState, memo, useEffect } from 'react';
import Table from '@/components/shared/table/Table';
import {
  FiAlertOctagon,
  FiArchive,
  FiClock,
  FiEdit,
  FiEye,
  FiMoreHorizontal,
  FiPrinter,
  FiTrash2,
} from 'react-icons/fi';
import Dropdown from '@/components/shared/Dropdown';
import SelectDropdown from '@/components/shared/SelectDropdown';
import { useSearchParams } from 'next/navigation';

const BASE_URL = 'https://green-owl-255815.hostingersite.com/api';

const getActions = (clientId, type, compid, deleteClient) => [
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
    onClick: () => deleteClient(clientId),
  },
]; 

const TableCell = memo(({ options, defaultSelect }) => {
  const [selectedOption, setSelectedOption] = useState(defaultSelect || null);

  return (
    <SelectDropdown
      options={options}
      selectedOption={selectedOption}
      defaultSelect={defaultSelect}
      onSelectOption={setSelectedOption}
    />
  );
});

const ProjectTable = ({ filters: externalFilters }) => { // Accept filters from parent
  const [token, setToken] = useState(null);
  const [compid, setCompid] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const Status = searchParams.get('Status');

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setCompid(localStorage.getItem('selected_company'));
  }, []);

  // Update filters when external filters change
  useEffect(() => {
    if (externalFilters) {
      setFilters(externalFilters);
      setCurrentPage(1);
    }
  }, [externalFilters]);

  // Search handler
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Sort handler
  const handleSort = (sortInfo) => {
    if (sortInfo) {
      setSortField(sortInfo.field);
      setSortOrder(sortInfo.order);
    } else {
      setSortField(null);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Fetch data when dependencies change
  useEffect(() => {
    if (!token || !compid) return;

    const fetchClients = async () => {
      try {
        setLoading(true);
        // console.log("Fetching clients with params:", { 
        //   type, 
        //   Status, 
        //   page: currentPage, 
        //   per_page: pageSize,
        //   filters,
        //   searchTerm,
        //   sortField,
        //   sortOrder
        // });

        const params = new URLSearchParams({
          company_id: compid,
          client_type: type || '',
          status: Status || '',
          page: currentPage,
          per_page: pageSize,
          filter: true
        });

        // Add search term if exists
        if (searchTerm) {
          params.append('search', searchTerm);
        }

        // Add sorting if exists
        if (sortField) {
          params.append('sort_by', sortField);
          params.append('sort_order', sortOrder);
        }

        // Add filters to params if they exist
        if (filters.clientName) params.append('client_name', filters.clientName);
        if (filters.ministry) params.append('ministry', filters.ministry);
        if (filters.organizationName) params.append('organization', filters.organizationName);
        if (filters.email) params.append('email', filters.email);
        if (filters.department) params.append('department', filters.department);
        if (filters.officeZone) params.append('office_zone', filters.officeZone);
        if (filters.status) params.append('client_status', filters.status);
        if (filters.contractType) params.append('contract_type', filters.contractType);
        
        // Handle date range
        if (filters.dateRange?.start) {
          params.append('start_date', filters.dateRange.start.toISOString().split('T')[0]);
        }
        if (filters.dateRange?.end) {
          params.append('end_date', filters.dateRange.end.toISOString().split('T')[0]);
        }
        console.log("params entrties what are",Object.fromEntries(params));

        const response = await fetch(
          `${BASE_URL}/client/view?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        console.log("client view data", result);

        if (!result?.status) {
          console.error(result?.message || 'API Error');
          return;
        }

        setTotalEntries(result.total || 0);
        setLastPage(result.last_page || 1);
        
        if (result.current_page !== currentPage) {
          setCurrentPage(result.current_page);
        }

        const mappedData = (result.data || []).map((item) => ({
          id: item.id,
          project: {
            service_title: item.department || item.service_title,
            description:  item.department_nickname,
            img: '/images/project-placeholder.png',
          },
          customer: {
            name: item.customer_name,
            email: item.email,
            img: null,
          },
          contact_no: item.contact_no,
          email: item.email,
          organisation_name: item.organisation_name,
          ministry: item.ministry,
          onboard_date: item.onboard_date,
          service_start_date: item.service_start_date,
          service_end_date: item.service_end_date,
          status: {
            status: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ],
            defaultSelect: item.status === 'active' 
              ? { label: 'Active', value: 'active' }
              : { label: 'Inactive', value: 'inactive' },
          },
        }));

        setTableData(mappedData);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [token, compid, type, Status, currentPage, pageSize, filters, searchTerm, sortField, sortOrder]);

  const deleteClient = async (clientId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication error");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this client?")) {
      return;
    }

    try {
      const response = await fetch(
        "https://green-owl-255815.hostingersite.com/api/client/delete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            client_id: clientId,
          }),
        }
      );

      const result = await response.json();

      if (!result?.status) {
        throw new Error(result?.message || "Failed to delete client");
      }

      alert("Client deleted successfully");
      
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const columns = [
    {
      id: 'select',
      accessorKey: 'id',
      header: ({ table }) => {
        const checkboxRef = React.useRef(null);

        useEffect(() => {
          if (checkboxRef.current) {
            checkboxRef.current.indeterminate = table.getIsSomeRowsSelected();
          }
        }, [table]);

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
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    {
      id: 'project',
      accessorKey: 'project',
      header: () => 'Client-name',
      cell: (info) => {
        const project = info.getValue();
        return (
          <div className="hstack gap-4">
           <div className="avatar-image border-0">
              {project.img == null ? (
                <img src={project.img} alt="" className="img-fluid" />
              ) : (
                <div className="avatar-text avatar-md">
                  {project.service_title?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <span className="fw-semibold">{project.service_title}</span>
              <p className="fs-12 text-muted mt-2">{project.description}</p>
            </div>
          </div>
        );
      },
    },
    {
      id: 'customer',
      accessorKey: 'customer',
      header: () => 'Customer',
      cell: (info) => {
        const customer = info.getValue();
        return (
          <div className="hstack gap-3">
            <div className="avatar-text avatar-md">
              {customer?.name?.charAt(0)}
            </div>
            <div>
              <span className='d-block'>{customer.name}</span>
              <small className="fs-12 text-muted">{customer.email}</small>
            </div>
          </div>
        );
      },
    },
    {
      id: 'contact_no',
      accessorKey: 'contact_no',
      header: 'Phone',
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: 'E-mail',
    },
    {
      id: 'organisation_name',
      accessorKey: 'organisation_name',
      header: 'Organisation Name',
    },
    {
      id: 'ministry',
      accessorKey: 'ministry',
      header: 'Ministry',
    },
    {
      id: 'onboard_date',
      accessorKey: 'onboard_date',
      header: 'Onboard Date',
    },
    {
      id: 'service_start_date',
      accessorKey: 'service_start_date',
      header: 'Start Date',
    },
    {
      id: 'service_end_date',
      accessorKey: 'service_end_date',
      header: 'End Date',
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: () => 'Status',
      cell: (info) => (
        <TableCell
          options={info.getValue().status}
          defaultSelect={info.getValue().defaultSelect}
        />
      ),
    },
    {
      id: 'actions',
      header: () => 'Actions',
      cell: (info) => {
        const clientId = info.row.original.id;
        return (
          <div className="hstack gap-2 justify-content-end">
            <a href={`/generate-documents/view?type=${type}&client_id=${clientId}`} className="avatar-text avatar-md">
              <FiEye />
            </a>
            {/* <a href={`/clients/edit?type=${type}&client_id=${clientId}`} className="avatar-text avatar-md">
              <FiEdit />
            </a> */}
            <Dropdown
              dropdownItems={getActions(clientId, type, compid, deleteClient)}
              triggerClassNaclassName="avatar-md"
              triggerPosition="0,21"
              triggerIcon={<FiMoreHorizontal />}
            />
          </div>
        );
      },
    },
  ];

  const tableProps = {
    data: tableData,
    columns,
    loading,
    totalEntries,
    currentPage,
    lastPage,
    pageSize,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    onSearch: handleSearch,
    onSort: handleSort
  };

  return <Table {...tableProps} />;
};

export default ProjectTable;
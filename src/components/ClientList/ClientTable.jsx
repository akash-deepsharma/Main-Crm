'use client';

import React, { useState, memo, useEffect } from 'react';
import Table from '@/components/shared/table/Table';
import {
  FiAlertOctagon,
  FiArchive,
  FiClock,
  FiEdit3,
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
    label: 'Edit',
    icon: <FiEdit3 />,
    onClick: () => {
      window.location.href = `/clients/create?type=${type}&client_id=${clientId}&company_id=${compid}`;
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


const ProjectTable = () => {
  const [token, setToken] = useState(null);
  const [compid, setCompid] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log("first table data", tableData)

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setCompid(localStorage.getItem('selected_company'));
  }, []);

  const searchParams = useSearchParams();
  const type = searchParams.get('type');


  useEffect(() => {
    if (!token || !compid) return;

    const fetchClients = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          company_id: compid,
          client_type: type,
        });

        const response = await fetch(
          `${BASE_URL}/client/view?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        console.log("client view data", result)

        if (!result?.status) {
          console.error(result?.message || 'API Error');
          return;
        }

        // ✅ Normalize API data for UI
        const mappedData = result.data.map((item) => ({
          id: item.id,

          project: {
            service_title: item.department_nickname,
            description: item.department,
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
            defaultSelect: { label: 'Active', value: 'active' },
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
  }, [token, compid]);


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

    // 🔁 Optional: reload / refetch list
    window.location.reload();

  } catch (err) {
    alert(err.message);
  }
};

  const columns = [
  {
    id: 'select',
    accessorKey: 'id',
    header: ({ table }) => {
      const checkboxRef = React.useRef(null);

      useEffect(() => {
        if (checkboxRef.current) {
          checkboxRef.current.indeterminate =
            table.getIsSomeRowsSelected();
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
            <img src={project.img} alt="" className="img-fluid" />
          </div>
          <div>
            <span className="fw-semibold">
              {project.service_title}
            </span>
            <p className="fs-12 text-muted mt-2">
              {project.description}
            </p>
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
            <span>{customer.name}</span>
            <small className="fs-12 text-muted">
              {customer.email}
            </small>
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
        <a href={`/clients/view?type=${type}&client_id=${clientId}`} className="avatar-text avatar-md">
          <FiEye />
        </a>
        <Dropdown
          dropdownItems={getActions(clientId, type, compid, deleteClient)}
          triggerClassNaclassName="avatar-md"
          triggerPosition="0,21"
          triggerIcon={<FiMoreHorizontal />}
        />
      </div>
          )
    },
  },
];


  return <Table data={tableData} columns={columns} loading={loading} />;
};

export default ProjectTable;

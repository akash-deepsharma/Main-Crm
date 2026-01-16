'use client'
import React, { useState, memo, useEffect } from 'react'
import Table from '@/components/shared/table/Table';
import { FiAlertOctagon, FiArchive, FiClock, FiEdit3, FiEye, FiMoreHorizontal, FiPrinter, FiTrash2 } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown';
import SelectDropdown from '@/components/shared/SelectDropdown';
import { SalaryClientTableData } from '@/utils/fackData/SalaryClientTableData';
import Input from '../shared/Input';
import { useSearchParams } from 'next/navigation';
const BASE_URL = 'https://green-owl-255815.hostingersite.com/api';



const getActions = (clientId, type, compid) => [
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
  },
]; 



const TableCell = memo(({ options }) => {
    console.log("options", options)
     const { text, color } = options;
    return (
         <span className={`badge bg-soft-${color} text-${color} mx-3`}>
            {text}
        </span>
    );
});

const ProjectTable = () => {

const [token, setToken] = useState(null)
  const [compid, setCompid] = useState(null)
    const [tableData, setTableData] = useState([]);
  
    const [loading, setLoading] = useState(false);
  

  const searchParams = useSearchParams()
  const type = searchParams.get('type')

  // get token & company id
  useEffect(() => {
    setToken(localStorage.getItem('token'))
    setCompid(sessionStorage.getItem('selected_company'))
  }, [])

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
             title: item.contract_no,
            //  description: item.customer_name,
            //  img: '/images/project-placeholder.png',
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
            accessorKey: 'project',
            header: () => 'Client-name',
            cell: (info) => {
                const roles = info.getValue();
                return (
                    <div className="hstack gap-4">
                        {/* <div className="avatar-image border-0">
                            <img src={roles?.img} alt="" className="img-fluid" />
                        </div> */}
                        <div>
                            <a href="projects-view.html" className="text-truncate-1-line">{roles?.title}</a>
                            
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
                                <div className="text-white avatar-text user-avatar-text avatar-md">{roles?.name.substring(0, 1)}</div>
                        }
                        <div>
                            <span className="text-truncate-1-line">{roles?.name}</span>
                            <small className="fs-12 fw-normal text-muted">{roles?.email}</small>
                        </div>
                    </a>
                )
            }
        },
        {
            accessorKey: 'contact_no',
            header: () => 'Phone',
        }, 
        {
            accessorKey: 'email',
            header: () => 'E-mail',
        },
        {
            accessorKey: 'organisation_name',
            header: () => 'Organisation Name',
        },
        {
            accessorKey: 'ministry',
            header: () => 'Ministry',
        },
//         {
//     accessorKey: 'status',
//     header: () => 'Status',
//     cell: (info) => {
//     const value = info.getValue();
//     return <TableCell options={{ text: value.defaultSelect, color: value.color }} />;
// }
// },
         {
    id: 'actions',
    header: () => 'Actions',
    cell: (info) => {
         const clientId = info.row.original.id;
          return (
      <div className="hstack gap-2 justify-content-end">
        <a href={`/salary/view?type=${type}&client_id=${clientId}`} className="avatar-text avatar-md">
          <FiEye />
        </a>
        <Dropdown
          dropdownItems={getActions(clientId, type, compid)}
          triggerClassNaclassName="avatar-md"
          triggerPosition="0,21"
          triggerIcon={<FiMoreHorizontal />}
        />
      </div>
          )
    },
  },
    ]

    return (
        <>
            <Table data={tableData} columns={columns} />
        </>
    )
}

export default ProjectTable


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
// https://green-owl-255815.hostingersite.com/api/client_salary_user?client_id=173


const IobToIob = () => {
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
const jan = 'Jan';

  useEffect(() => {
    if (!token || !compid) return;

    const fetchClients = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          company_id: compid,
          client_id: 173,
          month: jan,
        });

        const response = await fetch(
          `${BASE_URL}/client_salary_user?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        console.log("salery employee data", result)

        if (!result?.status) {
          console.error(result?.message || 'API Error');
          return;
        }

    const mappedData = result.data?.salary.map((item) => {
      const bankDetails = item.employee?.bank_details
        ? JSON.parse(item.employee.bank_details)
        : {};

      return {
        id: item.id,
        account_no: bankDetails.account_no || "N/A",
        amount: item.gross_salary,
        summary: `${item.employee?.name} Salery Month of ${jan}`  || "N/A",
      };
    });

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
  id: 'account_no',
  accessorKey: 'account_no',
  header: 'Account No',
},
{
  id: 'amount',
  accessorKey: 'amount',
  header: 'Amount',
},
{
  id: 'summary',
  accessorKey: 'summary',
  header: 'Summary',
},

];

  return <Table data={tableData} columns={columns} loading={loading} />;
};

export default IobToIob ;
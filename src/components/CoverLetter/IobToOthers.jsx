'use client';

import React, { useState, useEffect } from 'react';
import Table from '@/components/shared/table/Table';
import { FiEye, FiFileText } from 'react-icons/fi';

const BASE_URL = 'https://green-owl-255815.hostingersite.com/api';

const IobToOthers = () => {
  const [token, setToken] = useState(null);
  const [compid, setCompid] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [txtPreview, setTxtPreview] = useState('');
  const [showTxt, setShowTxt] = useState(false);

  const jan = 'January';
  const year = '2026';

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setCompid(localStorage.getItem('selected_company'));
  }, []);

  useEffect(() => {
    if (!token || !compid) return;

    const fetchSalary = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          company_id: compid,
          client_id: 173,
          month: jan,
          year:year
        });

        const res = await fetch(
          `${BASE_URL}/client_salary_user?${params}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const result = await res.json();
        console.log("reskt", result)
        if (!result?.status) return;

        const mapped = result.data.salary.map((item) => {
          const bank = item.employee?.bank_details
            ? JSON.parse(item.employee.bank_details)
            : {};

          return {
            id: item.id,
            ifsc: bank.ifsc || 'N/A',
            fix: 10,
            account_no: bank.account_no || 'N/A',
            account_holder_name: bank.account_holderName || 'N/A',
            amount: Number(item.gross_salary || 0),
            remarks :`${item.employee?.name} Salary Month of ${jan}`,
            summary: 'AMOUNT FOR LOAN',
          };
        });     

        setTableData(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalary();
  }, [token, compid]);

  /* 🔹 CREATE SINGLE TXT FROM ALL DATA */
  const generateFullTxt = () => {
    let txt = `
SALARY TRANSFER SHEET (IOB TO OTHERS)
=================================
`;

    tableData.forEach((row, index) => {
      txt += `${row.ifsc},${row.fix},${row.account_no},${row.account_holder_name},${row.remarks},${row.summary},${row.amount}
`;
    });

    txt += `
---------------------------------
Total Employees : ${tableData.length}
Generated On    : ${new Date().toLocaleString()}
`;

    setTxtPreview(txt);
    setShowTxt(true);
  };

  const downloadTxt = () => {
    const blob = new Blob([txtPreview], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'salary_transfer.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    { accessorKey: 'ifsc', header: 'Ifsc' },
    { accessorKey: 'fix', header: 'Fix' },
    { accessorKey: 'account_no', header: 'Account No' },
    { accessorKey: 'account_holder_name', header: 'Account Holder Name' },
    { accessorKey: 'remarks', header: 'Remarks' },
    { accessorKey: 'summary', header: 'Summary' },  
    { accessorKey: 'amount', header: 'Amount' },
  ];

  return (
    <>
      <div className="d-flex justify-content-between mb-3 gap-2 bg-dark rounded-3 p-3 m-4 mt-5 pt-5">
        <div className='text-white'>SALARY TRANSFER SHEET (IOB TO Others)
</div>
        <button className="btn btn-primary" onClick={generateFullTxt}>
          <FiFileText /> View TXT
        </button>
      </div>

      <Table data={tableData} columns={columns} loading={loading} />

      {showTxt && (
        <div className="txt-modal">
          <div className="txt-modal-content"> 

            <pre className="txt-preview">{txtPreview}</pre>

            <div className="txt-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowTxt(false)}
              >
                Close
              </button>
              <button
                className="btn btn-success"
                onClick={downloadTxt}
              >
                Download TXT
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IobToOthers;

'use client';

import React, { useEffect, useState } from 'react';
import Table from '@/components/shared/table/Table';
import { FiFileText } from 'react-icons/fi';
import * as XLSX from 'xlsx';

const BASE_URL = 'https://green-owl-255815.hostingersite.com/api';

const IdfcBankFormate = () => {
  const [token, setToken] = useState(null);
  const [compid, setCompid] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const MONTH = 'January';
  const year = '2026';
  const TRANSACTION_TYPE = 'RTGS';
  const DEBIT_ACCOUNT = '10132987671';

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
          month: MONTH,
          year : year
        });

        const res = await fetch(
          `${BASE_URL}/client_salary_user?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const result = await res.json();
        if (!result?.status) return;

        const today = new Date().toLocaleDateString('en-GB');

        // 🔹 SECOND ROW (INSTRUCTION ROW)
        const instructionRow = {
            beneficiary_name: 'Enter Beneficiary name. MANDATORY',
          beneficiary_account:
            'Enter Beneficiary account number. IDFC or Other bank. MANDATORY',
          ifsc:
            'Enter beneficiary bank IFSC code. Required for NEFT/RTGS',
          transaction_type:
            'IFT- Within Bank Payment NEFT- Inter-Bank(NEFT) Payment RTGS- Inter-Bank(RTGS) Payment MANDATORY',
          debit_account:
            'Enter Debit account number. This sold be IDFC Bank acount number have access to do transnaction on this account. MANDATORY',
          transaction_date:
            `Enter transaction value date. Should be today's or future Date. MANDATORY DD/MM/YYYY format`,
          amount:
            'Enter Payment Amount. MANDATORY',
          currency:
            'Enter Transaction curency. Should be INR only. MANDATORY',
          email:
            'Enter beneficiary email id. OPTIONAL',
          remarks:
            'Enter Remarks OPTIONAL',
        };

        // 🔹 SALARY ROWS
        const salaryRows = result.data.salary.map((item) => {
             const bank = item.employee?.bank_details
            ? JSON.parse(item.employee.bank_details)
            : {};
              return {
            beneficiary_name: item.employee?.name || '',
            beneficiary_account: bank.account_no || 'N/A',
            ifsc: bank?.ifsc || '',
            transaction_type: TRANSACTION_TYPE,
            debit_account: DEBIT_ACCOUNT,
            transaction_date: today,
            amount: item.gross_salary || 0,
            currency: 'INR',
            email: item.employee?.email || '',
            remarks: `MONTH OF ${MONTH}`,
            };
        });

        setTableData([instructionRow, ...salaryRows]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalary();
  }, [token, compid]);

  /* 🔹 TRUE XLSX EXPORT */
const exportXlsx = () => {
  const worksheetData = [
    [
      'Beneficiary Name',
      'Beneficiary Account Number',
      'IFSC',
      'Transaction Type',
      'Debit Account No.',
      'Transaction Date',
      'Amount',
      'Currency',
      'Beneficiary Email ID',
      'Remarks',
    ],
    ...tableData.map((row) => [
      row.beneficiary_name,
      row.beneficiary_account,
      row.ifsc,
      row.transaction_type,
      row.debit_account,
      row.transaction_date,
      row.amount,
      row.currency,
      row.email,
      row.remarks,
    ]),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  /* 🔴 STYLE FOR FIRST TWO ROWS */
  const redStyle = {
    fill: { fgColor: { rgb: 'FF0000' } },
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    protection: { locked: true },
  };

  const range = XLSX.utils.decode_range(worksheet['!ref']);

  for (let R = 0; R <= 1; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = redStyle;
    }
  }

  /* 🔓 UNLOCK DATA ROWS */
  for (let R = 2; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        protection: { locked: false },
      };
    }
  }

  /* 🔐 SHEET PROTECTION */
  worksheet['!protect'] = {
    selectLockedCells: false,
    selectUnlockedCells: true,
    formatCells: false,
    formatColumns: false,
    formatRows: false,
    insertColumns: false,
    insertRows: false,
    deleteColumns: false,
    deleteRows: false,
    sort: false,
    autoFilter: false,
    pivotTables: false,
  };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'IDFC Salary Upload');

  XLSX.writeFile(workbook, 'IDFC_Salary_Upload.xlsx');
};


  /* 🔹 TABLE COLUMNS */
  const columns = [
    { accessorKey: 'beneficiary_name', header: 'Beneficiary Name' },
    { accessorKey: 'beneficiary_account', header: 'Beneficiary Account Number' },
    { accessorKey: 'ifsc', header: 'IFSC' },
    { accessorKey: 'transaction_type', header: 'Transaction Type' },
    { accessorKey: 'debit_account', header: 'Debit Account No.' },
    { accessorKey: 'transaction_date', header: 'Transaction Date' },
    { accessorKey: 'amount', header: 'Amount' },
    { accessorKey: 'currency', header: 'Currency' },
    { accessorKey: 'email', header: 'Beneficiary Email ID' },
    { accessorKey: 'remarks', header: 'Remarks' },
  ];

  return (
    <>
    <div className="IDFC_BANK_FORMAT">
      <div className="d-flex justify-content-between align-items-center bg-dark text-white p-3 rounded-3 m-4">
        <div className="fw-semibold">
          SALARY TRANSFER SHEET – IDFC BANK FORMAT
        </div>

        <button className="btn btn-success" onClick={exportXlsx}>
          <FiFileText /> Download XLSX
        </button>
      </div>

      <Table data={tableData} columns={columns} loading={loading} />
    </div>
    </>
  );
};

export default IdfcBankFormate;

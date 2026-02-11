'use client';

import React, { useEffect, useState } from 'react';
import Table from '@/components/shared/table/Table';
import { FiFileText } from 'react-icons/fi';
import * as XLSX from 'xlsx';

const BASE_URL = 'https://green-owl-255815.hostingersite.com/api';

const IciciBankFormate = () => {
  const [token, setToken] = useState(null);
  const [compid, setCompid] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 CONSTANTS
  const MONTH = 'January';
   const year = '2026';
  const PYMT_MODE = 'NEFT'; // NEFT / RTGS
  const DEBIT_ACCOUNT = '10132987671';

  /* 🔹 GET TOKEN & COMPANY */
  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setCompid(localStorage.getItem('selected_company'));
  }, []);

  /* 🔹 FETCH SALARY DATA */
  useEffect(() => {
    if (!token || !compid) return;

    const fetchSalary = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          company_id: compid,
          client_id: 173,
          month: MONTH,
          year:year
        });

        const res = await fetch(
          `${BASE_URL}/client_salary_user?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();
        if (!result?.status) return;

        const today = new Date().toLocaleDateString('en-GB');

        const salaryRows = result.data.salary.map((item) => {
          const bank = item.employee?.bank_details
            ? JSON.parse(item.employee.bank_details)
            : {};

          return {
            PYMT_PROD_TYPE_CODE: 'PAB_VENDOR',
            PYMT_MODE: PYMT_MODE,
            DEBIT_ACC_NO: DEBIT_ACCOUNT,
            BNF_NAME: item.employee?.name || '',
            BENE_ACC_NO: bank.account_no || '',
            BENE_IFSC: bank?.ifsc || '',
            AMOUNT: Number(item.gross_salary || 0),
            DEBIT_NARR: `SALARY ${MONTH}`,
            CREDIT_NARR: `SALARY ${MONTH}`,
            MOBILE_NUM: item.employee?.mobile_no || '',
            EMAIL_ID: item.employee?.email || '',
            REMARK: `MONTH OF ${MONTH}`,
            PYMT_DATE: today,
            REF_NO: '',
            ADDL_INFO1: '',
            ADDL_INFO2: '',
            ADDL_INFO3: '',
            ADDL_INFO4: '',
            ADDL_INFO5: '',
          };
        });

        setTableData(salaryRows);
      } catch (error) {
        console.error('Salary Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalary();
  }, [token, compid]);

  /* 🔹 EXPORT XLSX */
  const exportXlsx = () => {
    const worksheetData = [
      [
        'PYMT_PROD_TYPE_CODE',
        'PYMT_MODE',
        'DEBIT_ACC_NO',
        'BNF_NAME',
        'BENE_ACC_NO',
        'BENE_IFSC',
        'AMOUNT',
        'DEBIT_NARR',
        'CREDIT_NARR',
        'MOBILE_NUM',
        'EMAIL_ID',
        'REMARK',
        'PYMT_DATE',
        'REF_NO',
        'ADDL_INFO1',
        'ADDL_INFO2',
        'ADDL_INFO3',
        'ADDL_INFO4',
        'ADDL_INFO5',
      ],
      ...tableData.map((row) => [
        row.PYMT_PROD_TYPE_CODE,
        row.PYMT_MODE,
        row.DEBIT_ACC_NO,
        row.BNF_NAME,
        row.BENE_ACC_NO,
        row.BENE_IFSC,
        row.AMOUNT,
        row.DEBIT_NARR,
        row.CREDIT_NARR,
        row.MOBILE_NUM,
        row.EMAIL_ID,
        row.REMARK,
        row.PYMT_DATE,
        row.REF_NO,
        row.ADDL_INFO1,
        row.ADDL_INFO2,
        row.ADDL_INFO3,
        row.ADDL_INFO4,
        row.ADDL_INFO5,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'ICICI Salary Upload'
    );

    XLSX.writeFile(workbook, 'ICICI_Salary_Upload.xlsx');
  };

  /* 🔹 TABLE COLUMNS */
  const columns = [
    { accessorKey: 'PYMT_PROD_TYPE_CODE', header: 'PYMT_PROD_TYPE_CODE' },
    { accessorKey: 'PYMT_MODE', header: 'PYMT_MODE' },
    { accessorKey: 'DEBIT_ACC_NO', header: 'DEBIT_ACC_NO' },
    { accessorKey: 'BNF_NAME', header: 'BNF_NAME' },
    { accessorKey: 'BENE_ACC_NO', header: 'BENE_ACC_NO' },
    { accessorKey: 'BENE_IFSC', header: 'BENE_IFSC' },
    { accessorKey: 'AMOUNT', header: 'AMOUNT' },
    { accessorKey: 'DEBIT_NARR', header: 'DEBIT_NARR' },
    { accessorKey: 'CREDIT_NARR', header: 'CREDIT_NARR' },
    { accessorKey: 'MOBILE_NUM', header: 'MOBILE_NUM' },
    { accessorKey: 'EMAIL_ID', header: 'EMAIL_ID' },
    { accessorKey: 'REMARK', header: 'REMARK' },
    { accessorKey: 'PYMT_DATE', header: 'PYMT_DATE' },
    { accessorKey: 'REF_NO', header: 'REF_NO' },
    { accessorKey: 'ADDL_INFO1', header: 'ADDL_INFO1' },
    { accessorKey: 'ADDL_INFO2', header: 'ADDL_INFO2' },
    { accessorKey: 'ADDL_INFO3', header: 'ADDL_INFO3' },
    { accessorKey: 'ADDL_INFO4', header: 'ADDL_INFO4' },
    { accessorKey: 'ADDL_INFO5', header: 'ADDL_INFO5' },
  ];

  return (
    <div className="ICICI_BANK_FORMAT">
      <div className="d-flex justify-content-between align-items-center bg-dark text-white p-3 rounded-3 m-4">
        <div className="fw-semibold">
          SALARY TRANSFER SHEET – ICICI BANK FORMAT
        </div>

        <button className="btn btn-success" onClick={exportXlsx}>
          <FiFileText className="me-2" />
          Download XLSX
        </button>
      </div>

      <Table data={tableData} columns={columns} loading={loading} />
    </div>
  );
};

export default IciciBankFormate;

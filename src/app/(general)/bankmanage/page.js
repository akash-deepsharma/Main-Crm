'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaArrowLeft, FaDownload, FaFileExcel, 
  FaRupeeSign, FaUsers, FaSearch,
  FaChevronLeft, FaChevronRight, FaFileAlt, 
  FaCog, FaEdit, FaSave, FaTimes
} from 'react-icons/fa';
import { MdClose, MdDateRange, MdInfo, MdSettings } from 'react-icons/md';
import { BiTransfer } from 'react-icons/bi';
import * as XLSX from 'xlsx';

const BASE_URL = 'https://green-owl-255815.hostingersite.com/api';

const BankSalaryTransferFormats = () => {
  const [token, setToken] = useState(null);
  const [compid, setCompid] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [tempMonth, setTempMonth] = useState('January');
  const [tempYear, setTempYear] = useState('2026');
  
  // ============ BANK SPECIFIC OPTIONS ============
  // IOB to IOB Options
  const [iobSummary, setIobSummary] = useState('Salary Month of');
  
  // IOB to Others Options
  const [iobOthersRemarks, setIobOthersRemarks] = useState('Salary');
  const [iobOthersSummary, setIobOthersSummary] = useState('AMOUNT FOR LOAN');
  const [iobFixValue, setIobFixValue] = useState('10');
  
  // IDFC Options
  const [idfcTxType, setIdfcTxType] = useState('RTGS');
  const [idfcDebitAccount, setIdfcDebitAccount] = useState('10132987671');
  const [idfcRemarks, setIdfcRemarks] = useState('MONTH OF');
  
  // ICICI Options
  const [iciciPymtMode, setIciciPymtMode] = useState('NEFT');
  const [iciciDebitAcc, setIciciDebitAcc] = useState('10132987671');
  const [iciciDebitNarr, setIciciDebitNarr] = useState('SALARY');
  const [iciciCreditNarr, setIciciCreditNarr] = useState('SALARY');
  const [iciciRemark, setIciciRemark] = useState('MONTH OF');
  const [iciciRefNo, setIciciRefNo] = useState('');
  const [iciciAddlInfo1, setIciciAddlInfo1] = useState('');
  const [iciciAddlInfo2, setIciciAddlInfo2] = useState('');
  const [iciciAddlInfo3, setIciciAddlInfo3] = useState('');
  const [iciciAddlInfo4, setIciciAddlInfo4] = useState('');
  const [iciciAddlInfo5, setIciciAddlInfo5] = useState('');
  
  // HDFC Options
  const [hdfcTxType, setHdfcTxType] = useState('NEFT');
  const [hdfcDebitAccount, setHdfcDebitAccount] = useState('12345678901');
  const [hdfcNarration, setHdfcNarration] = useState('Salary');
  
  // AXIS Options
  const [axisDepartment, setAxisDepartment] = useState('Engineering');
  const [axisPurpose, setAxisPurpose] = useState('Salary');
  
  // SBI Options
  const [sbiTxType, setSbiTxType] = useState('NEFT');
  
  // KOTAK Options
  const [kotakBatchId, setKotakBatchId] = useState('BATCH');
  const [kotakRemitter, setKotakRemitter] = useState('ABC Corp Pvt Ltd');
  const [kotakPaymentType, setKotakPaymentType] = useState('Salary');
  
  // YES BANK Options
  const [yesCreditNarr, setYesCreditNarr] = useState('Salary Cr');
  const [yesDebitNarr, setYesDebitNarr] = useState('Salary Dr');
  
  // Settings Panel State
  const [showSettings, setShowSettings] = useState(false);
  
  // Dynamic Summary Editor State
  const [showSummaryEditor, setShowSummaryEditor] = useState(false);
  const [editingFormat, setEditingFormat] = useState('');
  const [tempSummary, setTempSummary] = useState('');
  const [tempRemarks, setTempRemarks] = useState('');
  const [tempFixValue, setTempFixValue] = useState('');
  
  // Data States
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const years = ['2026', '2025', '2024', '2023', '2022'];

  // Transaction Types
  const transactionTypes = ['RTGS', 'NEFT', 'IFT'];
  const paymentModes = ['NEFT', 'RTGS', 'IMPS', 'FT'];

  // Get token and company id from localStorage
  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setCompid(localStorage.getItem('selected_company'));
  }, []);

  // Fetch salary data from API
  useEffect(() => {
    if (!token || !compid || !selectedBank) return;

    const fetchSalaryData = async () => {
      try {
        setLoading(true);
        
        const params = new URLSearchParams({
          company_id: compid,
          client_id: 173,
          month: selectedMonth,
          year: selectedYear
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
        
        if (result?.status && result.data?.salary) {
          const mappedData = result.data.salary.map((item, index) => {
            const bank = item.employee?.bank_details
              ? JSON.parse(item.employee.bank_details)
              : {};
            
            return {
              id: item.id || index + 1,
              empId: `EMP${String(index + 1).padStart(3, '0')}`,
              name: item.employee?.name || 'N/A',
              accountNo: bank.account_no || 'N/A',
              ifsc: bank.ifsc || 'N/A',
              amount: Number(item.gross_salary || 0),
              email: item.employee?.email || '',
              mobile: item.employee?.mobile_no || '',
              remarks: `MONTH OF ${selectedMonth.toUpperCase()}`,
              summary: 'SALARY PAYMENT',
              accountHolderName: bank.account_holderName || item.employee?.name || 'N/A',
              debitAccount: '10132987671',
              txDate: new Date().toLocaleDateString('en-GB')
            };
          });
          
          setSalaryData(mappedData);
          setFilteredData(mappedData);
        }
      } catch (error) {
        console.error('Error fetching salary data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, [token, compid, selectedBank, selectedMonth, selectedYear]);

  // Search filter
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(salaryData);
    } else {
      const filtered = salaryData.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.accountNo.includes(searchTerm) ||
        item.ifsc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.empId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, salaryData]);

  // Pagination calculations
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const banks = [
    {
      id: 1,
      name: 'IOB',
      code: 'IOB',
      color: '#0055A4',
      lightColor: '#E3F2FD',
      icon: '🏦',
      formats: ['IOB to IOB', 'IOB to Others']
    },
    {
      id: 2,
      name: 'IDFC',
      code: 'IDFC',
      color: '#6B5B95',
      lightColor: '#EDE7F6',
      icon: '🏛️',
      formats: ['Salary Transfer - IDFC']
    },
    {
      id: 3,
      name: 'ICICI',
      code: 'ICICI',
      color: '#FF6F61',
      lightColor: '#FFE0B2',
      icon: '🏢',
      formats: ['Corporate Salary - ICICI']
    },
    {
      id: 4,
      name: 'HDFC',
      code: 'HDFC',
      color: '#004B8D',
      lightColor: '#E1F5FE',
      icon: '🏣',
      formats: ['Salary Transfer - HDFC']
    },
    {
      id: 5,
      name: 'AXIS',
      code: 'AXIS',
      color: '#97144d',
      lightColor: '#FCE4EC',
      icon: '🏦',
      formats: ['Employee Salary - AXIS']
    },
    {
      id: 6,
      name: 'SBI',
      code: 'SBI',
      color: '#2E7D32',
      lightColor: '#E8F5E9',
      icon: '🏛️',
      formats: ['Salary Payment - SBI']
    },
    {
      id: 7,
      name: 'KOTAK',
      code: 'KOTAK',
      color: '#E64A19',
      lightColor: '#FBE9E7',
      icon: '🏢',
      formats: ['Bulk Salary - KOTAK']
    },
    {
      id: 8,
      name: 'YES BANK',
      code: 'YES',
      color: '#C2185B',
      lightColor: '#F8BBD7',
      icon: '🏣',
      formats: ['Salary Transfer - YES']
    }
  ];

  // ==================== DYNAMIC SUMMARY EDITOR ====================
  const openSummaryEditor = (formatType) => {
    setEditingFormat(formatType);
    
    if (formatType === 'IOB to IOB') {
      setTempSummary(iobSummary);
    } else if (formatType === 'IOB to Others') {
      setTempRemarks(iobOthersRemarks);
      setTempSummary(iobOthersSummary);
      setTempFixValue(iobFixValue);
    } else if (formatType === 'IDFC') {
      setTempSummary(idfcRemarks);
    } else if (formatType === 'ICICI') {
      setTempSummary(iciciRemark);
    }
    
    setShowSummaryEditor(true);
  };

  const saveSummaryChanges = () => {
    if (editingFormat === 'IOB to IOB') {
      setIobSummary(tempSummary);
    } else if (editingFormat === 'IOB to Others') {
      setIobOthersRemarks(tempRemarks);
      setIobOthersSummary(tempSummary);
      setIobFixValue(tempFixValue);
    } else if (editingFormat === 'IDFC') {
      setIdfcRemarks(tempSummary);
    } else if (editingFormat === 'ICICI') {
      setIciciRemark(tempSummary);
    }
    
    setShowSummaryEditor(false);
    setEditingFormat('');
  };

  // ==================== EXPORT FUNCTIONS ====================
  const downloadExcel = (formatType) => {
    let worksheetData = [];
    let fileName = '';

    switch(selectedBank?.name) {
      case 'IOB':
        if (formatType === 'IOB to IOB') {
          worksheetData = [
            ['Account No', 'Amount', 'Summary'],
            ...currentEntries.map(item => [
              item.accountNo,
              item.amount,
              `${item.name} - ${iobSummary} ${selectedMonth}`
            ])
          ];
          fileName = `IOB_to_IOB_Salary_${selectedMonth}_${selectedYear}.xlsx`;
        } else {
          worksheetData = [
            ['IFSC', 'Fix', 'Account No', 'Account Holder Name', 'Remarks', 'Summary', 'Amount'],
            ...currentEntries.map(item => [
              item.ifsc,
              iobFixValue,
              item.accountNo,
              item.accountHolderName,
              `${item.name} - ${iobOthersRemarks} ${selectedMonth}`,
              iobOthersSummary,
              item.amount
            ])
          ];
          fileName = `IOB_to_Others_Salary_${selectedMonth}_${selectedYear}.xlsx`;
        }
        break;

      case 'IDFC':
        worksheetData = [
          ['Beneficiary Name', 'Beneficiary Account Number', 'IFSC', 'Transaction Type', 
           'Debit Account No.', 'Transaction Date', 'Amount', 'Currency', 'Beneficiary Email ID', 'Remarks'],
          ...currentEntries.map(item => [
            item.name,
            item.accountNo,
            item.ifsc,
            idfcTxType,
            idfcDebitAccount,
            item.txDate,
            `${item.amount}.00`,
            'INR',
            item.email,
            `${idfcRemarks} ${selectedMonth.toUpperCase()}`
          ])
        ];
        fileName = `IDFC_Salary_${selectedMonth}_${selectedYear}.xlsx`;
        break;

      case 'ICICI':
        worksheetData = [
          ['PYMT_PROD_TYPE_CODE', 'PYMT_MODE', 'DEBIT_ACC_NO', 'BNF_NAME', 'BENE_ACC_NO', 
           'BENE_IFSC', 'AMOUNT', 'DEBIT_NARR', 'CREDIT_NARR', 'MOBILE_NUM', 'EMAIL_ID', 
           'REMARK', 'PYMT_DATE', 'REF_NO', 'ADDL_INFO1', 'ADDL_INFO2', 'ADDL_INFO3', 
           'ADDL_INFO4', 'ADDL_INFO5'],
          ...currentEntries.map(item => [
            'PAB_VENDOR',
            iciciPymtMode,
            iciciDebitAcc,
            item.name,
            item.accountNo,
            item.ifsc,
            item.amount,
            `${iciciDebitNarr} ${selectedMonth}`,
            `${iciciCreditNarr} ${selectedMonth}`,
            item.mobile,
            item.email,
            `${iciciRemark} ${selectedMonth.toUpperCase()}`,
            item.txDate,
            iciciRefNo,
            iciciAddlInfo1,
            iciciAddlInfo2,
            iciciAddlInfo3,
            iciciAddlInfo4,
            iciciAddlInfo5
          ])
        ];
        fileName = `ICICI_Salary_${selectedMonth}_${selectedYear}.xlsx`;
        break;

      case 'HDFC':
        worksheetData = [
          ['Beneficiary Name', 'Account Number', 'IFSC Code', 'Transfer Type', 
           'Debit A/c', 'Value Date', 'Amount', 'Email', 'Narration'],
          ...currentEntries.map(item => [
            item.name,
            item.accountNo,
            item.ifsc,
            hdfcTxType,
            hdfcDebitAccount,
            item.txDate,
            `${item.amount}.00`,
            item.email,
            `${hdfcNarration} ${selectedMonth} ${selectedYear}`
          ])
        ];
        fileName = `HDFC_Salary_${selectedMonth}_${selectedYear}.xlsx`;
        break;

      case 'AXIS':
        worksheetData = [
          ['Employee ID', 'Employee Name', 'Account Number', 'IFSC Code', 'Amount', 'Purpose', 'Department'],
          ...currentEntries.map(item => [
            item.empId,
            item.name,
            item.accountNo,
            item.ifsc,
            item.amount,
            `${axisPurpose} - ${selectedMonth}`,
            axisDepartment
          ])
        ];
        fileName = `AXIS_Salary_${selectedMonth}_${selectedYear}.xlsx`;
        break;

      case 'SBI':
        worksheetData = [
          ['S.No', 'Beneficiary Name', 'Account Number', 'IFSC Code', 'Transaction Type', 'Amount'],
          ...currentEntries.map((item, index) => [
            index + 1,
            item.name,
            item.accountNo,
            item.ifsc,
            sbiTxType,
            item.amount
          ])
        ];
        fileName = `SBI_Salary_${selectedMonth}_${selectedYear}.xlsx`;
        break;

      case 'KOTAK':
        worksheetData = [
          ['Batch ID', 'Beneficiary Name', 'Account No', 'IFSC', 'Amount', 'Payment Type', 'Remitter Name'],
          ...currentEntries.map(item => [
            `${kotakBatchId}${selectedYear}${selectedMonth.substring(0,3)}`,
            item.name,
            item.accountNo,
            item.ifsc,
            item.amount,
            kotakPaymentType,
            kotakRemitter
          ])
        ];
        fileName = `KOTAK_Salary_${selectedMonth}_${selectedYear}.xlsx`;
        break;

      case 'YES BANK':
        worksheetData = [
          ['Sr No', 'Beneficiary', 'Bank Account', 'IFSC', 'Amount', 'Credit Narration', 'Debit Narration'],
          ...currentEntries.map((item, index) => [
            index + 1,
            item.name,
            item.accountNo,
            item.ifsc,
            item.amount,
            `${yesCreditNarr} - ${selectedMonth}`,
            `${yesDebitNarr} - ${selectedMonth}`
          ])
        ];
        fileName = `YESBANK_Salary_${selectedMonth}_${selectedYear}.xlsx`;
        break;
    }

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Style header row
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: selectedBank?.color.substring(1) || '0B2F5C' } },
        alignment: { horizontal: 'center' }
      };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${selectedBank?.name} Salary`);
    XLSX.writeFile(workbook, fileName);
  };

  const downloadTXT = (formatType) => {
    let content = '';
    let fileName = '';

    if (selectedBank?.name === 'IOB') {
      if (formatType === 'IOB to IOB') {
        content = `SALARY TRANSFER SHEET (IOB TO IOB)
=================================
Month: ${selectedMonth} ${selectedYear}
Generated: ${new Date().toLocaleString()}
Total Employees: ${currentEntries.length}
Total Amount: ₹${currentEntries.reduce((sum, emp) => sum + emp.amount, 0).toLocaleString()}

`;
        currentEntries.forEach((item) => {
          content += `${item.accountNo}, ${item.amount}, ${item.name} - ${iobSummary} ${selectedMonth}\n`;
        });
        fileName = `IOB_to_IOB_Salary_${selectedMonth}_${selectedYear}.txt`;
      } else {
        content = `SALARY TRANSFER SHEET (IOB TO OTHERS)
=====================================
Month: ${selectedMonth} ${selectedYear}
Generated: ${new Date().toLocaleString()}
Total Employees: ${currentEntries.length}
Total Amount: ₹${currentEntries.reduce((sum, emp) => sum + emp.amount, 0).toLocaleString()}

`;
        currentEntries.forEach((item) => {
          content += `${item.ifsc}, ${iobFixValue}, ${item.accountNo}, ${item.accountHolderName}, ${item.name} - ${iobOthersRemarks} ${selectedMonth}, ${iobOthersSummary}, ${item.amount}\n`;
        });
        fileName = `IOB_to_Others_Salary_${selectedMonth}_${selectedYear}.txt`;
      }

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // ==================== ICICI FORMAT ====================
  const ICICI_Format = () => (
    <div style={styles.formatCard}>
      <div style={{...styles.formatHeader, backgroundColor: banks[2].lightColor, borderLeft: `5px solid ${banks[2].color}`}}>
        <h3 style={styles.formatTitle}>🏢 SALARY TRANSFER SHEET – ICICI BANK FORMAT</h3>
        <div style={styles.badge}>PAB_VENDOR</div>
      </div>
      
      {/* Show entries & Search */}
      <div style={styles.controlsHeader}>
        <div style={styles.showEntries}>
          Show 
          <select 
            style={styles.entriesSelect}
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          entries
        </div>
        
        <div style={styles.searchBox}>
          <span style={{color: '#64748b'}}>Search:</span>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{backgroundColor: '#f8f9fa'}}>
              <th style={styles.th}>PYMT_PROD_TYPE_CODE</th>
              <th style={styles.th}>PYMT_MODE</th>
              <th style={styles.th}>DEBIT_ACC_NO</th>
              <th style={styles.th}>BNF_NAME</th>
              <th style={styles.th}>BENE_ACC_NO</th>
              <th style={styles.th}>BENE_IFSC</th>
              <th style={styles.th}>AMOUNT</th>
              <th style={styles.th}>DEBIT_NARR</th>
              <th style={styles.th}>CREDIT_NARR</th>
              <th style={styles.th}>MOBILE_NUM</th>
              <th style={styles.th}>EMAIL_ID</th>
              <th style={styles.th}>REMARK</th>
              <th style={styles.th}>PYMT_DATE</th>
              <th style={styles.th}>REF_NO</th>
              <th style={styles.th}>ADDL_INFO1</th>
              <th style={styles.th}>ADDL_INFO2</th>
              <th style={styles.th}>ADDL_INFO3</th>
              <th style={styles.th}>ADDL_INFO4</th>
              <th style={styles.th}>ADDL_INFO5</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((item) => (
              <tr key={item.id} style={styles.tr}>
                <td style={styles.td}>PAB_VENDOR</td>
                <td style={styles.td}>{iciciPymtMode}</td>
                <td style={styles.td}>{iciciDebitAcc}</td>
                <td style={styles.td}>{item.name}</td>
                <td style={styles.td}>{item.accountNo}</td>
                <td style={styles.td}>{item.ifsc}</td>
                <td style={{...styles.td, ...styles.amountCell}}>{item.amount}</td>
                <td style={styles.td}>{iciciDebitNarr} {selectedMonth}</td>
                <td style={styles.td}>{iciciCreditNarr} {selectedMonth}</td>
                <td style={styles.td}>{item.mobile}</td>
                <td style={styles.td}>{item.email}</td>
                <td style={styles.td}>{iciciRemark} {selectedMonth.toUpperCase()}</td>
                <td style={styles.td}>{item.txDate}</td>
                <td style={styles.td}>{iciciRefNo}</td>
                <td style={styles.td}>{iciciAddlInfo1}</td>
                <td style={styles.td}>{iciciAddlInfo2}</td>
                <td style={styles.td}>{iciciAddlInfo3}</td>
                <td style={styles.td}>{iciciAddlInfo4}</td>
                <td style={styles.td}>{iciciAddlInfo5}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Showing entries and Pagination */}
      <div style={styles.tableFooter}>
        <div style={styles.showingInfo}>
          Showing {filteredData.length > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, filteredData.length)} of {filteredData.length} entries
        </div>
        
        <div style={styles.pagination}>
          <button 
            style={styles.pageButton}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FaChevronLeft /> Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              style={{
                ...styles.pageNumberButton,
                ...(currentPage === index + 1 ? styles.pageNumberActive : {})
              }}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          
          <button 
            style={styles.pageButton}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );

  // ==================== IOB to IOB FORMAT ====================
  const IOB_to_IOB_Format = () => (
    <div style={styles.formatCard}>
      <div style={{...styles.formatHeader, backgroundColor: banks[0].lightColor, borderLeft: `5px solid ${banks[0].color}`}}>
        <h3 style={styles.formatTitle}>🏦 SALARY TRANSFER SHEET (IOB TO IOB)</h3>
        <div style={styles.badge}>IOB to IOB</div>
      </div>
      
      {/* Show entries & Search */}
      <div style={styles.controlsHeader}>
        <div style={styles.showEntries}>
          Show 
          <select 
            style={styles.entriesSelect}
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          entries
        </div>
        
        <div style={styles.searchBox}>
          <span style={{color: '#64748b'}}>Search:</span>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{backgroundColor: '#f8f9fa'}}>
              <th style={styles.th}>Account No</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Summary</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((item) => (
              <tr key={item.id} style={styles.tr}>
                <td style={styles.td}>{item.accountNo}</td>
                <td style={{...styles.td, ...styles.amountCell}}>{item.amount}</td>
                <td style={styles.td}>{item.name} {iobSummary} {selectedMonth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={styles.tableFooter}>
        <div style={styles.showingInfo}>
          Showing {filteredData.length > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, filteredData.length)} of {filteredData.length} entries
        </div>
        
        <div style={styles.pagination}>
          <button 
            style={styles.pageButton}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FaChevronLeft /> Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              style={{
                ...styles.pageNumberButton,
                ...(currentPage === index + 1 ? styles.pageNumberActive : {})
              }}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          
          <button 
            style={styles.pageButton}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );

  // ==================== IOB to Others FORMAT ====================
  const IOB_to_Others_Format = () => (
    <div style={styles.formatCard}>
      <div style={{...styles.formatHeader, backgroundColor: banks[0].lightColor, borderLeft: `5px solid ${banks[0].color}`}}>
        <h3 style={styles.formatTitle}>🏦 SALARY TRANSFER SHEET (IOB TO OTHERS)</h3>
        <div style={styles.badge}>IOB to Others</div>
      </div>
      
      {/* Show entries & Search */}
      <div style={styles.controlsHeader}>
        <div style={styles.showEntries}>
          Show 
          <select 
            style={styles.entriesSelect}
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          entries
        </div>
        
        <div style={styles.searchBox}>
          <span style={{color: '#64748b'}}>Search:</span>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{backgroundColor: '#f8f9fa'}}>
              <th style={styles.th}>Ifsc</th>
              <th style={styles.th}>Fix</th>
              <th style={styles.th}>Account No</th>
              <th style={styles.th}>Account Holder Name</th>
              <th style={styles.th}>Remarks</th>
              <th style={styles.th}>Summary</th>
              <th style={styles.th}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((item) => (
              <tr key={item.id} style={styles.tr}>
                <td style={styles.td}>{item.ifsc}</td>
                <td style={styles.td}>{iobFixValue}</td>
                <td style={styles.td}>{item.accountNo}</td>
                <td style={styles.td}>{item.accountHolderName}</td>
                <td style={styles.td}>{item.name} {iobOthersRemarks} {selectedMonth}</td>
                <td style={styles.td}>{iobOthersSummary}</td>
                <td style={{...styles.td, ...styles.amountCell}}>{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={styles.tableFooter}>
        <div style={styles.showingInfo}>
          Showing {filteredData.length > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, filteredData.length)} of {filteredData.length} entries
        </div>
        
        <div style={styles.pagination}>
          <button 
            style={styles.pageButton}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FaChevronLeft /> Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              style={{
                ...styles.pageNumberButton,
                ...(currentPage === index + 1 ? styles.pageNumberActive : {})
              }}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          
          <button 
            style={styles.pageButton}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );

  // ==================== IDFC FORMAT ====================
  const IDFC_Format = () => (
    <div style={styles.formatCard}>
      <div style={{...styles.formatHeader, backgroundColor: banks[1].lightColor, borderLeft: `5px solid ${banks[1].color}`}}>
        <h3 style={styles.formatTitle}>🏛️ SALARY TRANSFER SHEET – IDFC BANK FORMAT</h3>
        <div style={styles.badge}>NEFT/RTGS/IFT</div>
      </div>
      
      {/* Field Guide */}
      <div style={styles.fieldGuide}>
        <div style={styles.fieldGuideHeader}>
          <MdInfo style={styles.infoIcon} />
          <span style={styles.fieldGuideTitle}>FIELD GUIDE - MANDATORY FIELDS</span>
        </div>
        <div style={styles.fieldGuideGrid}>
          <div style={styles.fieldGuideRow}>
            <div style={styles.fieldGuideItem}>
              <span style={styles.fieldLabel}>Beneficiary Name</span>
              <span style={styles.fieldDesc}>Enter Beneficiary name. MANDATORY</span>
            </div>
            <div style={styles.fieldGuideItem}>
              <span style={styles.fieldLabel}>Beneficiary Account Number</span>
              <span style={styles.fieldDesc}>Enter Beneficiary account number. IDFC or Other bank. MANDATORY</span>
            </div>
          </div>
          <div style={styles.fieldGuideRow}>
            <div style={styles.fieldGuideItem}>
              <span style={styles.fieldLabel}>IFSC</span>
              <span style={styles.fieldDesc}>Enter beneficiary bank IFSC code. Required for NEFT/RTGS</span>
            </div>
            <div style={styles.fieldGuideItem}>
              <span style={styles.fieldLabel}>Transaction Type</span>
              <span style={styles.fieldDesc}>IFT- Within Bank, NEFT- Inter-Bank, RTGS- Inter-Bank(RTGS). MANDATORY</span>
            </div>
          </div>
          <div style={styles.fieldGuideRow}>
            <div style={styles.fieldGuideItem}>
              <span style={styles.fieldLabel}>Debit Account No.</span>
              <span style={styles.fieldDesc}>Enter Debit account number. IDFC Bank account number. MANDATORY</span>
            </div>
            <div style={styles.fieldGuideItem}>
              <span style={styles.fieldLabel}>Transaction Date</span>
              <span style={styles.fieldDesc}>Enter value date. DD/MM/YYYY format. MANDATORY</span>
            </div>
          </div>
          <div style={styles.fieldGuideRow}>
            <div style={styles.fieldGuideItem}>
              <span style={styles.fieldLabel}>Amount</span>
              <span style={styles.fieldDesc}>Enter Payment Amount. MANDATORY</span>
            </div>
            <div style={styles.fieldGuideItem}>
              <span style={styles.fieldLabel}>Currency</span>
              <span style={styles.fieldDesc}>Enter Transaction currency. INR only. MANDATORY</span>
            </div>
          </div>
          <div style={styles.fieldGuideRow}>
            <div style={styles.fieldGuideItem}>
              <span style={styles.fieldLabel}>Beneficiary Email ID</span>
              <span style={styles.fieldDesc}>Enter beneficiary email id. OPTIONAL</span>
            </div>
            <div style={styles.fieldGuideItem}>
              <span style={styles.fieldLabel}>Remarks</span>
              <span style={styles.fieldDesc}>Enter Remarks. OPTIONAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Show entries & Search */}
      <div style={styles.controlsHeader}>
        <div style={styles.showEntries}>
          Show 
          <select 
            style={styles.entriesSelect}
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          entries
        </div>
        
        <div style={styles.searchBox}>
          <span style={{color: '#64748b'}}>Search:</span>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{backgroundColor: '#f8f9fa'}}>
              <th style={styles.th}>Beneficiary Name</th>
              <th style={styles.th}>Beneficiary Account Number</th>
              <th style={styles.th}>IFSC</th>
              <th style={styles.th}>Transaction Type</th>
              <th style={styles.th}>Debit Account No.</th>
              <th style={styles.th}>Transaction Date</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Currency</th>
              <th style={styles.th}>Beneficiary Email ID</th>
              <th style={styles.th}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((item) => (
              <tr key={item.id} style={styles.tr}>
                <td style={styles.td}><strong>{item.name}</strong></td>
                <td style={styles.td}>{item.accountNo}</td>
                <td style={styles.td}>{item.ifsc}</td>
                <td style={styles.td}>{idfcTxType}</td>
                <td style={styles.td}>{idfcDebitAccount}</td>
                <td style={styles.td}>{item.txDate}</td>
                <td style={{...styles.td, ...styles.amountCell}}>{item.amount}.00</td>
                <td style={styles.td}>INR</td>
                <td style={styles.td}>{item.email}</td>
                <td style={styles.td}>{idfcRemarks} {selectedMonth.toUpperCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={styles.tableFooter}>
        <div style={styles.showingInfo}>
          Showing {filteredData.length > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, filteredData.length)} of {filteredData.length} entries
        </div>
        
        <div style={styles.pagination}>
          <button 
            style={styles.pageButton}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FaChevronLeft /> Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              style={{
                ...styles.pageNumberButton,
                ...(currentPage === index + 1 ? styles.pageNumberActive : {})
              }}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          
          <button 
            style={styles.pageButton}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );

  // ==================== HDFC FORMAT ====================
  const HDFC_Format = () => (
    <div style={styles.formatCard}>
      <div style={{...styles.formatHeader, backgroundColor: banks[3].lightColor, borderLeft: `5px solid ${banks[3].color}`}}>
        <h3 style={styles.formatTitle}>🏣 HDFC BANK - SALARY TRANSFER SHEET</h3>
        <div style={styles.badge}>NEFT/RTGS</div>
      </div>
      
      <div style={styles.controlsHeader}>
        <div style={styles.showEntries}>
          Show <select style={styles.entriesSelect}><option>10</option></select> entries
        </div>
        <div style={styles.searchBox}>
          <span style={{color: '#64748b'}}>Search:</span>
          <input type="text" style={styles.searchInput} placeholder="Search..." />
        </div>
      </div>
      
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{backgroundColor: '#f8f9fa'}}>
              <th style={styles.th}>Beneficiary Name</th>
              <th style={styles.th}>Account Number</th>
              <th style={styles.th}>IFSC Code</th>
              <th style={styles.th}>Transfer Type</th>
              <th style={styles.th}>Debit A/c</th>
              <th style={styles.th}>Value Date</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Narration</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((item) => (
              <tr key={item.id} style={styles.tr}>
                <td style={styles.td}>{item.name}</td>
                <td style={styles.td}>{item.accountNo}</td>
                <td style={styles.td}>{item.ifsc}</td>
                <td style={styles.td}>{hdfcTxType}</td>
                <td style={styles.td}>{hdfcDebitAccount}</td>
                <td style={styles.td}>{item.txDate}</td>
                <td style={{...styles.td, ...styles.amountCell}}>{item.amount}.00</td>
                <td style={styles.td}>{item.email}</td>
                <td style={styles.td}>{hdfcNarration} {selectedMonth} {selectedYear}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ==================== AXIS FORMAT ====================
  const AXIS_Format = () => (
    <div style={styles.formatCard}>
      <div style={{...styles.formatHeader, backgroundColor: banks[4].lightColor, borderLeft: `5px solid ${banks[4].color}`}}>
        <h3 style={styles.formatTitle}>🏦 AXIS BANK - EMPLOYEE SALARY</h3>
        <div style={styles.badge}>Employee ID Based</div>
      </div>
      
      <div style={styles.controlsHeader}>
        <div style={styles.showEntries}>
          Show <select style={styles.entriesSelect}><option>10</option></select> entries
        </div>
        <div style={styles.searchBox}>
          <span style={{color: '#64748b'}}>Search:</span>
          <input type="text" style={styles.searchInput} placeholder="Search..." />
        </div>
      </div>
      
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{backgroundColor: '#f8f9fa'}}>
              <th style={styles.th}>Employee ID</th>
              <th style={styles.th}>Employee Name</th>
              <th style={styles.th}>Account Number</th>
              <th style={styles.th}>IFSC Code</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Purpose</th>
              <th style={styles.th}>Department</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((item) => (
              <tr key={item.id} style={styles.tr}>
                <td style={styles.td}>{item.empId}</td>
                <td style={styles.td}>{item.name}</td>
                <td style={styles.td}>{item.accountNo}</td>
                <td style={styles.td}>{item.ifsc}</td>
                <td style={{...styles.td, ...styles.amountCell}}>{item.amount}</td>
                <td style={styles.td}>{axisPurpose} - {selectedMonth}</td>
                <td style={styles.td}>{axisDepartment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ==================== SBI FORMAT ====================
  const SBI_Format = () => (
    <div style={styles.formatCard}>
      <div style={{...styles.formatHeader, backgroundColor: banks[5].lightColor, borderLeft: `5px solid ${banks[5].color}`}}>
        <h3 style={styles.formatTitle}>🏛️ SBI BANK - SALARY PAYMENT</h3>
        <div style={styles.badge}>Simple Format</div>
      </div>
      
      <div style={styles.controlsHeader}>
        <div style={styles.showEntries}>
          Show <select style={styles.entriesSelect}><option>10</option></select> entries
        </div>
        <div style={styles.searchBox}>
          <span style={{color: '#64748b'}}>Search:</span>
          <input type="text" style={styles.searchInput} placeholder="Search..." />
        </div>
      </div>
      
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{backgroundColor: '#f8f9fa'}}>
              <th style={styles.th}>S.No</th>
              <th style={styles.th}>Beneficiary Name</th>
              <th style={styles.th}>Account Number</th>
              <th style={styles.th}>IFSC Code</th>
              <th style={styles.th}>Transaction Type</th>
              <th style={styles.th}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((item, index) => (
              <tr key={item.id} style={styles.tr}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{item.name}</td>
                <td style={styles.td}>{item.accountNo}</td>
                <td style={styles.td}>{item.ifsc}</td>
                <td style={styles.td}>{sbiTxType}</td>
                <td style={{...styles.td, ...styles.amountCell}}>{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ==================== KOTAK FORMAT ====================
  const KOTAK_Format = () => (
    <div style={styles.formatCard}>
      <div style={{...styles.formatHeader, backgroundColor: banks[6].lightColor, borderLeft: `5px solid ${banks[6].color}`}}>
        <h3 style={styles.formatTitle}>🏢 KOTAK BANK - BULK SALARY</h3>
        <div style={styles.badge}>Bulk Upload</div>
      </div>
      
      <div style={styles.controlsHeader}>
        <div style={styles.showEntries}>
          Show <select style={styles.entriesSelect}><option>10</option></select> entries
        </div>
        <div style={styles.searchBox}>
          <span style={{color: '#64748b'}}>Search:</span>
          <input type="text" style={styles.searchInput} placeholder="Search..." />
        </div>
      </div>
      
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{backgroundColor: '#f8f9fa'}}>
              <th style={styles.th}>Batch ID</th>
              <th style={styles.th}>Beneficiary Name</th>
              <th style={styles.th}>Account No</th>
              <th style={styles.th}>IFSC</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Payment Type</th>
              <th style={styles.th}>Remitter Name</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((item) => (
              <tr key={item.id} style={styles.tr}>
                <td style={styles.td}>{kotakBatchId}{selectedYear}{selectedMonth.substring(0,3)}</td>
                <td style={styles.td}>{item.name}</td>
                <td style={styles.td}>{item.accountNo}</td>
                <td style={styles.td}>{item.ifsc}</td>
                <td style={{...styles.td, ...styles.amountCell}}>{item.amount}</td>
                <td style={styles.td}>{kotakPaymentType}</td>
                <td style={styles.td}>{kotakRemitter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ==================== YES BANK FORMAT ====================
  const YESBANK_Format = () => (
    <div style={styles.formatCard}>
      <div style={{...styles.formatHeader, backgroundColor: banks[7].lightColor, borderLeft: `5px solid ${banks[7].color}`}}>
        <h3 style={styles.formatTitle}>🏣 YES BANK - SALARY TRANSFER</h3>
        <div style={styles.badge}>Corporate Format</div>
      </div>
      
      <div style={styles.controlsHeader}>
        <div style={styles.showEntries}>
          Show <select style={styles.entriesSelect}><option>10</option></select> entries
        </div>
        <div style={styles.searchBox}>
          <span style={{color: '#64748b'}}>Search:</span>
          <input type="text" style={styles.searchInput} placeholder="Search..." />
        </div>
      </div>
      
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{backgroundColor: '#f8f9fa'}}>
              <th style={styles.th}>Sr No</th>
              <th style={styles.th}>Beneficiary</th>
              <th style={styles.th}>Bank Account</th>
              <th style={styles.th}>IFSC</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Credit Narration</th>
              <th style={styles.th}>Debit Narration</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((item, index) => (
              <tr key={item.id} style={styles.tr}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{item.name}</td>
                <td style={styles.td}>{item.accountNo}</td>
                <td style={styles.td}>{item.ifsc}</td>
                <td style={{...styles.td, ...styles.amountCell}}>{item.amount}</td>
                <td style={styles.td}>{yesCreditNarr} - {selectedMonth}</td>
                <td style={styles.td}>{yesDebitNarr} - {selectedMonth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ==================== SETTINGS PANEL ====================
  const SettingsPanel = () => {
    if (!showSettings) return null;
    
    return (
      <div style={styles.settingsOverlay} onClick={() => setShowSettings(false)}>
        <div style={styles.settingsPanel} onClick={(e) => e.stopPropagation()}>
          <div style={styles.settingsHeader}>
            <h3 style={styles.settingsTitle}>
              <FaCog style={{marginRight: '10px'}} />
              {selectedBank?.name} - Format Settings
            </h3>
            <button 
              style={styles.closeButton}
              onClick={() => setShowSettings(false)}
            >
              <MdClose />
            </button>
          </div>
          
          <div style={styles.settingsBody}>
            {/* IOB Settings */}
            {selectedBank?.name === 'IOB' && (
              <div style={styles.settingsSection}>
                <h4 style={styles.settingsSectionTitle}>IOB to IOB Settings</h4>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Summary Text:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={iobSummary}
                    onChange={(e) => setIobSummary(e.target.value)}
                    placeholder="e.g. Salary Month of"
                  />
                </div>
                
                <h4 style={{...styles.settingsSectionTitle, marginTop: '30px'}}>IOB to Others Settings</h4>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Fix Value:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={iobFixValue}
                    onChange={(e) => setIobFixValue(e.target.value)}
                    placeholder="10"
                  />
                </div>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Remarks:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={iobOthersRemarks}
                    onChange={(e) => setIobOthersRemarks(e.target.value)}
                    placeholder="e.g. Salary"
                  />
                </div>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Summary:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={iobOthersSummary}
                    onChange={(e) => setIobOthersSummary(e.target.value)}
                    placeholder="e.g. AMOUNT FOR LOAN"
                  />
                </div>
              </div>
            )}
            
            {/* IDFC Settings */}
            {selectedBank?.name === 'IDFC' && (
              <div style={styles.settingsSection}>
                <h4 style={styles.settingsSectionTitle}>IDFC Transaction Settings</h4>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Transaction Type:</label>
                  <select 
                    style={styles.settingsSelect}
                    value={idfcTxType}
                    onChange={(e) => setIdfcTxType(e.target.value)}
                  >
                    {transactionTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Debit Account:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={idfcDebitAccount}
                    onChange={(e) => setIdfcDebitAccount(e.target.value)}
                    placeholder="Debit Account Number"
                  />
                </div>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Remarks Prefix:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={idfcRemarks}
                    onChange={(e) => setIdfcRemarks(e.target.value)}
                    placeholder="e.g. MONTH OF"
                  />
                </div>
              </div>
            )}
            
            {/* ICICI Settings */}
            {selectedBank?.name === 'ICICI' && (
              <div style={styles.settingsSection}>
                <h4 style={styles.settingsSectionTitle}>ICICI Bank - Complete Format Settings</h4>
                
                <div style={styles.settingsGrid}>
                  <div style={styles.settingsGridItem}>
                    <label style={styles.settingsLabel}>PYMT_PROD_TYPE_CODE:</label>
                    <input 
                      type="text" 
                      style={styles.settingsInput}
                      value="PAB_VENDOR"
                      disabled
                    />
                  </div>
                  
                  <div style={styles.settingsGridItem}>
                    <label style={styles.settingsLabel}>PYMT_MODE:</label>
                    <select 
                      style={styles.settingsSelect}
                      value={iciciPymtMode}
                      onChange={(e) => setIciciPymtMode(e.target.value)}
                    >
                      {paymentModes.map(mode => (
                        <option key={mode} value={mode}>{mode}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={styles.settingsGridItem}>
                    <label style={styles.settingsLabel}>DEBIT_ACC_NO:</label>
                    <input 
                      type="text" 
                      style={styles.settingsInput}
                      value={iciciDebitAcc}
                      onChange={(e) => setIciciDebitAcc(e.target.value)}
                      placeholder="Debit Account Number"
                    />
                  </div>
                  
                  <div style={styles.settingsGridItem}>
                    <label style={styles.settingsLabel}>DEBIT_NARR:</label>
                    <input 
                      type="text" 
                      style={styles.settingsInput}
                      value={iciciDebitNarr}
                      onChange={(e) => setIciciDebitNarr(e.target.value)}
                      placeholder="e.g. SALARY"
                    />
                  </div>
                  
                  <div style={styles.settingsGridItem}>
                    <label style={styles.settingsLabel}>CREDIT_NARR:</label>
                    <input 
                      type="text" 
                      style={styles.settingsInput}
                      value={iciciCreditNarr}
                      onChange={(e) => setIciciCreditNarr(e.target.value)}
                      placeholder="e.g. SALARY"
                    />
                  </div>
                  
                  <div style={styles.settingsGridItem}>
                    <label style={styles.settingsLabel}>REMARK:</label>
                    <input 
                      type="text" 
                      style={styles.settingsInput}
                      value={iciciRemark}
                      onChange={(e) => setIciciRemark(e.target.value)}
                      placeholder="e.g. MONTH OF"
                    />
                  </div>
                  
                  <div style={styles.settingsGridItem}>
                    <label style={styles.settingsLabel}>REF_NO:</label>
                    <input 
                      type="text" 
                      style={styles.settingsInput}
                      value={iciciRefNo}
                      onChange={(e) => setIciciRefNo(e.target.value)}
                      placeholder="Reference Number (Optional)"
                    />
                  </div>
                </div>
                
                <h4 style={{...styles.settingsSectionTitle, marginTop: '30px'}}>Additional Information (ADDL_INFO1 to ADDL_INFO5)</h4>
                <div style={styles.settingsGrid}>
                  <div style={styles.settingsGridItem}>
                    <label style={styles.settingsLabel}>ADDL_INFO1:</label>
                    <input 
                      type="text" 
                      style={styles.settingsInput}
                      value={iciciAddlInfo1}
                      onChange={(e) => setIciciAddlInfo1(e.target.value)}
                      placeholder="Additional Info 1"
                    />
                  </div>
                  <div style={styles.settingsGridItem}>
                    <label style={styles.settingsLabel}>ADDL_INFO2:</label>
                    <input 
                      type="text" 
                      style={styles.settingsInput}
                      value={iciciAddlInfo2}
                      onChange={(e) => setIciciAddlInfo2(e.target.value)}
                      placeholder="Additional Info 2"
                    />
                  </div>
                  <div style={styles.settingsGridItem}>
                    <label style={styles.settingsLabel}>ADDL_INFO3:</label>
                    <input 
                      type="text" 
                      style={styles.settingsInput}
                      value={iciciAddlInfo3}
                      onChange={(e) => setIciciAddlInfo3(e.target.value)}
                      placeholder="Additional Info 3"
                    />
                  </div>
                  <div style={styles.settingsGridItem}>
                    <label style={styles.settingsLabel}>ADDL_INFO4:</label>
                    <input 
                      type="text" 
                      style={styles.settingsInput}
                      value={iciciAddlInfo4}
                      onChange={(e) => setIciciAddlInfo4(e.target.value)}
                      placeholder="Additional Info 4"
                    />
                  </div>
                  <div style={styles.settingsGridItem}>
                    <label style={styles.settingsLabel}>ADDL_INFO5:</label>
                    <input 
                      type="text" 
                      style={styles.settingsInput}
                      value={iciciAddlInfo5}
                      onChange={(e) => setIciciAddlInfo5(e.target.value)}
                      placeholder="Additional Info 5"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* HDFC Settings */}
            {selectedBank?.name === 'HDFC' && (
              <div style={styles.settingsSection}>
                <h4 style={styles.settingsSectionTitle}>HDFC Transaction Settings</h4>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Transfer Type:</label>
                  <select 
                    style={styles.settingsSelect}
                    value={hdfcTxType}
                    onChange={(e) => setHdfcTxType(e.target.value)}
                  >
                    <option value="NEFT">NEFT</option>
                    <option value="RTGS">RTGS</option>
                    <option value="IMPS">IMPS</option>
                  </select>
                </div>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Debit Account:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={hdfcDebitAccount}
                    onChange={(e) => setHdfcDebitAccount(e.target.value)}
                  />
                </div>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Narration:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={hdfcNarration}
                    onChange={(e) => setHdfcNarration(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {/* AXIS Settings */}
            {selectedBank?.name === 'AXIS' && (
              <div style={styles.settingsSection}>
                <h4 style={styles.settingsSectionTitle}>AXIS Settings</h4>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Department:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={axisDepartment}
                    onChange={(e) => setAxisDepartment(e.target.value)}
                  />
                </div>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Purpose:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={axisPurpose}
                    onChange={(e) => setAxisPurpose(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {/* SBI Settings */}
            {selectedBank?.name === 'SBI' && (
              <div style={styles.settingsSection}>
                <h4 style={styles.settingsSectionTitle}>SBI Settings</h4>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Transaction Type:</label>
                  <select 
                    style={styles.settingsSelect}
                    value={sbiTxType}
                    onChange={(e) => setSbiTxType(e.target.value)}
                  >
                    <option value="NEFT">NEFT</option>
                    <option value="RTGS">RTGS</option>
                  </select>
                </div>
              </div>
            )}
            
            {/* KOTAK Settings */}
            {selectedBank?.name === 'KOTAK' && (
              <div style={styles.settingsSection}>
                <h4 style={styles.settingsSectionTitle}>KOTAK Settings</h4>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Batch ID Prefix:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={kotakBatchId}
                    onChange={(e) => setKotakBatchId(e.target.value)}
                  />
                </div>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Payment Type:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={kotakPaymentType}
                    onChange={(e) => setKotakPaymentType(e.target.value)}
                  />
                </div>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Remitter Name:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={kotakRemitter}
                    onChange={(e) => setKotakRemitter(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {/* YES BANK Settings */}
            {selectedBank?.name === 'YES BANK' && (
              <div style={styles.settingsSection}>
                <h4 style={styles.settingsSectionTitle}>YES BANK Settings</h4>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Credit Narration:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={yesCreditNarr}
                    onChange={(e) => setYesCreditNarr(e.target.value)}
                  />
                </div>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Debit Narration:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={yesDebitNarr}
                    onChange={(e) => setYesDebitNarr(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div style={styles.settingsFooter}>
            <button 
              style={styles.settingsButton}
              onClick={() => setShowSettings(false)}
            >
              Save & Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==================== SUMMARY EDITOR MODAL ====================
  const SummaryEditorModal = () => {
    if (!showSummaryEditor) return null;
    
    return (
      <div style={styles.modalOverlay} onClick={() => setShowSummaryEditor(false)}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>
              <FaEdit style={{marginRight: '10px'}} />
              Edit {editingFormat} Format
            </h3>
            <button 
              style={styles.closeButton}
              onClick={() => setShowSummaryEditor(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div style={styles.pickerContainer}>
            {editingFormat === 'IOB to IOB' && (
              <div style={styles.settingsSection}>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Summary Text:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={tempSummary}
                    onChange={(e) => setTempSummary(e.target.value)}
                    placeholder="e.g. Salary Month of"
                  />
                </div>
                <p style={{color: '#64748b', fontSize: '0.9rem', marginTop: '10px'}}>
                  Preview: Akashy Kumar {tempSummary} {selectedMonth}
                </p>
              </div>
            )}

            {editingFormat === 'IOB to Others' && (
              <div style={styles.settingsSection}>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Fix Value:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={tempFixValue}
                    onChange={(e) => setTempFixValue(e.target.value)}
                    placeholder="10"
                  />
                </div>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Remarks:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={tempRemarks}
                    onChange={(e) => setTempRemarks(e.target.value)}
                    placeholder="e.g. Salary"
                  />
                </div>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Summary:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={tempSummary}
                    onChange={(e) => setTempSummary(e.target.value)}
                    placeholder="e.g. AMOUNT FOR LOAN"
                  />
                </div>
                <p style={{color: '#64748b', fontSize: '0.9rem', marginTop: '10px'}}>
                  Preview: SBIN0004574, {tempFixValue || '10'}, 789689678967896, Akashy Kumar, Akashy Kumar - {tempRemarks || 'Salary'} {selectedMonth}, {tempSummary || 'AMOUNT FOR LOAN'}, 13492
                </p>
              </div>
            )}

            {editingFormat === 'IDFC' && (
              <div style={styles.settingsSection}>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>Remarks Prefix:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={tempSummary}
                    onChange={(e) => setTempSummary(e.target.value)}
                    placeholder="e.g. MONTH OF"
                  />
                </div>
                <p style={{color: '#64748b', fontSize: '0.9rem', marginTop: '10px'}}>
                  Preview: {tempSummary || 'MONTH OF'} {selectedMonth.toUpperCase()}
                </p>
              </div>
            )}

            {editingFormat === 'ICICI' && (
              <div style={styles.settingsSection}>
                <div style={styles.settingsRow}>
                  <label style={styles.settingsLabel}>REMARK:</label>
                  <input 
                    type="text" 
                    style={styles.settingsInput}
                    value={tempSummary}
                    onChange={(e) => setTempSummary(e.target.value)}
                    placeholder="e.g. MONTH OF"
                  />
                </div>
                <p style={{color: '#64748b', fontSize: '0.9rem', marginTop: '10px'}}>
                  Preview: {tempSummary || 'MONTH OF'} {selectedMonth.toUpperCase()}
                </p>
              </div>
            )}

            <div style={{display: 'flex', gap: '15px', marginTop: '30px'}}>
              <button
                style={{
                  ...styles.actionButton,
                  flex: 1,
                  backgroundColor: '#e2e8f0',
                  color: '#1e293b',
                  boxShadow: 'none'
                }}
                onClick={() => setShowSummaryEditor(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  ...styles.actionButton,
                  flex: 1,
                  backgroundColor: '#059669'
                }}
                onClick={saveSummaryChanges}
              >
                <FaSave style={{marginRight: '8px'}} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== MONTH YEAR PICKER - FIXED ====================
  const MonthYearPicker = () => {
    // ✅ IMPORTANT: Agar show nahi hai toh kuch bhi mat dikhao
    if (!showMonthPicker) return null;

    return (
      <div style={styles.modalOverlay} onClick={() => setShowMonthPicker(false)}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>
              📅 {selectedBank?.name || 'Bank'} - Select Month & Year
            </h3>
            <button 
              style={styles.closeButton}
              onClick={() => setShowMonthPicker(false)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <MdClose />
            </button>
          </div>

          <div style={styles.pickerContainer}>
            {/* Month Selection */}
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Select Month</h4>
              <div style={styles.horizontalScroll}>
                {months.map((month) => (
                  <button
                    key={month}
                    style={{
                      ...styles.monthItem,
                      ...(tempMonth === month ? styles.selectedItem : {})
                    }}
                    onClick={() => setTempMonth(month)}
                  >
                    {month.substring(0,3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Year Selection */}
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Select Year</h4>
              <div style={styles.horizontalScroll}>
                {years.map((year) => (
                  <button
                    key={year}
                    style={{
                      ...styles.yearItem,
                      ...(tempYear === year ? styles.selectedItem : {})
                    }}
                    onClick={() => setTempYear(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{display: 'flex', gap: '15px', marginTop: '30px'}}>
              <button
                style={{
                  ...styles.actionButton,
                  flex: 1,
                  backgroundColor: '#e2e8f0',
                  color: '#1e293b',
                  boxShadow: 'none'
                }}
                onClick={() => setShowMonthPicker(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  ...styles.actionButton,
                  flex: 1,
                  backgroundColor: '#0B2F5C'
                }}
                onClick={() => {
                  setSelectedMonth(tempMonth);
                  setSelectedYear(tempYear);
                  setShowMonthPicker(false);
                }}
              >
                Generate Format
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== BANK SELECTION ====================
  const BankSelection = () => (
    <div style={styles.selectionContainer}>
      <h1 style={styles.title}>🏦 Bank Salary Transfer</h1>
      <p style={styles.subtitle}>Select your bank to generate the salary transfer format</p>
      
      <div style={styles.bankGrid}>
        {banks.map((bank) => (
          <button
            key={bank.id}
            style={{
              ...styles.bankCard,
              backgroundColor: bank.color,
              ...(selectedBank?.id === bank.id && styles.selectedBankCard)
            }}
            onClick={() => {
              setSelectedBank(bank);
              setShowMonthPicker(true);
            }}
            onMouseEnter={(e) => {
              if (selectedBank?.id !== bank.id) {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 30px 40px -15px rgba(0,0,0,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedBank?.id !== bank.id) {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.bankCard.boxShadow;
              }
            }}
          >
            <span style={styles.bankIcon}>{bank.icon}</span>
            <span style={styles.bankName}>{bank.name}</span>
            <div style={styles.formatBadgeContainer}>
              {bank.formats.map((format, idx) => (
                <span key={idx} style={styles.formatBadge}>{format}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // ==================== STATEMENT SCREEN ====================
  const StatementScreen = () => (
    <div style={styles.statementContainer}>
      <header style={{
        ...styles.statementHeader,
        background: `linear-gradient(145deg, ${selectedBank.color} 0%, ${selectedBank.color}dd 100%)`
      }}>
        <button 
          style={styles.backButton}
          onClick={() => {
            setSelectedBank(null);
            setSearchTerm('');
            setCurrentPage(1);
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        >
          <FaArrowLeft />
        </button>
        
        <div style={styles.headerContent}>
          <h1 style={styles.bankTitle}>{selectedBank.name} BANK</h1>
          <p style={styles.statementPeriod}>
            {selectedMonth} {selectedYear} - Salary Transfer Format
          </p>
        </div>
      </header>

      <main style={styles.statementContent}>
        {/* Summary Cards */}
        <div style={styles.summaryRow}>
          <div style={styles.summaryCard}>
            <FaUsers style={styles.summaryIcon} />
            <div>
              <p style={styles.summaryLabel}>Total Employees</p>
              <p style={styles.summaryValue}>{filteredData.length}</p>
            </div>
          </div>
          
          <div style={styles.summaryCard}>
            <FaRupeeSign style={styles.summaryIcon} />
            <div>
              <p style={styles.summaryLabel}>Total Amount</p>
              <p style={styles.summaryValue}>
                ₹{filteredData.reduce((sum, emp) => sum + emp.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div style={styles.summaryCard}>
            <BiTransfer style={styles.summaryIcon} />
            <div>
              <p style={styles.summaryLabel}>Transactions</p>
              <p style={styles.summaryValue}>{filteredData.length}</p>
            </div>
          </div>
        </div>

        {/* Bank Specific Formats */}
        <div style={styles.formatsSection}>
          {renderBankFormats()}
        </div>

        {/* Action Buttons */}
        {!loading && filteredData.length > 0 && (
          <div style={styles.statementActions}>
            {/* Dynamic Summary Editor Button */}
            <button 
              style={styles.editButton}
              onClick={() => {
                if (selectedBank?.name === 'IOB') {
                  openSummaryEditor('IOB to IOB');
                } else if (selectedBank?.name === 'IDFC') {
                  openSummaryEditor('IDFC');
                } else if (selectedBank?.name === 'ICICI') {
                  openSummaryEditor('ICICI');
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0369a1';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0284c7';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <FaEdit style={{marginRight: '8px'}} />
              Edit Summary/Remarks
            </button>

            {/* Settings Button */}
            <button 
              style={styles.settingsButton}
              onClick={() => setShowSettings(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#5a4a7a';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6B5B95';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <FaCog style={{marginRight: '8px'}} />
              Advanced Settings
            </button>

            {selectedBank?.name === 'IOB' && (
              <>
                <button 
                  style={styles.actionButton}
                  onClick={() => downloadExcel('IOB to IOB')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1a4f8c';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#0B2F5C';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <FaFileExcel />
                  IOB to IOB Excel
                </button>
                <button 
                  style={styles.actionButton}
                  onClick={() => downloadExcel('IOB to Others')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1a4f8c';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#0B2F5C';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <FaFileExcel />
                  IOB to Others Excel
                </button>
                <button 
                  style={styles.actionButton}
                  onClick={() => downloadTXT('IOB to IOB')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1a4f8c';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#0B2F5C';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <FaFileAlt />
                  IOB to IOB TXT
                </button>
                <button 
                  style={styles.actionButton}
                  onClick={() => downloadTXT('IOB to Others')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1a4f8c';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#0B2F5C';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <FaFileAlt />
                  IOB to Others TXT
                </button>
              </>
            )}
            
            {selectedBank?.name !== 'IOB' && (
              <button 
                style={styles.actionButton}
                onClick={() => downloadExcel(selectedBank?.name)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1a4f8c';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0B2F5C';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <FaFileExcel />
                Download Excel
              </button>
            )}
            
            <button 
              style={styles.actionButton}
              onClick={() => setShowMonthPicker(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1a4f8c';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0B2F5C';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <MdDateRange />
              Change Period
            </button>
          </div>
        )}
      </main>
      
      {/* Settings Panel */}
      <SettingsPanel />
      
      {/* Summary Editor Modal */}
      <SummaryEditorModal />
    </div>
  );

  // Render selected bank's formats
  const renderBankFormats = () => {
    if (loading) {
      return (
        <div style={styles.loadingContainer}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{marginTop: '15px', color: '#666'}}>Loading salary data...</p>
        </div>
      );
    }

    switch(selectedBank?.name) {
      case 'IOB':
        return (
          <>
            <IOB_to_IOB_Format />
            <div style={styles.formatSeparator} />
            <IOB_to_Others_Format />
          </>
        );
      case 'IDFC':
        return <IDFC_Format />;
      case 'ICICI':
        return <ICICI_Format />;
      case 'HDFC':
        return <HDFC_Format />;
      case 'AXIS':
        return <AXIS_Format />;
      case 'SBI':
        return <SBI_Format />;
      case 'KOTAK':
        return <KOTAK_Format />;
      case 'YES BANK':
        return <YESBANK_Format />;
      default:
        return null;
    }
  };

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #0B2F5C 0%, #1B4F8C 100%)',
      padding: '30px',
      fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif"
    },
    selectionContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px'
    },
    title: {
      fontSize: '3.2rem',
      fontWeight: 800,
      color: 'white',
      marginBottom: '15px',
      textShadow: '0 4px 12px rgba(0,0,0,0.2)',
      letterSpacing: '-0.02em'
    },
    subtitle: {
      fontSize: '1.3rem',
      color: 'rgba(255,255,255,0.9)',
      marginBottom: '50px',
      fontWeight: 400
    },
    bankGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '25px',
      marginTop: '30px'
    },
    bankCard: {
      position: 'relative',
      padding: '12px 8px',
      borderRadius: '24px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      color: 'white',
      fontSize: '1.6rem',
      fontWeight: 700,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: '0 20px 30px -10px rgba(0,0,0,0.3)',
      // minHeight: '240px',
      overflow: 'hidden',
      border: '2px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)'
    },
    selectedBankCard: {
      transform: 'scale(1.03)',
      border: '3px solid white',
      boxShadow: '0 0 30px rgba(255,255,255,0.4)'
    },
    bankName: {
      fontSize: '2rem',
      fontWeight: 800,
      zIndex: 1
    },
    bankIcon: {
      fontSize: '3.5rem',
      zIndex: 1
    },
    formatBadgeContainer: {
      display: 'flex',
      gap: '8px',
      marginTop: '10px',
      flexWrap: 'wrap',
      justifyContent: 'center',
      zIndex: 1
    },
    formatBadge: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      padding: '6px 14px',
      borderRadius: '30px',
      fontSize: '0.8rem',
      fontWeight: 500,
      color: 'white',
      border: '1px solid rgba(255,255,255,0.3)'
    },
    statementContainer: {
      maxWidth: '1600px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '32px',
      overflow: 'hidden',
      boxShadow: '0 30px 60px -20px rgba(0,0,0,0.3)'
    },
    statementHeader: {
      padding: '40px',
      color: 'white',
      position: 'relative'
    },
    backButton: {
      position: 'absolute',
      top: '30px',
      left: '30px',
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      color: 'white',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '1.3rem',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.3)'
    },
    headerContent: {
      textAlign: 'center',
      marginTop: '20px'
    },
    bankTitle: {
      fontSize: '2.8rem',
      fontWeight: 'bold',
      margin: '0 0 10px 0',
      textShadow: '0 2px 8px rgba(0,0,0,0.2)'
    },
    statementPeriod: {
      fontSize: '1.3rem',
      opacity: 0.95,
      margin: '10px 0 20px 0',
      fontWeight: 500
    },
    statementContent: {
      padding: '40px'
    },
    summaryRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '25px',
      marginBottom: '40px'
    },
    summaryCard: {
      backgroundColor: '#ffffff',
      padding: '25px',
      borderRadius: '20px',
      boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      border: '1px solid #edf2f7'
    },
    summaryIcon: {
      fontSize: '2.5rem',
      color: '#4A90E2'
    },
    summaryLabel: {
      fontSize: '0.9rem',
      color: '#64748b',
      margin: '0 0 8px 0',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    summaryValue: {
      fontSize: '1.9rem',
      fontWeight: 'bold',
      color: '#1e293b',
      margin: 0,
      lineHeight: 1.2
    },
    formatsSection: {
      backgroundColor: '#fafcff',
      borderRadius: '24px',
      padding: '30px',
      border: '1px solid #e6edf4'
    },
    formatCard: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '25px',
      marginBottom: '25px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.03)',
      border: '1px solid #f0f4f8'
    },
    formatHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
      padding: '15px 20px',
      borderRadius: '16px',
      backgroundColor: '#f8fafc'
    },
    formatTitle: {
      fontSize: '1.3rem',
      fontWeight: 700,
      color: '#0b2f5c',
      margin: 0
    },
    badge: {
      backgroundColor: '#4A90E2',
      color: 'white',
      padding: '6px 16px',
      borderRadius: '30px',
      fontSize: '0.85rem',
      fontWeight: 600
    },
    fieldGuide: {
      backgroundColor: '#f8fafc',
      padding: '20px',
      borderRadius: '16px',
      marginBottom: '25px',
      border: '1px dashed #cbd5e1'
    },
    fieldGuideHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '15px'
    },
    infoIcon: {
      color: '#6B5B95',
      fontSize: '1.2rem'
    },
    fieldGuideTitle: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#475569'
    },
    fieldGuideGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    fieldGuideRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
    },
    fieldGuideItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      padding: '12px 16px',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #eef2f6'
    },
    fieldLabel: {
      fontSize: '0.9rem',
      fontWeight: 700,
      color: '#6B5B95'
    },
    fieldDesc: {
      fontSize: '0.85rem',
      color: '#64748b',
      lineHeight: 1.5
    },
    tableWrapper: {
      overflowX: 'auto',
      marginBottom: '20px',
      borderRadius: '12px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '0.9rem',
      borderRadius: '12px',
      overflow: 'hidden'
    },
    th: {
      padding: '16px 12px',
      textAlign: 'left',
      fontWeight: 600,
      color: '#1e293b',
      fontSize: '0.85rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: '2px solid #e2e8f0',
      backgroundColor: '#f8fafc',
      whiteSpace: 'nowrap'
    },
    td: {
      padding: '14px 12px',
      color: '#1e293b',
      borderBottom: '1px solid #edf2f7',
      whiteSpace: 'nowrap'
    },
    amountCell: {
      fontWeight: 700,
      color: '#059669',
      fontFamily: 'monospace'
    },
    tr: {
      transition: 'background-color 0.2s ease',
      ':hover': {
        backgroundColor: '#fafafa'
      }
    },
    formatSeparator: {
      height: '2px',
      background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)',
      margin: '35px 0'
    },
    statementActions: {
      display: 'flex',
      gap: '15px',
      marginTop: '30px',
      justifyContent: 'flex-end',
      flexWrap: 'wrap'
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      backgroundColor: '#0B2F5C',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: 600,
      transition: 'all 0.2s ease',
      minWidth: '160px'
    },
    settingsButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      backgroundColor: '#6B5B95',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: 600,
      transition: 'all 0.2s ease'
    },
    editButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      backgroundColor: '#0284c7',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: 600,
      transition: 'all 0.2s ease'
    },
    controlsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '15px'
    },
    showEntries: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.95rem',
      color: '#475569'
    },
    entriesSelect: {
      padding: '6px 12px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      backgroundColor: 'white',
      fontSize: '0.95rem',
      margin: '0 5px',
      cursor: 'pointer'
    },
    searchBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    searchInput: {
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: '0.95rem',
      width: '250px',
      outline: 'none'
    },
    tableFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: '1px solid #e2e8f0',
      flexWrap: 'wrap',
      gap: '15px'
    },
    showingInfo: {
      fontSize: '0.95rem',
      color: '#475569'
    },
    pagination: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    pageButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      border: '1px solid #e2e8f0',
      backgroundColor: 'white',
      borderRadius: '8px',
      fontSize: '0.9rem',
      color: '#475569',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      ':disabled': {
        opacity: 0.5,
        cursor: 'not-allowed'
      }
    },
    pageNumberButton: {
      padding: '8px 14px',
      border: '1px solid #e2e8f0',
      backgroundColor: 'white',
      borderRadius: '8px',
      fontSize: '0.9rem',
      color: '#475569',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    pageNumberActive: {
      backgroundColor: '#0B2F5C',
      color: 'white',
      borderColor: '#0B2F5C'
    },
    settingsOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(5px)'
    },
    settingsPanel: {
      width: '90%',
      maxWidth: '800px',
      maxHeight: '80vh',
      backgroundColor: 'white',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 30px 60px rgba(0,0,0,0.3)'
    },
    settingsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 25px',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0'
    },
    settingsTitle: {
      fontSize: '1.3rem',
      fontWeight: 700,
      color: '#0b2f5c',
      margin: 0,
      display: 'flex',
      alignItems: 'center'
    },
    settingsBody: {
      padding: '25px',
      overflowY: 'auto',
      maxHeight: 'calc(80vh - 140px)'
    },
    settingsSection: {
      marginBottom: '20px'
    },
    settingsSectionTitle: {
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#1e293b',
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: '2px solid #e2e8f0'
    },
    settingsRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
      gap: '15px'
    },
    settingsLabel: {
      minWidth: '150px',
      fontSize: '0.95rem',
      fontWeight: 600,
      color: '#475569'
    },
    settingsInput: {
      flex: 1,
      padding: '10px 15px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: '0.95rem',
      outline: 'none',
      transition: 'all 0.2s ease',
      ':focus': {
        borderColor: '#0B2F5C',
        boxShadow: '0 0 0 3px rgba(11,47,92,0.1)'
      }
    },
    settingsSelect: {
      flex: 1,
      padding: '10px 15px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: '0.95rem',
      backgroundColor: 'white',
      cursor: 'pointer',
      outline: 'none'
    },
    settingsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '15px',
      marginBottom: '20px'
    },
    settingsGridItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    },
    settingsFooter: {
      padding: '20px 25px',
      backgroundColor: '#f8fafc',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'flex-end'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      color: '#64748b',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      transition: 'all 0.2s ease'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px',
      backgroundColor: 'white',
      borderRadius: '20px'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2500,
      backdropFilter: 'blur(5px)'
    },
    modalContent: {
      width: '90%',
      maxWidth: '600px',
      backgroundColor: 'white',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 30px 60px rgba(0,0,0,0.3)'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 25px',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0'
    },
    modalTitle: {
      fontSize: '1.2rem',
      fontWeight: 700,
      color: '#0b2f5c',
      margin: 0,
      display: 'flex',
      alignItems: 'center'
    },
    pickerContainer: {
      padding: '25px'
    },
    section: {
      marginBottom: '25px'
    },
    sectionTitle: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#1e293b',
      marginBottom: '15px'
    },
    horizontalScroll: {
      display: 'flex',
      overflowX: 'auto',
      gap: '12px',
      padding: '5px 0',
      scrollbarWidth: 'thin'
    },
    monthItem: {
      flexShrink: 0,
      padding: '12px 24px',
      backgroundColor: '#f1f5f9',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minWidth: '90px',
      textAlign: 'center',
      fontSize: '0.95rem',
      fontWeight: 500
    },
    yearItem: {
      flexShrink: 0,
      padding: '12px 28px',
      backgroundColor: '#f1f5f9',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minWidth: '90px',
      textAlign: 'center',
      fontSize: '0.95rem',
      fontWeight: 500
    },
    selectedItem: {
      backgroundColor: '#0B2F5C',
      color: 'white'
    }
  };

  return (
    <div style={styles.container}>
      {!selectedBank ? <BankSelection /> : <StatementScreen />}
      {/* Modals */}
      <MonthYearPicker />
      <SettingsPanel />
      <SummaryEditorModal />
    </div>
  );
};

export default BankSalaryTransferFormats;
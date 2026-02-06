'use client'
import React, { useState, memo, useEffect, useMemo } from 'react'
import Table from '@/components/shared/table/Table'
import * as XLSX from 'xlsx'

/* ---------- TABLE CELL ---------- */
const DaysCell = memo(({ attendance }) => {
  console.log('DaysCell attendance:', attendance);
  
  // Calculate total days from attendance array
  if (!attendance || !Array.isArray(attendance) || attendance.length === 0) {
    return <span className="text-muted">N/A</span>;
  }

  // Get the latest attendance record (usually there's only one per month)
  const latestAttendance = attendance[0];
  console.log('latestAttendance:', latestAttendance);
  
  // Check if total_days exists
  if (latestAttendance.total_days !== undefined) {
    return (
      <div className="d-flex flex-column">
        <span className="fw-bold">{latestAttendance.total_days} days</span>
        <small className="text-muted">Total days</small>
      </div>
    );
  }
  
  // Calculate total present days from day_1 to day_31
  let presentDays = 0;
  let totalCheckedDays = 0;
  
  for (let i = 1; i <= 31; i++) {
    const dayKey = `day_${i}`;
    if (latestAttendance.hasOwnProperty(dayKey)) {
      totalCheckedDays++;
      const dayValue = latestAttendance[dayKey];
      console.log(`${dayKey}: ${dayValue}`);
      
      // Check if present (P or p or 1 or true)
      if (dayValue === 'P' || dayValue === 'p' || dayValue === '1' || dayValue === 1 || dayValue === true) {
        presentDays++;
      }
    }
  }
  
  console.log(`Total checked days: ${totalCheckedDays}, Present: ${presentDays}`);
  
  // If no day columns found
  if (totalCheckedDays === 0) {
    return <span className="text-muted">No Days Data</span>;
  }

  return (
    <div className="d-flex flex-column">
      <span className="fw-bold">{presentDays} days</span>
      <small className="text-muted">Present: {presentDays} / {totalCheckedDays}</small>
    </div>
  );
});

const ExtraHoursCell = memo(({ attendance }) => {
  // Calculate extra hours from attendance array
  if (!attendance || !Array.isArray(attendance) || attendance.length === 0) {
    return <span className="text-muted">N/A</span>;
  }

  // Get the latest attendance record
  const latestAttendance = attendance[0];
  const extraHours = latestAttendance.extra_hr || latestAttendance.extra_hours || 0;

  return (
    <div className="d-flex flex-column align-items-center">
      <span className="fw-bold">{extraHours} hrs</span>
      <small className="text-muted">Extra hours</small>
    </div>
  );
});

/* ---------- MAIN COMPONENT ---------- */
const AttandanceEmployeeUpdateTable = ({
  clientType,
  initialClient,
  initialConsignee,
  month,
  year
}) => {

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------- API CALL ---------- */
  useEffect(() => {
    if (!clientType || !initialClient?.value && !initialConsignee?.value ) return;

    fetchAttendanceData();
  }, [clientType, initialClient, initialConsignee]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        client_type: clientType,
        client_id: initialClient.value,
        // consignee_id: initialConsignee.value,
        month: month,
        year: year
      });
      console.log( "consloe  prams", params)
      const res = await fetch(
        `https://green-owl-255815.hostingersite.com/api/attendance/employees?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const result = await res.json();

      console.log('API result:', result);
      
      // Log first few employees to check data structure
      if (result?.status && Array.isArray(result.data) && result.data.length > 0) {
        console.log('First employee:', result.data[0]);
        if (result.data[0].attendances && result.data[0].attendances.length > 0) {
          console.log('First attendance record:', result.data[0].attendances[0]);
          console.log('Attendance keys:', Object.keys(result.data[0].attendances[0]));
        }
      }

      if (result?.status && Array.isArray(result.data)) {
        setTableData(result.data);
      } else {
        setTableData([]);
      }

    } catch (error) {
      console.error('Attendance API error:', error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- DOWNLOAD EXCEL FORMAT ---------- */
  const downloadAttendanceFormat = () => {
    // Filter employees who DON'T have attendance records
    const employeesWithoutAttendance = tableData.filter(emp => 
      !emp.attendances || 
      !Array.isArray(emp.attendances) || 
      emp.attendances.length === 0
    );

    if (employeesWithoutAttendance.length === 0) {
      alert('All employees already have attendance records. No sheet to download.');
      return;
    }

    // Create Excel workbook
    const wb = XLSX.utils.book_new();
    
    // Header data matching your format
    const headerRows = [
      ['ALPHA MANPOWER SERVICES PRIVATE LIMITED'],
      ['1/56 D Basment Lalita Park Laxmi Nagar Delhi 110092'],
      ['ATTENDANCE FOR THE MONTH OF …………………………………………………….'],
      ['Central Government Health Scheme (CGHS)                                                           (Center NAME …………………………………………………..'],
      [] // Empty row
    ];

    // Create header for the table
    const tableHeader = [
      'S.No.', 
      'Employee ID', 
      'Name', 
      'Father name', 
      'POST',
      ...Array.from({length: 31}, (_, i) => i + 1), // Days 1-31
      'extra_hr',
      'TOTAL'
    ];

    // Create employee data rows with serial numbers
    const employeeRows = employeesWithoutAttendance.map((emp, index) => {
      const row = [
        index + 1, // Serial number starting from 1
        emp.rand_id || emp.id || 'N/A',
        emp.name || 'N/A',
        emp.Fathername || 'N/A', // Father name - not in your data
        emp.designation || 'N/A'
      ];

      // Add empty cells for 31 days
      for (let i = 1; i <= 31; i++) {
        row.push(''); // Empty for manual entry
      }

      // Add empty total cell
      row.push('');
      
      return row;
    });

    // Footer rows
    const footerRows = [
      [],
      ['Certified that ………………………… No. of Housekeeping Staffs deployed by the Agency'],
      [],
      ['Have performed their duties during the month of ………………………………………………….'],
      [],
      [],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'CMO I/C', '', '']
    ];

    // Combine all data
    const allData = [
      ...headerRows,
      tableHeader,
      ...employeeRows,
      ...footerRows
    ];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(allData);

    // Set column widths
    const colWidths = [
      { wch: 8 },  // S.No.
      { wch: 15 }, // Employee ID
      { wch: 20 }, // Name
      { wch: 20 }, // Father name
      { wch: 15 }, // POST
      ...Array(31).fill({ wch: 5 }), // Day columns
      { wch: 8 }   // TOTAL
    ];
    ws['!cols'] = colWidths;

    // Merge header cells
    const merges = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 36 } }, // Company name
      { s: { r: 1, c: 0 }, e: { r: 1, c: 36 } }, // Address
      { s: { r: 2, c: 0 }, e: { r: 2, c: 36 } }, // Month line
      { s: { r: 3, c: 0 }, e: { r: 3, c: 36 } }, // CGHS line
    ];
    ws['!merges'] = merges;

    // Add workbook sheet
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Sheet');

    // Generate file name
    const month = new Date().toLocaleString('default', { month: 'long' });
    const year = new Date().getFullYear();
    const fileName = `CGHS_Attendance_${month}_${year}_${employeesWithoutAttendance.length}_employees.xlsx`;

    // Download
    XLSX.writeFile(wb, fileName);
  };

  /* ---------- CALCULATE TOTALS ---------- */
  const calculateTotals = () => {
    let totalDays = 0;
    let totalExtraHours = 0;
    let totalEmployees = 0;
    let employeesWithoutAttendance = 0;

    tableData.forEach(employee => {
      if (employee.attendances && Array.isArray(employee.attendances) && employee.attendances.length > 0) {
        totalEmployees++;
        const attendance = employee.attendances[0];
        
        // Check if total_days exists
        if (attendance.total_days !== undefined) {
          totalDays += parseInt(attendance.total_days || 0);
        } else {
          // Calculate present days from day columns
          let presentDays = 0;
          for (let i = 1; i <= 31; i++) {
            const dayKey = `day_${i}`;
            const dayValue = attendance[dayKey];
            if (dayValue === 'P' || dayValue === 'p' || dayValue === '1' || dayValue === 1) {
              presentDays++;
            }
          }
          totalDays += presentDays;
        }
        
        // Add extra hours
        totalExtraHours += parseInt(attendance.extra_hr || attendance.extra_hours || 0);
      } else {
        employeesWithoutAttendance++;
      }
    });

    return { 
      totalDays, 
      totalExtraHours, 
      totalEmployees,
      employeesWithoutAttendance 
    };
  };

  const totals = calculateTotals();

  /* ---------- TABLE COLUMNS WITH SERIAL NUMBER ---------- */
  const columns = useMemo(() => [
    { 
      accessorKey: 'serial_number', 
      header: 'S.No.',
      size: 60,
      cell: ({ row }) => (
        <div className="fw-bold text-center">{row.index + 1}</div>
      )
    },
    { 
      accessorKey: 'rand_id', 
      header: 'Employee ID',
      size: 100,
      cell: ({ row }) => (
        <div className="fw-bold text-primary">{row.original.rand_id}</div>
      )
    },
    { 
      accessorKey: 'name', 
      header: 'Employee Name',
      size: 150,
      cell: ({ row }) => (
        <div>
          <div className="fw-semibold">{row.original.name}</div>
          <small className="text-muted">{row.original.designation}</small>
        </div>
      )
    },
    { 
      accessorKey: 'email', 
      header: 'Email',
      size: 150,
      cell: ({ row }) => (
        <div className="text-truncate" style={{ maxWidth: '200px' }}>
          {row.original.email}
        </div>
      )
    },
    { 
      accessorKey: 'designation', 
      header: 'Designation',
      size: 120,
      cell: ({ row }) => (
        <div>{row.original.designation || 'N/A'}</div>
      )
    },
    { 
      accessorKey: 'client.contract_no', 
      header: 'Client Contract',
      size: 120,
      cell: ({ row }) => (
        <div>
          {row.original.client?.contract_no || 'N/A'}
        </div>
      )
    },
    { 
      accessorKey: 'attendances.month', 
      header: 'Month/Year',
      size: 100,
      cell: ({ row }) => {
        const attendance = row.original.attendances;
        if (!attendance || !Array.isArray(attendance) || attendance.length === 0) {
          return <span className="text-muted">No Record</span>;
        }
        const latestAttendance = attendance[0];
        return (
          <div className="text-center">
            <div className="fw-bold text-uppercase">{latestAttendance.month || 'N/A'}</div>
            <small>{latestAttendance.year || ''}</small>
          </div>
        );
      }
    },
    {
      accessorKey: 'days',
      header: 'Days Present',
      size: 100,
      cell: ({ row }) => <DaysCell attendance={row.original.attendances} />
    },
    {
      accessorKey: 'extra_hr',
      header: 'Extra Hours',
      size: 100,
      cell: ({ row }) => <ExtraHoursCell attendance={row.original.attendances} />
    }
  ], []);

  /* ---------- UI ---------- */
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading attendance data...</p>
      </div>
    );
  }

  return (
    <div className="attendance-table-container">
      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Employees</h5>
              <h2 className="mb-0">{tableData.length}</h2>
              <small>All employees</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">With Attendance</h5>
              <h2 className="mb-0">{totals.totalEmployees}</h2>
              <small>Records available</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Without Attendance</h5>
              <h2 className="mb-0">{totals.employeesWithoutAttendance}</h2>
              <small>Need records</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Total Present Days</h5>
              <h2 className="mb-0">{totals.totalDays} days</h2>
              <small>Total days present</small>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-between mb-3">
        <h4 className="mb-0">Employee Attendance Records</h4>
        <div className="d-flex gap-2">
          {totals.employeesWithoutAttendance > 0 && (
            <button 
              className="btn btn-success btn-sm"
              onClick={downloadAttendanceFormat}
              title="Download Excel format for employees without attendance records"
            >
              <i className="bi bi-download me-1"></i>
              Download Format ({totals.employeesWithoutAttendance} employees)
            </button>
          )}
          <button 
            className="btn btn-primary btn-sm"
            onClick={fetchAttendanceData}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card">
        <div className="card-body p-0">
          <Table
            data={tableData}
            columns={columns}
            enableSorting={true}
            enablePagination={true}
            pageSize={10}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="alert alert-info mt-3">
        <div className="d-flex">
          <i className="bi bi-info-circle me-2"></i>
          <div>
            <strong>How to use:</strong>
            <ul className="mb-0 mt-1">
              <li>Click <strong>"Download Format"</strong> to get Excel sheet for employees without attendance</li>
              <li>Fill "P" for Present and "A" for Absent in day columns (1-31)</li>
              <li>Enter total days in TOTAL column</li>
              <li>Upload the filled sheet via the upload feature</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3">
        <div className="d-flex gap-3">
          <div className="d-flex align-items-center gap-1">
            <span className="badge bg-success">P</span>
            <small>Present</small>
          </div>
          <div className="d-flex align-items-center gap-1">
            <span className="badge bg-danger">A</span>
            <small>Absent</small>
          </div>
          <div className="d-flex align-items-center gap-1">
            <i className="bi bi-clock text-info"></i>
            <small>Extra Hours</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttandanceEmployeeUpdateTable;
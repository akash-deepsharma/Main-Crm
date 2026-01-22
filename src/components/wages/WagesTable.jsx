"use client";
import React, { useState, memo, useEffect, useRef } from "react";
import Table from "@/components/shared/table/Table";
import {
  FiAlertOctagon,
  FiArchive,
  FiClock,
  FiEdit3,
  FiEye,
  FiMoreHorizontal,
  FiPrinter,
  FiTrash2,
} from "react-icons/fi";
import Dropdown from "@/components/shared/Dropdown";
import SelectDropdown from "@/components/shared/SelectDropdown";

const actions = [
  { label: "Edit", icon: <FiEdit3 /> },
  { label: "Print", icon: <FiPrinter /> },
  { label: "Remind", icon: <FiClock /> },
  { type: "divider" },
  { label: "Archive", icon: <FiArchive /> },
  { label: "Report Spam", icon: <FiAlertOctagon /> },
  { type: "divider" },
  { label: "Delete", icon: <FiTrash2 /> },
];

const WagesTable = ({ selectedClientId, selectedClientName }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);

  // Function to get auth token - adjust based on how you store tokens
  const getAuthToken = () => {
    // Try to get token from localStorage
    const token = localStorage.getItem('auth_token') || 
                  localStorage.getItem('token') ||
                  sessionStorage.getItem('auth_token') ||
                  sessionStorage.getItem('token');
    
    console.log("Auth token found:", token ? "Yes" : "No");
    return token;
  };

  // Print functionality
  const handlePrint = () => {
    if (!tableData || tableData.length === 0) {
      alert("No data to print!");
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to print the table");
      return;
    }

    // Get current date
    const now = new Date();
    const printDate = now.toLocaleDateString();
    const printTime = now.toLocaleTimeString();

    // Create HTML content for printing
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Wages Table - Client ${selectedClientName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          .print-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
          }
          .print-header h1 {
            margin: 0 0 10px 0;
            color: #333;
          }
          .print-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 14px;
            color: #666;
          }
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .print-table th {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
            font-size: 14px;
          }
          .print-table td {
            border: 1px solid #dee2e6;
            padding: 10px 8px;
            font-size: 13px;
          }
          .print-table tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          .status-paid { color: #28a745; font-weight: bold; }
          .status-process { color: #007bff; font-weight: bold; }
          .status-hold { color: #dc3545; font-weight: bold; }
          .print-footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #dee2e6;
            padding-top: 15px;
          }
          @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none; }
            .print-table { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>Employee Wages Report</h1>
          <p>Client ID: ${selectedClientId || 'N/A'}</p>
          <p>Client Name: ${selectedClientName || 'N/A'}</p>
        </div>
        
        <div class="print-info">
          <div>
            <strong>Generated On:</strong> ${printDate} at ${printTime}<br>
            <strong>Total Records:</strong> ${tableData.length}
          </div>
        </div>
        
        <table class="print-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Designation</th>
              <th>Status</th>
              <th>ESI</th>
              <th>EPF</th>
              <th>Working Days</th>
              <th>Daily Rate</th>
              <th>Total Basic</th>
              <th>Bonus</th>
              <th>PF</th>
              <th>EDLI</th>
              <th>EPF Admin</th>
              <th>ESI</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            ${tableData.map(item => `
              <tr>
                <td>${item.id}</td>
                <td>${item.designation || 'N/A'}</td>
                <td class="status-${item.salary_status.toLowerCase()}">${item.salary_status}</td>
                <td>${item.esi_no}</td>
                <td>${item.epf_uan_no}</td>
                <td>${item.month_days}</td>
                <td>₹${item.rate}</td>
                <td>₹${item.total_basic}</td>
                <td>₹${item.annual_bonus}</td>
                <td>₹${item.pf_12}</td>
                <td>₹${item.esic_75}</td>
                <td>₹${item.pf_13}</td>
                <td>₹${item.esic_325}</td>
                <td><strong>₹${item.total_salary}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="print-footer">
          <p>End of Report • This document is generated from Wages Management System</p>
        </div>
        
        <script>
          // Auto-print when window loads
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            }, 500);
          }
        </script>
      </body>
      </html>
    `;

    // Write content to print window
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // Export to CSV functionality
  const handleExportCSV = () => {
    if (!tableData || tableData.length === 0) {
      alert("No data to export!");
      return;
    }

    // Define CSV headers
    const headers = [
      'ID',
      'Designation',
      'Salary Status',
      'ESI Status',
      'EPF Status',
      'Working Days',
      'Days',
      'Extra Hours',
      'Daily Rate',
      'Total Basic',
      'Annual Bonus',
      'PF (12%)',
      'EDLI (0.75%)',
      'EPF Admin (13%)',
      'ESI (3.25%)',
      'Total Cost'
    ];

    // Convert table data to CSV rows
    const csvRows = tableData.map(item => [
      item.id,
      `"${item.designation || ''}"`,
      item.salary_status,
      item.esi_no,
      item.epf_uan_no,
      item.month_days,
      item.days,
      item.Extra_hr,
      item.rate,
      item.total_basic,
      item.annual_bonus,
      item.pf_12,
      item.esic_75,
      item.pf_13,
      item.esic_325,
      item.total_salary
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `wages_client_${selectedClientId}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Edit functionality
  const handleEdit = () => {
    alert("Edit work remains ... Akash");
    // You can implement:
    // 1. Open a modal with editable form
    // 2. Navigate to edit page
    // 3. Enable inline editing in table
  };

  // Fetch data when selectedClientId changes
  useEffect(() => {
    const fetchWagesData = async () => {
      if (!selectedClientId) {
        console.log("No client ID selected yet");
        setTableData([]);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const apiUrl = `https://green-owl-255815.hostingersite.com/api/selected-wages-designation?client_id=${selectedClientId}`;
        console.log("Fetching from API:", apiUrl);
        
        // Get auth token
        const authToken = getAuthToken();
        
        if (!authToken) {
          throw new Error("Authentication token not found. Please log in again.");
        }

        // Add CORS headers and timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        };

        // Add Authorization header if token exists
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(apiUrl, {
          method: 'GET',
          mode: 'cors',
          credentials: 'same-origin',
          headers: headers,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        // Check if response is ok
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          
          if (response.status === 401) {
            throw new Error("Authentication failed. Please check your login credentials.");
          } else if (response.status === 403) {
            throw new Error("You don't have permission to access this resource.");
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        
        const data = await response.json();
        console.log("API Response:", data);
        
        // Handle different response structures
        if (data && typeof data === 'object') {
          // Check if the response has an error property
          if (data.error) {
            throw new Error(data.error);
          }
          
          // Check if data is an array or needs to be extracted
          let responseData = data;
          
          // If data has a 'data' property, use that
          if (data.data && Array.isArray(data.data)) {
            responseData = data.data;
          } else if (Array.isArray(data)) {
            responseData = data;
          }
          
          // Transform API data to match your table structure
          const transformedData = transformApiData(responseData);
          setTableData(transformedData);
        } else {
          throw new Error("Invalid API response format");
        }
        
      } catch (err) {
        console.error("Error fetching wages data:", err);
        setError(`Failed to load data: ${err.message}`);
        // Fallback to sample data if API fails
        setTableData(getFallbackData());
      } finally {
        setLoading(false);
      }
    };

    fetchWagesData();
  }, [selectedClientId]);

  // Function to transform API response to match your table structure
  const transformApiData = (apiData) => {
    console.log("Transforming API data:", apiData);
    
    if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
      console.log("No valid data received from API, using fallback");
      return getFallbackData();
    }

    return apiData.map((item, index) => {
      // Get the first service item or use empty object
      const service = item.services && item.services[0] ? item.services[0] : {};
      
      // Calculate total salary based on the data
      const minDailyWages = parseFloat(service.min_daily_wages) || 0;
      const noOfWorkingDays = parseFloat(service.no_of_working_day) || 30;
      const bonus = parseFloat(service.bonus) || 0;
      const provideantFund = parseFloat(service.provideant_fund) || 0;
      const epfAdminCharge = parseFloat(service.epf_admin_charge) || 0;
      const edliPerDay = parseFloat(service.edliPerDay) || 0;
      const esiPerDay = parseFloat(service.esiPerDay) || 0;
      const optionalAllowance1 = parseFloat(service.optionAllowance1) || 0;
      const optionalAllowance2 = parseFloat(service.optionAllowance2) || 0;
      const optionalAllowance3 = parseFloat(service.optionAllowance3) || 0;
      
      // Calculate total basic salary
      const totalBasic = (minDailyWages * noOfWorkingDays).toFixed(2);
      
      // Calculate total salary (basic + allowances)
      const totalSalary = (
        parseFloat(totalBasic) + 
        bonus + 
        provideantFund + 
        epfAdminCharge + 
        edliPerDay + 
        esiPerDay + 
        optionalAllowance1 + 
        optionalAllowance2 + 
        optionalAllowance3
      ).toFixed(2);
      
      // Determine salary status based on wages data
      let salaryStatus = "Process";
      if (item.wages) {
        salaryStatus = item.wages.status === "active" ? "Paid" : "Hold";
      }
      
      return {
        id: item.id || index + 1,
        "employee-name": {
          title: item.name || `Designation ${index + 1}`,
          img: "/images/brand/app-store.png",
        },
        "employee-id": {
          name: `EMP${item.id || 1000 + index}`,
          email: "",
        },
        designation: item.name || "Not specified",
        skill: item.skill || "Not specified",
        qualification: item.qualification || "Not specified",
        salary_status: salaryStatus,
        esi_no: service.is_esi_applicable ? "Applicable" : "Not Applicable",
        epf_uan_no: service.is_pf_applicable ? "Applicable" : "Not Applicable",
        month_days: service.no_of_working_day || "30",
        days: service.no_of_working_day || "30", // Same as month days
        Extra_hr: service.duty_extra_hours || "N/A",
        rate: service.min_daily_wages || "0",
        total_basic: totalBasic,
        annual_bonus: bonus.toString(),
        pf_12: provideantFund.toString(),
        esic_75: edliPerDay.toString(),
        pf_13: epfAdminCharge.toString(),
        esic_325: esiPerDay.toString(),
        total_salary: totalSalary,
        experience_years: item.experience_in_years || "0",
        hire_employees: item.hire_employee || "0",
        gender: service.gender || "Any",
        age_limit: service.age_limit || "N/A",
        duty_hours: service.duty_hours || "0",
        service_charge: service.perecnt_service_charge || "0",
      };
    });
  };

  // Fallback data in case API fails
  const getFallbackData = () => {
    return [
      {
        id: 1,
        "employee-name": {
          title: "Spark",
          img: "/images/brand/app-store.png",
        },
        "employee-id": {
          name: "EMPNI9623",
        },
        esi_no: "1014853713",
        epf_uan_no: "100257814054",
        designation: "Fire Pump Wet Riser Operator",
        salary_status: "Paid",
        month_days: "30",
        days: "23",
        Extra_hr: "23",
        rate: "724",
        total_basic: "24480",
        annual_bonus: "2039.1",
        pf_12: "1800",
        esic_75: "184.0",
        pf_13: "1950",
        esic_325: "795.0",
        total_salary: "29264",
      },
      {
        id: 2,
        "employee-name": {
          title: "Nexus",
          img: "/images/brand/dropbox.png",
          description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
        },
        "employee-id": {
          name: "EMPNI9623",
        },
        esi_no: "1014853713",
        epf_uan_no: "100257814054",
        designation: "Helper",
        salary_status: "Process",
        month_days: "30",
        days: "23",
        Extra_hr: "23",
        rate: "724",
        total_basic: "24480",
        annual_bonus: "2039.1",
        pf_12: "1800",
        esic_75: "184.0",
        pf_13: "1950",
        esic_325: "795.0",
        total_salary: "29264",
      },
      {
        id: 3,
        "employee-name": {
          title: "Velocity",
          img: "/images/brand/facebook.png",
          description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
        },
        "employee-id": {
          name: "EMPNI9623",
        },
        esi_no: "1014853713",
        epf_uan_no: "100257814054",
        designation: "Electrician",
        salary_status: "Hold",
        month_days: "30",
        days: "23",
        Extra_hr: "23",
        rate: "724",
        total_basic: "24480",
        annual_bonus: "2039.1",
        pf_12: "1800",
        esic_75: "184.0",
        pf_13: "1950",
        esic_325: "795.0",
        total_salary: "29264",
      },
    ];
  };

  const columns = [
    {
      accessorKey: "id",
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
        headerClassName: "width-30",
      },
    },
    {
      accessorKey: "employee-id",
      header: () => "Employee ID",
      cell: (info) => {
        const roles = info.getValue();
        return (
          <a href="#" className="hstack gap-3">
            {roles?.img ? (
              <div className="avatar-image avatar-md">
                <img src={roles?.img} alt="" className="img-fluid" />
              </div>
            ) : (
              <div className="text-white avatar-text user-avatar-text avatar-md">
                {roles?.name?.substring(0, 1) || 'E'}
              </div>
            )}
            <div>
              <span className="text-truncate-1-line">{roles?.name || 'N/A'}</span>
              <small className="fs-12 fw-normal text-muted">
                {roles?.email || ''}
              </small>
            </div>
          </a>
        );
      },
    },
    {
      accessorKey: "employee-name",
      header: () => "Designation",
      cell: (info) => {
        const roles = info.getValue();
        return (
          <div className="hstack gap-4">
            <div className="avatar-image border-0">
              <img 
                src={roles?.img} 
                alt={roles?.title || 'Employee'} 
                className="img-fluid" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/brand/app-store.png";
                }}
              />
            </div>
            <div>
              <div className="text-truncate-1-line fw-medium">
                {roles?.title || 'Unknown Designation'}
              </div>
            </div>
          </div>
        );
      },
      meta: {
        className: "project-name-td",
      },
    },
    {
      accessorKey: "designation",
      header: () => "DESIGNATION",
    },
    {
      accessorKey: "salary_status",
      header: () => "Salary Status",
      cell: (info) => {
        const status = info.getValue();
        let badgeClass = "badge mx-3 fs-16";

        if (status.toLowerCase() === "hold") {
          badgeClass += " bg-soft-danger text-danger";
        } else if (status.toLowerCase() === "process") {
          badgeClass += " bg-soft-primary text-primary";
        } else if (status.toLowerCase() === "paid") {
          badgeClass += " bg-soft-success text-success";
        } else {
          badgeClass += " bg-soft-secondary text-secondary";
        }

        return <span className={badgeClass}>{status}</span>;
      },
    },
    {
      accessorKey: "esi_no",
      header: () => "ESI Status",
    },
    {
      accessorKey: "epf_uan_no",
      header: () => "EPF Status",
    },
    {
      accessorKey: "month_days",
      header: () => "WORKING DAYS",
    },
    {
      accessorKey: "days",
      header: () => "Days",
    },
    {
      accessorKey: "Extra_hr",
      header: () => "Extra Hours",
    },
    {
      accessorKey: "rate",
      header: () => "DAILY RATE",
    },
    {
      accessorKey: "total_basic",
      header: () => "TOTAL BASIC",
      cell: (info) => (
        <span className="fw-medium">₹{info.getValue()}</span>
      ),
    },
    {
      accessorKey: "annual_bonus",
      header: () => "ANNUAL BONUS",
      cell: (info) => (
        <span className="fw-medium">₹{info.getValue()}</span>
      ),
    },
    {
      accessorKey: "pf_12",
      header: () => "PF",
      cell: (info) => (
        <span className="fw-medium">₹{info.getValue()}</span>
      ),
    },
    {
      accessorKey: "esic_75",
      header: () => "EDLI",
      cell: (info) => (
        <span className="fw-medium">₹{info.getValue()}</span>
      ),
    },
    {
      accessorKey: "pf_13",
      header: () => "EPF ADMIN",
      cell: (info) => (
        <span className="fw-medium">₹{info.getValue()}</span>
      ),
    },
    {
      accessorKey: "esic_325",
      header: () => "ESI",
      cell: (info) => (
        <span className="fw-medium">₹{info.getValue()}</span>
      ),
    },
    {
      accessorKey: "total_salary",
      header: () => "TOTAL COST",
      cell: (info) => (
        <span className="fw-bold text-success">₹{info.getValue()}</span>
      ),
    },
    {
      accessorKey: "actions",
      header: () => "Actions",
      cell: (info) => (
        <div className="hstack gap-2 justify-content-end">
          <a href="/salary/salary-slip" className="avatar-text avatar-md">
            <FiEye />
          </a>
          <button 
            className="avatar-text avatar-md"
            onClick={() => {
              console.log("View details for row:", info.row.original);
              // You can implement a modal or detailed view here
            }}
          >
            <FiMoreHorizontal />
          </button>
        </div>
      ),
      meta: {
        headerClassName: "text-end",
      },
    },
  ];

  return (
    <>
      {loading && (
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading wage data for client ID: {selectedClientId}...</p>
        </div>
      )}
      
      {error && (
        <div className="alert alert-warning" role="alert">
          <strong>Note:</strong> {error}
          <div className="mt-2">
            <small className="text-muted">
              Showing sample data for demonstration. Please check your authentication.
            </small>
          </div>
        </div>
      )}
      
      {!loading && tableData.length === 0 && !selectedClientId && (
        <div className="alert alert-info" role="alert">
          Please select a client to view wage data.
        </div>
      )}
      
      {!loading && tableData.length === 0 && selectedClientId && !error && (
        <div className="alert alert-info" role="alert">
          No wage data found for the selected client.
        </div>
      )}
      
      {!loading && tableData.length > 0 && (
        <>
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Showing data for Client ID: {selectedClientId} | {tableData.length} designations
                </small>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={handlePrint}
                  disabled={loading}
                >
                  <FiPrinter className="me-1" /> Print
                </button>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleExportCSV}
                  disabled={loading}
                >
                  Export CSV
                </button>
                {/* <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleEdit}
                  disabled={loading}
                >
                  <FiEdit3 className="me-1" /> Edit
                </button> */}
              </div>
            </div>
          </div>
          <div ref={tableRef}>
            <Table 
              data={tableData} 
              columns={columns} 
            />
          </div>
        </>
      )}
    </>
  );
};

export default WagesTable;
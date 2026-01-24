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

const InvoiceTable = ({ selectedClientId, selectedClientName }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);

  // Function to get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    console.log("Auth token found:", token ? "Yes" : "No");
    return token;
  };

  // Print functionality - updated for invoice data
  const handlePrint = () => {
    if (!tableData || tableData.length === 0) {
      alert("No invoice data to print!");
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to print the table");
      return;
    }

    const now = new Date();
    const printDate = now.toLocaleDateString();
    const printTime = now.toLocaleTimeString();

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice Report - Client ${selectedClientName}</title>
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
          .status-pending { color: #ffc107; font-weight: bold; }
          .status-paid { color: #28a745; font-weight: bold; }
          .status-overdue { color: #dc3545; font-weight: bold; }
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
          <h1>Invoice Report</h1>
          <p>Client ID: ${selectedClientId || 'N/A'}</p>
          <p>Client Name: ${selectedClientName || 'N/A'}</p>
        </div>
        
        <div class="print-info">
          <div>
            <strong>Generated On:</strong> ${printDate} at ${printTime}<br>
            <strong>Total Invoices:</strong> ${tableData.length}
          </div>
        </div>
        
        <table class="print-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Invoice Number</th>
              <th>Client Name</th>
              <th>Invoice Date</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Subtotal</th>
              <th>GST Amount</th>
              <th>Admin Charge</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            ${tableData.map(item => `
              <tr>
                <td>${item.id}</td>
                <td>${item.invoice_number || 'N/A'}</td>
                <td>${item.client_name || 'N/A'}</td>
                <td>${item.invoice_date ? new Date(item.invoice_date).toLocaleDateString() : 'N/A'}</td>
                <td>${item.due_date ? new Date(item.due_date).toLocaleDateString() : 'N/A'}</td>
                <td class="status-${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</td>
                <td>₹${item.subtotal}</td>
                <td>₹${item.gst_amount}</td>
                <td>₹${item.admin_charge_amount}</td>
                <td><strong>₹${item.total}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="print-footer">
          <p>End of Report • This document is generated from Invoice Management System</p>
        </div>
        
        <script>
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

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // Export to CSV - updated for invoice data
  const handleExportCSV = () => {
    if (!tableData || tableData.length === 0) {
      alert("No invoice data to export!");
      return;
    }

    const headers = [
      'Invoice ID',
      'Invoice Number',
      'Client Name',
      'Client Type',
      'Invoice Date',
      'Due Date',
      'Billing Cycle',
      'GST Type',
      'GST Percentage',
      'GST Amount',
      'Admin Charge',
      'Subtotal',
      'Total Amount',
      'Status'
    ];

    const csvRows = tableData.map(item => [
      item.id,
      `"${item.invoice_number || ''}"`,
      `"${item.client_name || ''}"`,
      item.client_type,
      item.invoice_date ? new Date(item.invoice_date).toLocaleDateString() : '',
      item.due_date ? new Date(item.due_date).toLocaleDateString() : '',
      item.billing_cycle,
      item.gst_type,
      item.gst_percentage,
      item.gst_amount,
      item.admin_charge_amount,
      item.subtotal,
      item.total,
      item.status
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `invoices_client_${selectedClientId}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // View invoice details
  const handleViewInvoice = (invoice) => {
    alert(`Viewing invoice: ${invoice.invoice_number}\nClient: ${invoice.client_name}\nAmount: ₹${invoice.total}`);
    // You can implement modal or detailed view here
  };

  // Download invoice
  const handleDownloadInvoice = (invoice) => {
    alert(`Downloading invoice: ${invoice.invoice_number}`);
    // Implement download functionality
  };

  // Fetch data when selectedClientId changes
  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!selectedClientId) {
        console.log("No client ID selected yet");
        setTableData([]);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const apiUrl = `https://green-owl-255815.hostingersite.com/api/client/invoices?client_id=${selectedClientId}`;
        console.log("Fetching from API:", apiUrl);
        
        const authToken = getAuthToken();
        
        if (!authToken) {
          throw new Error("Authentication token not found. Please log in again.");
        }

        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        };

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: headers,
        });
        
        const data = await response.json();
        console.log("API Response:", data);
        
        if (data && typeof data === 'object') {
          if (data.error) {
            throw new Error(data.error);
          }
          
          // Extract the array from response
          let responseData = data;
          
          if (data.data && Array.isArray(data.data)) {
            responseData = data.data;
          } else if (Array.isArray(data)) {
            responseData = data;
          }
          
          // Set the raw API data directly to tableData
          setTableData(responseData);
        } else {
          throw new Error("Invalid API response format");
        }
        
      } catch (err) {
        console.error("Error fetching invoice data:", err);
        setError(`Failed to load invoice data: ${err.message}`);
        // You can set empty array or fallback here
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [selectedClientId]);

  // Columns for invoice display - using direct API fields
  const columns = [
    {
      accessorKey: "selection",
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
      accessorKey: "id",
      header: "Invoice ID",
      cell: (info) => (
        <span className="fw-medium">#{info.getValue()}</span>
      ),
    },
    {
      accessorKey: "invoice_number",
      header: () => "Invoice Number",
      cell: (info) => (
        <span className="fw-medium">{info.getValue() || "N/A"}</span>
      ),
    },
    {
      accessorKey: "client_name",
      header: () => "Client Name",
      cell: (info) => (
        <div>
          <div className="text-truncate-1-line fw-medium">
            {info.getValue() || "N/A"}
          </div>
          <small className="fs-12 fw-normal text-muted">
            {info.row.original.client_type || ""}
          </small>
        </div>
      ),
    },
    {
      accessorKey: "invoice_date",
      header: () => "Invoice Date",
      cell: (info) => {
        const date = info.getValue();
        return date ? new Date(date).toLocaleDateString() : "N/A";
      },
    },
    {
      accessorKey: "due_date",
      header: () => "Due Date",
      cell: (info) => {
        const date = info.getValue();
        return date ? new Date(date).toLocaleDateString() : "N/A";
      },
    },
    {
      accessorKey: "billing_cycle",
      header: () => "Billing Cycle",
      cell: (info) => {
        const cycle = info.getValue();
        return cycle ? cycle.charAt(0).toUpperCase() + cycle.slice(1) : "N/A";
      },
    },
    {
      accessorKey: "gst_amount",
      header: () => "GST",
      cell: (info) => (
        <span className="fw-medium">{parseFloat(info.getValue() || 0).toFixed(2)}</span>
      ),
    },
    {
      accessorKey: "admin_charge_amount",
      header: () => "Admin Charge",
      cell: (info) => (
        <span className="fw-medium">{parseFloat(info.getValue() || 0).toFixed(2)}</span>
      ),
    },
    // {
    //   accessorKey: "actions",
    //   header: () => "Actions",
    //   cell: (info) => (
    //     <div className="hstack gap-2 justify-content-end">
    //       <button 
    //         className="btn btn-sm btn-outline-primary"
    //         onClick={() => handleViewInvoice(info.row.original)}
    //       >
    //         <FiEye className="me-1" /> View
    //       </button>
    //       <button 
    //         className="btn btn-sm btn-outline-success"
    //         onClick={() => handleDownloadInvoice(info.row.original)}
    //       >
    //         <FiPrinter className="me-1" /> Print
    //       </button>
    //     </div>
    //   ),
    //   meta: {
    //     headerClassName: "text-end",
    //   },
    // },
  ];

  return (
    <>
      {loading && (
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading invoice data for client ID: {selectedClientId}...</p>
        </div>
      )}
      
      {error && (
        <div className="alert alert-warning" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {!loading && !selectedClientId && (
        <div className="text-center p-5 border rounded bg-light">
          <div className="mb-3">
            <FiEye className="text-muted" style={{ fontSize: '3rem' }} />
          </div>
          <h5 className="text-muted mb-2">No Client Selected</h5>
          <p className="text-muted mb-4">Please select a client from the list to view invoice data.</p>
        </div>
      )}
      
      {!loading && selectedClientId && !tableData.length > 0 && (
        <div className="text-center p-5 border rounded bg-light">
          <div className="mb-3">
            <FiArchive className="text-muted" style={{ fontSize: '3rem' }} />
          </div>
          <h5 className="text-muted mb-2">No Invoices Found</h5>
          <p className="text-muted mb-4">No invoice data available for the selected client.</p>
          <small className="text-muted">Client ID: {selectedClientId} | Client: {selectedClientName}</small>
        </div>
      )}
      
      {!loading && tableData.length > 0 && (
        <>
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Showing invoice data for Client ID: {selectedClientId} | {tableData.length} invoices
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

export default InvoiceTable;
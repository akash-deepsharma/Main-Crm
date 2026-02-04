// "use client";
// import React, { useState } from "react";
// import { FiDownload, FiPrinter, FiSend } from "react-icons/fi";
// import Image from "next/image";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import "./InvoiceView.css";
// import MonthPicker from "../shared/MonthPicker";
 
// const downloadPDF = async (id, fileName) => {
//   const input = document.getElementById(id);
 
//   if (!input) {
//     console.error("Element not found:", id);
//     return;
//   }
 
//   const canvas = await html2canvas(input, {
//     scale: 1.5,
//     useCORS: true,
//   });
 
//   const imgData = canvas.toDataURL("image/png");
//   const pdf = new jsPDF("p", "mm", "a4");
 
//   const margin = 8;
//   const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2;
//   const imgProps = pdf.getImageProperties(imgData);
//   const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
 
//   pdf.addImage(imgData, "PNG", margin, margin, pdfWidth, imgHeight);
//   pdf.save(`${fileName}.pdf`);
// };
 
// // PRINT FUNCTION
// const printDiv = async (id) => {
//   const element = document.getElementById(id);
//   if (!element) return;
 
//   // Use html2canvas to capture EXACT preview
//   const canvas = await html2canvas(element, {
//     scale: 1.5,
//     useCORS: true,
//   });
 
//   const imgData = canvas.toDataURL("image/png");
 
//   // Create print window
//   const printWindow = window.open("", "_blank", "width=900,height=1000");
 
//   printWindow.document.write(`
//     <html>
//       <head>
//         <title>Print</title>
//         <style>
//           body, html {
//             margin: 0;
//             padding: 0;
//             text-align: center;
//           }
 
//           img {
//             width: 100%;
//             max-width: 800px;
//           }
//         </style>
//       </head>
//       <body>
//         <img src="${imgData}" />
//       </body>
//     </html>
//   `);
 
//   printWindow.document.close();
//   printWindow.focus();
 
//   setTimeout(() => {
//     printWindow.print();
//     printWindow.close();
//   }, 500);
// };
 
// const sharePDF = async (id, fileName) => {
//   const element = document.getElementById(id);
//   const canvas = await html2canvas(element, { scale: 1.5 });
//   const img = canvas.toDataURL("image/png");
 
//   const pdf = new jsPDF("p", "mm", "a4");
//   const pdfWidth = pdf.internal.pageSize.getWidth();
//   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//   pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
 
//   const pdfBlob = pdf.output("blob");
 
//   const file = new File([pdfBlob], `${fileName}.pdf`, {
//     type: "application/pdf",
//   });
 
//   if (navigator.canShare && navigator.canShare({ files: [file] })) {
//     await navigator.share({
//       title: fileName,
//       text: "Sharing Salary Slip",
//       files: [file],
//     });
//   } else {
//     alert("Sharing not supported on this device");
//   }
// };
 
// const InvoiceView = () => {
//   const [toggleDateRange, setToggleDateRange] = useState(false);
//   const [selectedMonth, setSelectedMonth] = useState(new Date());
//   return (
//     <div className="col-lg-12">
//       <div className="card invoice-container">
//         <div className="card-header">
//           <div className="d-flex align-items-center">
//             <h2 className="fs-16 fw-700 text-truncate-1-line mb-0" style={{width:'max-content'}}>
//               Client Name - Invoice 352 for the month of
//             </h2>
 
//             <div className="monthpicker-container asdfasdfasdfasdfasdf  ms-2  badge bg-soft-primary text-primary mx-3 fs-16 ">
//               <div
//                 onClick={() => setToggleDateRange(!toggleDateRange)}
//                 className="monthpicker-trigger p-0 m-0"
//               >
//                 <MonthPicker
//                   selectedMonth={selectedMonth}
//                   setSelectedMonth={setSelectedMonth}
//                   toggleDateRange={toggleDateRange}
//                   className="m-0 p-0 border-0 bg-transparent"
//                 />
//               </div>
//             </div>
//           </div>
 
//           <div className="d-flex align-items-center justify-content-center">
//             <a className="d-flex me-1">
//               <div
//                 className="avatar-text avatar-md"
//                 onClick={() => sharePDF("invoiceDiv", "Salary-Slip")}
//               >
//                 <FiSend size={12} />
//               </div>
//             </a>
 
//             {/* PRINT BUTTON */}
//             <a className="d-flex me-1 printBTN">
//               <div
//                 className="avatar-text avatar-md"
//                 onClick={() => printDiv("invoiceDiv")}
//               >
//                 <FiPrinter size={12} />
//               </div>
//             </a>
 
//             {/* DOWNLOAD BUTTON */}
//             <a className="d-flex me-1 file-download">
//               <div
//                 className="avatar-text avatar-md"
//                 onClick={() => downloadPDF("invoiceDiv", "Salary-Slip")}
//               >
//                 <FiDownload size={12} />
//               </div>
//             </a>
//           </div>
//         </div>
 
//         <div className="card-body p-5">
//           <div id="invoiceDiv" className="parent-class">
//             <div className="invoice">
//               <div className="header-invoice">
//                 <h1>Alpha Manpower Services Private Limited</h1>
//                 <p style={{ marginMottom: "10px" }}>
//                   Basement Gali No.1, 15/6-D, Lalit Park, Near Gurudwara, Laxmi
//                   Nagar, East Delhi, Delhi, 110092
//                 </p>
//                 <p>
//                   <span style={{ marginRight: "20px" }}>
//                     Email: alphaprivatelimited1@gmail.com
//                   </span>{" "}
//                   <span style={{ marginLeft: "20px" }}>
//                     Tel: 9899998149, 8585902112
//                   </span>
//                 </p>
//               </div>
 
//               <div className="party-details">
//                 <div className="details-1">
//                   <p>Party Details:</p>
//                   <p>
//                     <strong>District &amp; Sessions Judge North West</strong>
//                   </p>
//                   <p>
//                     <strong>Rohini District Court</strong>
//                   </p>
//                   <p>
//                     <strong>North West Delhi-110085</strong>
//                   </p>
//                 </div>
//                 <div className="details-2">
//                   <p>
//                     <strong>GEMC-511687703389806</strong>
//                   </p>
//                   <p>Invoice No.: AMPS/24-25/352</p>
//                   <p style={{ margin: "20px 0px 20px 0px !important" }}>
//                     Date: 01/10/2024
//                   </p>
//                   <p>Bill for the month of SEPTEMBER 2024 </p>
//                   <p>FOR THE MOΝΤΗ 01-09-2024 ΤΟ 30-09-2024</p>
//                 </div>
//               </div>
 
//               <div className="table">
//                 <table
//                   className="table table-bordered"
//                   cellPadding="40"
//                   cellSpacing="80"
//                   style={{ border: "1px solid black", margin: "-1px" }}
//                 >
//                   <thead className="table-header">
//                     <tr>
//                       <th style={{ width: "62.3px" }}>S.No.</th>
//                       <th
//                         className="bordered-cell"
//                         style={{ width: "351.98px" }}
//                       >
//                         Description
//                       </th>
//                       <th
//                         className="bordered-cell"
//                         style={{ width: "106.75px" }}
//                       >
//                         HSN/SAC Code
//                       </th>
//                       <th
//                         className="bordered-cell"
//                         style={{ width: "62.37px" }}
//                       >
//                         QTY
//                       </th>
//                       <th
//                         className="bordered-cell"
//                         style={{ width: "92.78px" }}
//                       >
//                         DAYS
//                       </th>
//                       <th
//                         className="bordered-cell"
//                         style={{ width: "92.78px" }}
//                       >
//                         Rate
//                       </th>
//                       <th
//                         className="bordered-cell right-align"
//                         style={{ width: "146.68px" }}
//                       >
//                         Amount
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td>1</td>
//                       <td className="right-align specific-center">
//                         <strong>SECURITY SUPERVISOR</strong>
//                       </td>
//                       <td>998519</td>
//                       <td>1</td>
//                       <td className="bordered-cell">30</td>
//                       <td>816</td>
//                       <td className="right-align">24480.00</td>
//                     </tr>
 
//                     <tr>
//                       <td>2</td>
//                       <td className="right-align specific-center">
//                         <strong>SECURITY GUARD</strong>
//                       </td>
 
//                       <td className="right-align"></td>
//                       <td className="right-align">33</td>
//                       <td className="bordered-cell right-align">974</td>
//                       <td className="right-align">742</td>
//                       <td className="right-align">722708.00</td>
//                     </tr>
 
//                     <tr>
//                       <td></td>
//                       <td className="right-align specific-center">
//                         <strong>Total</strong>
//                       </td>
 
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align">
//                         <strong>1004.00</strong>
//                       </td>
//                       <td className="right-align"></td>
//                       <td className="right-align">
//                         <strong>747188.00</strong>
//                       </td>
//                     </tr>
 
//                     <tr>
//                       <td></td>
//                       <td className="right-align specific-center">
//                         <strong style={{ fontSize: "14px !importnat" }}>
//                           Bonus@8.33%
//                         </strong>
//                       </td>
 
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align">
//                         <strong>62240.76</strong>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td></td>
//                       <td className="right-align specific-center">
//                         <strong style={{ fontSize: "14px !importnat" }}>
//                           EPF 15000@13%
//                         </strong>
//                       </td>
 
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align">72150.00</td>
//                     </tr>
//                     <tr>
//                       <td></td>
//                       <td className="right-align specific-center">
//                         <strong style={{ fontSize: "14px !importnat" }}>
//                           ESI@3.25%
//                         </strong>
//                       </td>
 
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align">24283.61</td>
//                     </tr>
 
//                     <tr>
//                       <td></td>
//                       <td className="right-align">
//                         <strong></strong>
//                       </td>
 
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                     </tr>
//                     <tr>
//                       <td></td>
//                       <td className="right-align specific-center">
//                         <strong>TOTAL</strong>
//                       </td>
 
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align">
//                         <strong>905862.37</strong>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td></td>
//                       <td className="right-align">
//                         <strong></strong>
//                       </td>
 
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                     </tr>
//                     <tr>
//                       <td></td>
//                       <td className="right-align specific-center">
//                         <strong>Service Charge @ 0.85%</strong>
//                       </td>
 
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align">7699.83</td>
//                     </tr>
 
//                     <tr>
//                       <td></td>
//                       <td className="right-align">
//                         <strong></strong>
//                       </td>
 
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                     </tr>
//                     <tr style={{ borderBottom: "1px solid black !important" }}>
//                       <td></td>
//                       <td className="right-align">
//                         <strong></strong>
//                       </td>
 
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                       <td className="right-align"></td>
//                     </tr>
 
//                     <tr>
//                       <td
//                         colSpan="6"
//                         className="left-align text-left"
//                         style={{ textAlign: "left", paddingLeft: "350px" }}
//                       >
//                         <strong>Total (including GST) </strong>
//                       </td>
//                       <td className="right-align">
//                         <strong>913562.20</strong>
//                       </td>
//                     </tr>
 
//                     <tr>
//                       <td
//                         colSpan="6"
//                         className="text-left left-align"
//                         style={{ textAlign: "left", paddingLeft: "350px" }}
//                       >
//                         CGST @9.00%
//                       </td>
//                       <td className="right-align">82220.60</td>
//                     </tr>
 
//                     <tr>
//                       <td
//                         colSpan="6"
//                         className="text-left left-align"
//                         style={{ textAlign: "left", paddingLeft: "350px" }}
//                       >
//                         SGST @9.00%
//                       </td>
//                       <td className="right-align">82220.60</td>
//                     </tr>
 
//                     <tr style={{ borderBottom: "1px solid black !important" }}>
//                       <td
//                         colSpan="6"
//                         className="text-left left-align"
//                         style={{ textAlign: "left", paddingLeft: "350px" }}
//                       >
//                         Less: Rounded Off (-)
//                       </td>
//                       <td className="bordered-cell right-align">-0.40</td>
//                     </tr>
 
//                     <tr>
//                       <td colSpan="6" className="text-center right-align">
//                         <strong>
//                           Rupees: Ten Lakh Seventy Eight Thousand Three rupees
//                           /-
//                         </strong>
//                         <strong style={{ marginLeft: "330px" }}>
//                           Grand Total
//                         </strong>
//                       </td>
//                       <td className="right-align">
//                         <strong>1,26,604.00</strong>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//               <div className="declaration">
//                 <h5 className="text-center">Declaration</h5>
//                 <p>ICICI BANK, Laxmi Nagar</p>
//                 <p>
//                   <strong>A/C No: 622505000413</strong>
//                 </p>
//                 <p>
//                   <strong>PAN No.: AAATC8738F | IFSC Code: ICIC0000225</strong>
//                 </p>
//               </div>
 
//               <div className="footer-invoice">
//                 <div className="authorized-sign d-flex">
//                   <div className="term-and-conditions">
//                     <h5
//                       style={{
//                         textDecoration: "underline",
//                         marginBottom: "20px",
//                       }}
//                     >
//                       Terms &amp; Conditions
//                     </h5>
//                     <p>1. Goods once sold will not be taken back.</p>
//                     <p>
//                       2. Interest @18% p.a. will be charged if the payment is
//                       not made within the stipulated time.
//                     </p>
//                     <p>3. Subject to Delhi Jurisdiction only.</p>
//                   </div>
//                   <div className="signature">
//                     <p className="text-start">Reciver Signature:</p>
//                     <p className="name text-center">
//                       Alpha Manpower Services Private Limited
//                     </p>
//                     <p className="text-end">Authorized Signatory</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
 
// export default InvoiceView;



"use client";
import React, { useState, useEffect } from "react";
import { FiDownload, FiPrinter, FiSend } from "react-icons/fi";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./InvoiceView.css";
import MonthPicker from "../shared/MonthPicker";
import { useSearchParams } from "next/navigation";
import { bottom } from "@popperjs/core";
import css from "styled-jsx/css";

const downloadPDF = async (id, fileName) => {
  const input = document.getElementById(id);

  if (!input) {
    console.error("Element not found:", id);
    return;
  }

  const canvas = await html2canvas(input, {
    scale: 1.5,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const margin = 8;
  const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2;
  const imgProps = pdf.getImageProperties(imgData);
  const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, "PNG", margin, margin, pdfWidth, imgHeight);
  pdf.save(`${fileName}.pdf`);
};

// PRINT FUNCTION
const printDiv = async (id) => {
  const element = document.getElementById(id);
  if (!element) return;

  // Use html2canvas to capture EXACT preview
  const canvas = await html2canvas(element, {
    scale: 1.5,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");

  // Create print window
  const printWindow = window.open("", "_blank", "width=900,height=1000");

  printWindow.document.write(`
    <html>
      <head>
        <title>Print</title>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            text-align: center;
          }

          img {
            width: 100%;
            max-width: 800px;
          }
        </style>
      </head>
      <body>
        <img src="${imgData}" />
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

const sharePDF = async (id, fileName) => {
  const element = document.getElementById(id);
  const canvas = await html2canvas(element, { scale: 1.5 });
  const img = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);

  const pdfBlob = pdf.output("blob");

  const file = new File([pdfBlob], `${fileName}.pdf`, {
    type: "application/pdf",
  });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title: fileName,
      text: "Sharing Salary Slip",
      files: [file],
    });
  } else {
    alert("Sharing not supported on this device");
  }
};

const InvoiceView = () => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('client_id');
  
  const [toggleDateRange, setToggleDateRange] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const currentDate = new Date();
    // Previous month set करें (current month - 1)
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    return previousMonth;
  });
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  console.log("invoiceData", invoiceData)
  console.log("client id", clientId)
  console.log("Selected Month:", selectedMonth)

  // Function to get token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      // Try different possible token keys that might be used
      const token = localStorage.getItem('token')
      return token;
    }
    return null;
  };
  
  const getSelectedCompany = () => {
    if (typeof window !== 'undefined') {
      const company_id = localStorage.getItem('selected_company')
      return company_id;
    }
    return null;
  };

  // Function to format month and year from selectedMonth - January, February format
  const getMonthYearFromDate = (date) => {
    // Check if it's a valid date
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      date = new Date();
    }
    
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return { month, year };
  };

  // Function to format date for display in "Jan 2026" format
  const formatDateForDisplay = (date) => {
    // Check if it's a valid date
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      date = new Date();
    }
    
    const monthNamesShort = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    const month = monthNamesShort[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  // Calculate total working days for each designation
  const calculateTotalWorkingDays = (designation) => {
    if (!designation?.employees) return 0;
    return designation.employees.reduce((total, emp) => total + (emp.present_days || 0), 0);
  };

  // Calculate total employees for each designation
  const calculateTotalEmployees = (designation) => {
    if (!designation?.employees) return 0;
    return designation.employees.length;
  };

  // Calculate total amount for each designation - FIXED
  const calculateTotalAmount = (designation) => {
    if (!designation?.employees) return 0;
    // Use total_gross_for_designation if available, otherwise calculate from employees
    if (designation.total_gross_for_designation !== undefined) {
      return designation.total_gross_for_designation;
    }
    return designation.employees.reduce((total, emp) => total + (emp.gross_salary || 0), 0);
  };

  // Calculate totals for all designations
  const calculateGrandTotals = () => {
    if (!invoiceData?.invoice?.details?.designation_wise_salary_breakup) {
      return {
        totalEmployees: 0,
        totalWorkingDays: 0,
        totalAmount: 0
      };
    }

    const designations = invoiceData.invoice.details.designation_wise_salary_breakup;
    
    return designations.reduce((totals, designation) => {
      totals.totalEmployees += calculateTotalEmployees(designation);
      totals.totalWorkingDays += calculateTotalWorkingDays(designation);
      totals.totalAmount += calculateTotalAmount(designation);
      return totals;
    }, { totalEmployees: 0, totalWorkingDays: 0, totalAmount: 0 });
  };

  // Calculate rate per employee for designation (average)
  const calculateDesignationRate = (designation) => {
    if (!designation?.employees || designation.employees.length === 0) return 0;
    const totalAmount = calculateTotalAmount(designation);
    const employeeCount = calculateTotalEmployees(designation);
    return employeeCount > 0 ? Math.round(totalAmount / employeeCount / 30) : 0; // Daily rate
  };

  // Handle month change from MonthPicker
  const handleMonthChange = (newMonth) => {
    console.log("Month changed to:", newMonth);
    setSelectedMonth(newMonth);
  };

  useEffect(() => {
    if (!clientId) {
      setError("Client ID is missing from URL");
      setLoading(false);
      return;
    }

    const fetchInvoiceData = async () => {
      try {
        setLoading(true);
        
        // Get token from localStorage
        const token = getAuthToken();
        const companyId = getSelectedCompany();
        
        if (!token) {
          throw new Error("Authentication token not found. Please login again.");
        }
        
        if (!companyId) {
          throw new Error("Company ID not found. Please select a company.");
        }
        
        // Get month and year from selectedMonth
        const { month, year } = getMonthYearFromDate(selectedMonth);
        
        console.log("Month being sent to API:", month);
        console.log("Year being sent to API:", year);
        
        const apiUrl = `https://green-owl-255815.hostingersite.com/api/get-invoice?client_id=${clientId}&company_id=${companyId}&month=${month}&year=${year}`;
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        
        // Log response status for debugging
        console.log("API Response Status:", response.status);
        console.log("API URL:", apiUrl);
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Authentication failed. Token may be invalid or expired.");
          } else if (response.status === 404) {
            throw new Error("Invoice not found for the given client ID / Month / Year.");
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }
        
        const data = await response.json();
        console.log("Invoice API Response:", data); 
        
        // Check if the API returned an error in the response body
        if (data.error) {
          throw new Error(data.message || data.error);
        }
        
        setInvoiceData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching invoice data:", err);
        setError(err.message);
        setInvoiceData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [clientId, selectedMonth]);

  // If you want to implement token refresh logic, you can add it here
  const handleTokenError = () => {
    // Redirect to login or refresh token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  if (loading) {
    return (
      <div className="col-lg-12">
        <div className="card invoice-container">
          <div className="card-body p-5 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading invoice data for {formatDateForDisplay(selectedMonth)}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-lg-12">
        <div className="card invoice-container">
          <div className="card-body p-5 text-center">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error Loading Invoice</h4>
              <p>{error}</p>
              <hr />
              <p className="mb-0">
                {error.includes("Authentication failed") || error.includes("token") ? (
                  <button 
                    className="btn btn-primary" 
                    onClick={handleTokenError}
                  >
                    Go to Login
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary" 
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="col-lg-12">
        <div className="card invoice-container">
          <div className="card-body p-5 text-center">
            <p>No invoice data found for client ID: {clientId} for {formatDateForDisplay(selectedMonth)}</p>
            <button 
              className="btn btn-primary mt-3" 
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get designation wise salary breakup data
  const designationData = invoiceData?.invoice?.details?.designation_wise_salary_breakup || [];
  const grandTotals = calculateGrandTotals();
  const invoiceSummary = invoiceData?.invoice?.details?.invoice_summary || {};


  // Calculate total salary subtotal (Basic + Allowances + Bonus + Overtime + ESI + EPF + Arrear)
  const calculateSalarySubtotal = () => {
    if (!invoiceSummary.gst_calculations?.components) return 0;
    return invoiceSummary.gst_calculations.components.reduce((total, component) => {
      return total + (component.amount || 0);
    }, 0);
  };

  
  const salarySubtotal = calculateSalarySubtotal();
  const totalGst = invoiceSummary.totals?.total_gst || 0;
  const totalInvoiceAmount = invoiceSummary.totals?.total_invoice_amount || 0;
  
  const calcute_gstcharge = (gstData) => {
    if (!gstData) return 0
  
    const percentage = gstData.gst_percentage || 0
  
    // Step 1: GST base (included components only)
    const gstBase = gstData.components
      ?.filter(
        (item) =>
          item.included === 1 || item.included === "1" || item.included === true
      )
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  
    // Step 2: GST amount
    const gstAmount = (gstBase * percentage) / 100
  
    return {
      gst_base: Number(gstBase.toFixed(2)),
      gst_amount: Number(gstAmount.toFixed(2)),
    }
  }
  const gstResult = calcute_gstcharge(invoiceSummary.gst_calculations)
  console.log("calcute_gstcharge", gstResult)



  // Function to convert number to Indian Rupees in words
const convertNumberToWords = (amount) => {
  if (!amount || isNaN(amount)) return "Zero Rupees Only";
  
  const num = parseFloat(amount);
  
  // Handle decimal part
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  
  const rupeesInWords = convertToWords(rupees);
  const paiseInWords = paise > 0 ? convertToWords(paise) : null;
  
  let result = rupeesInWords + " Rupees";
  if (paiseInWords) {
    result += " And " + paiseInWords + " Paise";
  }
  result += " Only";
  
  return result;
};

// Helper function to convert number to words
const convertToWords = (num) => {
  if (num === 0) return "Zero";
  
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", 
    "Seventeen", "Eighteen", "Nineteen"
  ];
  
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];
  
  const scaleWords = ["", "Thousand", "Lakh", "Crore"];
  
  // Indian numbering system conversion
  const convertLessThanThousand = (n) => {
    if (n === 0) return "";
    
    let words = "";
    
    // Hundreds
    if (n >= 100) {
      words += ones[Math.floor(n / 100)] + " Hundred";
      n %= 100;
      if (n > 0) words += " ";
    }
    
    // Tens and ones
    if (n >= 20) {
      words += tens[Math.floor(n / 10)];
      n %= 10;
      if (n > 0) words += " " + ones[n];
    } else if (n > 0) {
      words += ones[n];
    }
    
    return words;
  };
  
  // Convert number to array of digits in Indian system (Crore, Lakh, Thousand, Hundred)
  const getIndianDigits = (n) => {
    const digits = [];
    
    // Last 3 digits (hundreds, tens, ones)
    digits.push(n % 1000);
    n = Math.floor(n / 1000);
    
    // Next 2 digits (thousands)
    digits.push(n % 100);
    n = Math.floor(n / 100);
    
    // Next 2 digits (lakhs)
    digits.push(n % 100);
    n = Math.floor(n / 100);
    
    // Remaining digits (crores)
    digits.push(n);
    
    return digits;
  };
  
  const digits = getIndianDigits(num);
  let words = "";
  
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] > 0) {
      if (words !== "") words += " ";
      words += convertLessThanThousand(digits[i]);
      if (scaleWords[i] !== "") words += " " + scaleWords[i];
    }
  }
  
  return words.trim();
};
  return (
    <div className="col-lg-12">
      <div className="card invoice-container">
        <div className="card-header">
          <div className="d-flex align-items-center">
            <h2 className="fs-16 fw-700 text-truncate-1-line mb-0" style={{width:'max-content'}}>
              {invoiceData?.client?.name || "Client Name"} - Invoice {invoiceData?.invoice?.id || "352"} for the month of{" "}
              <span className="text-primary">
                {formatDateForDisplay(selectedMonth)}
              </span>
            </h2>
  
            <div className="monthpicker-container asdfasdfasdfasdfasdf  ms-2  badge bg-soft-primary text-primary mx-3 fs-16 ">
              <div
                onClick={() => setToggleDateRange(!toggleDateRange)}
                className="monthpicker-trigger p-0 m-0"
              >
                <MonthPicker
                  selectedMonth={selectedMonth}
                  setSelectedMonth={handleMonthChange}
                  toggleDateRange={toggleDateRange}
                  className="m-0 p-0 border-0 bg-transparent"
                />
              </div>
            </div>
          </div>
  
          <div className="d-flex align-items-center justify-content-center">
            <a className="d-flex me-1">
              <div
                className="avatar-text avatar-md"
                onClick={() => sharePDF("invoiceDiv", "Salary-Slip")}
              >
                <FiSend size={12} />
              </div>
            </a>
  
            {/* PRINT BUTTON */}
            <a className="d-flex me-1 printBTN">
              <div
                className="avatar-text avatar-md"
                onClick={() => printDiv("invoiceDiv")}
              >
                <FiPrinter size={12} />
              </div>
            </a>
  
            {/* DOWNLOAD BUTTON */}
            <a className="d-flex me-1 file-download">
              <div
                className="avatar-text avatar-md"
                onClick={() => downloadPDF("invoiceDiv", "Salary-Slip")}
              >
                <FiDownload size={12} />
              </div>
            </a>
          </div>
        </div>
  
        <div className="card-body p-5">
          <div id="invoiceDiv" className="parent-class">
            <div className="invoice">
              <div className="header-invoice">
                <h1>{invoiceData?.company?.company_name}</h1>
                <p style={{ marginMottom: "10px" }}>
                  {invoiceData?.company?.address}
                </p>
                <p>
                  <span style={{ marginRight: "20px" }}>
                    Email: {invoiceData?.company?.company_business_email}
                  </span>{" "}
                  <span style={{ marginLeft: "20px" }}>
                    Tel: {invoiceData?.company?.company_phone}
                  </span>
                </p>
              </div>
  
              <div className="party-details">
                <div className="details-1">
                  <p>Party Details:</p>
                  <p>
                    <strong>District &amp; Sessions Judge North West</strong>
                  </p>
                  <p>
                    <strong>Rohini District Court</strong>
                  </p>
                  <p>
                    <strong>North West Delhi-110085</strong>
                  </p>
                </div>
                <div className="details-2">
                  <p>
                    <strong>{invoiceData?.client?.contract_no || "GEMC-511687703389806"}</strong>
                  </p>
                  <p>Invoice No.: {invoiceData?.invoice?.details?.invoice_number }</p>
                  <p style={{ margin: "20px 0px 20px 0px !important" }}>
                    Date: {new Date().toLocaleDateString('en-GB')}
                  </p>
                  <p>Bill for the month of {invoiceData?.invoice?.month } {invoiceData?.invoice?.year } </p>
                  <p>FOR THE MOΝΤΗ 01-09-2024 ΤΟ 30-09-2024</p>
                </div>
              </div>
  
              <div className="table">
                <table
                  className="table table-bordered"
                  cellPadding="40"
                  cellSpacing="80"
                  style={{ border: "1px solid black", margin: "-1px" }}
                >
                  <thead className="table-header">
                    <tr>
                      <th style={{ width: "62.3px" }}>S.No.</th>
                      <th
                        className="bordered-cell"
                        style={{ width: "351.98px" }}
                      >
                        Description
                      </th>
                      <th
                        className="bordered-cell"
                        style={{ width: "106.75px" }}
                      >
                        HSN/SAC Code
                      </th>
                      <th
                        className="bordered-cell"
                        style={{ width: "62.37px" }}
                      >
                        QTY
                      </th>
                      <th
                        className="bordered-cell"
                        style={{ width: "92.78px" }}
                      >
                        DAYS
                      </th>
                      <th
                        className="bordered-cell"
                        style={{ width: "92.78px" }}
                      >
                        Rate
                      </th>
                      <th
                        className="bordered-cell right-align"
                        style={{ width: "146.68px" }}
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Dynamic data from designation_wise_salary_breakup */}
                    {designationData.map((designation, index) => {
                      const totalEmployees = calculateTotalEmployees(designation);
                      const totalWorkingDays = calculateTotalWorkingDays(designation);
                      const totalAmount = calculateTotalAmount(designation);
                      
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="right-align specific-center">
                            <strong>{designation.designation_name}</strong>
                          </td>
                          <td>998519</td>
                          <td>{totalEmployees}</td>
                          <td className="bordered-cell">{totalWorkingDays}</td>
                          <td>{designation?.designation_rate}</td>
                          <td className="right-align">{totalAmount.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                    
                    {/* Grand Totals Row */}
                    <tr>
                      <td></td>
                      <td className="right-align specific-center">
                        <strong>Total</strong>
                      </td>
                      <td></td>
                      <td><strong>{grandTotals.totalEmployees}</strong></td>
                      <td className="bordered-cell">
                        <strong>{grandTotals.totalWorkingDays}</strong>
                      </td>
                      <td></td>
                      <td className="right-align">
                        <strong>{grandTotals.totalAmount.toFixed(2)}</strong>
                      </td>
                    </tr>
                    
                    {/* Bonus Row */}
                  
                        <tr>
                          <td></td>
                          <td className="right-align specific-center">
                            <strong style={{ fontSize: "14px" }}>
                              Bonus @8.33%
                            </strong>
                          </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td className="right-align">
                            <strong>
                              {(
                                invoiceSummary.gst_calculations.components[1].amount).toFixed(2)}
                            </strong>
                          </td>
                        </tr>
                    
                    {/* EPF Row */}

                    
                    <tr>
                      <td></td>
                      <td className="right-align specific-center">
                        <strong style={{ fontSize: "14px !important" }}>
                          EPF @13%
                        </strong>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="right-align">
                        <strong>{(
                                invoiceSummary.gst_calculations.components[2].amount ).toFixed(2)}</strong>
                      </td>
                    </tr>
                    
                    {/* ESI Row */}
                   

                    <tr>
                      <td></td>
                      <td className="right-align specific-center">
                        <strong style={{ fontSize: "14px !important" }}>
                           ESI@3.25%
                        </strong>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="right-align">
                        <strong>{(
                                invoiceSummary.gst_calculations.components[3].amount ).toFixed(2)}</strong>
                      </td>
                    </tr>
                    
                   
                    <tr>
                      <td></td>
                      <td className="right-align specific-center">
                        <strong style={{ fontSize: "14px !important" }}>
                           Material Charges
                        </strong>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="right-align">
                        <strong>{(
                                invoiceSummary.gst_calculations.components[4].amount ).toFixed(2)}</strong>
                      </td>
                    </tr>
                    
                    {/* Empty Row */}
                    <tr>
                      <td></td>
                      <td className="right-align">
                        <strong></strong>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    
                    {/* TOTAL Row */}
                    <tr>
                      <td></td>
                      <td className="right-align specific-center">
                        <strong>TOTAL</strong>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="right-align">
                        <strong>{salarySubtotal.toFixed(2)}</strong>
                      </td>
                    </tr>
                    
                    {/* Empty Row */}
                    <tr>
                      <td></td>
                      <td className="right-align">
                        <strong></strong>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    
                    {/* Service Charge Row */}
                    <tr>
                      <td></td>
                      <td className="right-align specific-center">
                        <strong>Service Charge @ {invoiceSummary.admin_charge_calculations?.value || 0.85} {invoiceSummary.admin_charge_calculations?.type === "percentage" ? "%" : "₹"}</strong>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="right-align">{(invoiceSummary.admin_charge_calculations?.total_admin_amount || 0).toFixed(2)}</td>
                    </tr>
                    
                    {/* Empty Row */}
                    <tr className="custom-border-row"  style={{borderTop: 0}}>
                      <td></td>
                      <td className="right-align">
                        <strong></strong>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    
                    {/* Total including GST */}
                    <tr >
                      <td
                        colSpan="6"
                        className="left-align text-left"
                        style={{ textAlign: "left", paddingLeft: "350px" }}
                      >
                        <strong>Total </strong>
                      </td>
                      <td className="right-align">
                        <strong>{(salarySubtotal + invoiceSummary.admin_charge_calculations?.total_admin_amount ).toFixed(2)}</strong>
                      </td>
                    </tr>
                    
                    {/* CGST */}
                    <tr>
                      <td
                        colSpan="6"
                        className="text-left left-align"
                        style={{ textAlign: "left", paddingLeft: "350px" }}
                      >
                        CGST @{invoiceSummary.gst_calculations?.gst_percentage || 9}%
                      </td>
                      <td className="right-align">{(totalGst / 2).toFixed(2)}</td>
                    </tr>
                    
                    {/* SGST */}
                    <tr>
                      <td
                        colSpan="6"
                        className="text-left left-align"
                        style={{ textAlign: "left", paddingLeft: "350px" }}
                      >
                        SGST @{invoiceSummary.gst_calculations?.gst_percentage || 9}%
                      </td>
                      <td className="right-align">{(totalGst / 2).toFixed(2)}</td>
                    </tr>
                    
                    {/* Rounded Off */}
                    <tr style={{ borderBottom: "1px solid black !important" }}>
                      <td
                        colSpan="6"
                        className="text-left left-align"
                        style={{ textAlign: "left", paddingLeft: "350px" }}
                      >
                        Less: Rounded Off (-) panding hai
                      </td>
                      <td className="bordered-cell right-align">-0.40</td>
                    </tr>
                    
                    {/* Grand Total */}
                    <tr>
                      <td colSpan="6" className="text-center right-align">
                        <strong>
                          {/* You can add number to words conversion here */}
                        </strong>
                        <strong style={{ marginLeft: "330px",fontWeight:'800' }}>
                          Grand Total
                        </strong>
                      </td>
                      <td className="right-align" style={{ fontWeight:'800' }}>
                       {(salarySubtotal + totalGst + invoiceSummary.admin_charge_calculations?.total_admin_amount).toFixed(2)}
                      </td>
                    </tr>
                    <tr className="custom-border-row ">
                      <td style={{ fontWeight:'800',whiteSpace:'nowrap' }} >Amount :- </td>
                      <td colSpan="6" style={{ textAlign: "left" , fontWeight:'800' }}> {convertNumberToWords(salarySubtotal + totalGst + invoiceSummary.admin_charge_calculations?.total_admin_amount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="declaration">
                <h5 className="text-center">Declaration</h5>
                <p>{invoiceData?.company?.bank_name }, {invoiceData?.company?.bank_branch }</p>
                <p>
                  <strong>A/C No: {invoiceData?.company?.account_number || "622505000413"}</strong>
                </p>
                <p>
                  <strong>PAN No.: {invoiceData?.company?.pan_number || "AAATC8738F"} | IFSC Code: {invoiceData?.company?.ifsc_code || "ICIC0000225"}</strong>
                </p>
              </div>
  
              <div className="footer-invoice">
                <div className="authorized-sign d-flex">
                  <div className="term-and-conditions">
                    <h5
                      style={{
                        textDecoration: "underline",
                        marginBottom: "20px",
                      }}
                    >
                      Terms &amp; Conditions
                    </h5>
                    <p>1. Goods once sold will not be taken back.</p>
                    <p>
                      2. Interest @18% p.a. will be charged if the payment is
                      not made within the stipulated time.
                    </p>
                    <p>3. Subject to Delhi Jurisdiction only.</p>
                  </div>
                  <div className="signature">
                    <p className="text-start">Reciver Signature:</p>
                    <p className="name text-center">
                      {invoiceData?.company?.company_name}
                    </p>
                    <p className="text-end">Authorized Signatory</p>
                    <img src={`https://green-owl-255815.hostingersite.com/${invoiceData?.company?.company_stamp}`}/>
                  </div>  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
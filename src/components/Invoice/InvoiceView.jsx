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
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("invoiceData", invoiceData)

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
      const company_id = sessionStorage.getItem('selected_company')
      return company_id;
    }
    return null;
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

        const apiUrl = `https://green-owl-255815.hostingersite.com/api/client/invoice?client_id=${clientId}&company_id=${companyId}`;
        
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
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Authentication failed. Token may be invalid or expired.");
          } else if (response.status === 404) {
            throw new Error("Invoice not found for the given client ID.");
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }
        
        const data = await response.json();
        console.log("Invoice API Response:", data); // Console the data
        
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
  }, [clientId]);

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
            <p className="mt-3">Loading invoice data...</p>
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
            <p>No invoice data found for client ID: {clientId}</p>
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

  return (
    <div className="col-lg-12">
          <div className="card invoice-container">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <h2 className="fs-16 fw-700 text-truncate-1-line mb-0" style={{width:'max-content'}}>
                  Client Name - Invoice 352 for the month of
                </h2>
     
                <div className="monthpicker-container asdfasdfasdfasdfasdf  ms-2  badge bg-soft-primary text-primary mx-3 fs-16 ">
                  <div
                    onClick={() => setToggleDateRange(!toggleDateRange)}
                    className="monthpicker-trigger p-0 m-0"
                  >
                    <MonthPicker
                      selectedMonth={selectedMonth}
                      setSelectedMonth={setSelectedMonth}
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
                    <h1>{invoiceData?.data?.company?.company_name}</h1>
                    <p style={{ marginMottom: "10px" }}>
                      {invoiceData?.data?.company?.address}
                    </p>
                    <p>
                      <span style={{ marginRight: "20px" }}>
                        Email: {invoiceData?.data?.company?.company_business_email}
                      </span>{" "}
                      <span style={{ marginLeft: "20px" }}>
                        Tel: {invoiceData?.data?.company?.company_phone}
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
                        <strong>{invoiceData?.data?.client?.contract_no}</strong>
                      </p>
                      <p>Invoice No.: AMPS/24-25/352</p>
                      <p style={{ margin: "20px 0px 20px 0px !important" }}>
                        Date: 01/10/2024
                      </p>
                      <p>Bill for the month of SEPTEMBER 2024 </p>
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
                        <tr>
                          <td>1</td>
                          <td className="right-align specific-center">
                            <strong>SECURITY SUPERVISOR</strong>
                          </td>
                          <td>998519</td>
                          <td>1</td>
                          <td className="bordered-cell">30</td>
                          <td>816</td>
                          <td className="right-align">24480.00</td>
                        </tr>
     
                        <tr>
                          <td>2</td>
                          <td className="right-align specific-center">
                            <strong>SECURITY GUARD</strong>
                          </td>
     
                          <td className="right-align"></td>
                          <td className="right-align">33</td>
                          <td className="bordered-cell right-align">974</td>
                          <td className="right-align">742</td>
                          <td className="right-align">722708.00</td>
                        </tr>
     
                        <tr>
                          <td></td>
                          <td className="right-align specific-center">
                            <strong>Total</strong>
                          </td>
     
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align">
                            <strong>1004.00</strong>
                          </td>
                          <td className="right-align"></td>
                          <td className="right-align">
                            <strong>747188.00</strong>
                          </td>
                        </tr>
     
                        <tr>
                          <td></td>
                          <td className="right-align specific-center">
                            <strong style={{ fontSize: "14px !importnat" }}>
                              Bonus@8.33%
                            </strong>
                          </td>
     
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align">
                            <strong>62240.76</strong>
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td className="right-align specific-center">
                            <strong style={{ fontSize: "14px !importnat" }}>
                              EPF 15000@13%
                            </strong>
                          </td>
     
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align">72150.00</td>
                        </tr>
                        <tr>
                          <td></td>
                          <td className="right-align specific-center">
                            <strong style={{ fontSize: "14px !importnat" }}>
                              ESI@3.25%
                            </strong>
                          </td>
     
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align">24283.61</td>
                        </tr>
     
                        <tr>
                          <td></td>
                          <td className="right-align">
                            <strong></strong>
                          </td>
     
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                        </tr>
                        <tr>
                          <td></td>
                          <td className="right-align specific-center">
                            <strong>TOTAL</strong>
                          </td>
     
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align">
                            <strong>905862.37</strong>
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td className="right-align">
                            <strong></strong>
                          </td>
     
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                        </tr>
                        <tr>
                          <td></td>
                          <td className="right-align specific-center">
                            <strong>Service Charge @ 0.85%</strong>
                          </td>
     
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align">7699.83</td>
                        </tr>
     
                        <tr>
                          <td></td>
                          <td className="right-align">
                            <strong></strong>
                          </td>
     
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid black !important" }}>
                          <td></td>
                          <td className="right-align">
                            <strong></strong>
                          </td>
     
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                          <td className="right-align"></td>
                        </tr>
     
                        <tr>
                          <td
                            colSpan="6"
                            className="left-align text-left"
                            style={{ textAlign: "left", paddingLeft: "350px" }}
                          >
                            <strong>Total (including GST) </strong>
                          </td>
                          <td className="right-align">
                            <strong>913562.20</strong>
                          </td>
                        </tr>
     
                        <tr>
                          <td
                            colSpan="6"
                            className="text-left left-align"
                            style={{ textAlign: "left", paddingLeft: "350px" }}
                          >
                            CGST @9.00%
                          </td>
                          <td className="right-align">82220.60</td>
                        </tr>
     
                        <tr>
                          <td
                            colSpan="6"
                            className="text-left left-align"
                            style={{ textAlign: "left", paddingLeft: "350px" }}
                          >
                            SGST @9.00%
                          </td>
                          <td className="right-align">82220.60</td>
                        </tr>
     
                        <tr style={{ borderBottom: "1px solid black !important" }}>
                          <td
                            colSpan="6"
                            className="text-left left-align"
                            style={{ textAlign: "left", paddingLeft: "350px" }}
                          >
                            Less: Rounded Off (-)
                          </td>
                          <td className="bordered-cell right-align">-0.40</td>
                        </tr>
     
                        <tr>
                          <td colSpan="6" className="text-center right-align">
                            <strong>
                              Rupees: Ten Lakh Seventy Eight Thousand Three rupees
                              /-
                            </strong>
                            <strong style={{ marginLeft: "330px" }}>
                              Grand Total
                            </strong>
                          </td>
                          <td className="right-align">
                            <strong>1,26,604.00</strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="declaration">
                    <h5 className="text-center">Declaration</h5>
                    <p>ICICI BANK, Laxmi Nagar</p>
                    <p>
                      <strong>A/C No: 622505000413</strong>
                    </p>
                    <p>
                      <strong>PAN No.: AAATC8738F | IFSC Code: ICIC0000225</strong>
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
                          Alpha Manpower Services Private Limited
                        </p>
                        <p className="text-end">Authorized Signatory</p>
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
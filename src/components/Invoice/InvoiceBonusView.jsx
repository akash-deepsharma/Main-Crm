"use client";
import React, { useState } from "react";
import { FiDownload, FiPrinter, FiSend } from "react-icons/fi";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./InvoiceView.css";
import MonthPicker from "../shared/MonthPicker";

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

const InvoiceBonusView = () => {
  const [toggleDateRange, setToggleDateRange] = useState(false);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  return (
    <div className="col-lg-12">
      <div className="card invoice-container">
        <div className="card-header">
          <div className="d-flex align-items-center">
            <h2 className="fs-16 fw-700 text-truncate-1-line mb-0" style={{width:'max-content'}}>
              Client Name - Invoice 352 from the month year to month year
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
                 <p className="d-flex justify-content-between px-2 fs-8">
                  <span style={{ marginRight: "20px" }}>
                    <span className="fw-bold">GSTIN:</span> 09AAFCK6489H1ZY
                  </span>{" "}
                  <span style={{ marginLeft: "20px" }}>
                    <span className="fw-bold">PAN:</span> AAFCK6489H
                  </span>
                </p>
                <span className="fw-bold">TAX INVOICE</span>
                <h1>KDS International Pvt. Ltd.</h1>
                <p style={{ marginMottom: "10px" }}>
                  413, G/F, Street no. 01, Sarpanch ka Bara, Mandwali, Delhi- 110092
                </p>
                <p>
                  <span style={{ marginRight: "20px" }}>
                    Email: alphaprivatelimited1@gmail.com
                  </span>{" "}
                  <span style={{ marginLeft: "20px" }}>
                    Tel: 9899998149, 8585902112
                  </span>
                </p>
              </div>

              <div className="party-details">
                <div className="details-1">
                  <p>
                    <strong>GEMC-511687703389806</strong>
                  </p>
                  <p><span style={{fontWeight:'bold'}}>Invoice No.:</span> AMPS/24-25/352</p>
                  <p>Bonus For The Month of APRIL 24 TO MARCH 2025 </p>
                                    
                </div>
                <div className="details-2">
                  <p style={{ margin: "20px 0px 20px 0px !important" }}>
                    <span style={{fontWeight:'bold'}}>Date:</span> 01/10/2024
                  </p>
                  <p><span style={{fontWeight:'bold'}}>Place of Supply:</span> Delhi</p>
                </div>
              </div>
              <div className="party-details " style={{borderTop:'1px solid black'}}>
                <div className="details-1 pt-3">
                  <p className="fw-bold">Supplier Details:</p>
                  <p>
                    <span className="fw-bold" style={{fontSize:'16px'}}>KDS International Pvt. Ltd.</span>
                  </p>
                  <p>
                    <span className="fw-bold">413, G/F, Street no. 01, Sarpanch ka Bara, Mandwali, Delhi-110092</span>
                  </p>
                  <p>
                    <span className="fw-bold">GSTIN:</span> 09AAFCK6489H1ZY
                  </p>
                  <p>
                    <span className="fw-bold"> PAN: </span> AAFCK6489H
                  </p>
                </div>
                <div className="details-2">
                  <p>
                    <strong>Buyer / Bill To</strong>
                  </p>
                  <p>
                    <span className="fw-bold" style={{fontSize:'16px'}}>Ministry of Earth Sciences</span>
                  </p>
                  <p>
                    <span className="fw-bold">Prithvi Bhawan, Lodhi Road, South East Delhi, 110003</span>
                  </p>
                  <p><span style={{fontWeight:'bold'}}>GSTIN :</span> 07DELD08476G1DF</p>
                  <p><span style={{fontWeight:'bold'}}>State :</span> Delhi (Code 07)</p>
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
                        ATTENDENCE
                      </th>
                      <th
                        className="bordered-cell"
                        style={{ width: "92.78px" }}
                      >
                        Rate
                      </th>
                      <th
                        className="bordered-cell"
                        style={{ width: "92.78px" }}
                      >
                        Wages
                      </th>
                      <th
                        className="bordered-cell right-align"
                        style={{ width: "146.68px" }}
                      >
                        Bonus
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
                      <td className="bordered-cell">816</td>
                      <td>1240</td>
                      <td>1011840</td>
                      <td className="right-align">84286.27</td>
                    </tr>

                    <tr>
                      <td>2</td>
                      <td className="right-align specific-center">
                        <strong>SECURITY GUARD</strong>
                      </td>

                      <td className="right-align"></td>
                      <td className="bordered-cell right-align">974</td>
                      <td className="right-align">1123</td>
                      <td className="right-align">1093802</td>
                      <td className="right-align">91113.70</td>
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
                      <td className="right-align">
                        <strong>1790</strong>
                      </td>
                      <td className="right-align"></td>
                      
                      <td className="right-align">2105642</td>
                      <td className="right-align">
                        <strong>175399.97</strong>
                      </td>
                    </tr>

    
                    {/* <tr>
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
                    </tr> */}
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
                        <strong>Service Charge @ 3.85%</strong>
                      </td>

                      <td className="right-align"></td>
                      <td className="right-align"></td>
                      <td className="right-align"></td>
                      <td className="right-align"></td>
                      <td className="right-align">6752.90</td>
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

                    <tr cl>
                      <td
                        colSpan="6"
                        className=" bordered-cell border-bottom-0 left-align text-left"
                        style={{ textAlign: "left", paddingLeft: "350px" }}
                      >
                        <strong>Total (including GST) </strong>
                      </td>
                      <td className="right-align bordered-cell border-bottom-0">
                        <strong>182152.87</strong>
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
                      <td className="right-align">16,393.75</td>
                    </tr>

                    <tr>
                      <td
                        colSpan="6"
                        className="text-left left-align"
                        style={{ textAlign: "left", paddingLeft: "350px" }}
                      >
                        SGST @9.00%
                      </td>
                      <td className="right-align">16,393.75</td>
                    </tr>

                    <tr style={{ borderBottom: "1px solid black !important" }}>
                      <td
                        colSpan="6"
                        className="text-left left-align"
                        style={{ textAlign: "left", paddingLeft: "350px" }}
                      >
                        Less: Rounded Off (+)
                      </td>
                      <td className="bordered-cell right-align">+0.50</td>
                    </tr>

                    <tr>
                      <td colSpan="6" className="text-center right-align bordered-cell border-bottom-0">
                        <strong>
                          Rupees: Ten Lakh Seventy Eight Thousand Three rupees
                          /-
                        </strong>
                        <strong style={{ marginLeft: "330px" }}>
                          Grand Total
                        </strong>
                      </td>
                      <td className="right-align">
                        <strong>214940.00</strong>
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
                      KDS International Pvt. Ltd.
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

export default InvoiceBonusView;

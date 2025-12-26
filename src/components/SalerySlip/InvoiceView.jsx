"use client";
import React from "react";
import {
  FiDownload,
  FiPrinter,
  FiSend,
} from "react-icons/fi";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./InvoiceView.css";

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
  return (
    <div className="col-lg-12">
      <div className="card invoice-container">
        <div className="card-header">
          <div>
            <h2 className="fs-16 fw-700 text-truncate-1-line mb-0">
              Salary Slip Preview
            </h2>
          </div>

          <div className="d-flex align-items-center justify-content-center">
            <a className="d-flex me-1">
              <div className="avatar-text avatar-md"   onClick={() => sharePDF("invoiceDiv", "Salary-Slip")}>
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
                onClick={() =>
                  downloadPDF("invoiceDiv", "Salary-Slip")
                }
              >
                <FiDownload size={12} />
              </div>
            </a>
          </div>
        </div>

        <div className="card-body p-5">
          {/* ADD ID HERE */}
          <div id="invoiceDiv" className="parent-class">
            <div className="table-responsive container">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th className="caption-one text-center p-4" colSpan="4">
                      <Image
                        src="/images/logo-full.png"
                        alt=""
                        width={150}
                        height={50}
                      />
                    </th>
                  </tr>

                  <tr>
                    <th className="caption-two" colSpan="4">
                      Pay Slip
                    </th>
                  </tr>

                  <tr className="heading-name">
                    <td colSpan="4">
                      <b>Employee Name :</b> Akash Deep sharma
                    </td>
                  </tr>

                  <tr className="heading-name">
                    <td colSpan="4">
                      <b>Designation :</b> Developer
                    </td>
                  </tr>

                  <tr className="heading-name">
                    <td colSpan="4">
                      <b>Department :</b> Development
                    </td>
                  </tr>

                  <tr className="heading-name">
                    <td colSpan="4">
                      <b>Month :</b> Dec
                    </td>
                  </tr>

                  <tr className="earning-heading">
                    <th colSpan="2">Earnings</th>
                    <th colSpan="2">Deductions</th>
                  </tr>

                  <tr className="earning-subheading">
                    <th>Salary head</th>
                    <th>Amount</th>
                    <th>Salary head</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Basic</td>
                    <td></td>
                    <td>PF Employee</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>H R A</td>
                    <td></td>
                    <td>ESI Employee</td>
                    <td></td>
                  </tr>

                  <tr>
                    <td>Conv. All</td>
                    <td></td>
                    <td>Loan</td>
                    <td></td>
                  </tr>

                  <tr>
                    <td>Trans. All</td>
                    <td></td>
                    <td>Tax</td>
                    <td></td>
                  </tr>

                  <tr>
                    <td>CEA</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td>Others</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td>Medical Allowance</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <th>SALARY (GROSS)/ PM</th>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td>PF Employer</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td>ESI Employer</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td>Medical</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td>Telephone</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td>Others</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <th>Salary</th>
                    <th></th>
                    <th>Total Deduction</th>
                    <th></th>
                  </tr>
                </tbody>
              </table>

              <div className="footer py-5">
                <div className="sign">
                  Prepared by <br />
                  <p>-----------------------</p>
                </div>

                <div className="sign">
                  Checked by <br />
                  <p>-----------------------</p>
                </div>

                <div className="sign">
                  Authorized by <br />
                  <p>-----------------------</p>
                </div>
              </div>
            </div>
          </div>
          {/* END invoiceDiv */}
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;

"use client";
import React, { useEffect, useState } from "react";
import {
  FiDownload,
  FiPrinter,
  FiSend,
} from "react-icons/fi";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./InvoiceView.css";
import { useSearchParams } from 'next/navigation'; 

// Helper functions (same)
const downloadPDF = async (id, fileName) => {
  const input = document.getElementById(id);
  if (!input) return;

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

const printDiv = async (id) => {
  const element = document.getElementById(id);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 1.5,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");

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


  //hello

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
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get URL parameters
  const employeeId = searchParams.get('employee_id');
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  const employeeName = searchParams.get('employee_name');
  const designation = searchParams.get('designation');

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error("Authentication token not found. Please login again.");
        }

        const apiUrl = `https://green-owl-255815.hostingersite.com/api/salary-with-employee?employee_id=${employeeId}&month=${month}&year=${year}`;
        
        console.log("Fetching from:", apiUrl);
        console.log("Token:", token.substring(0, 20) + "...");

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result);
        
        // Check different response structures
        if (result.data) {
          setSalaryData(result.data);
        } else if (result) {
          setSalaryData(result);
        } else {
          throw new Error("No data received from API");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (employeeId && month && year) {
      fetchSalaryData();
    } else {
      setError("Missing required parameters: employee_id, month, or year");
      setLoading(false);
    }
  }, [employeeId, month, year]);

  // Debug: Show what we have
  useEffect(() => {
    if (salaryData) {
      console.log("Current salaryData:", salaryData);
    }
  }, [salaryData]);

  if (loading) {
    return (
      <div className="col-lg-12">
        <div className="card invoice-container">
          <div className="card-body p-5 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading salary data...</p>
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
            <div className="alert alert-danger">
              <h5>Error Loading Data</h5>
              <p>{error}</p>
              <p className="small">Please check:</p>
              <ul className="text-start">
                <li>Are you logged in? (Token required)</li>
                <li>Correct employee_id: {employeeId}</li>
                <li>Correct month: {month}</li>
                <li>Correct year: {year}</li>
              </ul>
              <button 
                className="btn btn-primary mt-3"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-lg-12">
      <div className="card invoice-container">
        <div className="card-header">
          <div>
            <h2 className="fs-16 fw-700 text-truncate-1-line mb-0">
              Salary Slip Preview
            </h2>
            {salaryData && (
              <small className="text-muted">
                {salaryData.employee?.name || employeeName} - {salaryData.month} {salaryData.year}
              </small>
            )}
          </div>

          <div className="d-flex align-items-center justify-content-center">
            <a className="d-flex me-1" style={{ cursor: 'pointer' }}>
              <div 
                className="avatar-text avatar-md"   
                onClick={() => sharePDF("invoiceDiv", "Salary-Slip")}
              >
                <FiSend size={12} />
              </div>
            </a>

            <a className="d-flex me-1 printBTN" style={{ cursor: 'pointer' }}>
              <div
                className="avatar-text avatar-md"
                onClick={() => printDiv("invoiceDiv")}
              >
                <FiPrinter size={12} />
              </div>
            </a>

            <a className="d-flex me-1 file-download" style={{ cursor: 'pointer' }}>
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
          {!salaryData ? (
            <div className="text-center py-5">
              <p>No salary data available</p>
            </div>
          ) : (
            <div id="invoiceDiv" className="parent-class">
              <div className="table-responsive container">
                <table className="table table-bordered align-middle">
                  <thead>
                    <tr>
                      <th className="caption-one text-center p-4" colSpan="4">
                        <Image
                          src="/images/logo-full.png"
                          alt="Company Logo"
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
                        <b>Employee Name :</b> {salaryData.employee?.name || employeeName}
                      </td>
                    </tr>

                    <tr className="heading-name">
                      <td colSpan="4">
                        <b>Designation :</b> {salaryData.designation?.name || designation}
                      </td>
                    </tr>

                    <tr className="heading-name">
                      <td colSpan="4">
                        <b>Month :</b> {salaryData.month} {salaryData.year}
                      </td>
                    </tr>

                    <tr className="heading-name">
                      <td colSpan="4">
                        <b>Present Days :</b> {salaryData.present_days}
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
                      <td>{salaryData.basic_salary}</td>
                      <td>PF Employee</td>
                      <td>{salaryData.employee_epfo || "0.00"}</td>
                    </tr>
                    <tr>
                      <td>H R A</td>
                      <td>0.00</td>
                      <td>ESI Employee</td>
                      <td>{salaryData.employee_esi || "0.00"}</td>
                    </tr>

                    <tr>
                      <td>Conv. All</td>
                      <td>0.00</td>
                      <td>Loan</td>
                      <td>0.00</td>
                    </tr>

                    <tr>
                      <td>Trans. All</td>
                      <td>0.00</td>
                      <td>Tax</td>
                      <td>0.00</td>
                    </tr>

                    <tr>
                      <td>CEA</td>
                      <td>0.00</td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>Others</td>
                      <td>0.00</td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>Medical Allowance</td>
                      <td>{salaryData.allowance}</td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <th>SALARY (GROSS)/ PM</th>
                      <td>{salaryData.gross_salary}</td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>PF Employer</td>
                      <td>{salaryData.epf}</td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>ESI Employer</td>
                      <td>{salaryData.esi}</td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>Medical</td>
                      <td>0.00</td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>Telephone</td>
                      <td>0.00</td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>Others</td>
                      <td>0.00</td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>Overtime</td>
                      <td>{salaryData.overtime_amount}</td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>Bonus</td>
                      <td>{salaryData.bonus}</td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>Arrears</td>
                      <td>{salaryData.arrear_amount}</td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <th>Total Earnings</th>
                      <th>
                        {(
                          parseFloat(salaryData.basic_salary || 0) +
                          parseFloat(salaryData.allowance || 0) +
                          parseFloat(salaryData.overtime_amount || 0) +
                          parseFloat(salaryData.bonus || 0) +
                          parseFloat(salaryData.arrear_amount || 0)
                        ).toFixed(2)}
                      </th>
                      <th>Total Deduction</th>
                      <th>
                        {(
                          parseFloat(salaryData.epf || 0) +
                          parseFloat(salaryData.esi || 0) +
                          parseFloat(salaryData.employee_epfo || 0) +
                          parseFloat(salaryData.employee_esi || 0)
                        ).toFixed(2)}
                      </th>
                    </tr>

                    <tr style={{ background: '#fff3cd' }}>
                      <td colSpan="2"><strong>Net Salary Payable</strong></td>
                      <td colSpan="2" className="text-end">
                        <strong className="text-success">
                          ₹ {(
                            parseFloat(salaryData.gross_salary || 0) 
                           ).toFixed(2)}
                        </strong>
                      </td>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
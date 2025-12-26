"use client";
import React, { useState } from "react";
import "./TabWagesSheet.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const downloadPDF = async (id, fileName) => {
  const input = document.getElementById(id);

  const canvas = await html2canvas(input, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const margin = 8.5; // 24px ≈ 8.5mm
  const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2;
  const pdfHeight = pdf.internal.pageSize.getHeight() - margin * 2;

  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pdfWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  // Center vertically inside margins
  const yPosition = margin;

  pdf.addImage(imgData, "PNG", margin, yPosition, imgWidth, imgHeight);

  pdf.save(fileName + ".pdf");
};
const TabWagesSheet = () => {
    const [mode, setMode] = useState("day");

  return (
    <div className="tab-pane fade active show" id="overviewTab">
      <div className="row">
        <div className="col-lg-12">
          {/* <div className="card stretch stretch-full"> */}
          <div className="card-body task-header d-md-flex align-items-center justify-content-between mb-4">
            <div className="filter-dropdown">
              <a
                className="btn btn-icon btn-light-brand dropdown-toggle"
                data-bs-toggle="dropdown"
                data-bs-offset="0, 10"
              >
                {mode === "day" ? "Per Day" : "Per Month"}{" "}
              </a>
              <div className="dropdown-menu wd-200">
                <button
                  href="#"
                  className="dropdown-item"
                  onClick={() => setMode("day")}
                >
                  <span> 01 - Per Day</span>
                </button>
                <button
                  href="#"
                  className="dropdown-item"
                  onClick={() => setMode("month")}
                >
                  <span> 02 - Per Month</span>
                </button>
              </div>
            </div>
          </div>
          {/* </div> */}
        </div>
        <div className="col-xl-12">
          <div className="card stretch stretch-full">
            <div className="card-body">
              <h3 className="mb-4">
                Wages Sheet{" "}
                <span className="text-primary">
                  {mode === "day" ? " Per Day" : " Per Month"}
                </span>{" "}
              </h3>
              <div className="row">
                {/* ---------------------- PER DAY SHEET ---------------------- */}
                {mode === "day" && (
                  <>
                    <div className="col-md-6 mb-2">
                      <PerDayWagesSheet id="day-sheet-1" />
                    </div>
                    <div className="col-md-6 mb-2">
                      <PerDayWagesSheet id="day-sheet-2" />
                    </div>
                  </>
                )}

                {/* ---------------------- PER MONTH SHEET ---------------------- */}
                {mode === "month" && (
                  <>
                    <div className="col-md-6 mb-2">
                      <PerMonthWagesSheet  id="month-sheet-1"/>
                    </div>
                    <div className="col-md-6 mb-2">
                      <PerMonthWagesSheet  id="month-sheet-2"/>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabWagesSheet;

const PerDayWagesSheet = ({id}) => {
  return (  
    <div>
         
      <div class="wages-sheet rounded mt-5" id={id} >
        <div
          class="wages-sheet-header mb-4"
          style={{
            backgroundImage: "url('/images/general/wages_invoice_bg.png')",
          }}
        >
          <div class="p-3 pb-0">
            <div class="company-details d-flex flex-column justify-content-center pt-3">
              <div class="text-center">
                <h5 class="mb-0 fw-bold fs-4">Company Name</h5>
                <p class="mb-0 mt-2 fw-bold">
                  Complete Address, City, State, Country
                </p>
              </div>
            </div>

            <div class="company-contacts d-flex justify-content-between align-items-center">
              <div class="company-mail">
                <p>
                  <span>Email:</span> company@email.com
                </p>
              </div>
              <div class="company-number">
                <p>
                  <span>Tel:</span> 0000000000
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="employee-details">
          <div class="px-3 d-flex justify-content-between">
            <div class="designation">
              <h5>DESIGNATION :</h5>
              <p class="fw-bold">Designation Here</p>
            </div>

            <div class="wages-days">
              <h5 class="d-flex align-items-center">
                Wages Format: <span>Per Day</span>
              </h5>
            </div>
          </div>
        </div>

        <div class="salary-summary">
          <div class="px-3 mt-3">
            <h5 class="mb-3 fw-bold">Payment For The Day Of DD MM YYYY</h5>
            <h6 class="mb-3 fw-bold">Employee Pay Summary</h6>

            <div class="row m-0">
              <div class="col-7">
                <div class="salary-details">
                  <p>
                    <b>PF Share @ 12%</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>ESI @ 0.75%</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Bonus @ 8.33%</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Optional Allowance 1</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Optional Allowance 2</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                </div>
              </div>

              <div class="col-5">
                <div class="salary-amount-details">
                  <p class="text-center">
                    <span>Paid Days: 1</span> | <span>Wages: 0.00</span>
                  </p>

                  <div class="basic-salary-box text-center">
                    <p class="mb-0 fs-4 text-muted">Total Salary</p>
                    <p class="amount mb-0">₹ 0.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="salary-summary-2 mt-3 mb-3">
          <div class="px-3">
            <div class="row m-0">
              <div class="col-6">
                <div class="salary-details">
                  <p>
                    <b>EPF @ 13%</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>ESI @ 3.25%</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Optional Allowance 1</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Optional Allowance 2</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Total</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                </div>
              </div>

              <div class="col-6">
                <div class="salary-details">
                  <p>
                    <b>Service Charge @ 3.85%</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>GST @ 18%</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                </div>
              </div>
            </div>

            <div class="total-salary d-flex justify-content-between align-items-center">
              <p class="mb-0 fw-bold fs-4">Per Day Bill Amount</p>
              <p class="mb-0 fw-bold fs-4">0.00</p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-end d-flex justify-content-center mt-3">
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => downloadPDF(id, "Per-Day-Wages-Sheet")}
        >
          Download PDF
        </button>
      </div>

    </div>
  );
};

const PerMonthWagesSheet = ({id}) => {
  return (
<div>
    
      <div class="wages-sheet rounded mt-5" id={id}>
        <div
          class="wages-sheet-header mb-4"
          style={{
            backgroundImage: "url('/images/general/wages_invoice_bg.png')",
          }}
        >
          <div class="p-3 pb-0">
            <div class="company-details d-flex flex-column justify-content-center pt-3">
              <div class="text-center">
                <h5 class="mb-0 fw-bold fs-4">Company Name</h5>
                <p class="mb-0 mt-2 fw-bold">
                  Complete Address, City, State, Country
                </p>
              </div>
            </div>

            <div class="company-contacts d-flex justify-content-between align-items-center">
              <div class="company-mail">
                <p>
                  <span>Email:</span> company@email.com
                </p>
              </div>
              <div class="company-number">
                <p>
                  <span>Tel:</span> 0000000000
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="employee-details">
          <div class="px-3 d-flex justify-content-between">
            <div class="designation">
              <h5>DESIGNATION :</h5>
              <p class="fw-bold">Designation Here</p>
            </div>

            <div class="wages-days">
              <h5 class="d-flex align-items-center">
                Wages Format: <span>Per Month</span>
              </h5>
            </div>
          </div>
        </div>

        <div class="salary-summary">
          <div class="px-3 mt-3">
            <h5 class="mb-3 fw-bold">Payment For The Month Of <span>June</span></h5>
            <h6 class="mb-3 fw-bold">Employee Pay Summary</h6>

            <div class="row m-0">
              <div class="col-7">
                <div class="salary-details">
                  <p>
                    <b>PF Share @ 12%</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>ESI @ 0.75%</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Bonus @ 8.33%</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Optional Allowance 1</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Optional Allowance 2</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                </div>
              </div>

              <div class="col-5">
                <div class="salary-amount-details">
                  <p class="text-center">
                    <span>Paid Days: 1</span> | <span>Wages: 0.00</span>
                  </p>

                  <div class="basic-salary-box text-center">
                    <p class="mb-0 fs-4 text-muted">Total Salary</p>
                    <p class="amount mb-0">₹ 0.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="salary-summary-2 mt-3 mb-3">
          <div class="px-3">
            <div class="row m-0">
              <div class="col-6">
                <div class="salary-details">
                  <p>
                    <b>EPF @ 13%</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>ESI @ 3.25%</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Optional Allowance 1</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Optional Allowance 2</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Total</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                </div>
              </div>

              <div class="col-6">
                <div class="salary-details">
                  <p>
                    <b>Service Charge @ 3.85%</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>GST @ 18%</b>
                    <span class="span">:</span>
                    <span>0.00</span>
                  </p>
                </div>
              </div>
            </div>

            <div class="total-salary d-flex justify-content-between align-items-center">
              <p class="mb-0 fw-bold fs-4">Per Day Bill Amount</p>
              <p class="mb-0 fw-bold fs-4">0.00</p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-end mt-3 d-flex justify-content-center">
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => downloadPDF(id, "Per-Month-Wages-Sheet")}
        >
          Download PDF
        </button>
      </div>

</div>
  );
};

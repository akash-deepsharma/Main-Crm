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

const TabWagesSheet = ({ data }) => {
  const [mode, setMode] = useState("day");
  const wagesData = data?.service || [];
  const ComanyData = data.company || [];
  console.log( "ComanyData", ComanyData)
  
  return (
    <div className="tab-pane fade active show" id="overviewTab">
      <div className="row">
        <div className="col-lg-12">
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
                {mode === "day" && wagesData.map((item, index) => (
                  <div key={item.id || index} className="col-md-6 mb-4">
                    <PerDayWagesSheet data={item} comp={ComanyData} id={`day-sheet-${index + 1}`} />
                  </div>
                ))}

                {mode === "month" && wagesData.map((item, index) => (
                  <div key={item.id || index} className="col-md-6 mb-4">
                    <PerMonthWagesSheet data={item} comp={ComanyData} id={`month-sheet-${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabWagesSheet;

const PerDayWagesSheet = ({ id, data ,comp}) => {
  // Calculate per day values
  const minDailyWages = parseFloat(data?.min_daily_wages) || 0;
  
  // Only get values if they are applicable
  const pfShare = data?.is_pf_applicable ? parseFloat(data?.provideant_fund) || 0 : 0;
  const esiEmployee = data?.is_esi_applicable ? parseFloat(data?.esiPerDay) || 0 : 0;
  const bonus = data?.is_bonus_applicable ? parseFloat(data?.bonus) || 0 : 0;
  const optionalAllowance1 = data?.is_optional_allowance_1_applicable ? parseFloat(data?.optionAllowance1) || 0 : 0;
  const optionalAllowance2 = data?.is_optional_allowance_2_applicable ? parseFloat(data?.optionAllowance2) || 0 : 0;
  const optionalAllowance3 = data?.is_optional_allowance_3_applicable ? parseFloat(data?.optionAllowance3) || 0 : 0;
  
  // Employer contributions (only if applicable)
  const epf = data?.is_epf_admin_charge_applicable ? parseFloat(data?.epf_admin_charge) || 0 : 0;
  const edli = data?.is_edli_applicable ? parseFloat(data?.edliPerDay) || 0 : 0;
  const esiEmployer = data?.is_esi_applicable ? esiEmployee * (3.25 / 0.75) : 0;
  
  // Calculate total employee salary (only applicable items)
  const totalEmployeeSalary = minDailyWages - 
    (data?.is_pf_applicable ? pfShare : 0) -
    (data?.is_esi_applicable ? esiEmployee : 0) +
    (data?.is_bonus_applicable ? bonus : 0) +
    (data?.is_optional_allowance_1_applicable ? optionalAllowance1 : 0) +
    (data?.is_optional_allowance_2_applicable ? optionalAllowance2 : 0) +
    (data?.is_optional_allowance_3_applicable ? optionalAllowance3 : 0);
  
  // Calculate total employer cost (only applicable items)
  const totalEmployerCost = 
    (data?.is_epf_admin_charge_applicable ? epf : 0) +
    (data?.is_edli_applicable ? edli : 0) +
    (data?.is_esi_applicable ? esiEmployer : 0);
    // +
    // (data?.is_optional_allowance_1_applicable ? optionalAllowance1 : 0) +
    // (data?.is_optional_allowance_2_applicable ? optionalAllowance2 : 0);
    // (data?.is_optional_allowance_3_applicable ? optionalAllowance3 : 0);
  
  // Total cost before service charge
  const totalCostBeforeServiceCharge = totalEmployeeSalary + totalEmployerCost;
  
  // Calculate service charge on applicable costs
  const serviceChargePercent = parseFloat(data?.perecnt_service_charge) || 3.85;
  const serviceCharge = (totalCostBeforeServiceCharge * serviceChargePercent) / 100;
  
  // Calculate GST on service charge
  const gstPercent = 18;
  const gst = (serviceCharge * gstPercent) / 100;
  
  // Final bill amount
  const totalBillAmount = totalCostBeforeServiceCharge + serviceCharge + gst;
  
  // Format date for display
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace(/ /g, ' ');
  
  return (
    <div>
      <div className="wages-sheet rounded mt-5" id={id}>
        <div
          className="wages-sheet-header mb-4"
          style={{
            backgroundImage: "url('/images/general/wages_invoice_bg.png')",
          }}
        >
          <div className="p-3 pb-0">
            <div className="company-details d-flex flex-column justify-content-center pt-3">
              <div className="text-center">
                <h5 className="mb-0 fw-bold fs-4">{comp?.company_name || "Company Name"}</h5>
                <p className="mb-0 mt-2 fw-bold">
                  {comp?.address || "Complete Address, City, State, Country"}
                </p>
              </div>
            </div>

            <div className="company-contacts d-flex justify-content-between align-items-center">
              <div className="company-mail">
                <p>
                  <span>Email:</span> {comp?.company_business_email || "company@email.com"}
                </p>
              </div>
              <div className="company-number">
                <p>
                  <span>Tel:</span> {comp?.company_phone || "0000000000"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="employee-details">
          <div className="px-3 d-flex justify-content-between">
            <div className="designation">
              <h5>DESIGNATION:</h5>
              <p className="fw-bold">{data?.designation?.name || "Designation Here"}</p>
            </div>

            <div className="wages-days">
              <h5 className="d-flex align-items-center">
                Wages Format: <span>Per Day</span>
              </h5>
            </div>
          </div>
        </div>

        <div className="salary-summary">
          <div className="px-3 mt-3">
            <h5 className="mb-3 fw-bold">Payment For The Day Of {formattedDate}</h5>
            <h6 className="mb-3 fw-bold">Employee Pay Summary</h6>

            <div className="row m-0">
              <div className="col-7">
                <div className="salary-details">
                  {data?.is_pf_applicable && (
                    <p>
                      <b>PF Share @ 12%</b>
                      <span className="span">:</span>
                      <span>{pfShare.toFixed(2)}</span>
                    </p>
                  )}
                  {data?.is_esi_applicable && (
                    <p>
                      <b>ESI @ 0.75%</b>
                      <span className="span">:</span>
                      <span>{esiEmployee.toFixed(2)}</span>
                    </p>
                  )}
                  {data?.is_bonus_applicable && (
                    <p>
                      <b>Bonus @ 8.33%</b>
                      <span className="span">:</span>
                      <span>{bonus.toFixed(2)}</span>
                    </p>
                  )}
                  {data?.is_optional_allowance_1_applicable && (
                    <p>
                      <b>Optional Allowance 1</b>
                      <span className="span">:</span>
                      <span>{optionalAllowance1.toFixed(2)}</span>
                    </p>
                  )}
                  {data?.is_optional_allowance_2_applicable && (
                    <p>
                      <b>Optional Allowance 2</b>
                      <span className="span">:</span>
                      <span>{optionalAllowance2.toFixed(2)}</span>
                    </p>
                  )}
                  {data?.is_optional_allowance_3_applicable && (
                    <p>
                      <b>Optional Allowance 3</b>
                      <span className="span">:</span>
                      <span>{optionalAllowance3.toFixed(2)}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="col-5">
                <div className="salary-amount-details">
                  <p className="text-center">
                    <span>Paid Days: 1</span> | <span>Wages: {minDailyWages.toFixed(0)}</span>
                  </p>

                  <div className="basic-salary-box text-center">
                    <p className="mb-0 fs-4 text-muted">Total Salary</p>
                    <p className="amount mb-0">₹ {totalEmployeeSalary.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="salary-summary-2 mt-3 mb-3">
          <div className="px-3">
            <div className="row m-0">
              <div className="col-6">
                <div className="salary-details">
                  {data?.is_epf_admin_charge_applicable && (
                    <p>
                      <b>EPF Admin @ 0.5%</b>
                      <span className="span">:</span>
                      <span>{epf.toFixed(2)}</span>
                    </p>
                  )}
                  {data?.is_edli_applicable && (
                    <p>
                      <b>EDLI @ 0.5%</b>
                      <span className="span">:</span>
                      <span>{edli.toFixed(2)}</span>
                    </p>
                  )}
                  {data?.is_esi_applicable && (
                    <p>
                      <b>ESI Employer @ 3.25%</b>
                      <span className="span">:</span>
                      <span>{esiEmployer.toFixed(2)}</span>
                    </p>
                  )}
                  <p>
                    <b>Total Employer Cost</b>
                    <span className="span">:</span>
                    <span>{totalEmployerCost.toFixed(2)}</span>
                  </p>
                </div>
              </div>

              <div className="col-6">
                <div className="salary-details">
                  <p>
                    <b>Service Charge @ {serviceChargePercent.toFixed(2)}%</b>
                    <span className="span">:</span>
                    <span>{serviceCharge.toFixed(2)}</span>
                  </p>
                  <p>
                    <b>GST @ {gstPercent}%</b>
                    <span className="span">:</span>
                    <span>{gst.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="total-salary d-flex justify-content-between align-items-center">
              <p className="mb-0 fw-bold fs-4">Per Day Bill Amount</p>
              <p className="mb-0 fw-bold fs-4">₹ {totalBillAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-end d-flex justify-content-center mt-3">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => downloadPDF(id, `Per-Day-Wages-Sheet-${data?.designation?.name || 'Day'}`)}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

const PerMonthWagesSheet = ({ id, data ,comp}) => {
  // Calculate per month values (multiply daily values by working days)
  const minDailyWages = parseFloat(data?.min_daily_wages) || 0;
  const workingDays = parseFloat(data?.no_of_working_day) || 26;
  
  // Only get values if they are applicable
  const pfShare = data?.is_pf_applicable ? (parseFloat(data?.provideant_fund) || 0) * workingDays : 0;
  const esiEmployee = data?.is_esi_applicable ? (parseFloat(data?.esiPerDay) || 0) * workingDays : 0;
  const bonus = data?.is_bonus_applicable ? (parseFloat(data?.bonus) || 0) * workingDays : 0;
  const optionalAllowance1 = data?.is_optional_allowance_1_applicable ? (parseFloat(data?.optionAllowance1) || 0) * workingDays : 0;
  const optionalAllowance2 = data?.is_optional_allowance_2_applicable ? (parseFloat(data?.optionAllowance2) || 0) * workingDays : 0;
  const optionalAllowance3 = data?.is_optional_allowance_3_applicable ? (parseFloat(data?.optionAllowance3) || 0) * workingDays : 0;
  
  const monthlyWages = minDailyWages * workingDays - pfShare - esiEmployee + bonus + optionalAllowance1+ optionalAllowance2+ optionalAllowance3 ;
  // Employer contributions (only if applicable)
  const epf = data?.is_epf_admin_charge_applicable ? (parseFloat(data?.epf_admin_charge) || 0) * workingDays : 0;
  const edli = data?.is_edli_applicable ? (parseFloat(data?.edliPerDay) || 0) * workingDays : 0;
  const esiEmployer = data?.is_esi_applicable ? esiEmployee * (3.25 / 0.75) : 0;
  
  // Calculate total employee salary (only applicable items)
  const totalEmployeeSalary = monthlyWages ;
  // + 
  //   (data?.is_pf_applicable ? pfShare : 0) +
  //   (data?.is_esi_applicable ? esiEmployee : 0) +
  //   (data?.is_bonus_applicable ? bonus : 0) +
  //   (data?.is_optional_allowance_1_applicable ? optionalAllowance1 : 0) +
  //   (data?.is_optional_allowance_2_applicable ? optionalAllowance2 : 0) +
  //   (data?.is_optional_allowance_3_applicable ? optionalAllowance3 : 0);
  
  // Calculate total employer cost (only applicable items)
  const totalEmployerCost = 
    (data?.is_epf_admin_charge_applicable ? epf : 0) +
    (data?.is_edli_applicable ? edli : 0) +
    (data?.is_esi_applicable ? esiEmployer : 0) ;
    // +
    // (data?.is_optional_allowance_1_applicable ? optionalAllowance1 : 0) +
    // (data?.is_optional_allowance_2_applicable ? optionalAllowance2 : 0) +
    // (data?.is_optional_allowance_3_applicable ? optionalAllowance3 : 0);
  
  // Total cost before service charge
  const totalCostBeforeServiceCharge = totalEmployeeSalary + totalEmployerCost;
  
  // Calculate service charge on applicable costs
  const serviceChargePercent = parseFloat(data?.perecnt_service_charge) || 3.85;
  const serviceCharge = (totalCostBeforeServiceCharge * serviceChargePercent) / 100;
  
  // Calculate GST on service charge
  const gstPercent = 18;
  const gst = (serviceCharge * gstPercent) / 100;
  
  // Final bill amount
  const totalBillAmount = totalCostBeforeServiceCharge + serviceCharge + gst;
  
  // Format month for display
  const currentDate = new Date();
  const monthName = currentDate.toLocaleDateString('en-GB', { month: 'long' });
  const year = currentDate.getFullYear();
  
  return (
    <div>
      <div className="wages-sheet rounded mt-5" id={id}>
        <div
          className="wages-sheet-header mb-4"
          style={{
            backgroundImage: "url('/images/general/wages_invoice_bg.png')",
          }}
        >
          <div className="p-3 pb-0">
            <div className="company-details d-flex flex-column justify-content-center pt-3">
              <div className="text-center">
                <h5 className="mb-0 fw-bold fs-4">{comp?.company_name || "Company Name"}</h5>
                <p className="mb-0 mt-2 fw-bold">
                  {comp?.address || "Complete Address, City, State, Country"}
                </p>
              </div>
            </div>

            <div className="company-contacts d-flex justify-content-between align-items-center">
              <div className="company-mail">
                <p>
                  <span>Email:</span> {comp?.company_business_email || "company@email.com"}
                </p>
              </div>
              <div className="company-number">
                <p>
                  <span>Tel:</span> {comp?.company_phone || "0000000000"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="employee-details">
          <div className="px-3 d-flex justify-content-between">
            <div className="designation">
              <h5>DESIGNATION:</h5>
              <p className="fw-bold">{data?.designation?.name || "Designation Here"}</p>
            </div>

            <div className="wages-days">
              <h5 className="d-flex align-items-center">
                Wages Format: <span>Per Month</span>
              </h5>
            </div>
          </div>
        </div>

        <div className="salary-summary">
          <div className="px-3 mt-3">
            <h5 className="mb-3 fw-bold">Payment For The Month Of <span>{monthName} {year}</span></h5>
            <h6 className="mb-3 fw-bold">Employee Pay Summary</h6>

            <div className="row m-0">
              <div className="col-7">
                <div className="salary-details">
                  {data?.is_pf_applicable && (
                    <p>
                      <b>PF Share @ 12%</b>
                      <span className="span">:</span>
                      <span>{pfShare.toFixed(2)}</span>
                    </p>
                  )}
                  {data?.is_esi_applicable && (
                    <p>
                      <b>ESI @ 0.75%</b>
                      <span className="span">:</span>
                      <span>{esiEmployee.toFixed(2)}</span>
                    </p>
                  )}
                  {data?.is_bonus_applicable && (
                    <p>
                      <b>Bonus @ 8.33%</b>
                      <span className="span">:</span>
                      <span>{bonus.toFixed(2)}</span>
                    </p>
                  )}
                  {data?.is_optional_allowance_1_applicable && (
                    <p>
                      <b>Optional Allowance 1</b>
                      <span className="span">:</span>
                      <span>{optionalAllowance1.toFixed(2)}</span>
                    </p>
                  )}
                  {data?.is_optional_allowance_2_applicable && (
                    <p>
                      <b>Optional Allowance 2</b>
                      <span className="span">:</span>
                      <span>{optionalAllowance2.toFixed(2)}</span>
                    </p>
                  )}
                  {data?.is_optional_allowance_3_applicable && (
                    <p>
                      <b>Optional Allowance 3</b>
                      <span className="span">:</span>
                      <span>{optionalAllowance3.toFixed(2)}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="col-5">
                <div className="salary-amount-details">
                  <p className="text-center">
                    <span>Paid Days: {workingDays}</span> | <span>Daily Wages: {minDailyWages.toFixed(0)}</span>
                  </p>

                  <div className="basic-salary-box text-center">
                    <p className="mb-0 fs-4 text-muted">Monthly Salary</p>
                    <p className="amount mb-0">₹ {monthlyWages.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="salary-summary-2 mt-3 mb-3">
          <div className="px-3">
            <div className="row m-0">
              <div className="col-6">
                <div className="salary-details">
                  {data?.is_epf_admin_charge_applicable && (
                    <p>
                      <b>EPF Admin @ 0.5%</b>
                      <span className="span">:</span>
                      <span>{epf.toFixed(2)}</span>
                    </p>
                  )}
                  {data?.is_edli_applicable && (
                    <p>
                      <b>EDLI @ 0.5%</b>
                      <span className="span">:</span>
                      <span>{edli.toFixed(2)}</span>
                    </p>
                  )}
                  {data?.is_esi_applicable && (
                    <p>
                      <b>ESI Employer @ 3.25%</b>
                      <span className="span">:</span>
                      <span>{esiEmployer.toFixed(2)}</span>
                    </p>
                  )}
                  
                  <p>
                    <b>Total Employer Cost</b>
                    <span className="span">:</span>
                    <span>{totalEmployerCost.toFixed(2)}</span>
                  </p>
                </div>
              </div>

              <div className="col-6">
                <div className="salary-details">
                  <p>
                    <b>Service Charge @ {serviceChargePercent.toFixed(2)}%</b>
                    <span className="span">:</span>
                    <span>{serviceCharge.toFixed(2)}</span>
                  </p>
                  <p>
                    <b>GST @ {gstPercent}%</b>
                    <span className="span">:</span>
                    <span>{gst.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="total-salary d-flex justify-content-between align-items-center">
              <p className="mb-0 fw-bold fs-4">Per Month Bill Amount</p>
              <p className="mb-0 fw-bold fs-4">₹ {totalBillAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-end mt-3 d-flex justify-content-center">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => downloadPDF(id, `Per-Month-Wages-Sheet-${data?.designation?.name || 'Month'}`)}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};
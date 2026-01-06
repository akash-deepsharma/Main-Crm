"use client";
import React, { useState } from "react";
import "./TabWagesSheet.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const downloadSelected = async (selected) => {
  if (selected.length === 0) {
    alert("Please select at least one section.");
    return;
  }

  // Step 1: Create a temporary wrapper to merge selected content
  const wrapper = document.createElement("div");
  wrapper.style.padding = "20px";
  wrapper.style.background = "#fff";
  wrapper.style.width = "100%";

  selected.forEach((secId) => {
    const sec = document.getElementById(secId);
    if (sec) {
      const clone = sec.cloneNode(true);
      clone.style.marginBottom = "0px";
      wrapper.appendChild(clone);
    }
  });

  document.body.appendChild(wrapper);

  // Step 2: Convert combined wrapper into one canvas
  const canvas = await html2canvas(wrapper, {
    scale: 2,
    useCORS: true,
  });
  const img = canvas.toDataURL("image/png");

  // Step 3: Create PDF (Single Page)
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);

  pdf.save("Selected-Sections.pdf");

  // Remove temporary wrapper
  document.body.removeChild(wrapper);
};

const SECTIONS = [
  { id: "section1", label: "Client Details" },
  { id: "section2", label: "Project Details" },
  { id: "day-sheet-1", label: "Wages Sheet - Per Day 1" },
  { id: "day-sheet-2", label: "Wages Sheet - Per Day 2" },
  { id: "month-sheet-1", label: "Wages Sheet - Per Month 1" },
  { id: "month-sheet-2", label: "Wages Sheet - Per Month 2" },
];
const TabDownloadSheet = (data) => {
  const [mode, setMode] = useState("day");
  const [selectedSections, setSelectedSections] = useState([]);
  const downloadSheetData = data?.data?.data
console.log("downloadsheet data", downloadSheetData)
  const toggleSection = (id) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  return (
    <div className={`tab-pane fade active show ${
                selectedSections.includes(SECTIONS[0].id)
                  ? " bg-light"
                  : "bg-none"
              }`} id="overviewTab">
      <div>
        {/* Checkbox for first section */}
        {SECTIONS[0] && (          
            <input
            key={SECTIONS[0].id}
              type="checkbox"
              checked={selectedSections.includes(SECTIONS[0].id)}
              onChange={() => toggleSection(SECTIONS[0].id)}
              className="me-2 d-none"
              onClick={(e) => e.stopPropagation()}
            />
        )}
        <div className="row" id="section1">
          <div className="col-lg-12 ">
            <div
              className={`card stretch stretch-full ${
                selectedSections.includes(SECTIONS[0].id)
                  ? "border border-success"
                  : "border"
              } p-3 mb-3`}
              onClick={() => toggleSection(SECTIONS[0].id)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body task-header d-md-flex align-items-center justify-content-center text-center">
                <div className="me-4">
                  <h4 className="mb-4 fw-bold d-flex">
                    <span className="text-truncate-1-line">
                      {downloadSheetData?.customer_name} 
                      {/* || Customer Name{" "} */}
                    </span>
                  </h4>
                  <div className="d-flex align-items-center">

                    <div className="img-group lh-0 ms-2 justify-content-start">
                      <span className="d-none d-sm-flex">
                        <span className="fs-12 text-muted ms-1 text-truncate-1-line">
                          <b>Phone:- </b> {downloadSheetData?.contact_no}
                        </span>
                      </span>
                    </div>
                    <span className="vr mx-3 text-muted"></span>
                    <div className="img-group lh-0 ms-2 justify-content-start">
                      <span className="d-none d-sm-flex">
                        <span className="fs-12 text-muted ms-1 text-truncate-1-line">
                          <b>Email:- </b>  {downloadSheetData?.email}
                        </span>
                      </span>
                    </div>
                    <span className="vr mx-3 text-muted"></span>
                    <div className="img-group lh-0 ms-2 justify-content-start">
                      <span className="d-none d-sm-flex">
                        <span className="fs-12 text-muted ms-1 text-truncate-1-line">
                          <b>Address:- </b> {downloadSheetData?.address}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-12">
            <div
              className={`card stretch stretch-full ${
                selectedSections.includes(SECTIONS[0].id)
                  ? "border border-success"
                  : "border"
              } p-3 mb-3`}
              onClick={() => toggleSection(SECTIONS[0].id)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 mb-4">
                    <label className="form-label">Project</label>
                    <p>{downloadSheetData?.customer_name}</p>
                  </div>
                  <div className="col-md-3 mb-4">
                    <label className="form-label">Client ID - </label>
                    <p>{downloadSheetData?.id}</p>
                  </div>
                  <div className="col-md-3 mb-4">
                    <label className="form-label">Contract No</label>
                    <p>{downloadSheetData?.contract_no}</p>
                  </div>
                  <div className="col-md-3 mb-4">
                    <label className="form-label">Contract Added on</label>
                    <p>{downloadSheetData?.onboard_date}</p>
                  </div>
                  <div className="col-md-3 mb-4">
                    <label className="form-label">
                      Contract Generated Date
                    </label>
                    <p>{downloadSheetData?.contract_generated_date}</p>
                  </div>
                  <div className="col-md-3 mb-4">
                    <label className="form-label">Contract Start Date </label>
                    <p>{downloadSheetData?.service_end_date}</p>
                  </div>
                  <div className="col-md-3 mb-4">
                    <label className="form-label">Contract End Date </label>
                    <p>{downloadSheetData?.service_start_date}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

            <div className="row">
                <div className="col-xl-6">
                    <div className="card stretch stretch-full">
                        <div className="card-body">
                            <h3 className='mb-4'>Financial Approval</h3>
                            <div className="row">
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">IFD Concurrence</label>
                                    <p>{downloadSheetData?.financial_approval?.ifd_concurrence}</p>
                                </div>
                             <div className="col-md-6 mb-2">
                                    <label className="form-label">Designation of Administrative Approval </label>
                                    <p>{downloadSheetData?.financial_approval?.designation_admin_approval}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Designation of Financial Approval </label>
                                    <p>{downloadSheetData?.financial_approval?.designation_financial_approval}</p>
                                </div>
                               
                            </div>
                          
                            
                        </div>
                    </div>
                </div>
                <div className="col-xl-6">
                    <div className="card stretch stretch-full">
                        <div className="card-body">
                              <h3 className='mb-4'>Paying Authority</h3>
                            <div className="row">
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Role</label>
                                    <p>{downloadSheetData?.financial_approval?.role}</p>
                                </div>
                             <div className="col-md-6 mb-2">
                                    <label className="form-label">Payment Mode </label>
                                    <p>{downloadSheetData?.financial_approval?.payment_mode}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Designation </label>
                                    <p>{downloadSheetData?.financial_approval?.designation}</p>
                                </div>
                               <div className="col-md-6 mb-2">
                                    <label className="form-label">Email ID </label>
                                    <p>{downloadSheetData?.financial_approval?.email}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">GSTIN </label>
                                    <p>{downloadSheetData?.financial_approval?.gstin}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Address  </label>
                                    <p>{downloadSheetData?.financial_approval?.address}</p>
                                </div>
                            </div>
                          
                            
                        </div>
                    </div>
                </div>
               
            </div>

      <div className="row" id="section2">
        {downloadSheetData?.consignees?.map((item,index)=>(

        <div className="col-xl-12" key={index}>
          <div className="card stretch stretch-full">
            <div className="card-body">
              <h3 className="mb-4">Consignee {index + 1}</h3>
              <div className="row">
                <div className="col-md-3 mb-2">
                  <label className="form-label">Consignee Name</label>
                  <p>{item.consignee_name}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Designation - </label>
                  <p>{item.consignee_name}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Contact </label>
                  <p>{item.consignee_contact_no}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Email </label>
                  <p>{item.consignee_email}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">GSTIN </label>
                  <p>{item.consignee_gstin}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Service Description </label>
                  <p>{item.designations?.length > 0
                                        ? item.designations.map(d => d.name).join(', ')
                                        : '—'}</p>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label">Address </label>
                  <p>
                    {item.consignee_addess}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        ))}
      </div>

      <div className="row">
        {downloadSheetData?.services?.map((item,index)=>(
        <div className="col-xl-12" key={index}>
          <div className="card stretch stretch-full">
            <div className="card-body">
              <h3 className="mb-4">
                Service details For{" "}
                <span className="text-primary">
                  {item.list_of_profile}
                </span>{" "}
              </h3>
              <div className="row">
                <div className="col-md-3 mb-2">
                  <label className="form-label">Consignee </label>
                  <p>{item.consignee?.consignee_name}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Designation </label>
                  <p>{item.consignee?.consigness_designation}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Gender </label>
                  <p>{item.gender}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Age Limit </label>
                  <p>{item.age_limit}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">
                    Educational Qualification{" "}
                  </label>
                  <p>{item.education_qualification}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Specialization for PG </label>
                  <p>{item.specialization_for_pg}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Post Graduation </label>
                  <p>{item.post_graduation}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Types of Function </label>
                  <p>{item.type_of_function}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Years of Experience </label>
                  <p>{item.year_of_experience}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Specialization </label>
                  <p>{item.specialization}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Skill Category </label>
                  <p>{item.skill_category}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">District </label>
                  <p>{item.district}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Zipcode </label>
                  <p>{item.zip_code}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Duty Hours in a Day </label>
                  <p>{item.duty_hours}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Min Daily Wages </label>
                  <p>{item.min_daily_wages}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Monthly Salery </label>
                  <p>{item.monthly_salary}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Bonus </label>
                  <p>{item.bonus}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">
                    Provident Fund (per/day){" "}
                  </label>
                  <p>{item.provideant_fund}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">
                    EPF Admin Charge (per/day){" "}
                  </label>
                  <p>{item.epf_admin_charge}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">EDLI (per/day) </label>
                  <p>{item.edliPerDay}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">ESI (per/day) </label>
                  <p>{item.esiPerDay}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">
                    Optional Allowance 1 (per/day){" "}
                  </label>
                  <p>{item.optionAllowance1}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">
                    Optional Allowance 2 (per/day){" "}
                  </label>
                  <p>{item.optionAllowance2}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">
                    Optional Allowance 3 (per/day){" "}
                  </label>
                  <p>{item.optionAllowance3}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">
                    Number of Working Days (per/month){" "}
                  </label>
                  <p>{item.no_of_working_day}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">
                    Tenure/Duration of Employment(in Months){" "}
                  </label>
                  <p>{item.tenure_duration}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">
                    Number Of Hired Resources{" "}
                  </label>
                  <p>{item.number_of_hire_resource}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Percent Service charge </label>
                  <p>{item.perecnt_service_charge}</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Additional Requirement </label>
                  <p>{item.additional_requirement}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        ))}
        {/* <div className="col-xl-12">
          <div className="card stretch stretch-full">
            <div className="card-body">
              <h3 className="mb-4">
                Service details{" "}
                <span className="text-primary"> STP Operator</span>{" "}
              </h3>
              <div className="row">
                <div className="col-md-3 mb-2">
                  <label className="form-label">Consignee </label>
                  <p>raj</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Designation </label>
                  <p>cmo</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Gender </label>
                  <p>Male</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Age Limit </label>
                  <p>60</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">
                    Educational Qualification{" "}
                  </label>
                  <p>High School</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Specialization for PG </label>
                  <p>Not Applicable</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Post Graduation </label>
                  <p>Not Required</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Types of Function </label>
                  <p>Others</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Years of Experience </label>
                  <p>0 to 3 years</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Specialization </label>
                  <p>Not Required</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Skill Category </label>
                  <p>Semi Skilled</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">District </label>
                  <p>NA</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Zipcode </label>
                  <p>NA</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Duty Hours in a Day </label>
                  <p>9 Hours</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Min Daily Wages </label>
                  <p>816</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Monthly Salery </label>
                  <p>developer , designer</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Bonus </label>
                  <p>0</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">
                    Provident Fund (per/day){" "}
                  </label>
                  <p>97.92</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">
                    EPF Admin Charge (per/day){" "}
                  </label>
                  <p>4.08</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">EDLI (per/day) </label>
                  <p>4.08</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">ESI (per/day) </label>
                  <p>26.52</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">
                    Optional Allowance 1 (per/day){" "}
                  </label>
                  <p>8.16</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">
                    Optional Allowance 2 (per/day){" "}
                  </label>
                  <p>10</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">
                    Optional Allowance 3 (per/day){" "}
                  </label>
                  <p>0</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">
                    Number of Working Days (per/day){" "}
                  </label>
                  <p>30</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">
                    Tenure/Duration of Employment(in Months){" "}
                  </label>
                  <p>12</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">
                    Number Of Hired Resources{" "}
                  </label>
                  <p>3</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Percent Service charge </label>
                  <p>3.85</p>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label">Additional Requirement </label>
                  <p>No</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>

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
                      <PerMonthWagesSheet id="month-sheet-1" />
                    </div>
                    <div className="col-md-6 mb-2">
                      <PerMonthWagesSheet id="month-sheet-2" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

        <div className="d-flex align-items-center justify-content-center position-fixed" style={{right:'24px', bottom:'24px'}} >
            <button
                className="btn btn-primary mt-3"
                onClick={() => downloadSelected(selectedSections)}
            >
                Download Selected Sections
            </button>
        </div>
    </div>
  );
};

export default TabDownloadSheet;

const PerDayWagesSheet = ({ id }) => {
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
                <h5 className="mb-0 fw-bold fs-4">Company Name</h5>
                <p className="mb-0 mt-2 fw-bold">
                  Complete Address, City, State, Country
                </p>
              </div>
            </div>

            <div className="company-contacts d-flex justify-content-between align-items-center">
              <div className="company-mail">
                <p>
                  <span>Email:</span> company@email.com
                </p>
              </div>
              <div className="company-number">
                <p>
                  <span>Tel:</span> 0000000000
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="employee-details">
          <div className="px-3 d-flex justify-content-between">
            <div className="designation">
              <h5>DESIGNATION :</h5>
              <p className="fw-bold">Designation Here</p>
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
            <h5 className="mb-3 fw-bold">Payment For The Day Of DD MM YYYY</h5>
            <h6 className="mb-3 fw-bold">Employee Pay Summary</h6>

            <div className="row m-0">
              <div className="col-7">
                <div className="salary-details">
                  <p>
                    <b>PF Share @ 12%</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>ESI @ 0.75%</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Bonus @ 8.33%</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Optional Allowance 1</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Optional Allowance 2</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                </div>
              </div>

              <div className="col-5">
                <div className="salary-amount-details">
                  <p className="text-center">
                    <span>Paid Days: 1</span> | <span>Wages: 0.00</span>
                  </p>

                  <div className="basic-salary-box text-center">
                    <p className="mb-0 fs-4 text-muted">Total Salary</p>
                    <p className="amount mb-0">₹ 0.00</p>
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
                  <p>
                    <b>EPF @ 13%</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>ESI @ 3.25%</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Optional Allowance 1</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Optional Allowance 2</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Total</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                </div>
              </div>

              <div className="col-6">
                <div className="salary-details">
                  <p>
                    <b>Service Charge @ 3.85%</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>GST @ 18%</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="total-salary d-flex justify-content-between align-items-center">
              <p className="mb-0 fw-bold fs-4">Per Day Bill Amount</p>
              <p className="mb-0 fw-bold fs-4">0.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PerMonthWagesSheet = ({ id }) => {
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
                <h5 className="mb-0 fw-bold fs-4">Company Name</h5>
                <p className="mb-0 mt-2 fw-bold">
                  Complete Address, City, State, Country
                </p>
              </div>
            </div>

            <div className="company-contacts d-flex justify-content-between align-items-center">
              <div className="company-mail">
                <p>
                  <span>Email:</span> company@email.com
                </p>
              </div>
              <div className="company-number">
                <p>
                  <span>Tel:</span> 0000000000
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="employee-details">
          <div className="px-3 d-flex justify-content-between">
            <div className="designation">
              <h5>DESIGNATION :</h5>
              <p className="fw-bold">Designation Here</p>
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
            <h5 className="mb-3 fw-bold">
              Payment For The Month Of <span>June</span>
            </h5>
            <h6 className="mb-3 fw-bold">Employee Pay Summary</h6>

            <div className="row m-0">
              <div className="col-7">
                <div className="salary-details">
                  <p>
                    <b>PF Share @ 12%</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>ESI @ 0.75%</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Bonus @ 8.33%</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Optional Allowance 1</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Optional Allowance 2</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                </div>
              </div>

              <div className="col-5">
                <div className="salary-amount-details">
                  <p className="text-center">
                    <span>Paid Days: 1</span> | <span>Wages: 0.00</span>
                  </p>

                  <div className="basic-salary-box text-center">
                    <p className="mb-0 fs-4 text-muted">Total Salary</p>
                    <p className="amount mb-0">₹ 0.00</p>
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
                  <p>
                    <b>EPF @ 13%</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>ESI @ 3.25%</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Optional Allowance 1</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Optional Allowance 2</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>Total</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                </div>
              </div>

              <div className="col-6">
                <div className="salary-details">
                  <p>
                    <b>Service Charge @ 3.85%</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                  <p>
                    <b>GST @ 18%</b>
                    <span className="span">:</span>
                    <span>0.00</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="total-salary d-flex justify-content-between align-items-center">
              <p className="mb-0 fw-bold fs-4">Per Day Bill Amount</p>
              <p className="mb-0 fw-bold fs-4">0.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

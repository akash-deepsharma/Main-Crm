
"use client"
import React, { useState } from "react";
import "./TabWagesSheet.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const downloadSelected = async (selected) => {
  if (selected.length === 0) {
    alert("Please select at least one section.");
    return;
  }

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

  const canvas = await html2canvas(wrapper, { scale: 2, useCORS: true });
  const img = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("Selected-Sections.pdf");

  document.body.removeChild(wrapper);
};

const documentOptions = [
  { id: "aadhar", title: "Aadhar Card", icon: "/images/file-icons/pdf.png", url: "/images/gallery/aadhar.jpg" },
  { id: "pan", title: "Pan Card", icon: "/images/file-icons/jpg.png", url: "/images/gallery/pan-card.jpg" },
  { id: "ip", title: "IP No", icon: "/images/file-icons/webp.png", url: "/images/gallery/electricity-Bill.pdf" },
  { id: "uan", title: "UAN", icon: "/images/file-icons/doc.png", url: "/images/gallery/uan.avif" },
];

const SECTIONS = [
  { id: "section1", label: "Employee Details" },
  { id: "section2", label: "Personal details" },
  { id: "section3", label: "Family details" },
  { id: "section4", label: "Present Address" },
  { id: "section5", label: "Permanent Address" },
  { id: "section6", label: "Bank Details" },
  { id: "section7", label: "Educational Details" },
  { id: "section8", label: "print Details" },
];

export default function TabDownloadSheet() {
  const [selectedSections, setSelectedSections] = useState([]);
  const [previewBoxes, setPreviewBoxes] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const toggleSection = (id) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePreview = (doc) => {
    setPreviewBoxes((prev) =>
      prev.find((d) => d.id === doc.id) ? prev : [...prev, doc]
    );
  };

  const removeBox = (id) => {
    setPreviewBoxes((prev) => prev.filter((d) => d.id !== id));
  };

  const toggleSelectAll = () => {
    if (showAll) {
      setPreviewBoxes([]);
    } else {
      setPreviewBoxes(documentOptions);
    }
    setShowAll(!showAll);
  };

  return (
    <div
      className={`tab-pane fade active show ${
        selectedSections.includes(SECTIONS[0].id) ? " bg-light" : "bg-none"
      }`}
      id="overviewTab"
    >

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
                      Employee Name || Client Name{" "}
                    </span>
                  </h4>
                  <div className="d-flex align-items-center">
                    <div className="img-group lh-0 ms-2 justify-content-start">
                      <span className="d-none d-sm-flex">
                        <span className="fs-12 text-muted ms-1 text-truncate-1-line">
                          <b>Phone:- </b> 9876543210
                        </span>
                      </span>
                    </div>
                    <span className="vr mx-3 text-muted"></span>
                    <div className="img-group lh-0 ms-2 justify-content-start">
                      <span className="d-none d-sm-flex">
                        <span className="fs-12 text-muted ms-1 text-truncate-1-line">
                          <b>Email:- </b> akash@gmail.com
                        </span>
                      </span>
                    </div>
                    <span className="vr mx-3 text-muted"></span>
                    <div className="img-group lh-0 ms-2 justify-content-start">
                      <span className="d-none d-sm-flex">
                        <span className="fs-12 text-muted ms-1 text-truncate-1-line">
                          <b>Address:- </b> noida{" "}
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
                    <label className="form-label">Client Contract No</label>
                    <p>XYZG1234ACB</p>
                  </div>
                  <div className="col-md-3 mb-4">
                    <label className="form-label">Contract No</label>
                    <p>In Progress</p>
                  </div>
                  <div className="col-md-3 mb-4">
                    <label className="form-label">Consignee</label>
                    <p>Tech</p>
                  </div>
                  <div className="col-md-3 mb-4">
                    <label className="form-label">Designation</label>
                    <p>Developer</p>
                  </div>
                  <div className="col-md-3 mb-4">
                    <label className="form-label">Date Of Join </label>
                    <p>01 Aug, 2025</p>
                  </div>
                  <div className="col-md-3 mb-4">
                    <label className="form-label">Replaceable </label>
                    <p>Yes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

   
        <div className="row">
          <div className="col-xl-12">
            {SECTIONS[1] && (
              <input
                key={SECTIONS[1].id}
                type="checkbox"
                checked={selectedSections.includes(SECTIONS[1].id)}
                onChange={() => toggleSection(SECTIONS[1].id)}
                className="me-2 d-none"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div
              className={`card stretch stretch-full ${
                selectedSections.includes(SECTIONS[1].id)
                  ? "border border-success"
                  : "border"
              } p-3 mb-3`}
              onClick={() => toggleSection(SECTIONS[1].id)}
              style={{ cursor: "pointer" }}
              id="section2"
            >
              <div className="card-body">
                <h3 className="mb-4">Personal details</h3>
                <div className="row">
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Date Of Birth</label>
                    <p>12 Aug, 1997</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Gender </label>
                    <p>Male</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Religion </label>
                    <p>Hindu</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Marital status </label>
                    <p>Married</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Aadhar No </label>
                    <p>5573 1920 7830</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Pan Card No </label>
                    <p>IFRPS5623F </p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">IP No </label>
                    <p>8999999999</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">UAN </label>
                    <p>989789787878</p>
                  </div>

                  <div className="col-md-3 mb-2">
                    <label className="form-label">
                      Rent Agreement / Electricity bill{" "}
                    </label>
                    <p>1234767656hasdsf </p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Police Verification </label>
                    <p>632423536862 </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-12">
            {SECTIONS[2] && (
              <input
                key={SECTIONS[2].id}
                type="checkbox"
                checked={selectedSections.includes(SECTIONS[2].id)}
                onChange={() => toggleSection(SECTIONS[2].id)}
                className="me-2 d-none"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div
              className={`card stretch stretch-full ${
                selectedSections.includes(SECTIONS[2].id)
                  ? "border border-success"
                  : "border"
              } p-3 mb-3`}
              onClick={() => toggleSection(SECTIONS[2].id)}
              style={{ cursor: "pointer" }}
              id="section3"
            >
              <div className="card-body">
                <h3 className="mb-4">Family details</h3>
                <div className="row">
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Father Name</label>
                    <p>raj</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Father Contact </label>
                    <p>cmo</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Spouse Name </label>
                    <p>XYZG</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Spouse Contact </label>
                    <p>98765432</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Child Name </label>
                    <p>XYZG</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-12">
            {SECTIONS[3] && (
              <input
                key={SECTIONS[3].id}
                type="checkbox"
                checked={selectedSections.includes(SECTIONS[3].id)}
                onChange={() => toggleSection(SECTIONS[3].id)}
                className="me-2 d-none"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div
              className={`card stretch stretch-full ${
                selectedSections.includes(SECTIONS[3].id)
                  ? "border border-success"
                  : "border"
              } p-3 mb-3`}
              onClick={() => toggleSection(SECTIONS[3].id)}
              style={{ cursor: "pointer" }}
              id="section4"
            >
              <div className="card-body">
                <h3 className="mb-4">Present Address</h3>
                <div className="row">
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Address</label>
                    <p>Gali No. 9 Durgapuram</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">City </label>
                    <p>Bluandshahr</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">State </label>
                    <p>Uttar Pradesh</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Country </label>
                    <p>Country</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Zip Code </label>
                    <p>203001</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-12">
            {SECTIONS[4] && (
              <input
                key={SECTIONS[4].id}
                type="checkbox"
                checked={selectedSections.includes(SECTIONS[4].id)}
                onChange={() => toggleSection(SECTIONS[4].id)}
                className="me-2 d-none"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div
              className={`card stretch stretch-full ${
                selectedSections.includes(SECTIONS[4].id)
                  ? "border border-success"
                  : "border"
              } p-3 mb-3`}
              onClick={() => toggleSection(SECTIONS[4].id)}
              style={{ cursor: "pointer" }}
              id="section5"
            >
              <div className="card-body">
                <h3 className="mb-4">Permanent Address</h3>
                <div className="row">
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Address</label>
                    <p>Gali No. 9 Durgapuram</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">City </label>
                    <p>Bluandshahr</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">State </label>
                    <p>Uttar Pradesh</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Country </label>
                    <p>Country</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Zip Code </label>
                    <p>203001</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-12">
            {SECTIONS[5] && (
              <input
                key={SECTIONS[5].id}
                type="checkbox"
                checked={selectedSections.includes(SECTIONS[5].id)}
                onChange={() => toggleSection(SECTIONS[5].id)}
                className="me-2 d-none"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div
              className={`card stretch stretch-full ${
                selectedSections.includes(SECTIONS[5].id)
                  ? "border border-success"
                  : "border"
              } p-3 mb-3`}
              onClick={() => toggleSection(SECTIONS[5].id)}
              style={{ cursor: "pointer" }}
              id="section6"
            >
              <div className="card-body">
                <h3 className="mb-4">Bank Details</h3>
                <div className="row">
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Bank Name</label>
                    <p>Punjab National Bank</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Branch Branch </label>
                    <p>DDRR Noida</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">IFSC Code </label>
                    <p>23KLJDLAD</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Account no. </label>
                    <p>323230203840823423</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-12">
            {SECTIONS[6] && (
              <input
                key={SECTIONS[6].id}
                type="checkbox"
                checked={selectedSections.includes(SECTIONS[6].id)}
                onChange={() => toggleSection(SECTIONS[6].id)}
                className="me-2 d-none"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div
              className={`card stretch stretch-full ${
                selectedSections.includes(SECTIONS[6].id)
                  ? "border border-success"
                  : "border"
              } p-3 mb-3`}
              onClick={() => toggleSection(SECTIONS[6].id)}
              style={{ cursor: "pointer" }}
              id="section7"
            >
              <div className="card-body">
                <h3 className="mb-4">Eduactional Details</h3>
                <div className="row">
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Qualification</label>
                    <p>10th</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Qualification Year </label>
                    <p>2020</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">12th Qualification </label>
                    <p>12th</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Qualification Year</label>
                    <p>2022</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Highest Qualification </label>
                    <p>Pg</p>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label">Qualification Year</label>
                    <p>2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>




      <div className="d-flex justify-content-between align-items-center mt-3">
        <h4>Attachments</h4>
        <button className="btn btn-outline-primary" onClick={toggleSelectAll}>
          {showAll ? "Unselect All Documents" : "Select All Documents"}
        </button>
      </div>

      {/* PREVIEW BOXES */}
      <div className="row mt-4">
        {previewBoxes.length === 0 && (
          <p className="text-muted text-center">No file selected</p>
        )}

        {previewBoxes.map((file) => (
          
          <div className="col-lg-6 mb-3" key={file.id}>
            {SECTIONS[7] && (
              <input
                key={SECTIONS[7].id}
                type="checkbox"
                checked={selectedSections.includes(SECTIONS[7].id)}
                onChange={() => toggleSection(SECTIONS[7].id)}
                className="me-2 d-none"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div className={`border p-3 position-relative ${
                selectedSections.includes(SECTIONS[7].id)
                  ? "border border-success"
                  : "border"
              } p-3 mb-3`}
              onClick={() => toggleSection(SECTIONS[7].id)}
              style={{ cursor: "pointer", minHeight:"250px" }}
              id="section8">
              <button
                className="btn btn-sm btn-danger position-absolute"
                style={{ top: 10, right: 10 }}
                onClick={() => removeBox(file.id)}
              >
                X
              </button>



               {file.url?.match(/\.(jpg|jpeg|png|webp|avif)$/) ? (
                <img
                  src={file.url}
                  alt={file.title}
                  style={{ maxWidth: "100%", maxHeight: "220px", objectFit: "contain" }}
                />
              ) : file.url?.match(/\.pdf$/) ? (
                <iframe src={file.url} style={{ width: "100%", height: "220px", border: "none" }}></iframe>
              ) : (
                <p>Preview not available</p>
              )}

              <p className="mt-2 text-center fw-bold">{file.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* DOCUMENT CARDS */}
      <div className="row mt-4">
        {documentOptions.map((doc) => (
          !previewBoxes.find((d) => d.id === doc.id) && (
            <AttachementCard
              key={doc.id}
              title={doc.title}
              iconSrc={doc.icon}
              onClick={() => handlePreview(doc)}
            />
          )
        ))}
      </div>

      {/* DOWNLOAD BUTTON */}
      <div className="d-flex align-items-center justify-content-center position-fixed" style={{ right: 24, bottom: 24 }}>
        <button className="btn btn-primary mt-3" onClick={() => downloadSelected(selectedSections)}>
          Download Selected Sections
        </button>
      </div>
    </div>
  );
}

function AttachementCard({ title, iconSrc, onClick }) {
  return (
    <div className="col-sm-4 col-md-3 col-lg-2 mb-4">
      <div className="card stretch-full shadow-sm" onClick={onClick} style={{ cursor: "pointer" }}>
        <div className="card-body p-0 ht-100 text-center">
          <img src={iconSrc} className="img-fluid wd-60 ht-60 mt-3" alt={title} />
        </div>
        <div className="card-footer p-2 text-center">
          <h2 className="fs-13 mb-1 text-truncate-1-line">{title}</h2>
        </div>
      </div>
    </div>
  );
}

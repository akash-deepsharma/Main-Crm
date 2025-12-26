import React, { useState } from "react";
import Dropdown from "@/components/shared/Dropdown";
import { strogeOptions } from "../storage/StorageContent";
import { FiMinus } from "react-icons/fi";

// List of document types
const documentOptions = [
  " Attendance Document ",
];

const TabAttachement = () => {
  const [selectedDocs, setSelectedDocs] = useState([]); // { type, file, icon }

  // Remaining options for dropdown (filter out selected types)
  const availableOptions = documentOptions.filter(
    (doc) => !selectedDocs.find((d) => d.type === doc)
  );

  // Add document with icon based on file extension
  const handleSelectDoc = (docType, file) => {
    if (!docType || !file) return;

    const icon = getIconByFile(file); // get icon by extension

    setSelectedDocs([...selectedDocs, { type: docType, file, icon }]);
  };

  const handleRemoveDoc = (type) => {
    setSelectedDocs(selectedDocs.filter((d) => d.type !== type));
  };

  return (
    <section className="step-body body stepChange mt-4">
      <div>
        <div className="mb-5">
          <h2 className="fs-16 fw-bold">Attachment Files</h2>
          <p className="text-muted">
            If you need more info, please check <a href="#">help center</a>
          </p>
        </div>

        {/* Document Upload Section */}
        <div className="mb-4">
          <label className="form-label">Select Document & Upload</label>

          <div className="row d-flex gap-2">
            <div className="col-lg-12">
              <select className="form-select" defaultValue="" id="documentSelect">
                <option value="" disabled>
                  Select Document
                </option>
                {availableOptions.map((doc, idx) => (
                  <option key={idx} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-12 mb-4">
              <label htmlFor="choose-file" className="custom-file-upload" id="choose-file-label">
                Upload Document
              </label>

              <input
                type="file"
                className="form-control"
                name="uploadDocument"
                id="choose-file"
                style={{ display: "none" }}
                onChange={(e) => {
                  const selectBox = document.getElementById("documentSelect");
                  const docType = selectBox.value;
                  const file = e.target.files[0];

                  handleSelectDoc(docType, file);

                  selectBox.value = ""; // reset dropdown
                  e.target.value = null; // reset file input
                }}
              />
            </div>
          </div>
        </div>

        {/* Display Uploaded Documents */}
        <div className="row">
          {selectedDocs.map((doc, index) => (
            <AttachementCard
              key={index}
              title={doc.type}
              iconSrc={doc.icon}
              onRemove={() => handleRemoveDoc(doc.type)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TabAttachement;

// Detect file icon based on extension
const getIconByFile = (file) => {
  const ext = file.name.split(".").pop().toLowerCase();

  if (ext === "pdf") return "/images/file-icons/pdf.png";

  if (["png"].includes(ext))
    return "/images/file-icons/png.png";

    if ([ "jpg", "jpeg"].includes(ext))
        return "/images/file-icons/jpg.png";

    if (["webp"].includes(ext))
        return "/images/file-icons/webp.png";

  if (["doc", "docx", "txt"].includes(ext))
    return "/images/file-icons/doc.png";

  if (["zip", "rar", "7z"].includes(ext))
    return "/images/file-icons/zip.png";

  if (ext === "psd") return "/images/file-icons/psd.png";

  return "/images/file-icons/file.png";
};

const AttachementCard = ({
  title,
  iconSrc,
  onRemove,
}) => {
  return (
    <div className="col-sm-4 col-md-3 col-lg-2 mb-4">
      <div className="card stretch stretch-full">
        <div className="card-body p-0 ht-200 position-relative">
          <a
            href="#"
            className="w-100 h-100 d-flex align-items-center justify-content-center"
          >
            <img src={iconSrc} className="img-fluid wd-80 ht-80" alt={title} />
          </a>

          
        </div>
        <button
            type="button"
            className="btn px-2 btn-sm btn-danger position-absolute top-10  " style={{top:'4px', right:'4px',}}
            onClick={onRemove}
          >
            <FiMinus/>
          </button>

        <div className="card-footer p-4">
          <h2 className="fs-13 mb-1 text-truncate-1-line">{title}</h2>
        </div>
      </div>
    </div>
  );
};
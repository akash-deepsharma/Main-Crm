"use client";

import React, { forwardRef, useEffect, useState, useImperativeHandle } from 'react';
import { FiMinus } from "react-icons/fi";
import { useRouter } from 'next/navigation';

// List of document types
const documentOptions = [
  "Experience Letter",
  "UAN",
  "PAN",
  "Aadhar",
  "Rent Agreement/Electricity Bill Proof",
  "Profile Image Upload",
  "CV Upload",
  "Police Verification Letter",
];

const API_BASE = 'https://green-owl-255815.hostingersite.com/api';

const TabAttachement = forwardRef(({ error }, ref) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]); // { type, file, icon }

  useEffect(() => {
    const employeeId = sessionStorage.getItem('employee_id');
    
    if (!employeeId) {
      alert('Employee not found. Complete previous steps first.');
      router.replace('/employee');
    }
  }, [router]);

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

  const handleSaveAttachments = async () => {
    const token = localStorage.getItem("token");
    const employeeId = sessionStorage.getItem("employee_id");

    if (!token || !employeeId) {
      alert("Employee not found. Complete previous steps first.");
      router.replace("/employee");
      return false;
    }

    if (selectedDocs.length === 0) {
      alert("Please upload at least one document");
      return false;
    }

    try {
      setLoading(true);

      // Create FormData as per backend requirements
      const formData = new FormData();
      formData.append("employee_id", employeeId);
      
      // Append each document with the structure backend expects
      selectedDocs.forEach((doc, index) => {
        formData.append(`documents[${index}][type]`, doc.type);
        formData.append(`documents[${index}][icon_path]`, doc.icon);
        formData.append(`documents[${index}][file]`, doc.file);
      });

      console.log("FormData structure for backend:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
      }

      // CORRECTED: Using the correct API endpoint for documents
      const response = await fetch(`${API_BASE}/employee/document/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set Content-Type header for FormData
        },
        body: formData,
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (result?.status === true || result?.status === 'true') {
        console.log("Documents saved successfully", result);
        return true;
      } else {
        // Show validation errors if any
        if (result?.errors) {
          const errorMessages = Object.values(result.errors).flat().join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(result?.message || "Document upload failed");
      }
    } catch (err) {
      console.error("Error uploading documents:", err);
      alert(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ expose submit
  useImperativeHandle(ref, () => ({
    submit: handleSaveAttachments,
  }));

  return (
    <section className="step-body body stepChange mt-4">
      <div>
        <div className="mb-5">
          <h2 className="fs-16 fw-bold">Attachment Files</h2>
          <p className="text-muted">
            Employee documents and attachments
          </p>
        </div>

        {/* Document Upload Section */}
        <div className="mb-4">
          <label className="form-label">Select Document & Upload</label>

          <div className="row">
            <div className="col-lg-6 mb-3">
              <select 
                className="form-select" 
                defaultValue="" 
                id="documentSelect"
                style={{ cursor: "pointer" }}
              >
                <option value="" disabled>
                  Select Document Type
                </option>
                {availableOptions.map((doc, idx) => (
                  <option key={idx} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-6 mb-3">
              <input
                type="file"
                className="form-control"
                name="uploadDocument"
                id="choose-file"
                style={{ cursor: "pointer" }}
                onChange={(e) => {
                  const selectBox = document.getElementById("documentSelect");
                  const docType = selectBox.value;
                  const file = e.target.files[0];

                  if (!docType) {
                    alert("Please select a document type first");
                    e.target.value = null;
                    return;
                  }

                  if (!file) return;

                  // Check file size (5MB limit as per backend)
                  const maxSize = 5 * 1024 * 1024; // 5MB
                  if (file.size > maxSize) {
                    alert("File size exceeds 5MB limit");
                    e.target.value = null;
                    return;
                  }

                  // Check file type (jpg, jpeg, png, pdf as per backend)
                  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
                  if (!allowedTypes.includes(file.type)) {
                    alert("Only JPG, PNG, and PDF files are allowed");
                    e.target.value = null;
                    return;
                  }

                  // Check if this document type is already added
                  if (selectedDocs.find(d => d.type === docType)) {
                    alert(`"${docType}" has already been added. Please select a different document type.`);
                    e.target.value = null;
                    return;
                  }

                  handleSelectDoc(docType, file);

                  selectBox.value = ""; // reset dropdown
                  e.target.value = null; // reset file input
                }}
              />
              <small className="text-muted">
                Allowed: JPG, PNG, PDF | Max: 5MB
              </small>
            </div>
          </div>

          <div className="alert alert-info mt-3">
            <small>
              <strong>Note:</strong> Each document type can only be uploaded once.
              Files will replace existing ones of the same type.
            </small>
          </div>
        </div>

        {/* Display Uploaded Documents */}
        {selectedDocs.length > 0 ? (
          <>
            <h4 className="fs-14 fw-bold mb-3">Documents Ready for Upload ({selectedDocs.length})</h4>
            <div className="row">
              {selectedDocs.map((doc, index) => (
                <AttachementCard
                  key={index}
                  title={doc.type}
                  file={doc.file}
                  iconSrc={doc.icon}
                  onRemove={() => handleRemoveDoc(doc.type)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="alert alert-warning">
            No documents uploaded yet. Please select document type and upload file.
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="alert alert-danger mt-3">
            <FiMinus className="me-2" /> Please upload all required documents
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="mt-4">
            <div className="d-flex align-items-center mb-2">
              <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-info mb-0">Uploading documents... Please wait.</p>
            </div>
            <div className="progress" style={{ height: '6px' }}>
              <div 
                className="progress-bar progress-bar-striped progress-bar-animated" 
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

TabAttachement.displayName = "TabAttachement";

export default TabAttachement;

// Detect file icon based on extension
const getIconByFile = (file) => {
  const ext = file.name.split(".").pop().toLowerCase();

  if (ext === "pdf") return "/images/file-icons/pdf.png";
  if (["png"].includes(ext)) return "/images/file-icons/png.png";
  if (["jpg", "jpeg"].includes(ext)) return "/images/file-icons/jpg.png";
  if (["doc", "docx", "txt"].includes(ext)) return "/images/file-icons/doc.png";
  return "/images/file-icons/file.png";
};

const AttachementCard = ({ title, file, iconSrc, onRemove }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="card border hover-shadow h-100">
        <div className="card-body p-3 position-relative d-flex flex-column">
          <div className="d-flex align-items-center mb-3">
            <div className="flex-shrink-0">
              <img 
                src={iconSrc} 
                className="img-fluid wd-60 ht-60 rounded" 
                alt={title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/file-icons/file.png";
                }}
              />
            </div>
            <div className="flex-grow-1 ms-3">
              <h6 className="fs-13 mb-1 fw-semibold text-truncate" title={title}>{title}</h6>
              <small className="text-muted d-block">
                Size: {formatFileSize(file.size)}
              </small>
            </div>
          </div>
          
          <div className="mt-auto">
            <small className="text-truncate d-block mb-2" title={file.name}>
              <i className="bi bi-file-earmark me-1"></i>
              {file.name}
            </small>
            <button
              type="button"
              className="btn btn-sm btn-danger w-100"
              onClick={onRemove}
            >
              <FiMinus className="me-1" /> Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
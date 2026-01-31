"use client";
import React, { useState } from "react";
import { FiCheck, FiUpload, FiMail, FiPhone, FiMapPin, FiFileText, FiCamera, FiUser } from "react-icons/fi";
import { FaRegBuilding, FaRegAddressCard, FaBuilding } from "react-icons/fa";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { MdBusinessCenter } from "react-icons/md";
import VerifyOtpModal from "./VerifyOtpModal";

export default function CreateCompanyModal({ onClose, onVerify, type }) {
  const [company_name, setCompanyName] = useState("");
  const [company_about, setCompanyAbout] = useState("");
  const [company_phone, setCompanyPhone] = useState("");
  const [pan_number, setPanNumber] = useState("");
  const [pan_document, setPanDocument] = useState(null);
  const [gst_number, setGstNumber] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip_code, setZipCode] = useState("");
  const [gst_document, setGstDocument] = useState(null);
  const [company_logo, setCompanyLogo] = useState(null);
  const [client_type, setClientType] = useState("Gem"); // New state for client type

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpType, setOtpType] = useState("email");

  /* ---------------- HELPERS ---------------- */
  const BASE_URL = "https://green-owl-255815.hostingersite.com/api";

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSendEmailOtp = async () => {
    if (!isValidEmail(email)) {
      setEmailError("Invalid email address");
      return;
    }

    setEmailError("");

    try {
      const response = await fetch(`${BASE_URL}/emailverify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("email verify otp", data.otp);

      if (data.status) {
        setOtpType("email");
        setShowOtpPopup(true);
      } else {
        setEmailError(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("API Error:", error);
      setEmailError("Server error. Please try again.");
    }
  };

  /* ---------------- OTP VERIFIED ---------------- */
  const handleVerifyOtp = (otp) => {
    console.log("Verified OTP:", otp);
    setEmailVerified(true);
    setShowOtpPopup(false);
  };

  /* ---------------- FILE HANDLERS ---------------- */
  const handlePanDocument = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      setPanDocument(file);
    }
  };

  const handleGstDocument = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      setGstDocument(file);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Logo size should be less than 2MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert("Please upload an image file");
        return;
      }
      setCompanyLogo(file);
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
      alert("Please verify email first");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("company_name", company_name);
      formData.append("company_about", company_about);
      formData.append("company_business_email", email);
      formData.append("company_phone", company_phone);
      formData.append("pan_number", pan_number);
      formData.append("gst_number", gst_number);
      formData.append("address", address);
      formData.append("type", type);
      formData.append("state", state);
      formData.append("city", city);
      formData.append("zip_code", zip_code);
      formData.append("client_type", client_type); // Added client_type to form data

      if (pan_document) {
        formData.append("pan_document", pan_document);
      }

      if (gst_document) {
        formData.append("gst_document", gst_document);
      }

      if (company_logo) {
        formData.append("company_logo", company_logo);
      }
      console.log("📦 FormData Body being sent:");
    
    // Create a readable object for logging
    const formDataObj = {};
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        formDataObj[key] = {
          name: value.name,
          type: value.type,
          size: `${(value.size / 1024).toFixed(2)} KB`,
          lastModified: new Date(value.lastModified).toLocaleString()
        };
      } else {
        formDataObj[key] = value;
      }
    }
    
    console.log(JSON.stringify(formDataObj, null, 2));
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/company/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log("API Response:", data);

      onVerify?.(data);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Company create error:", error);
      alert(
        error?.response?.data?.message || "Something went wrong, try again"
      );
    }
  };

  return (
    <>
      {/* MAIN MODAL */}
      <div className="modal show d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content rounded-4 border-0 shadow-lg" style={{ maxHeight: "90vh", overflowY: "scroll", scrollbarWidth:'none' }}>
            {/* Modal Header */}
            <div className="modal-header bg-primary text-white rounded-top-4">
              <div className="d-flex align-items-center gap-3">
                <TbBuildingSkyscraper size={28} />
                <div>
                  <h5 className="modal-title fw-bold text-white mb-0">Create New Company</h5>
                  <small className="opacity-75">Fill in your company details below</small>
                </div>
              </div>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Company Basic Info Section */}
                  <div className="col-12">
                    <h6 className="fw-bold text-primary d-flex align-items-center gap-2">
                      <HiOutlineOfficeBuilding /> Basic Information
                    </h6>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label fw-medium">Company Name *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FaRegBuilding />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter company name"
                          value={company_name}
                          onChange={(e) => setCompanyName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label fw-medium">Client Type *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FiUser />
                        </span>
                        <select
                          className="form-select"
                          value={client_type}
                          onChange={(e) => setClientType(e.target.value)}
                          required
                        >
                          <option value="Gem">Gem</option>
                          <option value="Corporate">Corporate</option>
                          <option value="Both">Both</option>
                        </select>
                      </div>
                      <small className="text-muted">Select the primary client type for this company</small>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label fw-medium">About Company *</label>
                      <textarea
                        className="form-control"
                        placeholder="Brief description of your company"
                        value={company_about}
                        onChange={(e) => setCompanyAbout(e.target.value)}
                        rows="2"
                        required
                      />
                    </div>
                  </div>

                  

                  {/* Email Section */}
                  <div className="col-12">
                    <h6 className="fw-bold text-primary d-flex align-items-center gap-2 mt-3">
                      <FiMail /> Official Contacts
                    </h6>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label fw-medium">Business Email *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FiMail />
                        </span>
                        <input
                          type="email"
                          className={`form-control ${emailError ? "is-invalid" : ""}`}
                          placeholder="company@example.com"
                          value={email}
                          disabled={emailVerified}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailVerified(false);
                            setEmailError("");
                          }}
                          required
                        />
                        <button
                          type="button"
                          className={`btn ${emailVerified ? "btn-success" : "btn-outline-primary"}`}
                          onClick={!emailVerified ? handleSendEmailOtp : undefined}
                          disabled={emailVerified}
                        >
                          {emailVerified ? (
                            <>
                              <FiCheck className="me-1" /> Verified
                            </>
                          ) : (
                            "Verify Email"
                          )}
                        </button>
                      </div>
                      {emailError && (
                        <div className="text-danger small mt-1">{emailError}</div>
                      )}
                      {emailVerified && (
                        <div className="text-success small mt-1">
                          <FiCheck className="me-1" /> Email verified successfully
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label fw-medium">Phone Number *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FiPhone />
                        </span>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="Enter phone number"
                          value={company_phone}
                          onChange={(e) => setCompanyPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="col-12">
                    <h6 className="fw-bold text-primary d-flex align-items-center gap-2 mt-3">
                      <FaRegAddressCard /> Company Address
                    </h6>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label fw-medium">Full Address *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FiMapPin />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Street address, building, floor, etc."
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label fw-medium">City *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label fw-medium">State *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label fw-medium">Zip Code *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Postal code"
                        value={zip_code}
                        onChange={(e) => setZipCode(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Tax & Legal Section */}
                  <div className="col-12">
                    <h6 className="fw-bold text-primary d-flex align-items-center gap-2 mt-3">
                      <FiFileText /> Tax & Legal Information
                    </h6>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label fw-medium">PAN Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ABCDE1234F"
                        value={pan_number}
                        onChange={(e) => setPanNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label fw-medium">GST Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="22ABCDE1234F1Z5"
                        value={gst_number}
                        onChange={(e) => setGstNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* File Uploads Section */}
                  <div className="col-12">
                    <h6 className="fw-bold text-primary d-flex align-items-center gap-2 mt-3">
                      <FiUpload /> Documents & Logo
                    </h6>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label fw-medium d-flex align-items-center gap-2">
                        <FiFileText /> PAN Document *
                      </label>
                      <div className="card border-dashed h-100">
                        <div className="card-body text-center d-flex flex-column justify-content-center">
                          <input
                            type="file"
                            id="pan_document"
                            className="d-none"
                            onChange={handlePanDocument}
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                          />
                          <label htmlFor="pan_document" className="c-pointer">
                            <FiUpload size={24} className="text-muted mb-2" />
                            <p className="small mb-1">
                              {pan_document ? pan_document.name : "Upload PAN Card"}
                            </p>
                            <small className="text-muted">PDF, JPG, PNG (Max 5MB)</small>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label fw-medium d-flex align-items-center gap-2">
                        <FiFileText /> GST Certificate *
                      </label>
                      <div className="card border-dashed h-100">
                        <div className="card-body text-center d-flex flex-column justify-content-center">
                          <input
                            type="file"
                            id="gst_document"
                            className="d-none"
                            onChange={handleGstDocument}
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                          />
                          <label htmlFor="gst_document" className="c-pointer">
                            <FiUpload size={24} className="text-muted mb-2" />
                            <p className="small mb-1">
                              {gst_document ? gst_document.name : "Upload GST Certificate"}
                            </p>
                            <small className="text-muted">PDF, JPG, PNG (Max 5MB)</small>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label fw-medium d-flex align-items-center gap-2">
                        <FiCamera /> Company Logo
                      </label>
                      <div className="card border-dashed h-100">
                        <div className="card-body text-center d-flex flex-column justify-content-center">
                          <input
                            type="file"
                            id="logo"
                            className="d-none"
                            onChange={handleLogoUpload}
                            accept="image/*"
                          />
                          <label htmlFor="logo" className="c-pointer">
                            <FiCamera size={24} className="text-muted mb-2" />
                            <p className="small mb-1">
                              {company_logo ? company_logo.name : "Upload Logo"}
                            </p>
                            <small className="text-muted">Image (Max 2MB)</small>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer border-top-0 pt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={!emailVerified}
                  >
                    {!emailVerified ? (
                      "Verify Email First"
                    ) : (
                      <>
                        <FiCheck className="me-2" />
                        Create Company
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* OTP POPUP */}
      {showOtpPopup && (
        <VerifyOtpModal
          type={otpType}
          onClose={() => setShowOtpPopup(false)}
          onVerify={handleVerifyOtp}
        />
      )}
    </>
  );
}
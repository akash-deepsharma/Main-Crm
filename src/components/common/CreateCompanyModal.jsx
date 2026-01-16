"use client";
import React, { useState } from "react";
import { FiCheck } from "react-icons/fi";
import VerifyOtpModal from "./VerifyOtpModal";
import { Router } from "next/router";

export default function CreateCompanyModal({ onClose, onVerify, type }) {
  const [company_name, setCompanyName] = useState("");
  const [company_about, setCompanyAbout] = useState("");
  const [company_phone, setCompanyPhone] = useState("");
  const [pan_number, setPanNumber] = useState("");
  const [pan_document, setPanDocument] = useState("");
  const [gst_number, setGstNumber] = useState("");
  const [address, setAddress] = useState("");
  const [gst_document, setGstDocument] = useState("");
  const [company_logo, setCompanyLogo] = useState("");

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
    console.log("email verify otp", data.otp)
   
    if (data.status) {
      setOtpType("email");
      setShowOtpPopup(true); // ✅ OPEN OTP MODAL
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

    // ✅ Files (append only if present)
    if (pan_document) {
      formData.append("pan_document", pan_document);
    }

    if (gst_document) {
      formData.append("gst_document", gst_document);
    }

    if (company_logo) {
      formData.append("company_logo", company_logo);
    }
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

    // optional callback
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
        <div className="modal-dialog modal-dialog-centered" >
          <div className="modal-content p-4 rounded-4 " style={{ width: "100%" , minWidth:'500px'}}>
            <h5 className="fw-bold mb-3">Create Company</h5>

            <form onSubmit={handleSubmit}>
              <div className="row">
                
              <div className="col-lg-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company Name"
                  value={company_name}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="col-lg-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company about"
                  value={company_about}
                  onChange={(e) => setCompanyAbout(e.target.value)}
                  required
                />
              </div>
              
              <div className="col-lg-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company Phone"
                  value={company_phone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  required
                />
              </div>
              <div className="col-lg-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company Pan Number"
                  value={pan_number}
                  onChange={(e) => setPanNumber(e.target.value)}
                  required
                />
              </div>
              <div className="col-lg-12 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company GST Number"
                  value={gst_number}
                  onChange={(e) => setGstNumber(e.target.value)}
                  required
                />
              </div>
              <div className="col-lg-12 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              {/* EMAIL */}
              <div className="col-lg-12 mb-2">
              <div className=" input-group mb-2">
                <input
                  type="email"
                  className={`form-control ${emailError ? "is-invalid" : ""}`}
                  placeholder="Official Email"
                  value={email}
                  disabled={emailVerified}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailVerified(false);
                    setEmailError("");
                  }}
                />

                <div
                  className={`input-group-text ${
                    emailVerified ? "bg-light text-muted" : "c-pointer"
                  }`}
                  onClick={!emailVerified ? handleSendEmailOtp : undefined}
                  style={{ cursor: emailVerified ? "not-allowed" : "pointer" }}
                >
                  {emailVerified ? <FiCheck color="green" /> : "Verify"}
                </div>
              </div>
              {emailError && (
                <small className="text-danger">{emailError}</small>
              )}

              </div>
              <div className="col-lg-6 mb-3">
                <label htmlFor="pan_document">Upload Company Pancard</label>
                <input
                  type="file"
                  id="pan_document"
                  className="form-control"
                  onChange={(e) => setPanDocument(e.target.files[0])}
                  required
                />
              </div>
              
              <div className="col-lg-6 mb-3">
                <label htmlFor="gst_document">Upload Company GST</label>
                <input
                  type="file"
                  id="gst_document"
                  className="form-control"
                  placeholder="Company GST Document"
                  onChange={(e) => setGstDocument(e.target.files[0])}
                  required
                />
              </div>
              <div className="col-lg-6 mb-3">
                <label htmlFor="logo">Upload Company Logo</label>
                <input
                  type="file"
                  id="logo"
                  className="form-control"
                  placeholder="Company Logo"
                  onChange={(e) => setCompanyLogo(e.target.files[0])}
                  required
                />
              </div>


              </div>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!emailVerified}
                >
                  Create Company
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
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

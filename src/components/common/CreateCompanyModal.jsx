"use client";
import React, { useState } from "react";
import { FiCheck, FiEye, FiEyeOff, FiHash } from "react-icons/fi";
import VerifyOtpModal from "./VerifyOtpModal";

export default function CreateCompanyModal({ onClose, onVerify, type }) {
  const [company_name, setCompanyName] = useState("");
  const [company_about, setCompanyAbout] = useState("");
  const [company_business_email, setCompanyBusinessEmail] = useState("");
  const [company_phone, setCompanyPhone] = useState("");
  const [pan_number, setPanNumber] = useState("");
  const [pan_document, setPanDocument] = useState("");
  const [gst_number, setGstNumber] = useState("");
  const [gst_document, setGstDocument] = useState("");
  const [userName, setUserName] = useState("");
  const [company_logo, setCompanyLogo] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpType, setOtpType] = useState("email");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  /* ---------------- HELPERS ---------------- */

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  /* ---------------- PASSWORD STRENGTH ---------------- */
  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    setStrength(score);
  };

  const strengthLabel =
    strength <= 2 ? "Low" : strength <= 4 ? "Medium" : "High";

  const strengthColor =
    strength <= 2 ? "bg-danger" : strength <= 4 ? "bg-warning" : "bg-success";

  /* ---------------- PASSWORD GENERATOR ---------------- */
  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let generated = "";
    for (let i = 0; i < 12; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
    setConfirmPassword(generated);
    setPasswordError("");
    calculateStrength(generated);
  };
  /* ---------------- EMAIL OTP ---------------- */

  const handleSendEmailOtp = async () => {
    if (!isValidEmail(email)) {
      setEmailError("Invalid email address");
      return;
    }

    setEmailError("");

    // 🔴 API call example
    // await sentEmailOtpApi(email);

    setOtpType("email");
    setShowOtpPopup(true); // ✅ OPEN OTP MODAL
  };

  /* ---------------- OTP VERIFIED ---------------- */

  const handleVerifyOtp = (otp) => {
    console.log("Verified OTP:", otp);

    setEmailVerified(true);
    setShowOtpPopup(false);
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailVerified) {
      alert("Please verify email first");
      return;
    }

    onVerify?.({
      company_name,
      company_about,
      company_business_email,
      company_phone,
      pan_number,
      pan_document,
      gst_number,
      gst_document,
      userName,
      company_logo,
      email,
      type,
    });

    onClose();
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
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="col-lg-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company Business Email"
                  value={company_business_email}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="col-lg-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company Phone"
                  value={company_phone}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="col-lg-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company Pan Number"
                  value={pan_number}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="col-lg-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company Pan Document"
                  value={pan_document}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="col-lg-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company GST Number"
                  value={gst_number}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="col-lg-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company GST Document"
                  value={gst_document}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="col-lg-6 mb-3">
                <input
                  type="file"
                  className="form-control"
                  placeholder="Company Logo"
                  value={company_logo}
                  onChange={(e) => setCompanyLogo(e.target.value)}
                  required
                />
              </div>

              <div className="col-lg-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="User Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="col-lg-6 mb-2">
              <div className=" input-group mb-2">
                <input
                  type="email"
                  className={`form-control ${emailError ? "is-invalid" : ""}`}
                  placeholder="Email"
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

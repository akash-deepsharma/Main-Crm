"use client";
import React, { useRef, useState } from "react";

export default function VerifyOtpModal({ onClose, onVerify, type }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // ✅ Handle OTP input
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, ""); // only numbers

    // If user pasted full OTP
    if (value.length > 1) {
      const values = value.split("").slice(0, 6);
      const newOtp = [...otp];
      values.forEach((v, i) => {
        newOtp[i] = v;
      });
      setOtp(newOtp);
      // Focus last field
      const lastIndex = Math.min(values.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
      return;
    }

    // Normal single digit typing
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next box
    if (index < 5 && value) inputRefs.current[index + 1]?.focus();
  };

  // ✅ Handle Backspace/Delete
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) inputRefs.current[index - 1]?.focus();
    }
  };

  // ✅ Handle Paste (anywhere)
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d{1,6}$/.test(paste)) return; // allow only up to 6 digits

    const values = paste.split("").slice(0, 6);
    const newOtp = [...otp];
    values.forEach((v, i) => {
      newOtp[i] = v;
    });
    setOtp(newOtp);

    // Focus last field
    const lastIndex = Math.min(values.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  // ✅ Submit OTP
  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) return alert("Please enter all 6 digits");
    onVerify(enteredOtp);
  };
const titleMap = {
  email: "Verify Email OTP",
  phone: "Verify Phone OTP",
  ForgetPassword: "Verify Forget Password OTP",
};
  return (
    <div className="modal show d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4 rounded-4 text-center">
          <h5 className="fw-bold mb-3">
            {titleMap[type] || "Verify OTP"}
          </h5>

          <form onSubmit={handleSubmit}>
            <div
              className="d-flex justify-content-center gap-2 mb-3"
              onPaste={handlePaste} // ✅ paste anywhere across the boxes
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  className="form-control text-center"
                  style={{
                    width: "45px",
                    height: "50px",
                    fontSize: "20px",
                    borderRadius: "10px",
                  }}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                />
              ))}
            </div>

            <div className="d-flex justify-content-center gap-3">
              <button type="submit" className="btn btn-primary" style={{lineHeight:'32px'}}>
                Verify
              </button>
              <button
                type="button"
                className="btn btn-secondary" style={{lineHeight:'32px'}}
                onClick={onClose} 
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

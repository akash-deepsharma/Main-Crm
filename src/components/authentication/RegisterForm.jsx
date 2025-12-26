"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FiCheck, FiEye, FiEyeOff, FiHash } from "react-icons/fi";
import VerifyOtpModal from "../common/VerifyOtpModal";

import {
  RegisterApi,
  sentEmailOtpApi,
  sentPhoneOtpApi,
  verifyEmailOtpApi,
  verifyPhoneOtpApi,
} from "@/ApiCall/Authantication";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

const RegisterForm = ({ path }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    emailVerified: "",
    phoneVerified: "",
  });

  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpType, setOtpType] = useState("");
  /* ---------------- STATES ---------------- */
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const router = useRouter();

  /* ---------------- HELPERS ---------------- */
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isValidPhone = (value) => /^[0-9]{10}$/.test(value);
  // const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

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

  // ✅ Send Email OTP
  const handleSendEmailOtp = async () => {
    if (!isValidEmail(email)) {
      setEmailError("Invalid email address");
      return;
    }

    setFormData({ ...formData, email });

    const res = await sentEmailOtpApi(email);
    if (res?.status) {
      setOtpType("email");
      setShowOtpPopup(true);
    } else {
      alert(res?.message || "Failed to send Email OTP");
    }
  };

  // ✅ Send Phone OTP
  const handleSendPhoneOtp = async () => {
    if (!isValidPhone(phone)) {
      setPhoneError("Enter valid 10 digit number");
      return;
    }

    setFormData({ ...formData, phone_number: phone });

    const res = await sentPhoneOtpApi(phone);
    if (res?.status) {
      setOtpType("phone");
      setShowOtpPopup(true);
    } else {
      alert(res?.message || "Failed to send Phone OTP");
    }
  };

  // ✅ Verify OTP Callback
  const handleVerifyOtp = async (enteredOtp) => {
    try {
      if (otpType === "email") {
        const res = await verifyEmailOtpApi(email, enteredOtp);
        if (res?.status) {
          setEmailVerified(true); // ✅ CORRECT PLACE
          setFormData((prev) => ({ ...prev, emailVerified: true }));
          alert("✅ Email verified successfully!");
        } else {
          alert("Invalid Email OTP");
          return;
        }
      }

      if (otpType === "phone") {
        const res = await verifyPhoneOtpApi(phone, enteredOtp);
        if (res?.status) {
          setPhoneVerified(true); // ✅ CORRECT PLACE
          setFormData((prev) => ({ ...prev, phoneVerified: true }));
          alert("✅ Phone verified successfully!");
        } else {
          alert("Invalid Phone OTP");
          return;
        }
      }

      setShowOtpPopup(false);
    } catch (err) {
      console.error(err);
      alert("Error verifying OTP");
    }
  };

  // ✅ Submit Form (only if verified)
  // ✅ Submit Form (only if verified)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!isValidEmail(email)) {
      alert("Invalid email format");
      return;
    }

    if (!isValidPhone(phone)) {
      alert("Phone number must be 10 digits");
      return;
    }

    if (!formData.emailVerified || !formData.phoneVerified) {
      alert("Please verify your Email and Phone before submitting.");
      return;
    }

    // ✅ Correct payload
    const formattedData = {
      name: name,
      email: email,
      phone: phone,
      password: password,
      email_verify: formData.emailVerified,
      phone_verify: formData.phoneVerified,
    };

    console.log("Form Data to submit:", formattedData);

    try {
      const res = await RegisterApi(formattedData);

      if (res?.status === "success") {
        localStorage.setItem("auth_token", res.token);
        localStorage.setItem("auth_user", JSON.stringify(res.user));
        alert("✅ Register request submitted successfully!");

        try {
          router.push("/pricing");
          // onClose?.();
        } catch (uiError) {
          console.error("UI error after success:", uiError);
        }
      } else {
        alert(res?.message || "⚠️ Request failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("❌ Failed to submit Register form.");
    }
  };

  return (
    <>
      <h2 className="fs-20 fw-bolder mb-4">Register</h2>
      <h4 className="fs-13 fw-bold mb-2">Manage all in our Alphonic CRM</h4>
      <p className="fs-12 fw-medium text-muted">
        Let's get you all setup so you can begin setting up your profile.
      </p>

      <form className="w-100 mt-4 pt-2" onSubmit={handleSubmit}>
        {/* NAME */}
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* EMAIL */}
        <div className="input-group mb-2">
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
            className={`input-group-text c-pointer ${
              emailVerified ? "disabled bg-light text-muted" : ""
            }`}
            onClick={!emailVerified ? handleSendEmailOtp : undefined}
            style={{ cursor: emailVerified ? "not-allowed" : "pointer" }}
          >
            {emailVerified ? <FiCheck color="green" /> : "Verify"}
          </div>
        </div>

        {emailError && <small className="text-danger">{emailError}</small>}

        {/* PHONE */}
        <div className="input-group mb-2 mt-3">
          <input
            type="tel"
            className={`form-control ${phoneError ? "is-invalid" : ""}`}
            placeholder="Phone (10 digit)"
            value={phone}
            disabled={phoneVerified}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 11) {
                setPhone(value);
                setPhoneVerified(false);
                setPhoneError("");
              }
            }}
          />

          <div
            className={`input-group-text c-pointer ${
              phoneVerified ? "disabled bg-light text-muted" : ""
            }`}
            onClick={!phoneVerified ? handleSendPhoneOtp : undefined}
            style={{ cursor: phoneVerified ? "not-allowed" : "pointer" }}
          >
            {phoneVerified ? <FiCheck color="green" /> : "Verify"}
          </div>
        </div>

        {phoneError && <small className="text-danger">{phoneError}</small>}

        {/* PASSWORD */}
        <div className="mb-4 mt-3">
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                calculateStrength(e.target.value);

                if (confirmPassword && e.target.value !== confirmPassword) {
                  setPasswordError("Passwords do not match");
                } else {
                  setPasswordError("");
                }
              }}
              required
            />

            <div
              className="input-group-text c-pointer"
              onClick={generatePassword}
              title="Generate Password"
            >
              <FiHash />
            </div>

            <div
              className="input-group-text c-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </div>

          <div className="progress mt-2" style={{ height: "6px" }}>
            <div
              className={`progress-bar ${strengthColor}`}
              style={{ width: `${(strength / 5) * 100}%` }}
            />
          </div>

          {password && (
            <small className={`fw-bold ${strengthColor.replace("bg", "text")}`}>
              Strength: {strengthLabel}
            </small>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-4">
          <input
            type="password"
            className={`form-control ${passwordError ? "is-invalid" : ""}`}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (password && e.target.value !== password) {
                setPasswordError("Passwords do not match");
              } else {
                setPasswordError("");
              }
            }}
            required
          />
          {passwordError && (
            <div className="invalid-feedback d-block">{passwordError}</div>
          )}
        </div>

        {/* CHECKBOXES */}
        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" id="get_mail" />
          <label className="form-check-label text-muted" htmlFor="get_mail">
            Yes, I want to receive Alphonic CRM emails
          </label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            id="agree"
            type="checkbox"
            required
          />
          <label className="form-check-label text-muted" htmlFor="agree">
            I agree to all the <a href="#">Terms & Conditions</a>
          </label>
        </div>

        {/* SUBMIT */}
        <div className="mt-5">
          <button
            type="submit"
            className="btn btn-lg btn-primary w-100"
            disabled={
              !name ||
              !emailVerified ||
              !phoneVerified ||
              !password ||
              !confirmPassword ||
              password !== confirmPassword ||
              strength < 3
            }
          >
            Create Account
          </button>
        </div>
      </form>

      <div className="mt-5 text-muted">
        <span>Already have an account?</span>
        <Link href={path} className="fw-bold">
          {" "}
          Login
        </Link>
      </div>

      {/* OTP Modal */}
      {showOtpPopup && (
        <VerifyOtpModal
          onClose={() => setShowOtpPopup(false)}
          onVerify={handleVerifyOtp}
          type={otpType}
        />
      )}
    </>
  );
};

export default RegisterForm;

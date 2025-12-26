"use client";
import { sentForgetPasswordOtpApi, verifyForgetPasswordOtpApi } from '@/ApiCall/Authantication';
import Link from 'next/link';
import React, { useState } from 'react';
import VerifyOtpModal from '../common/VerifyOtpModal';
import { useRouter } from 'next/navigation';

const ResetForm = ({ path }) => {
  const [inputType, setInputType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpType, setOtpType] = useState("");
  const router = useRouter();

  // ✅ Send OTP
  const handleSendPhoneOtp = async (e) => {
    e.preventDefault();

    if (!inputType) {
      alert("Please enter Email or Phone");
      return;
    }

    setLoading(true);
    const res = await sentForgetPasswordOtpApi(inputType);
    setLoading(false);

    if (res?.status) {
      setOtpType("ForgetPassword");
      setShowOtpPopup(true);
    } else {
      alert(res?.message || "Failed to send OTP");
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async (otp) => {
    try {
      if (otpType === "ForgetPassword") {
        const res = await verifyForgetPasswordOtpApi(inputType, otp);

        if (!res?.status) {
          alert(res?.message || "Invalid OTP");
          return;
        }        

        alert("✅ OTP verified. You can now reset your password.");
        try {
         router.push(
        `/authentication/update-password?input_type=${encodeURIComponent(inputType)}`
      );
        } catch (uiError) {
          console.error("UI error after success:", uiError);
        }
      }

      setShowOtpPopup(false);
    } catch (err) {
      console.error(err);
      alert("Error verifying OTP");
    }
  };

  return (
    <>
      <h2 className="fs-20 fw-bolder mb-4">Reset</h2>
      <h4 className="fs-13 fw-bold mb-2">Reset your password</h4>
      <p className="fs-12 fw-medium text-muted">
        Enter your Email/Phone and an OTP will be sent to you.
      </p>

      <form className="w-100 mt-4 pt-2" onSubmit={handleSendPhoneOtp}>
        <div className="mb-4">
          <input
            className="form-control"
            placeholder="Email or phone"
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
            required
          />
        </div>

        <div className="mt-5">
          <button
            type="submit"
            className="btn btn-lg btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Reset Now"}
          </button>
        </div>
      </form>

      <div className="mt-5 text-muted">
        <span>Don't have an account?</span>
        <Link href={path} className="fw-bold"> Create an Account</Link>
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

export default ResetForm;

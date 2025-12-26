"use client";
import { verifyResetPasswordApi } from "@/ApiCall/Authantication";
import Link from "next/link";
import React, { useState } from "react";
import { FiEye, FiEyeOff, FiHash } from "react-icons/fi";
import { useSearchParams, useRouter } from "next/navigation";

const UpdatePassword = ({ path }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const inputType = searchParams.get("input_type");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(false);

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

  /* ---------------- UPDATE PASSWORD ---------------- */
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!inputType) {
      alert("Invalid reset request");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await verifyResetPasswordApi(inputType, password);
    setLoading(false);

    if (!res?.status) {
      alert(res?.message || "Failed to update password");
      return;
    }
    alert("✅ Password updated successfully");
    router.push("/");
  };

  return (
    <>
      <h2 className="fs-20 fw-bolder mb-4">Update Password</h2>
      <h4 className="fs-13 fw-bold mb-2">Change your password</h4>
      <p className="fs-12 fw-medium text-muted">
        Create a strong new password for <b>{inputType}</b>
      </p>

      <form className="w-100 mt-4 pt-2" onSubmit={handleUpdatePassword}>
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
                setPasswordError(
                  confirmPassword && e.target.value !== confirmPassword
                    ? "Passwords do not match"
                    : ""
                );
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
              setPasswordError(
                password && e.target.value !== password
                  ? "Passwords do not match"
                  : ""
              );
            }}
            required
          />
          {passwordError && (
            <div className="invalid-feedback d-block">{passwordError}</div>
          )}
        </div>

        <div className="mt-5">
          <button
            type="submit"
            className="btn btn-lg btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Now"}
          </button>
        </div>
      </form>
    </>
  );
};

export default UpdatePassword;

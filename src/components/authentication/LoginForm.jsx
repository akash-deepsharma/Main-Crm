"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FiFacebook, FiGithub, FiTwitter } from "react-icons/fi";
import { LoginApi } from "@/ApiCall/Authantication";
import { useRouter } from "next/navigation";
import { SiGoogle } from "react-icons/si";
import { signInWithGoogle } from "@/utils/firebaseConfig";


const LoginForm = ({ registerPath, resetPath }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
const router = useRouter();

const handleSignIn = async (e) => {
  e.preventDefault();

  const payload = {
    input_type: email,
    password,
  };

  try {
    setLoading(true);
    const response = await LoginApi(payload);

    if (response?.status === "success") {
      // ✅ Save to localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("is_subscribed", response.subscribe);
      localStorage.setItem("role", response?.user?.role_type);

      // ✅ Redirect based on subscription
      if (response.subscribe === false) {
        router.push("/pricing");
      } else {
        router.push("/company");
      }
    } else {
      alert(response?.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong!");
  } finally {
    setLoading(false);
  }
};

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <>
      <h2 className="fs-20 fw-bolder mb-4">Login</h2>
      <h4 className="fs-13 fw-bold mb-2">Login to your account</h4>

      <form onSubmit={handleSignIn} className="w-100 mt-4 pt-2">
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Email/Phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="d-flex align-items-center justify-content-between">
          <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input" id="rememberMe" />
            <label className="custom-control-label" htmlFor="rememberMe">
              Remember Me
            </label>
          </div>

          <Link href={resetPath} className="fs-11 text-primary">
            Forget password?
          </Link>
        </div>

        <div className="mt-5">
          <button
            type="submit"
            className="btn btn-lg btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>

      <div className="w-100 mt-5 text-center mx-auto">
        <div className="mb-4 border-bottom position-relative">
          <span className="small py-1 px-3 text-uppercase text-muted bg-white position-absolute translate-middle">
            or
          </span>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-light-brand flex-fill" onClick={handleGoogleLogin}><SiGoogle /></button>
          <button className="btn btn-light-brand flex-fill"><FiFacebook /></button>
          <button className="btn btn-light-brand flex-fill"><FiTwitter /></button>
        </div>
      </div>

      <div className="mt-5 text-muted">
        Don’t have an account?
        <Link href={registerPath} className="fw-bold ms-1">
          Create an Account
        </Link>
      </div>
    </>
  );
};

export default LoginForm;

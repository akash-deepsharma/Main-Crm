// src/ApiCall/Authantication.js

const BASE_URL = "https://green-owl-255815.hostingersite.com/api";

// ---------------- LOGIN ----------------
export async function LoginApi(payload) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    return { status: false, message: "Login failed" };
  }
}

// ---------------- REGISTER ----------------
export async function RegisterApi(payload) {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  const data = await res.json();
  console.log("RegisterApi responce", data)
  return await data;
  } catch (err) {
    return { status: false, message: "Registration failed" };
  }
}

// ---------------- EMAIL OTP ----------------
export async function sentEmailOtpApi(email) {
  try {
    const res = await fetch(`${BASE_URL}/emailverify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    console.log("email otp" , data)

       if (!res.ok) {
      return {
        status: false,
        message: data?.message || "OTP sending failed",
      };
    }
     return data;
  } catch {
    return { status: false };
  }
}

export async function verifyEmailOtpApi(email, otp) {
  try {
    const res = await fetch(`${BASE_URL}/emailverifyotp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    return await res.json();
  } catch {
    return { status: false };
  }
}

// ---------------- PHONE OTP ----------------
export async function sentPhoneOtpApi(phone_number) {
  try {
    const res = await fetch(`${BASE_URL}/phone-number-verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone_number }),
    });

    const data = await res.json();

    console.log("phone otp response:", data);

    if (!res.ok) {
      return {
        status: false,
        message: data?.message || "OTP sending failed",
      };
    }

    return data;
  } catch (error) {
    console.error("Phone OTP error:", error);
    return { status: false, message: "Network error" };
  }
}


export async function verifyPhoneOtpApi(phone_number, otp) {
  try {
    const res = await fetch(`${BASE_URL}/phone-verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number, otp }),
    });
    return await res.json();
  } catch {
    return { status: false };
  }
}

export async function Signinwithgoogle(payload) {
  try {
    const res = await fetch(`${BASE_URL}/signinwithgoogle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    console.log("Signinwithgoogle responce", data)
    return await data;

  } catch (error) {
    if (error.response) {
      return error.response.data; 
    }
    return { status: "error", message: "Network or server error" };
  }
}





// ---------------- EMAIL OTP ----------------
export async function sentForgetPasswordOtpApi(input_type) {
  try {
    const res = await fetch(`${BASE_URL}/forgetpassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input_type }),
    });
    const data = await res.json();

    console.log(" Forget input_type otp" , data)

       if (!res.ok) {
      return {
        status: false,
        message: data?.message || "OTP sending failed",
      };
    }
     return data;
  } catch {
    return { status: false };
  }
}

export async function verifyForgetPasswordOtpApi(input_type, otp) {
  try {
    const res = await fetch(`${BASE_URL}/verifyforgetotp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input_type, otp }),
    });
    return await res.json();
  } catch {
    return { status: false };
  }
}

export async function verifyResetPasswordApi(input_type, password) {
  try {
    const res = await fetch(`${BASE_URL}/resetpassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input_type, password }),
    });
    return await res.json();
  } catch {
    return { status: false };
  }
}
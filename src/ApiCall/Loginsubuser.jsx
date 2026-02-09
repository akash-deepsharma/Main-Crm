// src/ApiCall/Authantication.js

const BASE_URL = "https://green-owl-255815.hostingersite.com/api";

// ---------------- LOGIN ----------------
export async function LoginA3pi(payload) {
  try {
    const res = await fetch(`${BASE_URL}/loginsubuse222r`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json(); 
    console.log("API Response:", data);

    return data; // ✅ Return response to frontend

  } catch (err) {
    console.error("API Error:", err);
    return { status: false, message: err.message };
  }
}

const BASE_URL = "https://green-owl-255815.hostingersite.com/api";

export async function subscriptionsGet() {
  const res = await fetch(`${BASE_URL}/subscriptions`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  return res.json();
}
// ---------------- REGISTER ----------------
export async function subscribedData(payload) {
    console.log("subscription data", payload)
    const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/purchase-subscription`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      body: JSON.stringify(payload),
      token: true,
    });
    const data = await res.json();
    console.log(" subscribedData responce", data)
  return await data;
  } catch (err) {
    return { status: false, message: "Registration failed" };
  }
}


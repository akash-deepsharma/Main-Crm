import { Signinwithgoogle } from "@/ApiCall/Authantication";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCFqJiqs1ONpsf_9EqOisRU2yUd2XiT_KM",
  authDomain: "alphonic-crm.firebaseapp.com",
  projectId: "alphonic-crm",
  storageBucket: "alphonic-crm.firebasestorage.apps",
  messagingSenderId: "1021459249309",
  appId: "1:1021459249309:web:f87ef14c8c0183f3d0bc74",  
  measurementId: "G-YH92N4DKEJ"
};



const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();


export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // console.log("User Info:", result.user);
    // alert(`Welcome ${result.user.displayName}!`);

    const payload = {
      email: user.email,
      name: user.displayName,
      google_id: user.uid,
      avatar: user.photoURL,
    };

      const signindata=  await Signinwithgoogle(payload)
      // console.log("Google Login API Response:", signindata);
      
    //  if (signindata.status === "success") {
      
    //   localStorage.setItem("token", signindata.token);
    //   localStorage.setItem("user", JSON.stringify(signindata.user));

    //   window.location.href = "/pricing";
    // } else {
    //   alert(signindata.message || "❌ Failed to set password. Try again.");
    // }

      if (signindata?.status === "success") {
          // ✅ Save to localStorage
          localStorage.setItem("token", signindata.token);
          localStorage.setItem("user", JSON.stringify(signindata.user));
          localStorage.setItem("is_subscribed", signindata.subscribe);
    
          
          if (signindata.subscribe === false) {
            // router.push("/pricing");
            window.location.href = "/pricing";
          } else {
            // router.push("/company");
          window.location.href = "/company";
          }
        } else {
          alert(signindata?.message || "Login failed");
        }
  } catch (error) {
    // console.error("Google Sign-In Error:", error);
    alert("Failed to sign in with Google.");
  }
};




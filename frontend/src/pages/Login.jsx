import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, Phone, KeyRound } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [method, setMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const googleButtonRef = useRef();



  const checkUserFlow = async () => {
  try {
    const res = await axios.get("http://localhost:3001/auth/status", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });

    const { profile, consent } = res.data;
    if (!profile) return navigate("/profile");
    if (!consent) return navigate("/consent");
    navigate("/dashboard");
  } catch {
    navigate("/profile"); 
  }
};



  const handleSubmit = async () => {
    if (method === "email") {
      if (!email || !password) return alert("Email and password required");

      try {
        if (isLogin) {
          const res = await axios.post("http://localhost:3001/auth/login", { email, password });
          localStorage.setItem("token", res.data.token);
        checkUserFlow();
        } else {
          await axios.post("http://localhost:3001/auth/register", { email, password });
          alert("Registered! Please log in.");
          setIsLogin(true);
        }
      } catch {
        alert("Authentication failed");
      }
    } else {
      if (!phone) return alert("Phone number required");
      if (!showOtpInput) {
        alert("📲 Mock OTP sent: 123456");
        setShowOtpInput(true);
        return;
      }
      if (otp !== "123456") return alert("Invalid OTP (Hint: use 123456)");
      localStorage.setItem("token", "mock-phone-token");
      checkUserFlow();
    }
  };

  
  const handleGoogleResponse = async (response) => {
    try {
      const res = await axios.post("http://localhost:3001/auth/google", {
        idToken: response.credential,
      });
      localStorage.setItem("token", res.data.token);
     checkUserFlow();
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login error");
    }
  };

  useEffect(() => {
    if (!window.google || !googleButtonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: "292312539986-4bp1hb87ao2k7hqo07an57l4dsslt1tu.apps.googleusercontent.com", 
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      type: "standard",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h1>

        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setMethod("email")}
            className={`px-4 py-1 rounded-full border ${method === "email" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}
          >
            Email
          </button>
          <button
            onClick={() => setMethod("phone")}
            className={`px-4 py-1 rounded-full border ${method === "phone" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}
          >
            Phone
          </button>
        </div>

        {method === "email" ? (
          <>
            <div className="flex items-center bg-gray-100 rounded px-3 py-2 mb-3">
              <Mail className="w-4 h-4 mr-2 text-gray-500" />
              <input
                type="email"
                placeholder="Email"
                className="bg-transparent w-full outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex items-center bg-gray-100 rounded px-3 py-2 mb-3">
              <Lock className="w-4 h-4 mr-2 text-gray-500" />
              <input
                type="password"
                placeholder="Password"
                className="bg-transparent w-full outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center bg-gray-100 rounded px-3 py-2 mb-3">
              <Phone className="w-4 h-4 mr-2 text-gray-500" />
              <input
                type="tel"
                placeholder="Phone number"
                className="bg-transparent w-full outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            {showOtpInput && (
              <div className="flex items-center bg-gray-100 rounded px-3 py-2 mb-3">
                <KeyRound className="w-4 h-4 mr-2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="bg-transparent w-full outline-none"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}
          </>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"} {" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setShowOtpInput(false);
              setOtp("");
            }}
            className="text-indigo-600 font-medium"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>

        <div className="my-4">
          <div className="text-center text-sm text-gray-500 mb-2">or sign in with</div>
          <div ref={googleButtonRef} className="flex justify-center" />
        </div>
      </div>
    </div>
  );
}
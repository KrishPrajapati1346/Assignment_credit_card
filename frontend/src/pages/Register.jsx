import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/auth/register", { email, password });
      alert("Account created! Please login.");
      navigate("/");
    } catch {
      alert("Registration failed. Try a different email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={register}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-semibold text-center mb-4">Create Account</h1>

        <div className="mb-3">
          <label className="block text-sm mb-1 text-gray-700">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-700">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Create Account
        </button>

        <p className="text-sm text-center mt-3 text-gray-600">
          Already registered?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-indigo-600 cursor-pointer font-medium"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    city: "",
    incomeRangeMonthly: "",
    primaryBank: ""
  });

  const [expenses, setExpenses] = useState({
    travel: "",
    utilities: "",
    groceries: "",
    shopping: "",
    dining: "",
    food_delivery: ""
  });

  const submit = async () => {
    try {
      await axios.post("http://localhost:3001/profile", form, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });

      await axios.post(
        "http://localhost:3001/expenses",
        {
          expenses: Object.entries(expenses).map(([categoryKey, amount]) => ({
            categoryKey,
            amount: parseFloat(amount)
          }))
        },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        }
      );

      navigate("/consent");
    } catch {
      alert("Error submitting profile");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">Profile Details</h1>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Income (₹)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={form.incomeRangeMonthly}
            onChange={(e) => setForm({ ...form, incomeRangeMonthly: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Primary Bank</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={form.primaryBank}
            onChange={(e) => setForm({ ...form, primaryBank: e.target.value })}
          />
        </div>
      </div>

      <h2 className="text-lg font-semibold mt-6 mb-2">Monthly Expenses (₹)</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(expenses).map(([key, val]) => (
          <div key={key}>
            <label className="block text-sm capitalize text-gray-700">{key.replace("_", " ")}</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={val}
              onChange={(e) => setExpenses({ ...expenses, [key]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <button
        onClick={submit}
        className="mt-6 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
      >
        Next
      </button>
    </div>
  );
}
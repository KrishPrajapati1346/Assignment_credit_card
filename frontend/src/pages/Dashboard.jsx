import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [statements, setStatements] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:3001/dashboard", {
      headers: { Authorization: "Bearer " + token }
    }).then(res => setData(res.data));

    axios.get("http://localhost:3001/statements", {
      headers: { Authorization: "Bearer " + token }
    }).then(res => setStatements(res.data));
  }, []);

  const connectGmail = () => {
    const token = localStorage.getItem("token");
    window.location.href = `http://localhost:3001/auth/gmail?token=${token}`;
  };

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">👋 Welcome, {data.profile?.fullName}</h1>

      <div className="mb-4 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">📄 Profile Info</h2>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>City:</strong> {data.profile?.city}</p>
        <p><strong>Bank:</strong> {data.profile?.primaryBank}</p>
      </div>

      <div className="mb-4 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">💸 Monthly Expenses</h2>
        <ul className="list-disc pl-6">
          {data.expenses.map((e, i) => (
            <li key={i}>{e.categoryKey}: ₹{e.amount}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">📧 Gmail Statements</h2>
        {statements.length === 0 ? (
          <p className="text-sm text-gray-500">No statements found. Connect Gmail below.</p>
        ) : (
          <ul className="list-disc pl-6 text-xs whitespace-pre-wrap">
            {statements.map((s, i) => (
              <li key={i} className="mb-2 bg-gray-100 p-2 rounded">
                {s.content.slice(0, 500)}...
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={connectGmail}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        📎 Connect Gmail to Parse Statement
      </button>
    </div>
  );
}
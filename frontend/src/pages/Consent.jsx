import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Consent() {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    if (!checked) return alert("Please accept terms.");
    try {
      await axios.post("http://localhost:3001/consent", {}, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      navigate("/dashboard");
    } catch (err) {
      alert("Error submitting consent.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
        <h1 className="text-xl font-semibold mb-4 text-center text-indigo-600">Consent Required</h1>
        
        <p className="text-sm text-gray-700 mb-4">
          Before continuing, please confirm that you accept our Terms & Conditions. We value your privacy and only collect data with your explicit consent.
        </p>

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            className="mr-2"
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span className="text-sm text-gray-800">I accept the Terms & Conditions</span>
        </label>

        <button
          onClick={submit}
          disabled={!checked}
          className={`w-full py-2 rounded text-white font-semibold transition ${
            checked ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Submit & Continue
        </button>
      </div>
    </div>
  );
}
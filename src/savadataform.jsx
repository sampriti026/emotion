import React, { useState, useEffect } from "react";
import "./App.css";

const SaveToExcel = ({ segments }) => {
  const [email, setEmail] = useState("");

  const [fullRadius, setFullRadius] = useState(150);

  useEffect(() => {
    // Dynamically update fullRadius based on window size or other conditions
    const updateRadius = () => {
      const newRadius = window.innerWidth < 768 ? 150 : 200;
      setFullRadius(newRadius);
    };

    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  const segmentsToPercentages = (segments) => {
    // Convert each segment radius to percentage of the fullRadius
    return segments.map((segment) => (segment / fullRadius) * 100);
  };

  const submitToGoogleSheets = async () => {
    const percentages = segmentsToPercentages(segments);
    const data = [email, ...percentages]; // This matches the structure of your columns
    console.log(fullRadius, percentages);

    try {
      const response = await fetch("/api/sheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        alert("Data saved successfully!");
      } else {
        alert("Failed to save data.");
      }
    } catch (error) {
      console.error("Error saving data", error);
      alert("Error submitting data.");
    }
  };

  return (
    <div>
      <input
        className="input-field"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <button className="button" onClick={submitToGoogleSheets}>
        Submit & Save to Excel
      </button>
    </div>
  );
};

export default SaveToExcel;

import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./App.css";

const SaveToExcel = ({ segments }) => {
  const [email, setEmail] = useState("");

  const emotions = [
    "Aggression",
    "Depression",
    "Fixations",
    "Abnormal Flat Speech",
    "Noise Sensitivity",
    "Social Difficulty",
    "Anxiety",
    "Abnormal Posture",
    "Poor Eye Contact",
    "Tics and Fidgets",
  ];
  const segment = () => {
    const percentages = segmentsToPercentages(segments);

    console.log(percentages);
  };
  const fullRadius = 200; // Assuming fullRadius is 200 for conversion

  const segmentsToPercentages = (segments) => {
    // Convert each segment radius to percentage of the fullRadius
    return segments.map((segment) => (segment / fullRadius) * 100);
  };

  const saveToExcel = () => {
    // Create a new workbook and a worksheet
    const percentages = segmentsToPercentages(segments);

    const workbook = XLSX.utils.book_new();
    const worksheet_data = [
      ["Email ID", ...emotions],
      [email, ...percentages],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheet_data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "EmotionsData");

    // Write the workbook to a file
    XLSX.writeFile(workbook, "EmotionsData.xlsx");
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
      <button className="button" onClick={saveToExcel}>
        Submit & Save to Excel
      </button>
    </div>
  );
};

export default SaveToExcel;

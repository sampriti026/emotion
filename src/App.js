import React, { useRef, useEffect, useState } from "react";
import './App.css';
import PieChart from './chart';
import SaveToExcel from './savadataform';
function App() {
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
  const [segments, setSegments] = useState(new Array(emotions.length).fill(0));
  const [lockedPercentages, setLockedPercentages] = useState(new Array(emotions.length).fill(0));

  const [percentages, setPercentages] = useState(new Array(10).fill(0));


  return (
    <div className="app-container">
    <div className="form-container">
      <PieChart segments={segments} setSegments={setSegments} setlockedPercentages={setLockedPercentages} lockedPercentages={lockedPercentages} setPercentages={setPercentages}  />
      <SaveToExcel  segments={segments} />

    </div>
     </div>
  );
}

export default App;

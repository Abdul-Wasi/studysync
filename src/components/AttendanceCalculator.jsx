// src/components/AttendanceCalculator.jsx

import React, { useState } from "react";
import "../styles/AttendanceCalculator.css";

const AttendanceCalculator = () => {
  const [totalClasses, setTotalClasses] = useState("");
  const [attendedClasses, setAttendedClasses] = useState("");
  const [targetPercentage, setTargetPercentage] = useState("");
  const [attendancePercentage, setAttendancePercentage] = useState(null);
  const [classesNeeded, setClassesNeeded] = useState(null);
  const [error, setError] = useState("");

  const calculateAttendance = () => {
    const total = parseInt(totalClasses);
    const attended = parseInt(attendedClasses);

    if (isNaN(total) || isNaN(attended) || total <= 0 || attended < 0 || attended > total) {
      setError("Please enter valid numbers. Attended classes cannot exceed total classes.");
      setAttendancePercentage(null);
      setClassesNeeded(null);
      return;
    }

    setError("");
    const percentage = ((attended / total) * 100).toFixed(2);
    setAttendancePercentage(parseFloat(percentage));
    setClassesNeeded(null);
  };

  const predictRequiredClasses = () => {
    const total = parseInt(totalClasses);
    const attended = parseInt(attendedClasses);
    const target = parseFloat(targetPercentage);

    if (isNaN(target) || target <= 0 || target > 100) {
      setError("Please enter a valid target percentage (1-100).");
      setClassesNeeded(null);
      return;
    }

    setError("");

    let extraClasses = 0;
    let newTotal = total;
    let newAttended = attended;

    while ((newAttended / newTotal) * 100 < target) {
      extraClasses++;
      newTotal++;
      newAttended++;
    }

    if (extraClasses === 0) {
      setClassesNeeded("You have already achieved your target!");
    } else {
      setClassesNeeded(`You need to attend ${extraClasses} more consecutive classes.`);
    }
  };

  return (
    <div className="attendance-page">
      <h1>Attendance Calculator</h1>
      <p className="subtitle">Track and plan your attendance smartly.</p>

      {error && <div className="error-box">{error}</div>}

      <div className="form-section">
        <input
          type="number"
          placeholder="Total Classes"
          value={totalClasses}
          onChange={(e) => setTotalClasses(e.target.value)}
        />
        <input
          type="number"
          placeholder="Attended Classes"
          value={attendedClasses}
          onChange={(e) => setAttendedClasses(e.target.value)}
        />
        <button onClick={calculateAttendance}>Calculate Attendance</button>
      </div>

      {attendancePercentage !== null && (
        <div className="result-box">
          <h3>Your Attendance: {attendancePercentage}%</h3>
          <div className="progress-bar-wrapper">
            <div className={`progress-bar ${attendancePercentage >= 75 ? "green" : attendancePercentage >= 50 ? "yellow" : "red"}`} style={{ width: `${attendancePercentage}%` }}></div>
          </div>
        </div>
      )}

      {attendancePercentage !== null && (
        <div className="target-section">
          <h4>🎯 Predict Required Attendance</h4>
          <input
            type="number"
            placeholder="Target Attendance %"
            value={targetPercentage}
            onChange={(e) => setTargetPercentage(e.target.value)}
          />
          <button onClick={predictRequiredClasses}>Calculate Required Classes</button>

          {classesNeeded && <div className="info-box">{classesNeeded}</div>}
        </div>
      )}
    </div>
  );
};

export default AttendanceCalculator;

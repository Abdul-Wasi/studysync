// src/components/AttendanceCalculator.jsx

import React, { useState } from "react";
import { useEffect } from "react";
import "../styles/AttendanceCalculator.css";

const AttendanceCalculator = () => {
  const [totalClasses, setTotalClasses] = useState("");
  const [attendedClasses, setAttendedClasses] = useState("");
  const [targetPercentage, setTargetPercentage] = useState("");
  const [attendancePercentage, setAttendancePercentage] = useState(null);
  const [classesNeededToAttend, setClassesNeededToAttend] = useState(null);
  const [classesCanMiss, setClassesCanMiss] = useState(null);
  const [error, setError] = useState("");

  const calculateAttendance = () => {
    const total = parseInt(totalClasses);
    const attended = parseInt(attendedClasses);

    if (isNaN(total) || isNaN(attended) || total <= 0 || attended < 0 || attended > total) {
      setError("Please enter valid numbers. Attended classes cannot exceed total classes.");
      setAttendancePercentage(null);
      setClassesNeededToAttend(null);
      setClassesCanMiss(null);
      return;
    }

    setError("");
    const percentage = ((attended / total) * 100).toFixed(2);
    setAttendancePercentage(parseFloat(percentage));
    setClassesNeededToAttend(null);
    setClassesCanMiss(calculateClassesCanMiss(total, attended));
  };

  const calculateClassesCanMiss = (total, attended) => {
    if (isNaN(parseFloat(targetPercentage)) || parseFloat(targetPercentage) <= 0 || parseFloat(targetPercentage) > 100) {
      return "Enter target % to see missable classes.";
    }
    const canMiss = Math.floor(total - (total * (parseFloat(targetPercentage) / 100)));
    return Math.max(0, canMiss - attended);
  };

  const predictRequiredClasses = () => {
    const total = parseInt(totalClasses);
    const attended = parseInt(attendedClasses);
    const target = parseFloat(targetPercentage);

    if (isNaN(target) || target <= 0 || target > 100) {
      setError("Please enter a valid target percentage (1-100).");
      setClassesNeededToAttend(null);
      return;
    }

    setError("");

    if ((attended / total) * 100 >= target) {
      setClassesNeededToAttend("You have already achieved your target!");
      return;
    }

    let needed = 0;
    let currentTotal = total;
    let currentAttended = attended;
    while ((currentAttended / currentTotal) * 100 < target) {
      needed++;
      currentTotal++;
      currentAttended++;
    }
    setClassesNeededToAttend(`You need to attend ${needed} more consecutive classes to reach ${target}% attendance.`);
  };

  useEffect(() => {
    if (totalClasses !== "" && attendedClasses !== "") {
      calculateAttendance();
    }
    if (totalClasses !== "" && attendedClasses !== "" && targetPercentage !== "") {
      predictRequiredClasses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalClasses, attendedClasses, targetPercentage]);

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
            <div
              className={`progress-bar ${
                attendancePercentage >= 75 ? "green" : attendancePercentage >= 50 ? "yellow" : "red"
              }`}
              style={{ width: `${attendancePercentage}%` }}
            ></div>
          </div>
          {classesCanMiss !== null && typeof classesCanMiss === 'number' && (
            <p className="info-text">You can miss <strong>{classesCanMiss}</strong> more classes to maintain {targetPercentage || 'your target'}% (approx.).</p>
          )}
          {classesCanMiss !== null && typeof classesCanMiss === 'string' && (
            <p className="info-text">{classesCanMiss}</p>
          )}
        </div>
      )}

      <div className="target-section">
        <h4>🎯 Predict Required Attendance</h4>
        <input
          type="number"
          placeholder="Target Attendance %"
          value={targetPercentage}
          onChange={(e) => setTargetPercentage(e.target.value)}
        />
        <button onClick={predictRequiredClasses}>Calculate Required Classes</button>

        {classesNeededToAttend && <div className="info-box">{classesNeededToAttend}</div>}
      </div>
    </div>
  );
};

export default AttendanceCalculator;
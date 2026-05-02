import React, { useState } from "react";
import "..//styles/AttendanceCalculator.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AttendanceCalculator = () => {
  const [totalClasses, setTotalClasses] = useState("");
  const [attendedClasses, setAttendedClasses] = useState("");
  const [targetPercentage, setTargetPercentage] = useState(75);
  const [attendancePercentage, setAttendancePercentage] = useState(null);
  const [classesCanMiss, setClassesCanMiss] = useState(null);

  const calculateAttendance = () => {
    if (totalClasses && attendedClasses) {
      const percentage = (attendedClasses / totalClasses) * 100;
      setAttendancePercentage(percentage.toFixed(2));
      calculateClassesCanMiss();
    }
  };

  const calculateClassesCanMiss = () => {
    const attended = parseInt(attendedClasses);
    const total = parseInt(totalClasses);
    const target = parseFloat(targetPercentage);

    if (isNaN(attended) || isNaN(total) || isNaN(target) || total <= 0) {
      setClassesCanMiss(null);
      return;
    }

    const numerator = attended - (target / 100) * total;
    const denominator = (target / 100);

    const canMiss = Math.floor(numerator / denominator);

    if (canMiss >= 0) {
      setClassesCanMiss(canMiss);
    } else {
      setClassesCanMiss("Not allowed to miss any more classes!");
    }
  };

  const resetForm = () => {
    setTotalClasses("");
    setAttendedClasses("");
    setTargetPercentage(75);
    setAttendancePercentage(null);
    setClassesCanMiss(null);
  };

  return (
    <div className="attendance-calculator">
      <h2>Attendance Calculator</h2>
      <div className="form-group">
        <label>Total Classes Held</label>
        <input
          type="number"
          value={totalClasses}
          onChange={(e) => setTotalClasses(e.target.value)}
          placeholder="Enter total classes"
        />
      </div>
      <div className="form-group">
        <label>Classes Attended</label>
        <input
          type="number"
          value={attendedClasses}
          onChange={(e) => setAttendedClasses(e.target.value)}
          placeholder="Enter attended classes"
        />
      </div>
      <div className="form-group">
        <label>Target Attendance % (Default: 75%)</label>
        <input
          type="number"
          value={targetPercentage}
          onChange={(e) => setTargetPercentage(e.target.value)}
          placeholder="Enter target percentage"
        />
      </div>
      <div className="button-group">
        <button onClick={calculateAttendance}>Calculate</button>
        <button onClick={resetForm} className="reset-btn">Reset</button>
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

          {/* Pie Chart */}
          <div className="chart-container">
            <Pie
              data={{
                labels: ["Attended", "Missed"],
                datasets: [
                  {
                    data: [
                      parseInt(attendedClasses),
                      parseInt(totalClasses) - parseInt(attendedClasses)
                    ],
                    backgroundColor: ["#2ecc71", "#e74c3c"],
                    borderColor: ["#27ae60", "#c0392b"],
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      color: "#333",
                      font: {
                        size: 14,
                        weight: "bold",
                      },
                    },
                  },
                },
              }}
            />
          </div>

          {classesCanMiss !== null && typeof classesCanMiss === 'number' && (
            <p className="info-text">
              You can miss <strong>{classesCanMiss}</strong> more classes to maintain {targetPercentage || 'your target'}% attendance (approx.).
            </p>
          )}
          {classesCanMiss !== null && typeof classesCanMiss === 'string' && (
            <p className="info-text">{classesCanMiss}</p>
          )}
        </div>
      )}
    </div>
  );
};

//exporting the component

export default AttendanceCalculator;

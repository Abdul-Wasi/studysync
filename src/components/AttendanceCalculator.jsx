import React, { useState } from "react";
import { ProgressBar } from "react-bootstrap"; // If you're using bootstrap for styling

const AttendanceCalculator = () => {
  const [classesHeld, setClassesHeld] = useState("");
  const [classesAttended, setClassesAttended] = useState("");
  const [requiredAttendance, setRequiredAttendance] = useState(75);
  const [attendancePercentage, setAttendancePercentage] = useState(null);
  const [prediction, setPrediction] = useState("");

  // Function to calculate attendance percentage
  const calculateAttendance = () => {
    if (classesHeld > 0 && classesAttended >= 0) {
      const percentage = (classesAttended / classesHeld) * 100;
      setAttendancePercentage(percentage);
      
      // Predict if the student will meet the attendance requirement
      if (percentage >= requiredAttendance) {
        setPrediction("You are on track!");
      } else {
        setPrediction("You need to attend more classes to meet the requirement.");
      }
    } else {
      setPrediction("Please enter valid numbers.");
    }
  };

  return (
    <div className="attendance-calculator">
      <h2>Attendance Calculator</h2>
      <div>
        <label>Classes Held: </label>
        <input
          type="number"
          value={classesHeld}
          onChange={(e) => setClassesHeld(e.target.value)}
        />
      </div>
      <div>
        <label>Classes Attended: </label>
        <input
          type="number"
          value={classesAttended}
          onChange={(e) => setClassesAttended(e.target.value)}
        />
      </div>
      <div>
        <label>Required Attendance: </label>
        <input
          type="number"
          value={requiredAttendance}
          onChange={(e) => setRequiredAttendance(e.target.value)}
        />
        <span>%</span>
      </div>
      <button onClick={calculateAttendance}>Calculate</button>
      
      {attendancePercentage !== null && (
        <div>
          <h3>Attendance Percentage: {attendancePercentage.toFixed(2)}%</h3>
          <ProgressBar now={attendancePercentage} max={100} label={`${attendancePercentage.toFixed(2)}%`} />
        </div>
      )}
      
      <h4>{prediction}</h4>
    </div>
  );
};

export default AttendanceCalculator;

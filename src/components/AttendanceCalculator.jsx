import React, { useState } from "react";
import { ProgressBar, Alert, Form, Button } from "react-bootstrap";

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
    setAttendancePercentage(percentage);
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

  const getProgressColor = () => {
    if (attendancePercentage >= 75) return "success";
    if (attendancePercentage >= 50) return "warning";
    return "danger";
  };

  return (
    <div className="attendance-calculator">
      <h2>Attendance Calculator</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form>
        <Form.Group>
          <Form.Label>Total Classes</Form.Label>
          <Form.Control
            type="number"
            value={totalClasses}
            onChange={(e) => setTotalClasses(e.target.value)}
            placeholder="Enter total classes"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Attended Classes</Form.Label>
          <Form.Control
            type="number"
            value={attendedClasses}
            onChange={(e) => setAttendedClasses(e.target.value)}
            placeholder="Enter attended classes"
          />
        </Form.Group>

        <Button variant="primary" className="mt-3" onClick={calculateAttendance}>
          Calculate Attendance
        </Button>
      </Form>

      {attendancePercentage !== null && (
        <div className="mt-4">
          <h4>Attendance Percentage: {attendancePercentage}%</h4>
          <ProgressBar variant={getProgressColor()} now={attendancePercentage} />
        </div>
      )}

      {/* Prediction Section */}
      {attendancePercentage !== null && (
        <div className="mt-4">
          <h3>Predict Required Attendance</h3>
          <Form.Group>
            <Form.Label>Target Attendance (%)</Form.Label>
            <Form.Control
              type="number"
              value={targetPercentage}
              onChange={(e) => setTargetPercentage(e.target.value)}
              placeholder="Enter target percentage"
            />
          </Form.Group>

          <Button variant="success" className="mt-3" onClick={predictRequiredClasses}>
            Calculate Required Classes
          </Button>

          {classesNeeded && (
            <Alert variant="info" className="mt-3">
              {classesNeeded}
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceCalculator;

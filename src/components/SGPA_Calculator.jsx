// src/components/SGPACalculator.jsx

import React, { useState } from "react";
import "../styles/SGPACalculator.css";

const gradeMap = {
  "O": 10,
  "A+": 9,
  "A": 8,
  "B+": 7,
  "B": 6,
  "C": 5,
  "F": 0,
};

const SGPACalculator = () => {
  const [subjects, setSubjects] = useState([{ credit: "", grade: "" }]);
  const [sgpa, setSGPA] = useState(null);
  const [error, setError] = useState("");

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const addSubject = () => {
    setSubjects([...subjects, { credit: "", grade: "" }]);
  };

  const calculateSGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    for (const subject of subjects) {
      const credit = parseFloat(subject.credit);
      const gradePoint = gradeMap[subject.grade.toUpperCase()];

      if (isNaN(credit) || !gradePoint && gradePoint !== 0) {
        setError("Please enter valid credits and grades for all subjects.");
        setSGPA(null);
        return;
      }

      totalCredits += credit;
      totalPoints += credit * gradePoint;
    }

    if (totalCredits === 0) {
      setError("Total credits cannot be zero.");
      return;
    }

    setError("");
    setSGPA((totalPoints / totalCredits).toFixed(2));
  };

  return (
    <div className="sgpa-calculator">
      <h2>SGPA Calculator</h2>

      {subjects.map((subject, index) => (
        <div className="subject-row" key={index}>
          <input
            type="number"
            placeholder="Credits"
            value={subject.credit}
            onChange={(e) => handleSubjectChange(index, "credit", e.target.value)}
          />
          <input
            type="text"
            placeholder="Grade (O, A+, A, B+...)"
            value={subject.grade}
            onChange={(e) => handleSubjectChange(index, "grade", e.target.value)}
          />
        </div>
      ))}

      <button className="add-btn" onClick={addSubject}>+ Add Subject</button>
      <button className="calculate-btn" onClick={calculateSGPA}>Calculate SGPA</button>

      {error && <div className="error-msg">{error}</div>}
      {sgpa && (
        <div className="result">
          Your SGPA is: <span>{sgpa}</span>
        </div>
      )}
    </div>
  );
};

export default SGPACalculator;

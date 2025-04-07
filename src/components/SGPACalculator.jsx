import React, { useState, useEffect } from "react";
import gradingScales from "../utils/gradingScales";
import "../styles/SGPACalculator.css";

const SGPACalculator = () => {
  const [university, setUniversity] = useState("IUST");
  const [degree, setDegree] = useState("B.Tech");
  const [scale, setScale] = useState(gradingScales["IUST"]["B.Tech"]);

  const [subjects, setSubjects] = useState([
    { name: "Sub 1", marks: "", grade: "", gradePoint: "", credit: "" },
  ]);
  const [sgpa, setSGPA] = useState(null);

  useEffect(() => {
    let selectedScale;

    if (university === "IUST") {
      selectedScale = gradingScales["IUST"]?.[degree];
    } else if (university === "Others") {
      selectedScale = gradingScales["Others"];
    }

    setScale(selectedScale || []);
  }, [university, degree]);

  const calculateGradeAndPoint = (index, key, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][key] = value;

    const subject = updatedSubjects[index];

    if (key === "marks") {
      const num = parseFloat(value);
      const matched = scale.find((entry) => num >= entry.min && num <= entry.max);
      if (matched) {
        subject.grade = matched.grade;
        subject.gradePoint = matched.point;
      }
    }

    if (key === "grade") {
      const matched = scale.find((entry) => entry.grade === value.toUpperCase());
      if (matched) {
        subject.gradePoint = matched.point;
      }
    }

    if (key === "gradePoint") {
      const num = parseFloat(value);
      const matched = scale.find((entry) => entry.point === num);
      if (matched) {
        subject.grade = matched.grade;
      }
    }

    setSubjects(updatedSubjects);
  };

  const addSubject = () => {
    const newIndex = subjects.length + 1;
    setSubjects([
      ...subjects,
      { name: `Sub ${newIndex}`, marks: "", grade: "", gradePoint: "", credit: "" },
    ]);
  };

  const calculateSGPA = () => {
    let totalCredits = 0;
    let totalWeightedPoints = 0;

    for (const subject of subjects) {
      const credit = parseFloat(subject.credit);
      const gradePoint = parseFloat(subject.gradePoint);
      if (isNaN(credit) || isNaN(gradePoint)) continue;

      totalCredits += credit;
      totalWeightedPoints += credit * gradePoint;
    }

    if (totalCredits === 0) {
      setSGPA(null);
      return;
    }

    const result = (totalWeightedPoints / totalCredits).toFixed(2);
    setSGPA(result);
  };

  return (
    <div className="sgpa-calculator">
      <h2>SGPA Calculator</h2>

      <div className="dropdowns">
        <label>
          University/College:
          <select value={university} onChange={(e) => setUniversity(e.target.value)}>
            <option value="IUST">IUST</option>
            <option value="Others">Others</option>
            <option disabled>More Universities (Coming Soon...)</option>
          </select>
        </label>

        {university === "IUST" && (
          <label>
            Degree:
            <select value={degree} onChange={(e) => setDegree(e.target.value)}>
              {Object.keys(gradingScales["IUST"]).map((deg) => (
                <option key={deg} value={deg}>
                  {deg}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="subjects">
        {subjects.map((sub, idx) => (
          <div key={idx} className="subject-row">
            <span>{sub.name}</span>
            <input
              type="number"
              placeholder="Marks"
              value={sub.marks}
              onChange={(e) => calculateGradeAndPoint(idx, "marks", e.target.value)}
            />
            <input
              type="text"
              placeholder="Grade"
              value={sub.grade}
              onChange={(e) => calculateGradeAndPoint(idx, "grade", e.target.value)}
            />
            <input
              type="number"
              step="0.1"
              placeholder="Grade Point"
              value={sub.gradePoint}
              onChange={(e) => calculateGradeAndPoint(idx, "gradePoint", e.target.value)}
            />
            <input
              type="number"
              placeholder="Credits"
              value={sub.credit}
              onChange={(e) => {
                const updated = [...subjects];
                updated[idx].credit = e.target.value;
                setSubjects(updated);
              }}
            />
          </div>
        ))}
      </div>

      <div className="buttons">
        <button onClick={addSubject}>+ Add Subject</button>
        <button onClick={calculateSGPA}>Calculate SGPA</button>
      </div>

      {sgpa && <div className="result">Your SGPA is: <strong>{sgpa}</strong></div>}
    </div>
  );
};

export default SGPACalculator;

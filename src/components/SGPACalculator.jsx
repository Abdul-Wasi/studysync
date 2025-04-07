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

  const handleSubjectChange = (index, key, value) => {
    const updated = [...subjects];
    updated[index][key] = value;

    if (key === "marks") {
      const num = parseFloat(value);
      const matched = scale.find((entry) => num >= entry.min && num <= entry.max);
      if (matched) {
        updated[index].grade = matched.grade;
        updated[index].gradePoint = matched.point;
      }
    }

    if (key === "grade") {
      const matched = scale.find((entry) => entry.grade === value.toUpperCase());
      if (matched) {
        updated[index].gradePoint = matched.point;
      }
    }

    if (key === "gradePoint") {
      const num = parseFloat(value);
      const matched = scale.find((entry) => entry.point === num);
      if (matched) {
        updated[index].grade = matched.grade;
      }
    }

    setSubjects(updated);
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
    let totalPoints = 0;

    subjects.forEach((s) => {
      const gp = parseFloat(s.gradePoint);
      const c = parseFloat(s.credit);
      if (!isNaN(gp) && !isNaN(c)) {
        totalCredits += c;
        totalPoints += gp * c;
      }
    });

    const result = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : null;
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
        {subjects.map((subject, index) => (
          <div key={index} className="subject-row">
            <input
              type="text"
              value={subject.name}
              onChange={(e) => handleSubjectChange(index, "name", e.target.value)}
              placeholder="Subject Name"
            />
            <input
              type="number"
              placeholder="Marks"
              value={subject.marks}
              onChange={(e) => handleSubjectChange(index, "marks", e.target.value)}
            />
            <input
              type="text"
              placeholder="Grade"
              value={subject.grade}
              onChange={(e) => handleSubjectChange(index, "grade", e.target.value)}
            />
            <input
              type="number"
              step="0.1"
              placeholder="Grade Point"
              value={subject.gradePoint}
              onChange={(e) => handleSubjectChange(index, "gradePoint", e.target.value)}
            />
            <input
              type="number"
              placeholder="Credits"
              value={subject.credit}
              onChange={(e) => handleSubjectChange(index, "credit", e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="buttons">
        <button onClick={addSubject}>+ Add Subject</button>
        <button onClick={calculateSGPA}>Calculate SGPA</button>
      </div>

      {sgpa && (
        <div className="result">
          Your SGPA is: <strong>{sgpa}</strong>
        </div>
      )}
    </div>
  );
};

export default SGPACalculator;

// src/components/SGPACalculator.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from '../firebase';
import { ref, set } from 'firebase/database';
import { toast } from 'react-toastify';
import gradingScales from "../utils/gradingScales";
import "../styles/SGPACalculator.css";

const SGPACalculator = () => {
  const [university, setUniversity] = useState("IUST");
  const [degree, setDegree] = useState("B.Tech");
  const [scale, setScale] = useState(gradingScales["IUST"]["B.Tech"]);
  const [subjects, setSubjects] = useState([
    { id: Date.now(), name: "Sub 1", marks: "", grade: "", gradePoint: "", credit: "" },
  ]);
  const [sgpa, setSGPA] = useState(null);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [semesterNumber, setSemesterNumber] = useState(""); // NEW STATE FOR SEMESTER NUMBER

  // Listen for auth state changes to determine if user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

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
      } else { // Clear if no match
        updated[index].grade = '';
        updated[index].gradePoint = '';
      }
    } else if (key === "grade") {
      const matched = scale.find((entry) => entry.grade === value.toUpperCase());
      if (matched) {
        updated[index].gradePoint = matched.point;
      } else { // Clear if no match
        updated[index].gradePoint = '';
      }
    } else if (key === "gradePoint") {
      const num = parseFloat(value);
      const matched = scale.find((entry) => entry.point === num);
      if (matched) {
        updated[index].grade = matched.grade;
      } else { // Clear if no match
        updated[index].grade = '';
      }
    }
    setSubjects(updated);
  };

  const addSubject = () => {
    const newIndex = subjects.length + 1;
    setSubjects([
      ...subjects,
      { id: Date.now(), name: `Sub ${newIndex}`, marks: "", grade: "", gradePoint: "", credit: "" },
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

    if (result === null) {
      toast.error("Please enter valid grade points and credits for all subjects to calculate SGPA.");
      setSGPA(null);
      setShowSavePrompt(false);
      return;
    }

    setSGPA(result);
    setShowSavePrompt(true); // Show save prompt after calculation
  };

  const saveSgpaData = async () => {
    const user = auth.currentUser;
    if (user && sgpa) {
      if (!semesterNumber.trim()) {
        toast.error("Please enter a semester name/number before saving.");
        return;
      }

      try {
        const sgpaId = Date.now();
        const semesterData = {
          semesterNumber: semesterNumber.trim(), // Save the semester name/number
          sgpa: parseFloat(sgpa),
          credits: subjects.reduce((sum, s) => sum + (parseFloat(s.credit) || 0), 0),
          totalSubjects: subjects.length, // Save total subjects for this semester
          subjects: subjects.map(s => ({
            name: s.name,
            marks: s.marks,
            grade: s.grade,
            gradePoint: s.gradePoint,
            credit: s.credit,
          })),
          calculatedAt: new Date().toISOString(),
        };

        // Use update instead of set to allow adding to `semesters` without overwriting other sgpaData properties
        // However, if sgpaData only contains `semesters`, `set` on the `semesters` path is fine too.
        // For simplicity and clarity, we'll `set` directly to the new semester entry.
        // Firebase path: users/{uid}/sgpaData/semesters/{sgpaId}
        await set(ref(db, `users/${user.uid}/sgpaData/semesters/${sgpaId}`), semesterData);

        toast.success(`SGPA for '${semesterNumber}' saved successfully!`);
        setShowSavePrompt(false); // Hide prompt after saving
        setSemesterNumber(''); // Clear semester number input
        setSubjects([{ id: Date.now(), name: "Sub 1", marks: "", grade: "", gradePoint: "", credit: "" }]); // Reset subjects
        setSGPA(null); // Clear SGPA result
      } catch (error) {
        console.error("Error saving SGPA data:", error);
        toast.error("Failed to save SGPA data.");
      }
    } else if (!user) {
      toast.warn("Please log in to save your SGPA data.");
    } else if (!sgpa) {
      toast.warn("Please calculate your SGPA before saving.");
    }
  };


  return (
    <div className="sgpa-calculator">
      <h2>🎓 SGPA Calculator</h2>

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
        {/* NEW: Semester Name/Number Input */}
        <label>
          Semester Name/Number:
          <input
            type="text"
            value={semesterNumber}
            onChange={(e) => setSemesterNumber(e.target.value)}
            placeholder="e.g., Semester 1, Fall 2023"
            className="semester-name-input"
          />
        </label>
      </div>

      <div className="subjects">
        {subjects.map((subject, index) => (
          <div key={subject.id} className="subject-row">
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
        <button onClick={calculateSGPA}>🎯 Calculate SGPA</button>
      </div>

      {sgpa && (
        <div className="result">
          ✅ <strong>Your SGPA is: {sgpa}</strong>
        </div>
      )}

      {showSavePrompt && (
        <div className="save-prompt">
          {isLoggedIn ? (
            <>
              <p>Ready to save this result for **{semesterNumber || 'this semester'}**?</p>
              <button onClick={saveSgpaData} className="save-button">Save Result</button>
            </>
          ) : (
            <>
              <p>Want to save your SGPA calculation?</p>
              <Link to="/login">Login</Link> or <Link to="/signup">Sign Up</Link> to save your result!
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SGPACalculator;
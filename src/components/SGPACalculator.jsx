// src/components/SGPACalculator.jsx
import React, { useState, useEffect } from "react";
import "../styles/StudyPlanner.css";
import { v4 as uuidv4 } from "uuid";

const StudyPlanner = () => {
  const [subjects, setSubjects] = useState([
    { id: uuidv4(), name: "", startDate: "", endDate: "", hours: "", priority: "Low", reminder: "" }
  ]);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [error, setError] = useState(null);
  const [showTotalTime, setShowTotalTime] = useState(false); // For controlling visibility

  const handleInputChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const addSubject = () => {
    setSubjects([
      ...subjects,
      { id: uuidv4(), name: "", startDate: "", endDate: "", hours: "", priority: "Low", reminder: "" }
    ]);
  };

  const removeSubject = (id) => {
    const updatedSubjects = subjects.filter(subject => subject.id !== id);
    setSubjects(updatedSubjects);
  };

  const validateDates = () => {
    for (let subject of subjects) {
      if (new Date(subject.endDate) < new Date(subject.startDate)) {
        setError("End date must be after start date.");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const calculateTotalStudyTime = () => {
    if (!validateDates()) return;
    const total = subjects.reduce((acc, subject) => acc + parseFloat(subject.hours || 0), 0);
    setTotalStudyTime(total);
    setShowTotalTime(true); // Show total time after calculation
  };

  useEffect(() => {
    // Reset total time and visibility when subjects change
    setTotalStudyTime(0);
    setShowTotalTime(false);
  }, [subjects]);

  return (
    <div className="study-planner">
      <h2>Study Planner</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="subject-list">
        {subjects.map((subject, index) => (
          <div key={subject.id} className={`subject-row priority-${subject.priority.toLowerCase()}`}>
            <div className="input-group">
              <label htmlFor={`subject-name-${subject.id}`}>Subject Name</label>
              <input
                id={`subject-name-${subject.id}`}
                type="text"
                value={subject.name}
                placeholder="Enter Subject Name"
                onChange={(e) => handleInputChange(index, "name", e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor={`start-date-${subject.id}`}>Start Date</label>
              <input
                id={`start-date-${subject.id}`}
                type="date"
                value={subject.startDate}
                onChange={(e) => handleInputChange(index, "startDate", e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor={`end-date-${subject.id}`}>End Date</label>
              <input
                id={`end-date-${subject.id}`}
                type="date"
                value={subject.endDate}
                onChange={(e) => handleInputChange(index, "endDate", e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor={`hours-${subject.id}`}>Study Hours</label>
              <input
                id={`hours-${subject.id}`}
                type="number"
                value={subject.hours}
                placeholder="Enter Study Hours"
                onChange={(e) => handleInputChange(index, "hours", e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor={`priority-${subject.id}`}>Priority</label>
              <select
                id={`priority-${subject.id}`}
                value={subject.priority}
                onChange={(e) => handleInputChange(index, "priority", e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor={`reminder-${subject.id}`}>Reminder Time</label>
              <input
                id={`reminder-${subject.id}`}
                type="time"
                value={subject.reminder}
                onChange={(e) => handleInputChange(index, "reminder", e.target.value)}
              />
            </div>

            <button onClick={() => removeSubject(subject.id)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="buttons">
        <button onClick={addSubject}>+ Add Subject</button>
        <button onClick={calculateTotalStudyTime}>Calculate Total Time</button>
      </div>

      {showTotalTime && totalStudyTime > 0 && (
        <div className="total-time visible">
          <h3>Total Study Time: {totalStudyTime} hours</h3>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;

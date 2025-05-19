// src/components/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { ref, onValue, off } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
    const [userEmail, setUserEmail] = useState('');
    const [studyPlannerData, setStudyPlannerData] = useState(null);
    const [budgetingToolData, setBudgetingToolData] = useState(null);
    const [sgpaCalculatorData, setSgpaCalculatorData] = useState(null); // This will hold an array of semester objects
    const [loading, setLoading] = useState(true);
    const [showCGPA, setShowCGPA] = useState(false); // New state for toggling CGPA display
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            if (user) {
                setUserEmail(user.email);
                const userRef = ref(db, `users/${user.uid}`);

                const unsubscribeDb = onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        // Study Planner Data
                        if (data.studyPlannerData && data.studyPlannerData.tasks) {
                            setStudyPlannerData(Object.values(data.studyPlannerData.tasks));
                        } else {
                            setStudyPlannerData(null);
                        }

                        // Budgeting Tool Data
                        if (data.budgetingData) {
                            const loadedExpenses = data.budgetingData.expenses
                                ? Object.values(data.budgetingData.expenses)
                                : [];

                            setBudgetingToolData({
                                totalIncome: data.budgetingData.totalIncome || 0,
                                expenses: loadedExpenses,
                            });
                        } else {
                            setBudgetingToolData(null);
                        }

                        // SGPA Calculator Data
                        if (data.sgpaData && data.sgpaData.semesters) {
                            const semestersArray = Object.values(data.sgpaData.semesters);
                            // Sort by calculatedAt (oldest first) to ensure consistent order
                            semestersArray.sort((a, b) => new Date(a.calculatedAt) - new Date(b.calculatedAt));
                            setSgpaCalculatorData(semestersArray);
                        } else {
                            setSgpaCalculatorData(null);
                        }
                    } else {
                        setStudyPlannerData(null);
                        setBudgetingToolData(null);
                        setSgpaCalculatorData(null);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user data from Realtime Database:", error);
                    toast.error("Failed to load profile data.");
                    setLoading(false);
                });

                return () => {
                    off(userRef);
                };

            } else {
                setUserEmail('');
                setStudyPlannerData(null);
                setBudgetingToolData(null);
                setSgpaCalculatorData(null);
                setLoading(false);
                toast.info("Please log in to view your profile.");
                navigate('/login');
            }
        });

        return () => unsubscribeAuth();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully!");
            navigate('/login');
        } catch (error) {
            console.error("Error logging out:", error);
            toast.error("Failed to log out.");
        }
    };

    if (loading) {
        return (
            <div className="profile-container">
                <p className="loading-message">Loading profile...</p>
            </div>
        );
    }

    const totalExpensesForBudgeting = budgetingToolData?.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
    const remainingBudget = (budgetingToolData?.totalIncome || 0) - totalExpensesForBudgeting;

    // --- SGPA Calculations for display ---
    const latestSgpaEntry = sgpaCalculatorData && sgpaCalculatorData.length > 0
        ? sgpaCalculatorData[sgpaCalculatorData.length - 1] // Get the last element (most recent after sorting)
        : null;

    let totalCumulativeCredits = 0;
    let totalCumulativeGradePointsSum = 0; // Sum of (SGPA * credits) for CGPA calculation
    let totalSubjectsAcrossAllSemesters = 0;

    if (sgpaCalculatorData && sgpaCalculatorData.length > 0) {
        sgpaCalculatorData.forEach(sem => {
            const sgpaValue = parseFloat(sem.sgpa);
            const creditsValue = parseFloat(sem.credits);
            const totalSubjectsInSem = parseInt(sem.totalSubjects, 10);

            if (!isNaN(sgpaValue) && !isNaN(creditsValue)) {
                totalCumulativeCredits += creditsValue;
                totalCumulativeGradePointsSum += (sgpaValue * creditsValue);
            }
            if (!isNaN(totalSubjectsInSem)) {
                totalSubjectsAcrossAllSemesters += totalSubjectsInSem;
            }
        });
    }

    const calculatedCGPA = totalCumulativeCredits > 0
        ? (totalCumulativeGradePointsSum / totalCumulativeCredits).toFixed(2)
        : null;

    return (
        <div className="profile-container">
            <h2>Your Profile</h2>
            <div className="profile-info">
                <p><strong>Email:</strong> {userEmail}</p>
                <button onClick={handleLogout} className="logout-button">Log Out</button>
            </div>

            <div className="profile-section">
                <h3>Study Planner</h3>
                {studyPlannerData && studyPlannerData.length > 0 ? (
                    <div className="data-card-list">
                        {studyPlannerData.map((task, index) => (
                            <div key={task.id || index} className="data-card study-task-card">
                                <h4>{task.title}</h4>
                                {task.description && <p>Description: {task.description}</p>}
                                {task.dueDate && <p>Due Date: {task.dueDate}</p>}
                                {task.dueTime && <p>Due Time: {task.dueTime}</p>}
                                <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-data-message">No saved study plan found. <Link to="/tools/studyPlanner">Start planning your studies!</Link></p>
                )}
            </div>

            <div className="profile-section">
                <h3>Budgeting Tool</h3>
                {budgetingToolData ? (
                    <div className="data-card budgeting-summary-card">
                        <p><strong>Total Income:</strong> ₹{budgetingToolData.totalIncome?.toFixed(2) || '0.00'}</p>
                        <h4>Expenses:</h4>
                        {budgetingToolData.expenses && budgetingToolData.expenses.length > 0 ? (
                            <ul>
                                {budgetingToolData.expenses.map((item) => (
                                    <li key={item.id}>{item.name}: ₹{item.amount?.toFixed(2)} ({item.date})</li>
                                ))}
                            </ul>
                        ) : <p>No expenses recorded.</p>}
                        <p className={`remaining-budget-display ${remainingBudget < 0 ? 'negative-budget' : 'positive-budget'}`}>
                            <strong>Remaining Budget:</strong> ₹{remainingBudget.toFixed(2)}
                        </p>
                    </div>
                ) : (
                    <p className="no-data-message">No saved budgeting data found. <Link to="/tools/budgetingTool">Start managing your budget!</Link></p>
                )}
            </div>

            <div className="profile-section">
                <h3>SGPA Calculator</h3>
                {sgpaCalculatorData && sgpaCalculatorData.length > 0 ? (
                    <div className="data-card sgpa-card">
                        {/* Last Calculated Details */}
                        {latestSgpaEntry && (
                            <div className="sgpa-summary-card">
                                <h4>Last Calculated SGPA:</h4>
                                <p><strong>Semester:</strong> {latestSgpaEntry.semesterNumber || 'N/A'}</p>
                                <p><strong>SGPA:</strong> {latestSgpaEntry.sgpa || 'N/A'}</p>
                                <p><strong>Credits:</strong> {latestSgpaEntry.credits || 'N/A'}</p>
                                <p><strong>Calculated On:</strong> {new Date(latestSgpaEntry.calculatedAt).toLocaleDateString()}</p>
                            </div>
                        )}

                        {/* Show CGPA Button */}
                        <button onClick={() => setShowCGPA(!showCGPA)} className="toggle-cgpa-button">
                            {showCGPA ? 'Hide CGPA' : 'Show Cumulative Performance'}
                        </button>

                        {/* CGPA and Total Stats Display (Conditional) */}
                        {showCGPA && (
                            <div className="cgpa-details">
                                <h4>Cumulative Performance:</h4>
                                {calculatedCGPA !== null ? (
                                    <p><strong>CGPA:</strong> {calculatedCGPA}</p>
                                ) : (
                                    <p>CGPA cannot be calculated (insufficient data).</p>
                                )}
                                <p><strong>Total Subjects:</strong> {totalSubjectsAcrossAllSemesters}</p>
                                <p><strong>Total Cumulative Credits:</strong> {totalCumulativeCredits}</p>
                            </div>
                        )}

                        {/* Saved Semesters List */}
                        <h4>Saved Semesters:</h4>
                        <ul className="semester-list">
                            {/* Sorted by calculatedAt in useEffect, so it's already oldest first */}
                            {sgpaCalculatorData.map((sem, index) => (
                                <li key={sem.calculatedAt} className="semester-item">
                                    <h5>
                                        {sem.semesterNumber || `Semester ${index + 1}`}: SGPA {sem.sgpa}
                                    </h5>
                                    <p>Credits: {sem.credits} | Subjects: {sem.totalSubjects}</p>
                                    <p>Calculated: {new Date(sem.calculatedAt).toLocaleDateString()}</p>
                                    <details className="sgpa-subjects-toggle">
                                        <summary>View Details</summary>
                                        <ul className="sgpa-subjects-list">
                                            {sem.subjects.map((sub, subIndex) => (
                                                <li key={subIndex}>
                                                    {sub.name}: {sub.grade} ({sub.credit} Cr)
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="no-data-message">No saved SGPA data found. <Link to="/tools/sgpa-calculator">Calculate your SGPA!</Link></p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;

//profilepage
// src/components/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { ref, onValue, off } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom'; // <--- ADD LINK HERE
import { toast } from 'react-toastify';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
    const [userEmail, setUserEmail] = useState('');
    const [studyPlannerData, setStudyPlannerData] = useState(null);
    const [budgetingToolData, setBudgetingToolData] = useState(null);
    const [sgpaCalculatorData, setSgpaCalculatorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            if (user) {
                setUserEmail(user.email);
                const userRef = ref(db, `users/${user.uid}`);

                // Listen for changes to the user's data
                const unsubscribeDb = onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        // Study Planner Data
                        // Ensure it's an object/array, not a string
                        if (data.studyPlannerData && data.studyPlannerData.tasks) {
                            setStudyPlannerData(Object.values(data.studyPlannerData.tasks));
                        } else {
                            setStudyPlannerData(null);
                        }

                        // Budgeting Tool Data
                        // Ensure it's an object/array, not a string
                        if (data.budgetingData) {
                            setBudgetingToolData(data.budgetingData);
                        } else {
                            setBudgetingToolData(null);
                        }

                        // SGPA Calculator Data
                        if (data.sgpaData) {
                            setSgpaCalculatorData(data.sgpaData);
                        } else {
                            setSgpaCalculatorData(null);
                        }
                    } else {
                        // Clear all data if no user data found
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
                    off(userRef); // Detach the Realtime Database listener on unmount
                };

            } else {
                setUserEmail('');
                setStudyPlannerData(null);
                setBudgetingToolData(null);
                setSgpaCalculatorData(null);
                setLoading(false);
                toast.info("Please log in to view your profile.");
                navigate('/login'); // Redirect to login if not authenticated
            }
        });

        return () => unsubscribeAuth(); // Cleanup auth listener
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
                        <p><strong>Total Balance:</strong> ${budgetingToolData.totalBalance || 0}</p>
                        <h4>Income:</h4>
                        {budgetingToolData.income && budgetingToolData.income.length > 0 ? (
                            <ul>
                                {budgetingToolData.income.map((item, index) => (
                                    <li key={item.id || index}>{item.description}: ${item.amount} ({item.date})</li>
                                ))}
                            </ul>
                        ) : <p>No income recorded.</p>}

                        <h4>Expenses:</h4>
                        {budgetingToolData.expenses && budgetingToolData.expenses.length > 0 ? (
                            <ul>
                                {budgetingToolData.expenses.map((item, index) => (
                                    <li key={item.id || index}>{item.description}: ${item.amount} ({item.date})</li>
                                ))}
                            </ul>
                        ) : <p>No expenses recorded.</p>}
                    </div>
                ) : (
                    <p className="no-data-message">No saved budgeting data found. <Link to="/tools/budgetingTool">Start managing your budget!</Link></p>
                )}
            </div>

            <div className="profile-section">
                <h3>SGPA Calculator</h3>
                {sgpaCalculatorData ? (
                    <div className="data-card sgpa-card">
                        <p><strong>Last Calculated SGPA:</strong> {sgpaCalculatorData.sgpa || 'N/A'}</p>
                        {/* You can add more details here if your SGPA data structure supports it */}
                        <p>Total Credits: {sgpaCalculatorData.totalCredits || 'N/A'}</p>
                        <p>Total Grade Points: {sgpaCalculatorData.totalGradePoints || 'N/A'}</p>
                        {sgpaCalculatorData.semesters && sgpaCalculatorData.semesters.length > 0 && (
                            <>
                                <h4>Saved Semesters:</h4>
                                <ul>
                                    {sgpaCalculatorData.semesters.map((sem, index) => (
                                        <li key={sem.id || index}> {/* Added key for semester as well */}
                                            Semester {sem.semesterNumber}: SGPA {sem.sgpa} (Credits: {sem.credits})
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                ) : (
                    <p className="no-data-message">No saved SGPA data found. <Link to="/tools/sgpa-calculator">Calculate your SGPA!</Link></p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
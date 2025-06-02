// src/components/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { ref, onValue, off, update } from 'firebase/database'; // <--- Import 'update'
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
    const [userEmail, setUserEmail] = useState('');
    const [userDisplayName, setUserDisplayName] = useState(''); // <--- New state for display name
    const [editingDisplayName, setEditingDisplayName] = useState(false); // <--- New state for editing mode
    const [newDisplayName, setNewDisplayName] = useState(''); // <--- New state for input field value

    const [studyPlannerData, setStudyPlannerData] = useState(null);
    const [budgetingToolData, setBudgetingToolData] = useState(null);
    const [sgpaCalculatorData, setSgpaCalculatorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCGPA, setShowCGPA] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            if (user) {
                setUserEmail(user.email);
                const userRef = ref(db, `users/${user.uid}`);

                const unsubscribeDb = onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        setUserDisplayName(data.displayName || 'N/A'); // <--- Set display name
                        setNewDisplayName(data.displayName || ''); // Initialize input with current display name

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
                            semestersArray.sort((a, b) => new Date(a.calculatedAt) - new Date(b.calculatedAt));
                            setSgpaCalculatorData(semestersArray);
                        } else {
                            setSgpaCalculatorData(null);
                        }
                    } else {
                        // If no user data found (e.g., old user without displayName)
                        setUserDisplayName('N/A');
                        setNewDisplayName(''); // Set input as empty
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
                    off(userRef); // Clean up Realtime DB listener
                };

            } else {
                setUserEmail('');
                setUserDisplayName('');
                setNewDisplayName('');
                setStudyPlannerData(null);
                setBudgetingToolData(null);
                setSgpaCalculatorData(null);
                setLoading(false);
                toast.info("Please log in to view your profile.");
                navigate('/login');
            }
        });

        return () => unsubscribeAuth(); // Clean up Auth listener
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

    const handleUpdateDisplayName = async () => {
        if (!newDisplayName.trim()) {
            toast.error("Display Name cannot be empty.");
            return;
        }

        if (!auth.currentUser) {
            toast.error("You must be logged in to update your profile.");
            navigate('/login');
            return;
        }

        try {
            const userRef = ref(db, `users/${auth.currentUser.uid}`);
            await update(userRef, { displayName: newDisplayName.trim() }); // <--- Use 'update'
            setUserDisplayName(newDisplayName.trim()); // Update local state
            setEditingDisplayName(false); // Exit editing mode
            toast.success("Display Name updated successfully!");
        } catch (error) {
            console.error("Error updating display name:", error);
            toast.error("Failed to update display name. Please try again.");
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

    let totalCumulativeCredits = 0;
    let totalCumulativeGradePointsSum = 0;
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

                <div className="display-name-section"> {/* New section for display name */}
                    <strong>Display Name:</strong>
                    {editingDisplayName ? (
                        <div className="edit-display-name-group">
                            <input
                                type="text"
                                value={newDisplayName}
                                onChange={(e) => setNewDisplayName(e.target.value)}
                                placeholder="Enter new display name"
                                className="display-name-input"
                            />
                            <button onClick={handleUpdateDisplayName} className="save-display-name-btn">Save</button>
                            <button onClick={() => { setEditingDisplayName(false); setNewDisplayName(userDisplayName); }} className="cancel-display-name-btn">Cancel</button>
                        </div>
                    ) : (
                        <div className="view-display-name-group">
                            <span> {userDisplayName}</span>
                            <button onClick={() => setEditingDisplayName(true)} className="edit-display-name-btn">Edit</button>
                        </div>
                    )}
                </div>

                <button onClick={handleLogout} className="logout-button">Log Out</button>
            </div>

            <div className="profile-section">
                <h3>Study Planner</h3>
                {/* ... existing Study Planner data display ... */}
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
                {/* ... existing Budgeting Tool data display ... */}
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
                {/* ... existing SGPA Calculator data display ... */}
                {sgpaCalculatorData && sgpaCalculatorData.length > 0 ? (
                    <div className="data-card sgpa-card">
                        {sgpaCalculatorData.length > 0 && (
                            <div className="sgpa-summary-card">
                                <h4>Last Calculated SGPA:</h4>
                                <p><strong>Semester:</strong> {sgpaCalculatorData[sgpaCalculatorData.length - 1].semesterNumber || 'N/A'}</p>
                                <p><strong>SGPA:</strong> {sgpaCalculatorData[sgpaCalculatorData.length - 1].sgpa || 'N/A'}</p>
                                <p><strong>Credits:</strong> {sgpaCalculatorData[sgpaCalculatorData.length - 1].credits || 'N/A'}</p>
                                <p><strong>Calculated On:</strong> {new Date(sgpaCalculatorData[sgpaCalculatorData.length - 1].calculatedAt).toLocaleDateString()}</p>
                            </div>
                        )}

                        <button onClick={() => setShowCGPA(!showCGPA)} className="toggle-cgpa-button">
                            {showCGPA ? 'Hide Cumulative Performance' : 'Show Cumulative Performance'}
                        </button>

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

                        <h4>Saved Semesters:</h4>
                        <ul className="semester-list">
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
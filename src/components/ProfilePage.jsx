// src/components/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Import Firebase auth and db
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [studyPlannerData, setStudyPlannerData] = useState(null);
  const [budgetingData, setBudgetingData] = useState(null);
  const [sgpaData, setSgpaData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const uid = authUser.uid;
        setLoadingData(true);
        setError(null);

        try {
          const studyPlannerRef = db.ref(`users/${uid}/studyPlannerData`);
          const studyPlannerSnapshot = await studyPlannerRef.once('value');
          setStudyPlannerData(studyPlannerSnapshot.val());

          const budgetingRef = db.ref(`users/${uid}/budgetingData`);
          const budgetingSnapshot = await budgetingRef.once('value');
          setBudgetingData(budgetingSnapshot.val());

          const sgpaRef = db.ref(`users/${uid}/sgpaData`);
          const sgpaSnapshot = await sgpaRef.once('value');
          setSgpaData(sgpaSnapshot.val());
        } catch (err) {
          setError('Failed to load saved data.');
          console.error('Error loading data:', err);
        } finally {
          setLoadingData(false);
        }
      } else {
        setUser(null);
        setStudyPlannerData(null);
        setBudgetingData(null);
        setSgpaData(null);
      }
    });

    return () => unsubscribeAuth(); // Cleanup auth listener
  }, []);

  return (
    <div className="profile-page-container">
      <h2>Your Profile</h2>
      {user && (
        <div className="user-info">
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      {loadingData && <p>Loading saved data...</p>}
      {error && <p className="error-message">{error}</p>}

      {studyPlannerData && (
        <div className="saved-data-section">
          <h3>Study Planner</h3>
          {/* Display saved study planner data here */}
          <pre>{JSON.stringify(studyPlannerData, null, 2)}</pre> {/* For now, just display JSON */}
        </div>
      )}

      {budgetingData && (
        <div className="saved-data-section">
          <h3>Budgeting Tool</h3>
          {/* Display saved budgeting data here */}
          <pre>{JSON.stringify(budgetingData, null, 2)}</pre> {/* For now, just display JSON */}
        </div>
      )}

      {sgpaData && (
        <div className="saved-data-section">
          <h3>SGPA Calculator</h3>
          {/* Display saved SGPA data here */}
          <pre>{JSON.stringify(sgpaData, null, 2)}</pre> {/* For now, just display JSON */}
        </div>
      )}

      {!user && !loadingData && !error && <p>Please log in to see your profile information.</p>}
    </div>
  );
};

export default ProfilePage;
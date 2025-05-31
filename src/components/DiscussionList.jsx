// src/components/DiscussionList.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import your Firestore instance
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom'; // To link to individual discussion pages
import '../styles/DiscussionForum.css'; // We'll create this CSS file next

const DiscussionList = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'discussions'), orderBy('lastActivityAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const discussionsData = [];
      snapshot.forEach((doc) => {
        discussionsData.push({ id: doc.id, ...doc.data() });
      });
      setDiscussions(discussionsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching discussions:", err);
      setError("Failed to load discussions. Please try again later.");
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div className="forum-container loading">Loading discussions...</div>;
  }

  if (error) {
    return <div className="forum-container error">Error: {error}</div>;
  }

  return (
    <div className="forum-container">
      <div className="forum-header">
        <h2>Discussion Forum</h2>
        <Link to="/forum/new" className="new-discussion-btn">
          Start New Discussion
        </Link>
      </div>

      <div className="discussion-list">
        {discussions.length === 0 ? (
          <p className="no-discussions-msg">No discussions yet. Be the first to start one!</p>
        ) : (
          discussions.map((discussion) => (
            <Link to={`/forum/${discussion.id}`} key={discussion.id} className="discussion-card">
              <div className="discussion-card-header">
                <h3>{discussion.title}</h3>
                <span className="discussion-category">{discussion.category || 'General'}</span>
              </div>
              <p className="discussion-snippet">{discussion.description ? discussion.description.substring(0, 100) + '...' : 'No description'}</p>
              <div className="discussion-meta">
                <span>By: {discussion.authorName || 'Anonymous'}</span>
                <span>
                  {discussion.lastActivityAt ?
                    new Date(discussion.lastActivityAt.toDate()).toLocaleString() : // Convert Firestore Timestamp to Date
                    (discussion.createdAt ? new Date(discussion.createdAt.toDate()).toLocaleString() : 'N/A')
                  }
                </span>
                <span>Replies: {discussion.replyCount || 0}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default DiscussionList;
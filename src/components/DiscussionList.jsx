// src/components/DiscussionList.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // <--- CORRECTED: Import 'db' which is your Realtime Database instance
import { ref, onValue, off } from 'firebase/database';
import { Link } from 'react-router-dom';
import '../styles/DiscussionForum.css';

const DiscussionList = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reference to the 'discussions' node in your Realtime Database
    const discussionsRef = ref(db, 'discussions'); // <--- Use 'db' here

    // Attach a listener to get real-time updates
    const unsubscribe = onValue(discussionsRef, (snapshot) => {
      const discussionsData = [];
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Realtime Database returns data as an object of objects,
        // so we need to convert it to an array and sort it.
        const discussionKeys = Object.keys(data);
        const sortedKeys = discussionKeys.sort((a, b) => {
            const dateA = data[a].lastActivityAt || data[a].createdAt;
            const dateB = data[b].lastActivityAt || data[b].createdAt;
            // Assuming lastActivityAt/createdAt are stored as Firebase server timestamps or ISO strings
            return new Date(dateB) - new Date(dateA); // Sort by most recent activity
        });

        sortedKeys.forEach(key => {
            discussionsData.push({ id: key, ...data[key] });
        });
      }
      setDiscussions(discussionsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching discussions from Realtime Database:", err);
      setError("Failed to load discussions. Please try again later.");
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => off(discussionsRef, 'value', unsubscribe);
  }, []);

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
                    new Date(discussion.lastActivityAt).toLocaleString() : // Assuming stored as ISO string or timestamp number
                    (discussion.createdAt ? new Date(discussion.createdAt).toLocaleString() : 'N/A')
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
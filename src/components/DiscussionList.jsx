// src/components/DiscussionList.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, off } from 'firebase/database';
import { Link } from 'react-router-dom';
import '../styles/DiscussionForum.css';

const DiscussionList = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const discussionsRef = ref(db, 'discussions');

    const unsubscribe = onValue(discussionsRef, (snapshot) => {
      const discussionsData = [];
      if (snapshot.exists()) {
        const data = snapshot.val();
        const discussionKeys = Object.keys(data);
        const sortedKeys = discussionKeys.sort((a, b) => {
          const dateA = data[a].lastActivityAt || data[a].createdAt;
          const dateB = data[b].lastActivityAt || data[b].createdAt;
          return new Date(dateB) - new Date(dateA);
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
              {/* This is the key change: render HTML snippet with dangerouslySetInnerHTML */}
              <div
                className="discussion-snippet quill-content" // Add quill-content class for styling
                dangerouslySetInnerHTML={{
                  __html: discussion.description
                    ? discussion.description.substring(0, 150) + '...' // Take a longer snippet if needed
                    : 'No description'
                }}
              />
              <div className="discussion-meta">
                <span>By: {discussion.authorName || 'Anonymous'}</span>
                <span>
                  {discussion.lastActivityAt ?
                    new Date(discussion.lastActivityAt).toLocaleString() :
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
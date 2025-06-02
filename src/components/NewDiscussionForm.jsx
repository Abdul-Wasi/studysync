// src/components/NewDiscussionForm.jsx

import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Import 'db' for Realtime Database and 'auth' for user info
import { ref, push, serverTimestamp, set, get } from 'firebase/database'; // <--- ADD 'get' here
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/DiscussionForum.css'; // Reuse existing styles for consistency

const NewDiscussionForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // Keep description state
  const [category, setCategory] = useState('General'); // Keep category state
  const [user, setUser] = useState(null); // To store authenticated user info
  const [loading, setLoading] = useState(true); // To manage initial user check loading

  const navigate = useNavigate();

  // Effect to check user authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
        toast.info('Please log in to start a new discussion.');
        navigate('/login'); // Redirect to login if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to create a discussion.');
      navigate('/login');
      return;
    }

    if (!title.trim() || !description.trim()) {
      toast.error('Title and Description cannot be empty.');
      return;
    }

    try {
      // Fetch the user's display name from the Realtime Database
      let authorName = user.email; // Fallback to email
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef); // Use 'get' to fetch data once
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.displayName) {
          authorName = userData.displayName; // Use display name if available
        }
      }

      const newDiscussionRef = push(ref(db, 'discussions')); // Get a new unique key
      const discussionId = newDiscussionRef.key; // Get the unique ID for the new discussion

      const newDiscussion = {
        id: discussionId, // Store the ID within the object for easy retrieval
        title: title.trim(),
        description: description.trim(), // Use description state
        category: category, // Use category state
        authorId: user.uid,
        authorName: authorName, // <--- Use the fetched display name or fallback email
        createdAt: serverTimestamp(), // Firebase server timestamp
        lastActivityAt: serverTimestamp(), // Initially same as createdAt
        replyCount: 0, // Initialize reply count
      };

      await set(newDiscussionRef, newDiscussion); // Save the new discussion to Realtime Database

      toast.success('Discussion topic created successfully!');
      // Navigate to the new discussion's detail page, or back to the list
      navigate(`/forum/${discussionId}`);
      // Optionally clear form fields after successful submission
      setTitle('');
      setDescription('');
      setCategory('General');
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast.error('Failed to create discussion. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="forum-container loading">
        <p>Checking authentication status...</p>
      </div>
    );
  }

  // If not logged in, the useEffect will redirect, so this won't typically render if user is null
  if (!user) {
    return null;
  }

  return (
    <div className="forum-container">
      <div className="new-discussion-form-card">
        <h2>Start a New Discussion</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="discussion-title">Title:</label>
            <input
              type="text"
              id="discussion-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter discussion title (e.g., 'Best study techniques')"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="discussion-description">Description:</label>
            <textarea
              id="discussion-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description or question for your discussion..."
              rows="6"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="discussion-category">Category:</label>
            <select
              id="discussion-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="General">General</option>
              <option value="Study Tips">Study Tips</option>
              <option value="Career Advice">Career Advice</option>
              <option value="Well-being">Well-being</option>
              <option value="Announcements">Announcements</option>
              {/* Add more categories as needed */}
            </select>
          </div>

          <button type="submit" className="submit-discussion-btn">
            Create Discussion
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewDiscussionForm;
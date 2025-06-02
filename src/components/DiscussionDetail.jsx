// src/components/DiscussionDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase'; // Import 'db' for Realtime Database and 'auth' for user info
import { set, ref, onValue, off, push, serverTimestamp, update, get } from 'firebase/database'; // <--- ADD 'get' here
import { toast } from 'react-toastify';
import '../styles/DiscussionForum.css'; // Reuse existing styles

const DiscussionDetail = () => {
  const { discussionId } = useParams(); // Get the discussion ID from the URL
  const navigate = useNavigate();

  const [discussion, setDiscussion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const [user, setUser] = useState(null); // Current authenticated user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to check user authentication status
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribeAuth();
  }, []);

  // Effect to fetch discussion details and replies
  useEffect(() => {
    if (!discussionId) {
      setError('Discussion ID is missing.');
      setLoading(false);
      return;
    }

    const discussionRef = ref(db, `discussions/${discussionId}`);
    const repliesRef = ref(db, `discussions/${discussionId}/replies`);

    let discussionUnsubscribe;
    let repliesUnsubscribe;

    try {
      // Listener for the main discussion details
      discussionUnsubscribe = onValue(discussionRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setDiscussion({ id: discussionId, ...data });
        } else {
          setDiscussion(null);
          setError('Discussion not found.');
        }
        setLoading(false); // Set loading to false once initial discussion data is fetched
      }, (err) => {
        console.error("Error fetching discussion:", err);
        setError("Failed to load discussion. Please try again.");
        setLoading(false);
      });

      // Listener for replies
      repliesUnsubscribe = onValue(repliesRef, (snapshot) => {
        const repliesData = [];
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Realtime Database returns replies as an object of objects
          Object.keys(data).forEach(key => {
            repliesData.push({ id: key, ...data[key] });
          });
          // Sort replies by createdAt for chronological order
          repliesData.sort((a, b) => {
            const dateA = a.createdAt?.val ? a.createdAt.val : a.createdAt; // Handle serverTimestamp objects
            const dateB = b.createdAt?.val ? b.createdAt.val : b.createdAt; // Handle serverTimestamp objects
            return new Date(dateA) - new Date(dateB);
          });
        }
        setReplies(repliesData);
      }, (err) => {
        console.error("Error fetching replies:", err);
        // Don't set a critical error for replies, just log it.
        // The main discussion loading handles the primary error state.
      });

    } catch (err) {
      console.error("Firebase setup error:", err);
      setError("An internal error occurred while setting up listeners.");
      setLoading(false);
    }

    // Cleanup function for listeners
    return () => {
      if (discussionUnsubscribe) off(discussionRef, 'value', discussionUnsubscribe);
      if (repliesUnsubscribe) off(repliesRef, 'value', repliesUnsubscribe);
    };
  }, [discussionId]); // Re-run effect if discussionId changes

  const handleSubmitReply = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to reply.');
      navigate('/login');
      return;
    }

    if (!replyContent.trim()) {
      toast.error('Reply content cannot be empty.');
      return;
    }

    if (!discussion) {
      toast.error('Cannot post reply, discussion not loaded.');
      return;
    }

    try {
      // Fetch the user's display name for the reply
      let replyAuthorName = user.email; // Fallback to email
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef); // Use 'get' to fetch data once
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.displayName) {
          replyAuthorName = userData.displayName; // Use display name if available
        }
      }

      const newReplyRef = push(ref(db, `discussions/${discussionId}/replies`)); // Push to replies sub-node
      const replyId = newReplyRef.key;

      const newReply = {
        id: replyId,
        content: replyContent.trim(),
        authorId: user.uid,
        authorName: replyAuthorName, // <--- Use the fetched display name for replies
        createdAt: serverTimestamp(),
      };

      await set(newReplyRef, newReply); // Use set with the newReplyRef

      // Update the parent discussion's lastActivityAt and replyCount
      const discussionUpdates = {
        lastActivityAt: serverTimestamp(),
        replyCount: (discussion.replyCount || 0) + 1,
      };
      await update(ref(db, `discussions/${discussionId}`), discussionUpdates); // Update the discussion node

      setReplyContent(''); // Clear the input
      toast.success('Reply posted successfully!');
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply. Please try again.');
    }
  };

  if (loading) {
    return <div className="forum-container loading">Loading discussion...</div>;
  }

  if (error) {
    return <div className="forum-container error">Error: {error}</div>;
  }

  if (!discussion) {
    return <div className="forum-container no-data-message">Discussion not found. It might have been deleted.</div>;
  }

  return (
    <div className="forum-container">
      <div className="discussion-detail-card">
        <div className="discussion-detail-header">
          <h2>{discussion.title}</h2>
          <span className="discussion-category detail-category">{discussion.category || 'General'}</span>
        </div>
        <p className="discussion-detail-description">{discussion.description}</p>
        <div className="discussion-detail-meta">
          <span>Posted by: **{discussion.authorName || 'Anonymous'}**</span> {/* <--- Display authorName for main post */}
          <span>
            on: {discussion.createdAt && new Date(discussion.createdAt?.val || discussion.createdAt).toLocaleString()}
          </span>
          <span>Last Activity: {discussion.lastActivityAt && new Date(discussion.lastActivityAt?.val || discussion.lastActivityAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="replies-section">
        <h3>Replies ({replies.length})</h3>
        {replies.length === 0 ? (
          <p className="no-replies-msg">No replies yet. Be the first to respond!</p>
        ) : (
          <div className="replies-list">
            {replies.map((reply) => (
              <div key={reply.id} className="reply-card">
                <p className="reply-content">{reply.content}</p>
                <div className="reply-meta">
                  <span>By: **{reply.authorName || 'Anonymous'}**</span> {/* <--- Display authorName for replies */}
                  <span>On: {reply.createdAt && new Date(reply.createdAt?.val || reply.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {user ? (
          <form onSubmit={handleSubmitReply} className="reply-form">
            <h4>Post a Reply</h4>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply here..."
              rows="4"
              required
            ></textarea>
            <button type="submit" className="post-reply-btn">
              Post Reply
            </button>
          </form>
        ) : (
          <p className="login-to-reply-msg">
            <Link to="/login">Log in</Link> to post a reply.
          </p>
        )}
      </div>
    </div>
  );
};

export default DiscussionDetail;
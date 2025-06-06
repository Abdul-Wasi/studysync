import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { set, ref, onValue, off, push, serverTimestamp, update, get } from 'firebase/database';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

import '../styles/DiscussionForum.css';

// Define the truncation height limit.
const TRUNCATION_HEIGHT_LIMIT = 300;

// Reusable Comment component to handle replies and nested replies
const Comment = ({ comment, discussionId, currentUser, onLikeToggle, onReply }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [nestedReplyContent, setNestedReplyContent] = useState('');

    const hasLiked = currentUser && comment.likes && comment.likes[currentUser.uid];

    const renderRichText = (htmlContent) => {
        const cleanHtml = DOMPurify.sanitize(htmlContent, { USE_PROFILES: { html: true } });
        return { __html: cleanHtml };
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'link', 'image'
    ];

    const handleNestedReplySubmit = async (e) => {
        e.preventDefault();
        const isReplyContentEmpty = !nestedReplyContent.trim() || nestedReplyContent === '<p><br></p>';

        if (isReplyContentEmpty) {
            toast.error('Reply content cannot be empty.');
            return;
        }
        await onReply(comment.id, nestedReplyContent);
        setNestedReplyContent('');
        setShowReplyForm(false);
    };

    return (
        <div className="reply-card">
            <div className="reply-content quill-content" dangerouslySetInnerHTML={renderRichText(comment.content)}></div>
            <div className="reply-meta">
                <span>By: **{comment.authorName || 'Anonymous'}**</span>
                <span>On: {comment.createdAt && new Date(comment.createdAt?.val || comment.createdAt).toLocaleString()}</span>
                {currentUser && (
                    <button
                        className={`like-btn ${hasLiked ? 'liked' : ''}`}
                        onClick={() => onLikeToggle(comment.id, hasLiked, 'reply')}
                    >
                        ❤️ {comment.likesCount || 0}
                    </button>
                )}
                <button onClick={() => setShowReplyForm(!showReplyForm)} className="reply-btn">
                    {showReplyForm ? 'Cancel Reply' : 'Reply'}
                </button>
            </div>

            {showReplyForm && currentUser && (
                <form onSubmit={handleNestedReplySubmit} className="nested-reply-form">
                    <ReactQuill
                        theme="snow"
                        value={nestedReplyContent}
                        onChange={setNestedReplyContent}
                        modules={modules}
                        formats={formats}
                        placeholder="Write your reply to this comment..."
                        className="reply-form-quill"
                    />
                    <button type="submit" className="post-nested-reply-btn">Post Reply</button>
                </form>
            )}

            {/* Render nested replies if they exist */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="nested-replies-list">
                    {comment.replies.map(nestedReply => (
                        <Comment
                            key={nestedReply.id}
                            comment={nestedReply}
                            discussionId={discussionId}
                            currentUser={currentUser}
                            onLikeToggle={onLikeToggle}
                            onReply={onReply}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


const DiscussionDetail = () => {
    const { discussionId } = useParams();
    const navigate = useNavigate();

    const [discussion, setDiscussion] = useState(null);
    const [comments, setComments] = useState([]); // Renamed from replies to comments
    const [replyContent, setReplyContent] = useState(''); // For top-level replies to discussion
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showFullDescription, setShowFullDescription] = useState(false);
    const [needsTruncation, setNeedsTruncation] = useState(false);
    const descriptionRef = useRef(null);

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'link', 'image'
    ];

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((authUser) => {
            setUser(authUser);
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!discussionId) {
            setError('Discussion ID is missing. Please navigate from a valid discussion link.');
            setLoading(false);
            return;
        }

        const discussionRef = ref(db, `discussions/${discussionId}`);
        const commentsRef = ref(db, `comments/${discussionId}`); // Dedicated comments path

        let discussionUnsubscribe;
        let commentsUnsubscribe;

        try {
            discussionUnsubscribe = onValue(discussionRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setDiscussion({ id: discussionId, ...data });
                } else {
                    setDiscussion(null);
                    setError('Discussion not found. It might have been deleted.');
                }
                setLoading(false);
            }, (err) => {
                console.error("Error fetching discussion:", err);
                setError("Failed to load discussion. Please try again.");
                setLoading(false);
            });

            commentsUnsubscribe = onValue(commentsRef, (snapshot) => {
                const commentsData = [];
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    Object.keys(data).forEach(key => {
                        commentsData.push({ id: key, ...data[key] });
                    });
                    commentsData.sort((a, b) => {
                        const dateA = a.createdAt?.val ? a.createdAt.val : a.createdAt;
                        const dateB = b.createdAt?.val ? b.createdAt.val : b.createdAt;
                        return new Date(dateA) - new Date(dateB);
                    });
                }
                // Build the hierarchical structure of comments
                const commentMap = {};
                const rootComments = [];

                commentsData.forEach(comment => {
                    commentMap[comment.id] = { ...comment, replies: [] };
                });

                commentsData.forEach(comment => {
                    if (comment.parentId && commentMap[comment.parentId]) {
                        commentMap[comment.parentId].replies.push(commentMap[comment.id]);
                    } else if (!comment.parentId) {
                        rootComments.push(commentMap[comment.id]);
                    }
                });

                setComments(rootComments); // Set the structured comments
            }, (err) => {
                console.error("Error fetching comments:", err);
            });

        } catch (err) {
            console.error("Firebase setup error:", err);
            setError("An internal error occurred while setting up listeners.");
            setLoading(false);
        }

        return () => {
            if (discussionUnsubscribe) off(discussionRef, 'value', discussionUnsubscribe);
            if (commentsUnsubscribe) off(commentsRef, 'value', commentsUnsubscribe);
        };
    }, [discussionId]);

    // Effect for "Read More" logic
    useEffect(() => {
        if (descriptionRef.current && discussion) {
            const fullContentScrollHeight = descriptionRef.current.scrollHeight;

            if (fullContentScrollHeight > TRUNCATION_HEIGHT_LIMIT) {
                setNeedsTruncation(true);
                setShowFullDescription(false); // Default to collapsed if content is long
            } else {
                setNeedsTruncation(false);
                setShowFullDescription(true); // Always show full if content is short
            }
        }
    }, [discussion]);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const handleLikeToggle = async (itemId, hasLiked, itemType) => {
        if (!user) {
            toast.error('You must be logged in to like.');
            navigate('/login');
            return;
        }

        const userId = user.uid;
        let itemRef;
        let currentLikes;

        if (itemType === 'discussion') {
            itemRef = ref(db, `discussions/${discussionId}`);
            currentLikes = discussion.likes || {};
        } else if (itemType === 'reply') { // This also handles nested replies
            itemRef = ref(db, `comments/${discussionId}/${itemId}`);
            // To get current likes for a reply, we need to fetch it first
            // This is less efficient than a single listener but simpler for now
            const snapshot = await get(itemRef);
            currentLikes = snapshot.exists() ? (snapshot.val().likes || {}) : {};
        } else {
            console.error('Invalid item type for like toggle:', itemType);
            return;
        }

        const updates = {};
        if (hasLiked) {
            // User is unliking
            updates[`likes/${userId}`] = null; // Remove the specific user's like
            updates['likesCount'] = (currentLikes.likesCount || 0) - 1; // Decrement count
        } else {
            // User is liking
            updates[`likes/${userId}`] = true; // Mark user as liked
            updates['likesCount'] = (currentLikes.likesCount || 0) + 1; // Increment count
        }

        try {
            await update(itemRef, updates);
            // Optimistic UI update could be done here as well, but onValue handles it
            toast.success(hasLiked ? 'Unliked!' : 'Liked!');
        } catch (error) {
            console.error(`Error toggling like for ${itemType}:`, error);
            toast.error(`Failed to toggle like. Please try again.`);
        }
    };

    const handleSubmitReply = async (e, parentCommentId = null, replyContentParam = null) => {
        e?.preventDefault(); // e might be null if called from nested component

        const content = replyContentParam !== null ? replyContentParam : replyContent;

        if (!user) {
            toast.error('You must be logged in to reply.');
            navigate('/login');
            return;
        }

        const isReplyContentEmpty = !content.trim() || content === '<p><br></p>';

        if (isReplyContentEmpty) {
            toast.error('Reply content cannot be empty.');
            return;
        }

        if (!discussion) {
            toast.error('Cannot post reply, discussion not loaded.');
            return;
        }

        try {
            let replyAuthorName = user.email;
            const userRef = ref(db, `users/${user.uid}`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if (userData.displayName) {
                    replyAuthorName = userData.displayName;
                }
            }

            // Replies/Comments now go into a dedicated 'comments' collection under the discussion ID
            const newCommentRef = push(ref(db, `comments/${discussionId}`));
            const commentId = newCommentRef.key;

            const newComment = {
                id: commentId, // Store ID within the object for easier reference
                content: content,
                authorId: user.uid,
                authorName: replyAuthorName,
                createdAt: serverTimestamp(),
                likes: {}, // Initialize likes object
                likesCount: 0,
                parentId: parentCommentId, // null for top-level comments, ID of parent for nested
            };

            await set(newCommentRef, newComment);

            // Update discussion's reply count only for top-level replies to the discussion
            // For nested replies, we don't update the main discussion's replyCount directly
            if (!parentCommentId) {
                const discussionUpdates = {
                    lastActivityAt: serverTimestamp(),
                    replyCount: (discussion.replyCount || 0) + 1,
                };
                await update(ref(db, `discussions/${discussionId}`), discussionUpdates);
            }

            setReplyContent(''); // Clear main reply form
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

    const renderRichText = (htmlContent) => {
        const cleanHtml = DOMPurify.sanitize(htmlContent, { USE_PROFILES: { html: true } });
        return { __html: cleanHtml };
    };

    const hasDiscussionLiked = user && discussion.likes && discussion.likes[user.uid];

    return (
        <div className="forum-container">
            <div className="discussion-detail-card">
                <div className="discussion-detail-header">
                    <h2>{discussion.title}</h2>
                    <span className="discussion-category detail-category">{discussion.category || 'General'}</span>
                </div>
                <div
                    ref={descriptionRef}
                    className={`discussion-detail-description quill-content ${!showFullDescription && needsTruncation ? 'truncated-content' : ''}`}
                    dangerouslySetInnerHTML={renderRichText(discussion.description)}
                />
                {needsTruncation && (
                    <button
                        onClick={toggleDescription}
                        className="read-more-btn"
                    >
                        {showFullDescription ? 'Show Less' : 'Read More...'}
                    </button>
                )}
                <div className="discussion-detail-meta">
                    <span>Posted by: **{discussion.authorName || 'Anonymous'}**</span>
                    <span>
                        on: {discussion.createdAt && new Date(discussion.createdAt?.val || discussion.createdAt).toLocaleString()}
                    </span>
                    <span>Last Activity: {discussion.lastActivityAt && new Date(discussion.lastActivityAt?.val || discussion.lastActivityAt).toLocaleString()}</span>
                    {user && (
                        <button
                            className={`like-btn ${hasDiscussionLiked ? 'liked' : ''}`}
                            onClick={() => handleLikeToggle(discussionId, hasDiscussionLiked, 'discussion')}
                        >
                            ❤️ {discussion.likesCount || 0}
                        </button>
                    )}
                </div>
            </div>

            <div className="replies-section">
                <h3>Comments ({comments.length})</h3>
                {comments.length === 0 ? (
                    <p className="no-replies-msg">No comments yet. Be the first to respond!</p>
                ) : (
                    <div className="replies-list">
                        {comments.map((comment) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                discussionId={discussionId}
                                currentUser={user}
                                onLikeToggle={handleLikeToggle}
                                onReply={(parentId, content) => handleSubmitReply(null, parentId, content)} // Pass the ID and content
                            />
                        ))}
                    </div>
                )}

                {user ? (
                    <form onSubmit={handleSubmitReply} className="reply-form">
                        <h4>Post a Comment:</h4>
                        <ReactQuill
                            theme="snow"
                            value={replyContent}
                            onChange={setReplyContent}
                            modules={modules}
                            formats={formats}
                            placeholder="Write your comment here..."
                            className="reply-form-quill"
                        />
                        <button type="submit" className="post-reply-btn">
                            Post Comment
                        </button>
                    </form>
                ) : (
                    <p className="login-to-reply-msg">
                        <Link to="/login">Log in</Link> to post a comment.
                    </p>
                )}
            </div>
        </div>
    );
};

export default DiscussionDetail;
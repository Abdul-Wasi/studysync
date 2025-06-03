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
// This value MUST match the `max-height` set in your .truncated-content CSS class.
const TRUNCATION_HEIGHT_LIMIT = 300;

const DiscussionDetail = () => {
    const { discussionId } = useParams();
    const navigate = useNavigate();

    const [discussion, setDiscussion] = useState(null);
    const [replies, setReplies] = useState([]);
    const [replyContent, setReplyContent] = useState('');
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
        const repliesRef = ref(db, `discussions/${discussionId}/replies`);

        let discussionUnsubscribe;
        let repliesUnsubscribe;

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

            repliesUnsubscribe = onValue(repliesRef, (snapshot) => {
                const repliesData = [];
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    Object.keys(data).forEach(key => {
                        repliesData.push({ id: key, ...data[key] });
                    });
                    repliesData.sort((a, b) => {
                        const dateA = a.createdAt?.val ? a.createdAt.val : a.createdAt;
                        const dateB = b.createdAt?.val ? b.createdAt.val : b.createdAt;
                        return new Date(dateA) - new Date(dateB);
                    });
                }
                setReplies(repliesData);
            }, (err) => {
                console.error("Error fetching replies:", err);
            });

        } catch (err) {
            console.error("Firebase setup error:", err);
            setError("An internal error occurred while setting up listeners.");
            setLoading(false);
        }

        return () => {
            if (discussionUnsubscribe) off(discussionRef, 'value', discussionUnsubscribe);
            if (repliesUnsubscribe) off(repliesRef, 'value', repliesUnsubscribe);
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

    const handleSubmitReply = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('You must be logged in to reply.');
            navigate('/login');
            return;
        }

        const isReplyContentEmpty = !replyContent.trim() || replyContent === '<p><br></p>';

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

            const newReplyRef = push(ref(db, `discussions/${discussionId}/replies`));
            const replyId = newReplyRef.key;

            const newReply = {
                id: replyId,
                content: replyContent,
                authorId: user.uid,
                authorName: replyAuthorName,
                createdAt: serverTimestamp(),
            };

            await set(newReplyRef, newReply);

            const discussionUpdates = {
                lastActivityAt: serverTimestamp(),
                replyCount: (discussion.replyCount || 0) + 1,
            };
            await update(ref(db, `discussions/${discussionId}`), discussionUpdates);

            setReplyContent('');
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
                                <div className="reply-content quill-content" dangerouslySetInnerHTML={renderRichText(reply.content)}></div>
                                <div className="reply-meta">
                                    <span>By: **{reply.authorName || 'Anonymous'}**</span>
                                    <span>On: {reply.createdAt && new Date(reply.createdAt?.val || reply.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {user ? (
                    <form onSubmit={handleSubmitReply} className="reply-form">
                        <h4>Post a Reply:</h4>
                        <ReactQuill
                            theme="snow"
                            value={replyContent}
                            onChange={setReplyContent}
                            modules={modules}
                            formats={formats}
                            placeholder="Write your reply here..."
                            className="reply-form-quill"
                        />
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
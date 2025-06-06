import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { ref, push, serverTimestamp, set, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import '../styles/DiscussionForum.css';

const NewDiscussionForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

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
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                setUser(authUser);
            } else {
                setUser(null);
                toast.info('Please log in to start a new discussion.');
                navigate('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('You must be logged in to create a discussion.');
            navigate('/login');
            return;
        }

        const isDescriptionEmpty = !description.trim() || description === '<p><br></p>';

        if (!title.trim() || isDescriptionEmpty) {
            toast.error('Title and Description cannot be empty. Please write your discussion content.');
            return;
        }

        try {
            let authorName = user.email;
            const userRef = ref(db, `users/${user.uid}`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if (userData.displayName) {
                    authorName = userData.displayName;
                }
            }

            const newDiscussionRef = push(ref(db, 'discussions'));
            const discussionId = newDiscussionRef.key;

            const newDiscussion = {
                id: discussionId,
                title: title.trim(),
                description: description,
                category: category,
                authorId: user.uid,
                authorName: authorName,
                createdAt: serverTimestamp(),
                lastActivityAt: serverTimestamp(),
                replyCount: 0,
                likes: {}, // Initialize empty likes object
                likesCount: 0, // Initialize likes count
            };

            await set(newDiscussionRef, newDiscussion);

            toast.success('Discussion topic created successfully!');
            navigate(`/forum/${discussionId}`);

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

    if (!user) {
        return null;
    }

    return (
        <div className="forum-container new-discussion-form-card">
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
                    <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={setDescription}
                        modules={modules}
                        formats={formats}
                        placeholder="Provide a detailed description or question for your discussion..."
                    />
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
                    </select>
                </div>

                <button type="submit" className="submit-discussion-btn">
                    Create Discussion
                </button>
            </form>
        </div>
    );
};

export default NewDiscussionForm;
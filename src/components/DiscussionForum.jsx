// src/components/DiscussionForum.jsx

import React, { useState } from "react";
import "../styles/DiscussionForum.css";

const DiscussionForum = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ name: "", title: "", content: "" });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (form.title && form.content) {
      const newPost = {
        id: Date.now(),
        ...form,
        timestamp: new Date().toLocaleString(),
      };
      setPosts([newPost, ...posts]);
      setForm({ name: "", title: "", content: "" });
    }
  };

  return (
    <div className="discussion-container">
      <h1 className="discussion-title">🗣️ Student Discussion Forum</h1>
      <p className="discussion-subtitle">Ask questions, share ideas, and collaborate with others.</p>

      <form className="discussion-form" onSubmit={handlePostSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your name (optional)"
          value={form.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="title"
          placeholder="Post title"
          value={form.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="content"
          placeholder="What's on your mind?"
          value={form.content}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Post</button>
      </form>

      <div className="discussion-posts">
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet. Be the first to start a discussion!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <div className="post-footer">
                <span>🧑 {post.name || "Anonymous"}</span>
                <span>🕒 {post.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiscussionForum;

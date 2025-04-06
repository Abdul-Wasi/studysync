// src/pages/Contact.jsx

import React from "react";
import "../styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Get in Touch</h1>
        <p className="contact-intro">
          Have questions, suggestions, or just want to say hi? We'd love to hear from you!
        </p>

        <form className="contact-form">
          <div className="form-group">
            <label>Name</label>
            <input type="text" placeholder="Your Name" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Your Email" required />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea rows="5" placeholder="Your Message" required />
          </div>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;

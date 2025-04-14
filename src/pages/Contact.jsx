import React, { useRef } from "react";
import "../styles/Contact.css";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_g4erbxc", "template_1mxnbb6", form.current, "egKs99L3S-yS2P2Rd")
      .then(
        (result) => {
          toast.success("Message sent successfully 🚀");
          form.current.reset();
        },
        (error) => {
          toast.error("Oops! Something went wrong 😢");
        }
      );
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Get in Touch</h1>
        <p className="contact-intro">
          Have questions, suggestions, or just want to say hi? We'd love to hear from you!
        </p>

        <form ref={form} onSubmit={sendEmail} className="contact-form">
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" placeholder="Your Name" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="Your Email" required />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea name="message" rows="5" placeholder="Your Message" required />
          </div>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;

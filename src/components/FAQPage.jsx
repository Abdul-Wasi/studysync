// src/components/FAQPage.jsx
import React, { useState } from 'react';
import '../styles/FAQPage.css';

const faqData = [
    {
        question: "What is StudySync?",
        answer: "StudySync is an all-in-one platform designed for students to seamlessly manage their academic life. It provides integrated tools for study planning, personal budgeting, and SGPA/CGPA calculation, all accessible from a personalized profile."
    },
    {
        question: "How do I use the Study Planner?",
        answer: "Navigate to the 'Study Planner' tool. You can effortlessly add new tasks, set specific due dates and times, include detailed descriptions, and mark tasks as complete once finished. All your tasks are automatically saved to your profile when you are logged in."
    },
    {
        question: "How does the Budgeting Tool work?",
        answer: "Within the 'Budgeting Tool', you can easily input your total monthly income and add individual expenses, categorizing them for better insights. The tool helps you vigilantly track where your money goes and calculates your remaining budget in real-time. All your financial data is securely saved to your profile."
    },
    {
        question: "How do I calculate my SGPA?",
        answer: "Head over to the 'SGPA Calculator' tool. First, select your university and degree program (or choose 'Others' if your institution isn't listed for a generic scale). Then, enter your subjects, along with their marks/grades/grade points, and credit values. Click 'Calculate SGPA' to instantly view your result. You'll then have the option to save this calculation to your profile, including a custom semester name for easy tracking."
    },
    {
        question: "What is CGPA and how is it calculated?",
        answer: "CGPA stands for Cumulative Grade Point Average. On your 'Profile' page, in the SGPA section, you'll find a 'Show Cumulative Performance' button. Clicking this will display your CGPA, which is calculated as the weighted average of all your saved SGPAs, taking into account the credits for each semester. It provides an overall academic standing."
    },
    {
        question: "Is my data saved securely?",
        answer: "Absolutely. All your personal data and tool-specific information (study plans, financial records, and SGPA calculations) are securely stored using Firebase's robust authentication and Realtime Database services. Your data is tied to your unique user account, ensuring privacy and integrity."
    },
    {
        question: "Can I access my data from different devices?",
        answer: "Yes, definitely! As long as you log in with the same StudySync account, all your saved study plans, budgeting data, and SGPA/CGPA calculations will be seamlessly accessible from any of your devices, whether it's a laptop, tablet, or smartphone."
    },
    {
        question: "What if my university's grading scale is not listed in the SGPA Calculator?",
        answer: "No worries! You can simply select the 'Others' option in the SGPA Calculator. This allows you to manually input your subjects' grade points and credits. We are continuously working to expand our database with more university-specific grading scales in future updates."
    },
    {
        question: "How do I log out of my StudySync account?",
        answer: "You can easily log out from your 'Profile' page. Simply click the 'Log Out' button located there, and you'll be securely signed out of your StudySync session."
    },
    {
        question: "I forgot my password, what should I do?",
        answer: "If you've forgotten your password, navigate to the 'Login' page. Below the login form, you'll find a 'Forgot Password' link. Click on it, enter your registered email address, and you will receive an email with instructions on how to securely reset your password."
    }
];

const FAQPage = () => {
    // State to manage which FAQ item is open/closed
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-container">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
                {faqData.map((item, index) => (
                    <div className="faq-item" key={index}>
                        <div
                            className="faq-question"
                            onClick={() => toggleFAQ(index)}
                            aria-expanded={openIndex === index} // Accessibility
                        >
                            <h3>{item.question}</h3>
                            <span className={`faq-icon ${openIndex === index ? 'open' : ''}`}>
                                &#9660; {/* Unicode for down arrow */}
                            </span>
                        </div>
                        {/* Always render faq-answer, but control visibility/size with CSS */}
                        <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                            <p>{item.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQPage;
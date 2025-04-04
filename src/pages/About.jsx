import React from "react";
import "../styles/About.css";

const teamMembers = [
  { name: "John Doe", role: "Founder & CEO", image: "john.jpg" },
  { name: "Jane Smith", role: "Lead Developer", image: "jane.jpg" },
  { name: "Alice Brown", role: "UI/UX Designer", image: "alice.jpg" },
];

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <h1>About StudySync</h1>
        <p>Revolutionizing student tools with innovation and precision.</p>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-card" key={index}>
              <img src={`/images/${member.image}`} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;

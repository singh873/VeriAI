import "./OurTeam.css";

const OurTeam = () => {
  return (
    <section className="our-team" id="about-us">
      <h2 className="team-title">Our Team</h2>

      <div className="team-grid">
        <div className="team-card">
          <div className="avatar">👤</div>
          <h3>Sudhanshu Singh</h3>
          <p>
            IIT Madras student with a strong interest in data science and
            software development, focused on building reliable and practical
            AI-driven solutions.
          </p>
        </div>

        <div className="team-card">
          <div className="avatar">👤</div>
          <h3>Shikha Rani</h3>
          <p>
            IIT Madras student passionate about backend systems, APIs, and
            building efficient, scalable server-side applications.
          </p>
        </div>

        <div className="team-card">
          <div className="avatar">👤</div>
          <h3>Sonu Kumar</h3>
          <p>
            IIT Madras student interested in frontend development and UI design,
            focused on creating clean and user-friendly interfaces.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurTeam;

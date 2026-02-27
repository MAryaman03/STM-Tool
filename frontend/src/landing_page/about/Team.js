import React from "react";

function Team() {
  return (
    <section className="founder-section">

      {/* Floating Particles */}
      <div className="particles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="container py-5 position-relative">

        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="founder-title">Founder</h1>
          <p className="founder-subtitle">
            Building the future of intelligent fintech platforms
          </p>
        </div>

        <div className="row align-items-center">

          {/* LEFT PROFILE */}
          <div className="col-lg-5 text-center mb-5 mb-lg-0">
            <img
              src="/images/Amppp1.png"
              alt="Aryaman Mohanty"
              className="founder-img"
            />

            <h3 className="mt-4">Aryaman Mohanty</h3>
            <p className="text-light opacity-75">
              Software Developer • Salesforce Specialist
            </p>

          
            {/* 🔥 CONNECT BUTTONS (RESTORED) */}
            <div className="connect-links mt-4">
              <a
                href="https://www.linkedin.com/in/aryaman-mohanty-053a041b1"
                target="_blank"
                rel="noreferrer"
                className="connect-btn"
              >
                LinkedIn
              </a>


              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                className="connect-btn"
              >
                GitHub
              </a>

              <a
                href="https://maryaman03.github.io/Portfolio/"
                target="_blank"
                rel="noreferrer"
                className="connect-btn"
              >
                MyView
              </a>
            </div>

          </div>

          {/* RIGHT CONTENT */}
          <div className="col-lg-7">

            <p className="founder-text">
              Aryaman engineers scalable CRM and fintech systems with deep
              expertise in Salesforce architecture, automation pipelines,
              and performance-driven application design.
            </p>

            <p className="founder-text">
              He has delivered enterprise dashboards, API integrations,
              and intelligent workflow systems during his professional journey.
            </p>

            {/* Timeline */}
            <div className="timeline mt-5">

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div>
                  <h6>Salesforce Developer </h6>
                  <p>Neevas • CRM automation & dashboards</p>
                </div>
              </div>

              <div className="timeline-item">

                
  <div className="timeline-dot"></div>
  <div>
    <h6>Salesforce Certified AgentForce Specialist</h6>
    <p>
      Certification link :{" "}
      <a
        href="https://trailhead.salesforce.com/en/credentials/verification/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Verify Credential
      </a>
    </p>
  </div>
</div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div>
                  <h6>Stock Monitoring Tool</h6>
                  <p>MERN stack real-time analytics platform</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div>
                  <h6>AI Voice Assistant</h6>
                  <p>Integrated Gemini APIs & Live systems</p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Team;
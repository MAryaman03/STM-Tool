import React from "react";

function Hero() {
  return (
    <div className="container">
      {/* Headline Section */}
      <div className="row p-5 mt-5 mb-4">
        <h1 className="fs-2 text-center fw-semibold">
          Building Scalable CRM Systems & Intelligent Applications
          <br />
          Now, Engineering the Future with AI & Full-Stack Technology.
        </h1>
      </div>

      {/* Content Section */}
      <div
        className="row p-4 mt-4 border-top text-muted"
        style={{ lineHeight: "1.8", fontSize: "1.1em" }}
      >
        {/* Left Column */}
        <div className="col-md-6 p-4">
          <p>
            My journey began with Salesforce development, where I built 
            automation-driven CRM systems using Apex, Lightning Web Components 
            (LWC), and Flow Builder. The goal has always been to eliminate 
            inefficiencies through clean architecture and intelligent workflows.
          </p>

          <p>
            During my internship as a Salesforce Developer, I worked on 
            application customization, reporting dashboards, and API integrations 
            that improved business visibility and operational efficiency.
          </p>

          <p>
            I focus on designing scalable systems that are secure, optimized, 
            and built with long-term maintainability in mind.
          </p>
        </div>

        {/* Right Column */}
        <div className="col-md-6 p-4">
          <p>
            Expanding beyond CRM, I have built full-stack applications such as 
            a Stock Monitoring Dashboard using the MERN stack, featuring 
            real-time portfolio tracking and RESTful API architecture.
          </p>

          <p>
            I also developed an AI-powered voice assistant integrated with 
            Google Gemini API and LiveKit, enabling context-aware and 
            bilingual interaction.
          </p>

          <p>
            Passionate about AI, system design, and emerging technologies, 
            I am continuously building solutions that solve real-world problems 
            with automation and intelligence.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
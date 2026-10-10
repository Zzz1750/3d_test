import { Link } from 'react-router-dom'
import './WorkflowIntegrations.css'

export default function WorkflowIntegrations() {
  const base = import.meta.env.BASE_URL

  return (
    <section className="workflow-section" id="integrations" aria-label="Workflow Integrations">
      <div className="workflow-container">
        <div className="workflow-layout">
          {/* Left Column: Copy & CTA */}
          <div className="workflow-content">
            <h2 className="workflow-title">
              Fits into your workflow.<br />
              <span className="workflow-title-accent">Not the other way around.</span>
            </h2>

            <p className="workflow-subtitle">
              Our compliance AI plugs directly into the tools your teams already use, no migrations, no new logins, no disruption. Connect once and get regulatory intelligence flowing across your entire stack in minutes.
            </p>

            <div className="workflow-cta-box">
              <Link to="/demo" className="workflow-btn-demo">
                <span>Book demo</span>
                <svg className="workflow-btn-arrow" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M1 8a.75.75 0 0 1 .75-.75h10.19L8.47 3.78a.75.75 0 1 1 1.06-1.06l4.75 4.75a.75.75 0 0 1 0 1.06l-4.75 4.75a.75.75 0 1 1-1.06-1.06l3.47-3.47H1.75A.75.75 0 0 1 1 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Column: 3x2 Grid of Partner Logos */}
          <div className="workflow-logos-grid" aria-label="Supported Integrations">
            <div className="workflow-logo-cell item-teams">
              <img
                src={`${base}images/integration/int1.png`}
                alt="Microsoft Teams"
                className="workflow-logo-img logo-teams"
                loading="lazy"
              />
            </div>
            <div className="workflow-logo-cell item-slack">
              <img
                src={`${base}images/integration/int5.png`}
                alt="Slack"
                className="workflow-logo-img logo-slack"
                loading="lazy"
              />
            </div>
            <div className="workflow-logo-cell item-confluence">
              <img
                src={`${base}images/integration/int6.png`}
                alt="Confluence"
                className="workflow-logo-img logo-confluence"
                loading="lazy"
              />
            </div>

            <div className="workflow-logo-cell item-servicenow">
              <img
                src={`${base}images/integration/int2.png`}
                alt="ServiceNow"
                className="workflow-logo-img logo-servicenow"
                loading="lazy"
              />
            </div>
            <div className="workflow-logo-cell item-archer">
              <img
                src={`${base}images/integration/int3.png`}
                alt="Archer"
                className="workflow-logo-img logo-archer"
                loading="lazy"
              />
            </div>
            <div className="workflow-logo-cell item-sharepoint">
              <img
                src={`${base}images/integration/int4.png`}
                alt="SharePoint"
                className="workflow-logo-img logo-sharepoint"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

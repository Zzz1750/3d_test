import { Link } from 'react-router-dom'
import './WorkflowIntegrations.css'

export const INTEGRATION_CARDS = [
  {
    id: 'teams',
    name: 'Microsoft Teams',
    logo: 'images/integration/int1.png',
  },
  {
    id: 'servicenow',
    name: 'ServiceNow',
    logo: 'images/integration/int2.png',
  },
  {
    id: 'archer',
    name: 'Archer GRC',
    logo: 'images/integration/int3.png',
  },
  {
    id: 'confluence',
    name: 'Confluence',
    logo: 'images/integration/int6.png',
  },
  {
    id: 'slack',
    name: 'Slack',
    logo: 'images/integration/int5.png',
  },
  {
    id: 'sharepoint',
    name: 'SharePoint',
    logo: 'images/integration/int4.png',
  }
]

export default function WorkflowIntegrations() {
  const base = import.meta.env.BASE_URL
  const step = 360 / INTEGRATION_CARDS.length

  return (
    <section className="workflow-section" id="integrations" aria-label="Workflow Integrations">
      <div className="workflow-container">
        <div className="workflow-layout">
          {/* Left Column: Original Clean Text & CTA */}
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

          {/* Right Column: Clean White 3D Cards with Centered Logos Only */}
          <div className="workflow-showcase-wrap" aria-label="Supported Integrations">
            <div className="workflow-3d-stage">
              <div className="workflow-3d-tilt">
                <div className="workflow-3d-rotor">
                  {INTEGRATION_CARDS.map((card, idx) => (
                    <div
                      key={card.id}
                      className="workflow-3d-card"
                      style={{
                        transform: `rotateY(${idx * step}deg) translateX(var(--fan-offset, 20px))`
                      }}
                    >
                      {/* Front Face: White card with centered logo */}
                      <div className="card-face card-face-front">
                        <img
                          src={`${base}${card.logo}`}
                          alt={card.name}
                          className={`card-center-logo logo-${card.id}`}
                          loading="lazy"
                        />
                      </div>

                      {/* Back Face: White card with centered logo (never inverted) */}
                      <div className="card-face card-face-back">
                        <img
                          src={`${base}${card.logo}`}
                          alt={card.name}
                          className={`card-center-logo logo-${card.id}`}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

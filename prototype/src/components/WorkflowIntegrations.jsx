import './WorkflowIntegrations.css'

// Compact authentic vector logo marks (strictly small icon glyphs, no wide wordmarks)
const ToolIcons = {
  archer: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <polygon points="3,3 13,12 3,21" fill="#005B94" />
      <polygon points="9,3 19,12 9,21" fill="#00A3E0" />
    </svg>
  ),
  servicenow: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="13" r="8.5" stroke="#81B5A1" strokeWidth="2.8" fill="none" />
      <circle cx="12" cy="4.5" r="2" fill="#293E40" />
    </svg>
  ),
  metricstream: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <path d="M4 18V6l8 7 8-7v12" stroke="#0072CE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 6l8 7 8-7" stroke="#F37021" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ibm: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 16" fill="#052FAD">
      <rect x="2" y="1" width="20" height="1.8" />
      <rect x="2" y="4" width="20" height="1.8" />
      <rect x="2" y="7" width="20" height="1.8" />
      <rect x="2" y="10" width="20" height="1.8" />
      <rect x="2" y="13" width="20" height="1.8" />
    </svg>
  ),
  jira: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <path d="M12.004 2c-.22 0-.44.085-.607.252l-9.145 9.146a.857.857 0 0 0 0 1.213l9.145 9.145c.334.335.88.335 1.214 0l9.145-9.145a.857.857 0 0 0 0-1.213L12.611 2.252A.853.853 0 0 0 12.004 2zm0 4.887l4.53 4.53-4.53 4.53-4.53-4.53 4.53-4.53z" fill="#0052CC"/>
    </svg>
  ),
  devops: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <path d="M22 7.5L16.5 2 11 4.5 5 2 2 7.5l5 4.5-5 4.5 3 5.5 6-2.5 5.5 2.5 5.5-5.5L17 12l5-4.5z" fill="#0078D7"/>
      <path d="M11 4.5l6 7.5-6 7.5-3-3 4.5-4.5-4.5-4.5 3-3z" fill="#50E6FF"/>
    </svg>
  ),
  pega: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h9a7 7 0 0 1 0 14H4V4z" fill="#001F5F"/>
      <circle cx="13" cy="11" r="3" fill="#00A3E0"/>
    </svg>
  ),
  teams: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <circle cx="16.5" cy="7.5" r="3.5" fill="#505AC9"/>
      <rect x="13" y="12" width="9" height="9" rx="2.5" fill="#505AC9"/>
      <rect x="2" y="5" width="13" height="14" rx="2.5" fill="#7B83EB"/>
      <path d="M6 8.5h5M8.5 8.5v7" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  outlook: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="4" width="13" height="16" rx="2" fill="#0078D4"/>
      <polygon points="9,6 15.5,12 22,6" fill="#28A8EA"/>
      <rect x="2" y="7" width="10" height="10" rx="2" fill="#005A9E"/>
      <circle cx="7" cy="12" r="2.2" stroke="#ffffff" strokeWidth="1.4"/>
    </svg>
  ),
  sharepoint: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <circle cx="15.5" cy="8.5" r="5" fill="#038387"/>
      <circle cx="16.5" cy="15.5" r="4" fill="#004E53"/>
      <circle cx="9.5" cy="17" r="4.5" fill="#36B0B6"/>
      <rect x="2" y="6" width="11" height="12" rx="2" fill="#007874"/>
      <path d="M8.5 9.5a2 2 0 0 0-2 2c0 2 3 1.5 3 3.5a2 2 0 0 1-2 2" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  confluence: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <path d="M4 7.5c2-2 5.5-2 7.5 0l4.5 4.5c2 2 2 5.5 0 7.5-2 2-5.5 2-7.5 0L4 15c-2-2-2-5.5 0-7.5z" fill="#0052CC" opacity="0.65"/>
      <path d="M20 16.5c-2 2-5.5 2-7.5 0L8 12c-2-2-2-5.5 0-7.5 2-2 5.5-2 7.5 0L20 9c2 2 2 5.5 0 7.5z" fill="#0052CC"/>
    </svg>
  ),
  entra: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8.5" height="8.5" fill="#F25022"/>
      <rect x="12.5" y="3" width="8.5" height="8.5" fill="#7FBA00"/>
      <rect x="3" y="12.5" width="8.5" height="8.5" fill="#00A4EF"/>
      <rect x="12.5" y="12.5" width="8.5" height="8.5" fill="#FFB900"/>
    </svg>
  ),
  okta: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="#007DC1" strokeWidth="3" fill="none"/>
    </svg>
  ),
  splunk: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <path d="M4 6l6 6-6 6M12 18h8" stroke="#65A637" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  sentinel: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 5.5v6.5c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V5.5L12 2z" fill="#0078D4"/>
      <path d="M12 2v20c4.5-.5 8-5 8-10V5.5L12 2z" fill="#50E6FF" opacity="0.6"/>
    </svg>
  ),
  snowflake: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none" stroke="#29B5E8" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="3.34" y1="7" x2="20.66" y2="17" />
      <line x1="3.34" y1="17" x2="20.66" y2="7" />
    </svg>
  ),
  databricks: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="#FF3621">
      <path d="M12 2L2 7.5v9L12 22l10-5.5v-9L12 2zm0 2.2l7.6 4.2-3.6 2-7.6-4.2 3.6-2zm-8 6.5l3.6-2 7.6 4.2-3.6 2-7.6-4.2zm8 9.1l-7.6-4.2 3.6-2 7.6 4.2-3.6 2zm8-4.2l-7.6 4.2v-4.4l7.6-4.2v4.4z"/>
    </svg>
  ),
  oracle: (
    <svg className="workflow-tool-ico" viewBox="0 0 32 20" fill="none">
      <rect x="2" y="3" width="28" height="14" rx="7" stroke="#F80000" strokeWidth="2.8" fill="none"/>
    </svg>
  ),
  kafka: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="#231F20">
      <circle cx="6" cy="12" r="2.8"/>
      <circle cx="18" cy="6" r="2.8"/>
      <circle cx="18" cy="18" r="2.8"/>
      <line x1="8.5" y1="10.8" x2="15.5" y2="7.2" stroke="#231F20" strokeWidth="1.8"/>
      <line x1="8.5" y1="13.2" x2="15.5" y2="16.8" stroke="#231F20" strokeWidth="1.8"/>
    </svg>
  ),
  temenos: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="5" fill="#E21836" rx="1"/>
      <rect x="9.5" y="8" width="5" height="13" fill="#E21836" rx="1"/>
    </svg>
  ),
  finastra: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h16l-8 16L4 4z" stroke="#6929C4" strokeWidth="2.4" fill="none"/>
      <circle cx="12" cy="12" r="2.8" fill="#6929C4"/>
    </svg>
  ),
  actimize: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <circle cx="8" cy="12" r="4.5" fill="#005B94"/>
      <circle cx="16" cy="12" r="4.5" fill="#F58220" opacity="0.85"/>
    </svg>
  ),
  axiomsl: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" stroke="#003366" strokeWidth="2" fill="none"/>
      <path d="M12 2v20M3 7l9 5 9-5" stroke="#0066CC" strokeWidth="1.5"/>
    </svg>
  ),
  box: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 16" fill="none">
      <circle cx="6" cy="8" r="4" stroke="#0061D5" strokeWidth="2"/>
      <circle cx="14" cy="8" r="4" stroke="#0061D5" strokeWidth="2"/>
      <path d="M6 4h8" stroke="#0061D5" strokeWidth="2"/>
    </svg>
  ),
  elastic: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="#005571" strokeWidth="2"/>
      <path d="M8 12h8M12 8v8" stroke="#FED136" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  datadog: (
    <svg className="workflow-tool-ico" viewBox="0 0 24 24" fill="#632CA6">
      <path d="M19 4h-4a2 2 0 0 0-2 2v2H9a5 5 0 0 0-5 5v5a2 2 0 0 0 2 2h10a5 5 0 0 0 5-5V6a2 2 0 0 0-2-2zm0 10a3 3 0 0 1-3 3H6v-3a3 3 0 0 1 3-3h6v-2h4v5z"/>
    </svg>
  ),
}

export default function WorkflowIntegrations() {
  return (
    <section className="workflow-section" id="integrations" aria-label="Workflow Integrations">
      <div className="workflow-container">
        {/* Section Header */}
        <div className="workflow-header">
          <h2 className="workflow-title">
            Fits into the bank's systems. <span className="workflow-title-accent">Not the other way around.</span>
          </h2>
        </div>

        {/* Central Hub & Surrounding Systems Topology */}
        <div className="workflow-stage">
          {/* SVG Connector Dashed Lines Layer */}
          <svg className="workflow-connectors-svg" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
            {/* Left Connectors */}
            <path d="M 330 100 C 380 100, 390 200, 420 215" className="workflow-dashed-line" />
            <path d="M 330 270 C 370 270, 375 270, 395 270" className="workflow-dashed-line" />
            <path d="M 330 440 C 380 440, 390 340, 420 325" className="workflow-dashed-line" />

            {/* Right Connectors */}
            <path d="M 670 100 C 620 100, 610 200, 580 215" className="workflow-dashed-line" />
            <path d="M 670 270 C 630 270, 625 270, 605 270" className="workflow-dashed-line" />
            <path d="M 670 440 C 620 440, 610 340, 580 325" className="workflow-dashed-line" />

            {/* Anchor Dots on Cards */}
            <circle cx="330" cy="100" r="3" className="workflow-anchor-dot" />
            <circle cx="330" cy="270" r="3" className="workflow-anchor-dot" />
            <circle cx="330" cy="440" r="3" className="workflow-anchor-dot" />
            <circle cx="670" cy="100" r="3" className="workflow-anchor-dot" />
            <circle cx="670" cy="270" r="3" className="workflow-anchor-dot" />
            <circle cx="670" cy="440" r="3" className="workflow-anchor-dot" />
          </svg>

          {/* Left Cards Column */}
          <div className="workflow-cards-col left">
            {/* 1. Governance, risk and compliance */}
            <div className="workflow-category-card">
              <h3 className="workflow-category-title">Governance, risk and compliance</h3>
              <div className="workflow-pills-wrap">
                <span className="workflow-pill">
                  {ToolIcons.archer}
                  Archer
                </span>
                <span className="workflow-pill">
                  {ToolIcons.servicenow}
                  ServiceNow IRM
                </span>
                <span className="workflow-pill">
                  {ToolIcons.metricstream}
                  MetricStream
                </span>
                <span className="workflow-pill">
                  {ToolIcons.ibm}
                  IBM OpenPages
                </span>
              </div>
            </div>

            {/* 2. Work and ticketing */}
            <div className="workflow-category-card">
              <h3 className="workflow-category-title">Work and ticketing</h3>
              <div className="workflow-pills-wrap">
                <span className="workflow-pill">
                  {ToolIcons.servicenow}
                  ServiceNow
                </span>
                <span className="workflow-pill">
                  {ToolIcons.jira}
                  Jira
                </span>
                <span className="workflow-pill">
                  {ToolIcons.devops}
                  Azure DevOps
                </span>
                <span className="workflow-pill">
                  {ToolIcons.pega}
                  Pega
                </span>
              </div>
            </div>

            {/* 3. Collaboration and documents */}
            <div className="workflow-category-card">
              <h3 className="workflow-category-title">Collaboration and documents</h3>
              <div className="workflow-pills-wrap">
                <span className="workflow-pill">
                  {ToolIcons.teams}
                  Microsoft Teams
                </span>
                <span className="workflow-pill">
                  {ToolIcons.outlook}
                  Outlook
                </span>
                <span className="workflow-pill">
                  {ToolIcons.sharepoint}
                  SharePoint
                </span>
                <span className="workflow-pill">
                  {ToolIcons.confluence}
                  Confluence
                </span>
              </div>
            </div>
          </div>

          {/* Central Hub: Comply2Reg Node + Protocols */}
          <div className="workflow-hub-col">
            <div className="workflow-hub-aura">
              <div className="workflow-hub-circle">
                <img
                  src={`${import.meta.env.BASE_URL}images/logo.png`}
                  alt="Comply2Reg"
                  className="workflow-hub-logo"
                />
              </div>
            </div>

            {/* Connection Protocol Badges */}
            <div className="workflow-protocol-badges">
              <span className="workflow-protocol-pill">API</span>
              <span className="workflow-protocol-pill">MCP</span>
              <span className="workflow-protocol-pill">AGENT TO AGENT</span>
            </div>
          </div>

          {/* Right Cards Column */}
          <div className="workflow-cards-col right">
            {/* 4. Identity and security */}
            <div className="workflow-category-card">
              <h3 className="workflow-category-title">Identity and security</h3>
              <div className="workflow-pills-wrap">
                <span className="workflow-pill">
                  {ToolIcons.entra}
                  Microsoft Entra ID
                </span>
                <span className="workflow-pill">
                  {ToolIcons.okta}
                  Okta
                </span>
                <span className="workflow-pill">
                  {ToolIcons.splunk}
                  Splunk
                </span>
                <span className="workflow-pill">
                  {ToolIcons.sentinel}
                  Microsoft Sentinel
                </span>
              </div>
            </div>

            {/* 5. Data platforms */}
            <div className="workflow-category-card">
              <h3 className="workflow-category-title">Data platforms</h3>
              <div className="workflow-pills-wrap">
                <span className="workflow-pill">
                  {ToolIcons.snowflake}
                  Snowflake
                </span>
                <span className="workflow-pill">
                  {ToolIcons.databricks}
                  Databricks
                </span>
                <span className="workflow-pill">
                  {ToolIcons.oracle}
                  Oracle
                </span>
                <span className="workflow-pill">
                  {ToolIcons.kafka}
                  Kafka
                </span>
              </div>
            </div>

            {/* 6. Core banking and reporting */}
            <div className="workflow-category-card">
              <h3 className="workflow-category-title">Core banking and reporting</h3>
              <div className="workflow-pills-wrap">
                <span className="workflow-pill">
                  {ToolIcons.temenos}
                  Temenos
                </span>
                <span className="workflow-pill">
                  {ToolIcons.finastra}
                  Finastra
                </span>
                <span className="workflow-pill">
                  {ToolIcons.actimize}
                  NICE Actimize
                </span>
                <span className="workflow-pill">
                  {ToolIcons.axiomsl}
                  AxiomSL
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Logo & Tool Ticker Strip */}
        <div className="workflow-bottom-strip">
          <span className="workflow-strip-item">
            {ToolIcons.teams}
            Microsoft Teams
          </span>
          <span className="workflow-strip-item">
            {ToolIcons.servicenow}
            ServiceNow
          </span>
          <span className="workflow-strip-item">
            {ToolIcons.jira}
            Jira
          </span>
          <span className="workflow-strip-item">
            {ToolIcons.outlook}
            Outlook
          </span>
          <span className="workflow-strip-item">
            {ToolIcons.sharepoint}
            SharePoint
          </span>
          <span className="workflow-strip-item">
            {ToolIcons.confluence}
            Confluence
          </span>
          <span className="workflow-strip-item">
            {ToolIcons.box}
            Box
          </span>
          <span className="workflow-strip-item">
            {ToolIcons.okta}
            Okta
          </span>
          <span className="workflow-strip-item">
            {ToolIcons.splunk}
            Splunk
          </span>
          <span className="workflow-strip-item">
            {ToolIcons.elastic}
            Elastic
          </span>
          <span className="workflow-strip-item">
            {ToolIcons.datadog}
            Datadog
          </span>
          <span className="workflow-strip-item">
            {ToolIcons.snowflake}
            Snowflake
          </span>
          <span className="workflow-strip-item">
            {ToolIcons.databricks}
            Databricks
          </span>
        </div>

        {/* CTAs */}
        <div className="workflow-actions">
          <button type="button" className="workflow-btn-primary">
            See all integrations <span aria-hidden="true">&rarr;</span>
          </button>
          <button type="button" className="workflow-btn-secondary">
            Book a demo
          </button>
        </div>
      </div>
    </section>
  )
}

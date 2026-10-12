import './UseCases.css'

const USE_CASES = [
  {
    id: 'uc-1',
    title: 'Regulatory change monitoring',
    desc: 'Catch every new rule the day it is issued, grade its relevance and assign an owner.',
    icon: (
      <svg className="usecase-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="#0f172a" />
        <line x1="12" y1="12" x2="17.5" y2="6.5" stroke="#0066cc" strokeWidth="1.2" />
        <circle cx="17.5" cy="6.5" r="1.8" fill="#0066cc" fillOpacity="0.15" stroke="#0066cc" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'uc-2',
    title: 'Impact assessment',
    desc: 'Map each rule to the policies, controls and systems it changes, in hours not weeks.',
    icon: (
      <svg className="usecase-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="5" cy="12" r="2.2" stroke="#0f172a" />
        <circle cx="19" cy="6" r="2.2" stroke="#0066cc" fill="#0066cc" fillOpacity="0.12" />
        <circle cx="19" cy="18" r="2.2" stroke="#0066cc" fill="#0066cc" fillOpacity="0.12" />
        <path d="M7.2 12h4a3 3 0 0 0 3-3V6" stroke="#0f172a" />
        <path d="M11.2 12a3 3 0 0 1 3 3v3" stroke="#0f172a" />
      </svg>
    ),
  },
  {
    id: 'uc-3',
    title: 'Pre-launch compliance check',
    desc: "Test a new product, process or draft rule against the bank's rulebook before committing.",
    icon: (
      <svg className="usecase-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 21.5s7.5-3.8 7.5-9.5V5.5L12 2.5 4.5 5.5V12c0 5.7 7.5 9.5 7.5 9.5z" stroke="#0f172a" />
        <path d="m9 12 2 2 4-4" stroke="#0066cc" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'uc-4',
    title: 'Gap remediation tracking',
    desc: 'Follow every gap to closure with an owner, deadline, status and evidence the Board can see.',
    icon: (
      <svg className="usecase-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="#0f172a" />
        <path d="m8.5 12 2.3 2.3 4.7-4.7" stroke="#0066cc" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'uc-5',
    title: 'Regulatory reporting',
    desc: 'Draft each return ahead of its deadline and reconcile it after filing.',
    icon: (
      <svg className="usecase-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2.5H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5z" stroke="#0f172a" />
        <polyline points="14 2.5 14 8.5 20 8.5" stroke="#0f172a" />
        <line x1="8" y1="13" x2="16" y2="13" stroke="#0066cc" strokeWidth="1.2" />
        <line x1="8" y1="16.5" x2="13" y2="16.5" stroke="#0066cc" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'uc-6',
    title: 'Audit readiness',
    desc: 'Gather evidence as work happens so working papers are ready for any audit or inspection.',
    icon: (
      <svg className="usecase-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4.5" y="4.5" width="15" height="16.5" rx="2" stroke="#0f172a" />
        <path d="M9 2.5h6a1 1 0 0 1 1 1v2H8v-2a1 1 0 0 1 1-1z" stroke="#0f172a" />
        <path d="m9 13.5 2 2 4-4" stroke="#0066cc" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'uc-7',
    title: 'AI model governance',
    desc: "Keep an inventory of the bank's AI models mapped to the rules that govern them.",
    icon: (
      <svg className="usecase-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="6.5" y="6.5" width="11" height="11" rx="2" stroke="#0f172a" />
        <circle cx="12" cy="12" r="2" stroke="#0066cc" strokeWidth="1.2" fill="#0066cc" fillOpacity="0.15" />
        <line x1="12" y1="2" x2="12" y2="6.5" stroke="#0f172a" />
        <line x1="12" y1="17.5" x2="12" y2="22" stroke="#0f172a" />
        <line x1="2" y1="12" x2="6.5" y2="12" stroke="#0f172a" />
        <line x1="17.5" y1="12" x2="22" y2="12" stroke="#0f172a" />
      </svg>
    ),
  },
  {
    id: 'uc-8',
    title: 'Compliance on request',
    desc: 'Any team asks in plain language; agents plan and act, a person approves each change.',
    icon: (
      <svg className="usecase-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.5 11.5a7.5 7.5 0 0 1-7.5 7.5 8 8 0 0 1-3.2-.7L4 19.5l1.2-5.4A7.5 7.5 0 1 1 20.5 11.5z" stroke="#0f172a" />
        <path d="M12.5 7.5 9.5 12h3l-1 4.5 4-4.5h-3z" stroke="#0066cc" strokeWidth="1.1" fill="#0066cc" fillOpacity="0.15" />
      </svg>
    ),
  },
]

const ROLES = [
  'Head of Compliance',
  'Head of Products',
  'Head of Risk & Audit',
  'Head of Ops & IT',
]

export default function UseCases() {
  return (
    <section className="usecases-section" id="use-cases" aria-label="Use Cases">
      <div className="usecases-container">
        {/* Clean Header — NO Eyebrow as requested */}
        <div className="usecases-header">
          <h2 className="usecases-title">
            Use Cases Across the <span className="usecases-title-accent">Bank</span>
          </h2>
          <p className="usecases-subtitle">

          </p>
        </div>

        {/* 8 Minimal Clean Use Case Cards */}
        <div className="usecases-grid">
          {USE_CASES.map((uc) => (
            <div key={uc.id} className="usecase-card">
              <div className="usecase-card-icon" aria-hidden="true">
                {uc.icon}
              </div>
              <h3 className="usecase-card-title">{uc.title}</h3>
              <p className="usecase-card-desc">{uc.desc}</p>
            </div>
          ))}
        </div>

        {/* Connected Leadership Axis — Creative, Minimal & Non-Clickable */}
        <div className="usecases-roles-section">
          <div className="usecases-roles-header">
            <h3 className="usecases-roles-title">
              Connected compliance across <span className="usecases-roles-accent">bank leadership</span>
            </h3>
          </div>

          <div className="usecases-roles-axis">
            <div className="usecases-axis-line" aria-hidden="true" />
            <div className="usecases-axis-nodes">
              {ROLES.map((role) => (
                <div key={role} className="usecases-axis-item">
                  <div className="usecases-axis-node" aria-hidden="true">
                    <span className="usecases-node-core" />
                  </div>
                  <span className="usecases-axis-text">{role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

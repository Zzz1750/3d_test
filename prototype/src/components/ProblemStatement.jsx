import './ProblemStatement.css'

const USE_CASES = [
  {
    id: 'uc-1',
    icon: (
      <svg
        className="usecase-icon-svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    problem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    solution: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.',
    roles: 'Lorem ipsum dolor sit amet, Chief Compliance Officer, Lead Risk Analyst.',
    severity: 'Lorem Ipsum / High',
  },
  {
    id: 'uc-2',
    icon: (
      <svg
        className="usecase-icon-svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
    problem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
    solution: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
    roles: 'Lorem ipsum dolor sit amet, Internal Audit Lead, Policy Manager.',
    severity: 'Lorem Ipsum / Critical',
  },
  {
    id: 'uc-3',
    icon: (
      <svg
        className="usecase-icon-svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    problem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio praesent libero sed cursus ante dapibus diam tristique.',
    solution: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales ligula in libero pellentesque dignissim commodo.',
    roles: 'Lorem ipsum dolor sit amet, Head of Governance, Regulatory Liaison.',
    severity: 'Lorem Ipsum / Moderate',
  },
]

export default function ProblemStatement() {
  return (
    <section className="problem-section" id="problem-statement" aria-label="Use Cases">
      <div className="problem-container">
        {/* Section Header */}
        <header className="problem-header">
          <h2 className="problem-title">
            Use <span className="problem-title-accent">Cases</span>
          </h2>
          <p className="problem-subtitle">
            From automated regulatory horizon scanning to continuous audit readiness, see how compliance and risk teams replace manual spreadsheet tracking.
          </p>
        </header>

        {/* 3-Column Deck: Outside Boxes Removed, Inside Boxes Kept */}
        <div className="usecase-grid">
          {USE_CASES.map((item) => (
            <div key={item.id} className="usecase-col">
              {/* Left Column: Icon */}
              <div className="usecase-icon-col" aria-hidden="true">
                <div className="usecase-icon-box">
                  {item.icon}
                </div>
              </div>

              {/* Right Column: Stacked Inside Boxes */}
              <div className="usecase-stack">
                {/* Problem Box (Clean White) */}
                <div className="usecase-box usecase-box-problem">
                  <span className="usecase-box-label">Problem</span>
                  <p className="usecase-box-text">{item.problem}</p>
                </div>

                {/* Solution Box (Vibrant Brand Blue) */}
                <div className="usecase-box usecase-box-solution">
                  <span className="usecase-box-label usecase-box-label-solution">Solution</span>
                  <p className="usecase-box-text usecase-box-text-solution">{item.solution}</p>
                </div>

                {/* Roles Box (Clean White) */}
                <div className="usecase-box usecase-box-roles">
                  <span className="usecase-box-label">Roles</span>
                  <p className="usecase-box-text">{item.roles}</p>
                </div>

                {/* Severity Box (Clean White Compact Box) */}
                <div className="usecase-box usecase-box-severity">
                  <span className="usecase-box-label">Severity</span>
                  <span className="usecase-severity-val">{item.severity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

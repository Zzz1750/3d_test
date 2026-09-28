import './ProblemStatement.css'

const STAGES = [
  {
    num: '01',
    question: 'What changed?',
    module: 'RegPulse',
    tagline: 'Horizon Scanning',
    desc: 'Monitors 50+ global regulators in real time, separating statutory mandates from non-binding guidance within minutes.'
  },
  {
    num: '02',
    question: 'Does it hit us?',
    module: 'ReguLens',
    tagline: 'Applicability Engine',
    desc: 'Evaluates clauses directly against your entity licenses, product lines, and tech stack to determine exact relevance.'
  },
  {
    num: '03',
    question: 'Who owns it?',
    module: 'Gap Analyzer',
    tagline: 'Task Orchestration',
    desc: 'Converts legal mandates into assigned engineering tickets, policy revisions, and operational tasks with clear RACI ownership.'
  },
  {
    num: '04',
    question: 'Can we prove it?',
    module: 'AuditGeniee',
    tagline: 'Supervisory Proof',
    desc: 'Compiles continuous, timestamped evidence dossiers connecting live code to regulations, ready for examiners in one click.'
  }
]

export default function ProblemStatement() {
  return (
    <section className="problem-section" id="problem-statement">
      <div className="problem-container">

        {/* Header Block */}
        <div className="problem-intro">
          <h2 className="problem-title">
            Everyone reads the rule.
            <span className="problem-title-accent"> Nobody owns what it changes.</span>
          </h2>

          <p className="problem-desc">
            <span className="problem-lead-highlight">The Orchestration Gap . </span>
            When a financial regulator issues a 100-page circular, it lands across Compliance, Product, Tech, and Operations simultaneously. Each team holds a disconnected piece, but no single team owns execution. Comply2Reg automates the entire lifecycle into four decisive stages.
          </p>
        </div>

        {/* Frosted Cloud Glass Columns Grid */}
        <div className="hairline-columns-grid">
          {/* Relaxed Mascot laying on top of the 04 AuditGeniee box towards the right */}
          <div className="col-mascot-sleep-wrap" aria-hidden="true">
            <img
              src={`${import.meta.env.BASE_URL}images/sleep.png`}
              alt="Comply2Reg Mascot Relaxing"
              className="col-mascot-sleep-img"
            />
          </div>

          {STAGES.map((stage) => (
            <div key={stage.num} className="hairline-col">
              <div className="col-top-meta">
                <span className="col-index">{stage.num}</span>
                <span className="col-module-badge">{stage.module}</span>
              </div>

              <h3 className="col-question">{stage.question}</h3>
              <span className="col-tagline">{stage.tagline}</span>

              <p className="col-desc">{stage.desc}</p>
            </div>
          ))}
        </div>

        {/* Minimal Understated Impact Strip */}
        <div className="problem-impact-strip">
          <div className="impact-point">
            <span className="impact-lead">Response Time:</span>
            <span className="impact-text">From 100-page circular to assigned team tasks in under 2 minutes.</span>
          </div>
          <div className="impact-divider" aria-hidden="true" />
          <div className="impact-point">
            <span className="impact-lead">Audit Readiness:</span>
            <span className="impact-text">Complete supervisory readiness in 60–90 days with continuous proof.</span>
          </div>
        </div>

      </div>
    </section>
  )
}

import './ProductShowcase.css'

const TOOLKIT_ITEMS = [
  {
    num: '01',
    title: 'Horizon scanning',
    reality: 'Circulars arrive as PDFs and emails. Relevance is judged from memory, and intake lags by weeks.',
    solution: 'RegPulse pulls every regulator notification, triages each change by impact and flags the policies and controls it affects, on the day of issue.',
    cta: 'Explore horizon scanning',
    image: `${import.meta.env.BASE_URL}images/tool1.png`,
    urlName: 'horizon-scanning',
  },
  {
    num: '02',
    title: 'Control gap mapping',
    reality: 'Working out what a rule changes takes workshops, spreadsheets and weeks of email, and the list is never known to be complete.',
    solution: 'ReguLens holds every regulation in one place, maps obligations to controls or drafts new ones for sign-off. Gap Analyser keeps a live register with owners and deadlines.',
    cta: 'Explore gap mapping',
    image: `${import.meta.env.BASE_URL}images/tool2.png`,
    urlName: 'control-gap-mapping',
  },
  {
    num: '03',
    title: 'Audit and accountability',
    reality: 'Weeks spent pulling emails, minutes and screenshots for each auditor, from records that can be edited afterwards.',
    solution: 'AuditGenie gathers evidence as work happens, tests controls, drafts findings and builds the pack from a record that cannot be changed.',
    cta: 'Explore audit evidence',
    image: `${import.meta.env.BASE_URL}images/tool3.png`,
    urlName: 'audit-accountability',
  },
]

export default function ProductShowcase({ standalone = false }) {
  return (
    <section
      className={`toolkit-section ${standalone ? 'standalone-mode' : ''}`}
      id="products"
      aria-label="Comply2reg Toolkit"
    >
      <div className="toolkit-container">
        {/* Clean Editorial Header */}
        <header className="toolkit-header">
          <h2 className="toolkit-title">
            Comply2reg  <span className="toolkit-title-accent">Toolkit</span>
          </h2>
          <p className="toolkit-subtitle">
            Three things to see first
          </p>
        </header>

        {/* Minimal & Clean Showcase Cards */}
        <div className="toolkit-list">
          {TOOLKIT_ITEMS.map((item) => (
            <article key={item.num} className="toolkit-card">
              {/* Narrative Content */}
              <div className="toolkit-content">
                <div className="toolkit-card-header">
                  <span className="toolkit-num">{item.num}</span>
                  <h3 className="toolkit-card-title">{item.title}</h3>
                </div>

                <div className="toolkit-narrative">
                  <div className="toolkit-point toolkit-point-reality">
                    <span className="toolkit-point-label">Today's reality</span>
                    <p className="toolkit-point-text">{item.reality}</p>
                  </div>

                  <div className="toolkit-point toolkit-point-solution">
                    <span className="toolkit-point-label">With Comply2Reg</span>
                    <p className="toolkit-point-text">{item.solution}</p>
                  </div>
                </div>

                <div className="toolkit-action">
                  <a href={`#${item.urlName}`} className="toolkit-link">
                    <span>{item.cta}</span>
                    <span className="toolkit-arrow" aria-hidden="true">→</span>
                  </a>
                </div>
              </div>

              {/* Framed Application Preview */}
              <div className="toolkit-media">
                <div className="toolkit-media-frame">
                  <img
                    src={item.image}
                    alt={`${item.title} Screenshot Preview`}
                    className="toolkit-media-img"
                    loading="lazy"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

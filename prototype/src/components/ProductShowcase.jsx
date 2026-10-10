import './ProductShowcase.css'

const BENTO_ITEMS = [
  {
    num: '01',
    title: 'Horizon Scanning',
    reality: "140+ page PDFs · 6-week intake lag",
    solution: "Real-time intake across 50+ regulators",
    image: `${import.meta.env.BASE_URL}images/tool1.png`,
    imageFirst: true, // Row 1: Screenshot on left, Content on right
    urlName: 'horizon-scanning',
  },
  {
    num: '02',
    title: 'Control Gap Mapping',
    reality: "Siloed spreadsheets · Hidden control gaps",
    solution: "Instant semantic policy-to-control mapping",
    image: `${import.meta.env.BASE_URL}images/tool2.png`,
    imageFirst: false, // Row 2: Content on left, Screenshot on right
    urlName: 'control-gap-mapping',
  },
  {
    num: '03',
    title: 'Audit & Accountability',
    reality: "Scrambling for proof · Personal SMCR liability",
    solution: "Continuous proof · Audit-ready in 60 days",
    image: `${import.meta.env.BASE_URL}images/tool3.png`,
    imageFirst: true, // Row 3: Screenshot on left, Content on right
    urlName: 'audit-accountability',
  },
]

function MediaCard({ item }) {
  return (
    <div className="bento-card bento-card-media">
      {/* macOS-style Window Frame Top Bar */}
      <div className="bento-media-window-bar">
        <div className="bento-window-dots" aria-hidden="true">
          <span className="dot dot-red" />
          <span className="dot dot-amber" />
          <span className="dot dot-green" />
        </div>
        <div className="bento-window-url">
          <span className="bento-url-lock" aria-hidden="true">🔒</span>
          <span>app.comply2reg.com/{item.urlName}</span>
        </div>
        <div className="bento-window-spacer" aria-hidden="true" />
      </div>

      {/* Main High-Resolution Application Screenshot */}
      <div className="bento-media-viewport">
        <img
          src={item.image}
          alt={`${item.title} Screenshot Preview`}
          className="bento-media-img"
          loading="lazy"
        />
      </div>
    </div>
  )
}

function ContentCard({ item }) {
  return (
    <div className="bento-card bento-card-content">
      {/* Header: Stage Badge + Title */}
      <div className="bento-content-header">
        <div className="bento-num-badge">
          <span className="bento-num-val">{item.num}</span>
        </div>
        <h3 className="bento-card-title">{item.title}</h3>
      </div>

      {/* Structured Comparison Sequence */}
      <div className="bento-comparison-flow">
        {/* Today's Reality */}
        <div className="bento-state-block bento-state-reality">
          <span className="bento-state-label">Today's Reality</span>
          <p className="bento-state-text bento-reality-text">{item.reality}</p>
        </div>

        {/* Directional Flow Separator */}
        <div className="bento-state-separator" aria-hidden="true">
          <span className="bento-sep-line" />
          <span className="bento-sep-arrow">↓</span>
          <span className="bento-sep-line" />
        </div>

        {/* With Comply2Reg */}
        <div className="bento-state-block bento-state-solution">
          <span className="bento-state-label bento-label-solution">With Comply2Reg</span>
          <p className="bento-state-text bento-solution-text">{item.solution}</p>
        </div>
      </div>

      {/* Bottom Footer: Feature Explore Action */}
      <div className="bento-content-footer">
        <div className="bento-card-link">
          <span>Explore {item.title}</span>
          <span className="bento-link-arrow" aria-hidden="true">→</span>
        </div>
      </div>
    </div>
  )
}

export default function ProductShowcase({ standalone = false }) {
  return (
    <section
      className={`toolkit-section ${standalone ? 'standalone-mode' : ''}`}
      id="products"
      aria-label="The Comply2Reg Toolkit"
    >
      <div className="toolkit-container">
        {/* Clean Header */}
        <header className="toolkit-header">
          <h2 className="toolkit-title">
            The Comply2Reg <span className="toolkit-title-accent">Toolkit</span>
          </h2>
          <p className="toolkit-subtitle">
            A unified suite of intelligent compliance tools designed to eliminate regulatory friction.
          </p>
        </header>

        {/* Alternating Bento Grid Sequence */}
        <div className="toolkit-bento-wrapper">
          {BENTO_ITEMS.map((item) => (
            <div
              key={item.num}
              className={`bento-row ${
                item.imageFirst ? 'bento-row-media-first' : 'bento-row-content-first'
              }`}
            >
              {item.imageFirst ? (
                <>
                  <MediaCard item={item} />
                  <ContentCard item={item} />
                </>
              ) : (
                <>
                  <ContentCard item={item} />
                  <MediaCard item={item} />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

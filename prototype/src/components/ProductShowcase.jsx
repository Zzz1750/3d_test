import './ProductShowcase.css'

const TOOLKIT_ITEMS = [
  {
    num: '',
    title: 'Horizon scanning',
    reality: '',
    solution: 'Real-time intake across 50+ regulators. Every circular, classified and prioritised the moment it lands.',
    cta: '',
    image: `${import.meta.env.BASE_URL}images/tool1.png`,
    urlName: '',
  },
  {
    num: '',
    title: 'Control gap mapping',
    reality: '',
    solution: 'Instant, semantic policy-to-control mapping. Every obligation traced to a policy, a control and an owner.',
    cta: '',
    image: `${import.meta.env.BASE_URL}images/tool2.png`,
    urlName: 'control-gap-mapping',
  },
  {
    num: '',
    title: 'Audit and accountability',
    reality: '',
    solution: 'Continuous proof, audit-ready in 60 days. Evidence that builds itself, ready when the examiner asks.',
    cta: '',
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
            The toolkit. <br />  <span className="toolkit-title-accent">Intuitive features in a conversational setting.</span>
          </h2>
          <p className="toolkit-subtitle">

          </p>
        </header>

        {/* Minimal & Clean Showcase Cards */}
        <div className="toolkit-list">
          {TOOLKIT_ITEMS.map((item) => (
            <article key={item.num} className="toolkit-card">
              {/* Narrative Content */}
              <div className="toolkit-content">
                {/* <div className="toolkit-card-header">
                  <span className="toolkit-num">{item.num}</span>
                  <h3 className="toolkit-card-title">{item.title}</h3>
                </div> */}

                <div className="toolkit-narrative">
                  {/* <div className="toolkit-point toolkit-point-reality">
                    <span className="toolkit-point-label"></span>
                    <p className="toolkit-point-text">{item.reality}</p>
                  </div> */}

                  <div className="toolkit-point toolkit-point-solution">
                    <span className="toolkit-point-label"></span>
                    <p className="toolkit-point-text">{item.solution}</p>
                  </div>
                </div>

                <div className="toolkit-action">
                  <a href={`#${item.urlName}`} className="toolkit-link">
                    <span>{item.cta}</span>
                    {/* <span className="toolkit-arrow" aria-hidden="true">→</span> */}
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

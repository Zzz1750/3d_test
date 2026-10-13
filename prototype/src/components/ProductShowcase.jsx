import './ProductShowcase.css'

const TOOLKIT_ITEMS = [
  {
    id: 'tool-horizon',
    title: 'Horizon scanning',
    text: 'Real-time intake across 50+ regulators. Every circular, classified and prioritised the moment it lands.',
    image: `${import.meta.env.BASE_URL}images/tool1.png`,
  },
  {
    id: 'tool-gap',
    title: 'Control gap mapping',
    text: 'Instant, semantic policy-to-control mapping. Every obligation traced to a policy, a control and an owner.',
    image: `${import.meta.env.BASE_URL}images/tool2.png`,
  },
  {
    id: 'tool-audit',
    title: 'Audit and accountability',
    text: 'Continuous proof, audit-ready in 60 days. Evidence that builds itself, ready when the examiner asks.',
    image: `${import.meta.env.BASE_URL}images/tool3.png`,
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
            The toolkit. <br />{' '}
            <span className="toolkit-title-accent">Intuitive features in a conversational setting.</span>
          </h2>
        </header>

        {/* Minimal Unboxed Showcase Rows (Zig-Zag) */}
        <div className="toolkit-list">
          {TOOLKIT_ITEMS.map((item, index) => {
            const isImageFirst = index % 2 === 0

            return (
              <article
                key={item.id}
                className={`toolkit-row ${isImageFirst ? 'row-image-first' : 'row-content-first'}`}
              >
                {/* Narrative Content */}
                <div className="toolkit-content">
                  <p className="toolkit-text">{item.text}</p>
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
            )
          })}
        </div>
      </div>
    </section>
  )
}


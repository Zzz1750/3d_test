import { useRef, useEffect } from 'react'
import './ProductShowcase.css'

const FEATURES = [
  {
    id: 'asklia',
    name: 'AskLia',
    desc: 'An intelligent compliance copilot trained on global regulations and internal policies. Interrogate circulars in natural language and receive instant, citation-backed answers mapped directly to statutory mandates.',
    points: [
      {
        title: 'Zero Hallucinations',
        desc: 'Direct clause citations connecting every response to verified statutory text.'
      },
      {
        title: 'Contextual Policy Mapping',
        desc: 'Synthesizes new circulars against your internal SOPs and technical controls.'
      }
    ],
    videoSrc: `${import.meta.env.BASE_URL}videos/asklia.mp4`
  },
  {
    id: 'regulens',
    name: 'ReguLens',
    desc: 'An applicability engine that evaluates incoming circular clauses directly against your entity licenses, product lines, and tech stack to determine exact institutional exposure.',
    points: [
      {
        title: 'Entity Scope Filtering',
        desc: 'Instantly filters out non-applicable mandates across multi-license banking entities.'
      },
      {
        title: 'Impact Radius Analysis',
        desc: 'Maps clause dependencies across core banking, treasury, and retail payment rails.'
      }
    ],
    videoSrc: null
  },
  {
    id: 'regpulse',
    name: 'RegPulse',
    desc: 'Continuous real-time surveillance across 50+ financial regulators. Automatically classifies statutory mandates, consultative drafts, and supervisory guidance the moment they drop.',
    points: [
      {
        title: 'Real-Time Surveillance',
        desc: 'Surfaces urgent circulars and enforcement actions within minutes of publication.'
      },
      {
        title: 'Mandate Classification',
        desc: 'Distinguishes binding statutory mandates from non-binding advisory notices.'
      }
    ],
    videoSrc: null
  },
  {
    id: 'gap-analyser',
    name: 'Compliance Gap Analyser',
    desc: 'Converts legal mandates into verified engineering tickets, policy revisions, and operational tasks with unambiguous RACI ownership and tracked delivery timelines.',
    points: [
      {
        title: 'Automated Task Orchestration',
        desc: 'Translates 100-page directives into assignable engineering and ops tickets.'
      },
      {
        title: 'Cross-Functional RACI',
        desc: 'Assigns clear accountability across Compliance, Legal, Product, and IT.'
      }
    ],
    videoSrc: null
  },
  {
    id: 'audit-geniee',
    name: 'Audit Geniee',
    desc: 'Compiles continuous, timestamped evidence dossiers connecting live repository code and controls directly to regulations, ready for supervisory examiners in one click.',
    points: [
      {
        title: 'Continuous Evidence Dossiers',
        desc: 'Generates immutable audit trails connecting operational state to regulation.'
      },
      {
        title: 'One-Click Examiner Packs',
        desc: 'Eliminates weeks of manual audit prep with standardized supervisory packages.'
      }
    ],
    videoSrc: null
  }
]

// macOS Window Component wrapping the video / preview
function MacWindowDisplay({ feature }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (video && feature.videoSrc) {
      video.muted = true
      video.play().catch(() => {})
    }
  }, [feature.videoSrc])

  return (
    <div className="mac-video-window">
      {/* macOS Window Title Bar */}
      <div className="mac-titlebar">
        <div className="mac-traffic-lights" aria-hidden="true">
          <span className="traffic-dot dot-red" />
          <span className="traffic-dot dot-yellow" />
          <span className="traffic-dot dot-green" />
        </div>

        <div className="mac-address-pill">
          <svg className="mac-lock-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M4 4a4 4 0 0 1 8 0v2h.25A1.75 1.75 0 0 1 14 7.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5A1.75 1.75 0 0 1 3.75 6H4V4zm1.5 2h5V4a2.5 2.5 0 0 0-5 0v2z" clipRule="evenodd" />
          </svg>
          <span className="mac-address-url">comply2reg.com/{feature.id}</span>
        </div>

        <div className="mac-titlebar-end" aria-hidden="true" />
      </div>

      {/* Video or Clean Feature Preview Canvas */}
      <div className="mac-window-canvas">
        {feature.videoSrc ? (
          <video
            ref={videoRef}
            className="mac-window-video"
            src={feature.videoSrc}
            loop
            muted
            autoPlay
            playsInline
            preload="auto"
          />
        ) : (
          <div className="mac-screen-empty" />
        )}
      </div>
    </div>
  )
}

export default function ProductShowcase({ standalone = false }) {
  return (
    <section
      className={`toolkit-section ${standalone ? 'standalone-mode' : ''}`}
      id="products"
      aria-label="Comply2Reg Products"
    >
      <div className="toolkit-container">
        {/* Clean Header: No eyebrows, no dashes */}
        <header className="toolkit-header">
          {/* AskLia Astronaut Overlaying Above & Moving Over the Heading */}
          <div className="toolkit-astronaut-overlay" aria-hidden="true">
            <div className="toolkit-astronaut-mover">
              <div className="toolkit-astronaut-rotator">
                <div className="toolkit-astronaut-bobber">
                  <img
                    src={`${import.meta.env.BASE_URL}images/astronaut.png`}
                    alt="AskLia Astronaut"
                    className="toolkit-astronaut-img"
                  />
                </div>
              </div>
            </div>
          </div>

          <h2 className="toolkit-title">
            Comply2Reg <span className="toolkit-title-accent">Toolkit</span>
          </h2>
          <p className="toolkit-subtitle">
            A unified suite of intelligent compliance tools designed to eliminate regulatory friction.
          </p>
        </header>

        {/* Vertical Alternating Flow: Every product visible as visitors scroll naturally */}
        <div className="toolkit-flow-list">
          {FEATURES.map((feature, index) => {
            const isReversed = index % 2 !== 0

            return (
              <article
                key={feature.id}
                className={`toolkit-row ${isReversed ? 'row-reversed' : ''}`}
                id={`product-${feature.id}`}
              >
                {/* Media Column (macOS Window over the Video/Preview) */}
                <div className="toolkit-media-col">
                  <MacWindowDisplay feature={feature} />
                </div>

                {/* Content Column */}
                <div className="toolkit-info-col">
                  <h3 className="feature-name">{feature.name}</h3>

                  <p className="feature-description">{feature.desc}</p>

                  <div className="feature-points-group">
                    {feature.points.map((pt, i) => (
                      <div key={i} className="feature-point-row">
                        <span className="feature-bullet-dot" aria-hidden="true" />
                        <div className="feature-point-content">
                          <span className="feature-point-title">{pt.title}: </span>
                          <span className="feature-point-desc">{pt.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="feature-cta-box">
                    <button
                      type="button"
                      className="feature-btn-know-more"
                      aria-label={`Know more about ${feature.name}`}
                    >
                      <span>Know more</span>
                      <svg className="feature-btn-arrow" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M1 8a.75.75 0 0 1 .75-.75h10.19L8.47 3.78a.75.75 0 1 1 1.06-1.06l4.75 4.75a.75.75 0 0 1 0 1.06l-4.75 4.75a.75.75 0 1 1-1.06-1.06l3.47-3.47H1.75A.75.75 0 0 1 1 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
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

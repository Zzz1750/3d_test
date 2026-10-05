import { useState, useEffect, useRef } from 'react'
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
    desc: 'Compiles continuous, timestamped evidence dossiers connecting live repository code and controls directly to regulations — ready for supervisory examiners in one click.',
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

// Video Player inside authentic MacBook Pro with active state playback and restart from beginning
function MacBookDisplay({ videoSrc, featureName, isPlaying }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoSrc) return

    video.muted = true

    if (isPlaying) {
      video.currentTime = 0
      video.play().catch(() => {})
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [isPlaying, videoSrc])

  return (
    <div className="macbook-device-wrapper">
      {/* MacBook Screen / Lid */}
      <div className="macbook-lid">
        {/* FaceTime Camera Sensor */}
        <div className="macbook-camera" aria-hidden="true">
          <span className="camera-lens" />
        </div>

        {/* True 16:9 Display Screen */}
        {videoSrc ? (
          <div className="macbook-screen">
            <video
              ref={videoRef}
              className="macbook-video"
              src={videoSrc}
              loop
              muted
              playsInline
              preload="auto"
            />
          </div>
        ) : (
          <div className="macbook-screen macbook-screen-blank" />
        )}
      </div>

      {/* MacBook Base / Bottom Chassis */}
      <div className="macbook-base" aria-hidden="true">
        <div className="macbook-notch" />
      </div>

      {/* Realistic Floor Drop Shadow */}
      <div className="macbook-shadow" aria-hidden="true" />
    </div>
  )
}

export default function ProductShowcase({ standalone = false }) {
  const [progress, setProgress] = useState(0)
  const [isInView, setIsInView] = useState(true)
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let ticking = false

    const updateScrollProgress = () => {
      const rect = track.getBoundingClientRect()
      const totalScrollDist = rect.height - window.innerHeight
      if (totalScrollDist <= 0) return

      // Determine if the track is within the viewport at all
      const inView = rect.bottom > 0 && rect.top < window.innerHeight
      setIsInView(inView)

      const rawProgress = -rect.top / totalScrollDist
      const clamped = Math.max(0, Math.min(1, rawProgress))
      setProgress(clamped)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    updateScrollProgress()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Calculate active product index for top tab indicator
  let activeIndex = -1
  if (isInView && progress >= 0.06 && progress < 0.98) {
    for (let i = 0; i < FEATURES.length; i++) {
      const start = 0.06 + i * 0.18
      const nextStart = i < FEATURES.length - 1 ? 0.06 + (i + 1) * 0.18 : 0.98
      if (progress >= start && progress < nextStart) {
        activeIndex = i
        break
      }
    }
  }

  // Smooth jump to product tab
  const handleTabClick = (index) => {
    const track = trackRef.current
    if (!track) return

    const totalScrollDist = track.offsetHeight - window.innerHeight
    const trackRect = track.getBoundingClientRect()
    const trackTopInDoc = window.scrollY + trackRect.top

    // Midpoint of that product's dwell
    const targetProgress = 0.06 + index * 0.18 + 0.15
    const targetScrollY = trackTopInDoc + targetProgress * totalScrollDist

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    })
  }

  return (
    <section
      ref={trackRef}
      className={`toolkit-scroll-track ${standalone ? 'standalone-mode' : ''}`}
      id="products"
      aria-label="Comply2Reg Toolkit"
    >
      {/* Sticky 100vh Viewport Stage */}
      <div className="toolkit-sticky-stage">

        {/* Floating Top Tabs Navigation (Smoothly fades in once scrolling into products) */}
        <nav
          className="toolkit-tabs-nav"
          aria-label="Product Showcase Navigation"
          style={{
            opacity: progress > 0.04 ? 1 : 0,
            pointerEvents: progress > 0.04 ? 'auto' : 'none'
          }}
        >
          <div className="toolkit-tabs-container">
            {FEATURES.map((feature, i) => {
              const isCurrent = activeIndex === i
              return (
                <button
                  key={feature.id}
                  type="button"
                  className={`toolkit-tab-btn ${isCurrent ? 'active' : ''}`}
                  onClick={() => handleTabClick(i)}
                  aria-label={`Jump to ${feature.name}`}
                  aria-current={isCurrent ? 'true' : undefined}
                >
                  <span className="toolkit-tab-num">0{i + 1}</span>
                  <span className="toolkit-tab-label">{feature.name}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* =========================================================
            SLIDE 0: Heading Presentation (Center text + Chai Mascot)
            ========================================================= */}
        <div
          className="toolkit-slide toolkit-slide-heading"
          style={{ zIndex: 1 }}
        >
          <div className="toolkit-container">
            <div className="toolkit-header">
              <h2 className="toolkit-title">
                Autonomous tools engineered for{' '}
                <span className="toolkit-title-accent">continuous compliance.</span>
              </h2>

              <div className="toolkit-header-mascot" aria-hidden="true">
                <img
                  src={`${import.meta.env.BASE_URL}images/chai.png`}
                  alt="Comply2Reg Mascot with Chai"
                  className="toolkit-mascot-img"
                />
              </div>
            </div>
          </div>

          {/* Gentle scroll indicator hint */}
          <div
            className="toolkit-scroll-hint"
            style={{ opacity: progress > 0.03 ? 0 : 1 }}
            aria-hidden="true"
          >
            <span>Scroll down to explore</span>
            <svg className="scroll-hint-arrow" viewBox="0 0 16 16" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8 1a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V1.75A.75.75 0 0 1 8 1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* =========================================================
            SLIDES 1 to 5: Each product tab glides in from right to left
            ========================================================= */}
        {FEATURES.map((feature, index) => {
          const start = 0.06 + index * 0.18
          const end = start + 0.15

          // Only stop and reset this feature's video when the NEXT feature has completely glided over
          const nextEnd = index < FEATURES.length - 1 ? 0.06 + (index + 1) * 0.18 + 0.15 : 0.98
          const isVideoPlaying = isInView && progress >= start && progress < nextEnd

          let tx = 100
          if (progress >= end) {
            tx = 0
          } else if (progress <= start) {
            tx = 100
          } else {
            const t = (progress - start) / (end - start)
            tx = (1 - t) * 100
          }

          const isReversed = index % 2 === 1
          const isVisible = tx < 100

          return (
            <article
              key={feature.id}
              className="toolkit-slide toolkit-slide-product"
              style={{
                transform: `translate3d(${tx}%, 0, 0)`,
                zIndex: 10 + index,
                visibility: isVisible ? 'visible' : 'hidden'
              }}
              aria-label={`Feature: ${feature.name}`}
            >
              <div className="toolkit-container">
                <div className={`feature-row ${isReversed ? 'is-reversed' : ''}`}>
                  {/* Media Column (MacBook Video / Dummy Display) */}
                  <div className="feature-media-side">
                    <MacBookDisplay
                      videoSrc={feature.videoSrc}
                      featureName={feature.name}
                      isPlaying={isVideoPlaying}
                    />
                  </div>

                  {/* Content Column */}
                  <div className="feature-text-side">
                    <div className="feature-tab-indicator">
                      <span className="feature-tab-tag">0{index + 1} / 05</span>
                    </div>

                    <h3 className="feature-title">{feature.name}</h3>

                    <p className="feature-desc">{feature.desc}</p>

                    {/* Bullet Points */}
                    <div className="feature-points">
                      {feature.points.map((pt, i) => (
                        <div key={i} className="feature-point">
                          <span className="feature-point-bullet" aria-hidden="true" />
                          <div className="feature-point-body">
                            <span className="feature-point-heading">{pt.title}: </span>
                            <span className="feature-point-text">{pt.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Action */}
                    <div className="feature-cta-wrap">
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
                </div>
              </div>
            </article>
          )
        })}

      </div>
    </section>
  )
}

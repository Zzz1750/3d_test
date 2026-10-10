import { useRef } from 'react'
import './BlogStudiesShowcase.css'

export const FEATURED_STUDIES = [
  {
    id: 'fca-gap-analysis',
    title: 'How do I run a compliance gap analysis against FCA rules?',
    category: 'Regulatory Gap Analysis',
    tag: 'FCA & CASS',
    readTime: '6 min read',
    date: 'Sep 2, 2026',
    description: 'How tier-1 institutions map complex FCA rules to real-time controls before examiners arrive...',
    image: `${import.meta.env.BASE_URL}images/blogs/study_gap_analysis.jpg`,
    url: 'https://blog.comply2reg.com/blog/how-do-i-run-a-compliance-gap-analysis-against-fca-rules',
  },
  {
    id: 'hsbc-scam-protection',
    title: 'When Scam Protection Fails: What the HSBC Australia Case Signals',
    category: 'Case Study & Enforcement',
    tag: 'ASIC Penalty',
    readTime: '6 min read',
    date: 'Jun 23, 2026',
    description: 'A $24.6M penalty exposed a critical vulnerability inside real-time payment rails and manual triage...',
    image: `${import.meta.env.BASE_URL}images/blogs/study_hsbc_scam.jpg`,
    url: 'https://blog.comply2reg.com/blog/when-scam-protection-fails-what-the-hsbc-australia-case-really-signals',
  },
  {
    id: 'ai-accountability',
    title: 'AI Accountability Is No Longer a Future Problem',
    category: 'AI Governance & Audits',
    tag: 'EU AI Act',
    readTime: '4 min read',
    date: 'May 11, 2026',
    description: 'What supervisory authorities actually inspect when compliance decisions run on automated AI...',
    image: `${import.meta.env.BASE_URL}images/blogs/study_ai_accountability.jpg`,
    url: 'https://blog.comply2reg.com/blog/ai-accountability-is-no-longer-a-future-problem',
  },
  {
    id: 'fincrime-sanctions',
    title: 'FinCrime & Sanctions Evasion in Real-Time Cross-Border Rails',
    category: 'AML & Sanctions',
    tag: 'FinCEN & FATF',
    readTime: '5 min read',
    date: 'Apr 28, 2026',
    description: 'Sub-second payment settlement created an unexpected blind spot across ISO 20022 message payloads...',
    image: `${import.meta.env.BASE_URL}images/blogs/study_fincrime.jpg`,
    url: 'https://blog.comply2reg.com/blog/fincrime-sanctions-evasion-cross-border-rails',
  },
  {
    id: 'tokenization-capital',
    title: 'Deposit Tokens vs Stablecoins: Regulatory Capital Treatment',
    category: 'Digital Assets',
    tag: 'Basel III / IV',
    readTime: '7 min read',
    date: 'Mar 15, 2026',
    description: 'The critical reserve calculation separating commercial bank deposit tokens from permissionless stablecoins...',
    image: `${import.meta.env.BASE_URL}images/blogs/study_tokenization.jpg`,
    url: 'https://blog.comply2reg.com/blog/deposit-tokens-vs-stablecoins-regulatory-capital',
  },
  {
    id: 'mcp-bank-infra',
    title: 'Model Context Protocol (MCP) in Tier-1 Bank Architectures',
    category: 'AI Engineering',
    tag: 'MCP & Security',
    readTime: '5 min read',
    date: 'Feb 19, 2026',
    description: 'Why engineering leaders are replacing brittle compliance bridges with standardized Model Context Protocols...',
    image: `${import.meta.env.BASE_URL}images/blogs/study_mcp_infra.jpg`,
    url: 'https://blog.comply2reg.com/blog/mcp-tier-1-bank-architectures',
  },
  {
    id: 'bank-merger-it',
    title: 'Post-Merger IT Consolidation & Prudential Capital Adequacy',
    category: 'Prudential Risk',
    tag: 'PRA & Fed',
    readTime: '8 min read',
    date: 'Jan 30, 2026',
    description: 'The hidden data discrepancy that triggered millions in reporting errors during core system integration...',
    image: `${import.meta.env.BASE_URL}images/blogs/study_bank_merger.jpg`,
    url: 'https://blog.comply2reg.com/blog/post-merger-it-consolidation-capital-adequacy',
  },
]

export default function BlogStudiesShowcase() {
  const trackRef = useRef(null)

  const handleScroll = (direction) => {
    const el = trackRef.current
    if (!el) return
    const cardEl = el.querySelector('.blog-card')
    const step = cardEl ? cardEl.offsetWidth + 24 : 380

    if (direction === 'right') {
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 15
      if (isAtEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' })
      }
    } else {
      const isAtStart = el.scrollLeft <= 15
      if (isAtStart) {
        el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' })
      } else {
        el.scrollBy({ left: -step, behavior: 'smooth' })
      }
    }
  }

  const handleCardClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section
      className="blog-showcase-section"
      id="research-studies"
      aria-label="Comply2Reg Research & Regulatory Case Studies"
    >
      <div className="blog-showcase-container">
        {/* Clean Header Matching Previous Layout */}
        <header className="blog-showcase-header">
          <div className="blog-header-content">
            <h2 className="blog-showcase-title">
              Regulatory insights.<br />
              <span className="blog-showcase-title-accent">Not just compliance theory.</span>
            </h2>
            <p className="blog-showcase-subtitle">
              Supervisory enforcement breakdowns, forensic case studies, and engineering frameworks.
            </p>
          </div>

          <a
            href="https://blog.comply2reg.com"
            target="_blank"
            rel="noopener noreferrer"
            className="blog-showcase-cta"
          >
            <span>Visit our blog</span>
            <span className="blog-cta-arrow" aria-hidden="true">→</span>
          </a>
        </header>

        {/* 3-Card Carousel with Left & Right Buttons Flanking the Cards */}
        <div className="blog-carousel-wrapper">
          <button
            type="button"
            className="blog-nav-btn blog-nav-btn-prev"
            onClick={() => handleScroll('left')}
            aria-label="Previous studies"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="blog-cards-track" ref={trackRef}>
            {FEATURED_STUDIES.map((study) => (
              <article
                key={study.id}
                className="blog-card"
                onClick={() => handleCardClick(study.url)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCardClick(study.url)
                }}
              >
                {/* 100% Full Uncropped Image — Zero Crop, Zero Squeeze */}
                <div className="blog-card-media">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="blog-card-img"
                    loading="lazy"
                  />
                </div>

                <div className="blog-card-body">
                  <span className="blog-card-tag">{study.tag}</span>

                  <h3 className="blog-card-title">{study.title}</h3>

                  <p className="blog-card-desc">{study.description}</p>

                  <div className="blog-card-footer">
                    <div className="blog-card-date">
                      <span>{study.date}</span>
                      <span className="blog-dot">·</span>
                      <span>{study.readTime}</span>
                    </div>

                    <span className="blog-card-read">
                      <span>Read study</span>
                      <span className="blog-read-arrow" aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="blog-nav-btn blog-nav-btn-next"
            onClick={() => handleScroll('right')}
            aria-label="Next studies"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

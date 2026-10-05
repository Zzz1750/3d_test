import { useState, useEffect, useRef, useCallback } from 'react'
import './BlogStudiesShowcase.css'

export const BLOG_STUDIES = [
  {
    id: 'fca-gap-analysis',
    title: 'How do I run a compliance gap analysis against FCA rules?',
    category: 'Regulatory Gap Analysis',
    readTime: '6 min read',
    date: 'Sep 2, 2026',
    description: 'A step-by-step framework mapping FCA permissions to technical controls, RACI owners, and automated CASS 15 evidence dossiers.',
    image: `${import.meta.env.BASE_URL}images/blogs/study_gap_analysis.jpg`,
    url: 'https://blog.comply2reg.com/blog/how-do-i-run-a-compliance-gap-analysis-against-fca-rules',
    badge: 'Popular Study'
  },
  {
    id: 'tokenization-finance',
    title: 'Tokenization vs Digitization: What Actually Changes in Finance',
    category: 'Digital Assets & Tokenization',
    readTime: '5 min read',
    date: 'Aug 28, 2026',
    description: 'Tokenization is not just a bond on a blockchain. It is a shared record, embedded transfer rules that travel with the asset, and T+0 atomic settlement.',
    image: `${import.meta.env.BASE_URL}images/blogs/study_tokenization.jpg`,
    url: 'https://blog.comply2reg.com/blog/tokenization-vs-digitization-what-actually-changes-in-finance',
    badge: 'Deep Dive'
  },
  {
    id: 'financial-crime-alerts',
    title: 'The Hidden Cost of Financial Crime: Why Alert Reviews Are the Real Challenge',
    category: 'Financial Crime & AML',
    readTime: '7 min read',
    date: 'Jun 29, 2026',
    description: 'Discover why manual alert reviews—not false positives—are the primary compliance drain, and how specialized AI automates remediation dossiers.',
    image: `${import.meta.env.BASE_URL}images/blogs/study_fincrime.jpg`,
    url: 'https://blog.comply2reg.com/blog/the-hidden-cost-of-financial-crime-compliance-why-alert-reviews-are-becoming-the-real-challenge',
    badge: 'Industry Benchmark'
  },
  {
    id: 'hsbc-scam-protection',
    title: 'When Scam Protection Fails: What the HSBC Australia Case Really Signals',
    category: 'Case Study & Enforcement',
    readTime: '6 min read',
    date: 'Jun 23, 2026',
    description: 'HSBC Australia’s $24.6M penalty exposes structural vulnerabilities in scam protection latency, manual triage, and real-time payment rails.',
    image: `${import.meta.env.BASE_URL}images/blogs/study_hsbc_scam.jpg`,
    url: 'https://blog.comply2reg.com/blog/when-scam-protection-fails-what-the-hsbc-australia-case-really-signals',
    badge: 'Enforcement Analysis'
  },
  {
    id: 'mcp-api-infrastructure',
    title: 'Building AI-Native Compliance Infrastructure with APIs and MCP',
    category: 'Architecture & MCP',
    readTime: '5 min read',
    date: 'Jun 8, 2026',
    description: 'How Model Context Protocol (MCP) and real-time regulatory APIs turn static rulebooks into machine-readable continuous verification.',
    image: `${import.meta.env.BASE_URL}images/blogs/study_mcp_infra.jpg`,
    url: 'https://blog.comply2reg.com/blog/how-comply2reg-is-building-ai-native-compliance-infrastructure-with-apis-and-mcp',
    badge: 'Technical Architecture'
  },
  {
    id: 'ai-accountability',
    title: 'AI Accountability Is No Longer a Future Problem',
    category: 'AI Governance & Audits',
    readTime: '4 min read',
    date: 'May 11, 2026',
    description: 'Regulators now demand strict explainability, audit trails, and human-in-the-loop governance for all automated banking compliance decisions.',
    image: `${import.meta.env.BASE_URL}images/blogs/study_ai_accountability.jpg`,
    url: 'https://blog.comply2reg.com/blog/ai-accountability-is-no-longer-a-future-problem',
    badge: 'Executive Brief'
  },
  {
    id: 'santander-tsb-merger',
    title: 'When Banks Merge, Systems Don’t: What Santander × TSB Really Means',
    category: 'Core Banking Resilience',
    readTime: '8 min read',
    date: 'May 8, 2026',
    description: 'An architectural examination into why banking M&A triggers massive regulatory reporting debt, IT operational risks, and supervisory scrutiny.',
    image: `${import.meta.env.BASE_URL}images/blogs/study_bank_merger.jpg`,
    url: 'https://blog.comply2reg.com/blog/when-banks-merge-systems-dont-what-santander-tsb-really-means',
    badge: 'System Architecture'
  }
]

export default function BlogStudiesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const total = BLOG_STUDIES.length
  const touchStartX = useRef(null)

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total)
  }, [total])

  // Continuous auto-movement every 3.8s, pausing when user hovers or interacts
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total)
    }, 3800)
    return () => clearInterval(timer)
  }, [isPaused, total])

  // Keyboard navigation when hovering or focused
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePrev()
    } else if (e.key === 'ArrowRight') {
      handleNext()
    }
  }

  // Touch swipe support
  const handleTouchStart = (e) => {
    setIsPaused(true)
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    setIsPaused(false)
    if (touchStartX.current === null) return
    const diff = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handlePrev()
      } else {
        handleNext()
      }
    }
    touchStartX.current = null
  }

  const handleCardClick = (index, url) => {
    if (index === activeIndex) {
      // Center card clicked: navigate to live study
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      // Side card clicked: smoothly transition it to the center
      setActiveIndex(index)
    }
  }

  return (
    <section
      className="blog-studies-section"
      id="research-studies"
      aria-label="Comply2Reg Research & Regulatory Case Studies"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="blog-studies-container">
        {/* Section Header */}
        <div className="blog-studies-header">
          <div className="blog-header-content">
            <h2 className="blog-studies-title">
              Regulatory insights.<br />
              <span className="blog-studies-title-accent">Not just compliance theory.</span>
            </h2>
            <p className="blog-studies-subtitle">
              Expert analysis, enforcement breakdowns, and practical frameworks to turn complex circulars into operational certainty.
            </p>
          </div>
        </div>

        {/* 3D Coverflow Carousel Stage */}
        <div
          className="blog-carousel-stage"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Prominent Stage Left Arrow */}
          <button
            type="button"
            className="stage-nav-arrow stage-nav-prev"
            onClick={handlePrev}
            aria-label="Previous study"
            title="Previous (Left Arrow)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Cards Track */}
          <div className="blog-cards-track">
            {BLOG_STUDIES.map((study, idx) => {
              // Calculate circular offset relative to active card
              let offset = idx - activeIndex
              if (offset > total / 2) offset -= total
              if (offset < -total / 2) offset += total

              const isActive = offset === 0
              const isVisible = Math.abs(offset) <= 2

              let positionClass = 'hidden'
              if (isActive) positionClass = 'active'
              else if (offset === -1) positionClass = 'prev'
              else if (offset === 1) positionClass = 'next'
              else if (offset === -2) positionClass = 'outer-prev'
              else if (offset === 2) positionClass = 'outer-next'

              return (
                <article
                  key={study.id}
                  className={`blog-study-card ${positionClass}`}
                  onClick={() => handleCardClick(idx, study.url)}
                  role="button"
                  tabIndex={isActive ? 0 : -1}
                  aria-label={`${study.title} - ${study.category}`}
                  aria-hidden={!isVisible}
                >
                  {/* Uncropped 4CRisk-Style Thumbnail Image Header */}
                  <div className="card-thumb-wrap">
                    <img
                      src={study.image}
                      alt={study.title}
                      className="card-thumb-img"
                      loading="lazy"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="card-body-wrap">
                    <div className="card-meta-row">
                      <span className="card-category-tag">{study.category}</span>
                      <span className="card-read-time-pill">{study.readTime}</span>
                    </div>

                    <h3 className="card-study-title" title={study.title}>
                      {study.title}
                    </h3>

                    <p className="card-study-desc">
                      {study.description}
                    </p>

                    <div className="card-action-footer">
                      <span className="card-read-cta">
                        {isActive ? 'Read Full Study' : 'View Study'}
                        <svg className="cta-arrow-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Prominent Stage Right Arrow */}
          <button
            type="button"
            className="stage-nav-arrow stage-nav-next"
            onClick={handleNext}
            aria-label="Next study"
            title="Next (Right Arrow)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Carousel Pagination Indicator & Direct Link */}
        <div className="carousel-bottom-strip">
          <div className="carousel-dots" role="tablist" aria-label="Study pagination">
            {BLOG_STUDIES.map((study, idx) => (
              <button
                key={study.id}
                type="button"
                className={`carousel-dot ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to slide ${idx + 1}: ${study.title}`}
                role="tab"
                aria-selected={idx === activeIndex}
              />
            ))}
          </div>

          <a
            href="https://blog.comply2reg.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="explore-all-blogs-link"
          >
            <span>Explore all 26+ research papers on <strong>blog.comply2reg.com</strong></span>
            <svg viewBox="0 0 20 20" fill="currentColor" className="external-link-arrow">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

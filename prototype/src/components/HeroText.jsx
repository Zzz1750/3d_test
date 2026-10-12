import { Link } from 'react-router-dom'
import './HeroText.css'

export default function HeroText({
  title,
  subtitle = "Our proprietary Small Language Model and agents map every rule to policies and controls, close gaps, preserve evidence, hosted securely, human-approved.",
  demoLink = "/demo",
  onHowItWorks
}) {
  const handleHowItWorks = () => {
    if (onHowItWorks) {
      onHowItWorks()
      return
    }
    const el = document.getElementById('use-cases') || document.getElementById('compliance-flow')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="hero-headline-container">
      {/* Clean Minimal Hero Headline */}
      <h1 className="hero-headline">
        {title || (
          <>
            Regulatory change. Simplified.<br />
            <span className="hero-headline-sub">Agentic AI, inside your bank.</span>
          </>
        )}
      </h1>

      {/* Clean Sub-copy */}
      {subtitle && <p className="hero-subtext">{subtitle}</p>}

      {/* Action Buttons */}
      <div className="hero-actions">
        <Link to={demoLink} style={{ textDecoration: 'none' }}>
          <button className="btn-demo-primary" type="button">
            <img
              src={`${import.meta.env.BASE_URL}images/icon.png`}
              alt=""
              className="demo-icon"
            />
            <span>Book a demo</span>
          </button>
        </Link>

        <button
          className="btn-how-it-works"
          type="button"
          onClick={handleHowItWorks}
          aria-label="How it works"
        >
          <svg
            className="play-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>How it works</span>
        </button>
      </div>
    </div>
  )
}

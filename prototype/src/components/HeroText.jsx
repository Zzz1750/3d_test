import { Link } from 'react-router-dom'
import './HeroText.css'

export default function HeroText({
  title = "AI-Powered Compliance for Banks & Fintechs",
  subtitle = "Eliminate manual regulatory tracking. Map circulars directly to internal controls and achieve complete audit readiness in 60–90 days.",
  demoLink = "/demo",
  onHowItWorks
}) {
  const handleHowItWorks = () => {
    if (onHowItWorks) {
      onHowItWorks()
      return
    }
    const el = document.getElementById('problem-statement')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="hero-headline-container">
      {/* Original Headline */}
      <h1 className="hero-headline">
        AI-Powered Compliance<br />
        <span className="hero-headline-sub">for Banks &amp; Fintechs</span>
      </h1>

      {/* Original Subtitle */}
      {subtitle && <p className="hero-subtext">{subtitle}</p>}

      {/* Clean Buttons Only */}
      <div className="hero-actions">
        <Link to={demoLink} style={{ textDecoration: 'none' }}>
          <button className="btn-demo-primary" type="button">
            <img
              src={`${import.meta.env.BASE_URL}images/icon.png`}
              alt=""
              className="demo-icon"
            />
            <span>Book a Demo</span>
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

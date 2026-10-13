import { Link } from 'react-router-dom'
import './HeroText.css'

export default function HeroText({
  title,
  subtitle = "Our proprietary Small Language Model and agents map every rule to policies and controls, close gaps, preserve evidence, hosted securely, human-approved.",
  demoLink = "/demo",
  onUseCases,
  onHowItWorks,
}) {
  const handleUseCases = () => {
    const callback = onUseCases || onHowItWorks
    if (callback) {
      callback()
      return
    }
    const el = document.getElementById('use-cases')
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
            Regulatory change. <span className="hero-headline-accent">Simplified.</span><br />
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
          className="btn-use-cases"
          type="button"
          onClick={handleUseCases}
          aria-label="Use cases"
        >
          <svg
            className="use-cases-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <span>Use cases</span>
        </button>
      </div>
    </div>
  )
}

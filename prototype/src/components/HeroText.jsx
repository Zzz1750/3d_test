import { Link } from 'react-router-dom'
import './HeroText.css'

export default function HeroText({
  title = "AI-Powered Compliance Solution",
  subtitle = "Turn regulatory chaos into continuous compliance. Automate audits and stay audit-ready in real time.",
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
      <h1 className="hero-headline">{title}</h1>
      {subtitle && <p className="hero-subtext">{subtitle}</p>}
      <div className="hero-actions">
        <Link to={demoLink} style={{ textDecoration: 'none' }}>
          <button className="btn-demo" type="button">
            <img
              src={`${import.meta.env.BASE_URL}images/icon.png`}
              alt=""
              className="demo-icon"
            />
            <span>Demo</span>
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


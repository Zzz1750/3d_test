import { Link } from 'react-router-dom'
import './ContactCTA.css'

export default function ContactCTA() {
  return (
    <section className="contact-cta-section" id="contact" aria-label="Contact and Call to Action">
      <div className="contact-cta-container">
        {/* Balanced 2-line title: Line 1 black, Line 2 blue */}
        <h2 className="cta-title">
          Ready to get started?<br />
          <span className="cta-title-accent">See Comply2Reg in action.</span>
        </h2>

        {/* Clean, well-proportioned description */}
        <p className="cta-subtitle">
          Schedule a walkthrough tailored to your institution, or connect directly with our engineering team.
        </p>

        {/* Paired Actions: Book a demo + Email us */}
        <div className="cta-actions">
          <Link to="/demo" className="cta-btn-primary">
            <img
              src={`${import.meta.env.BASE_URL}images/icon.png`}
              alt=""
              className="cta-btn-icon"
            />
            <span>Book a demo</span>
          </Link>

          <a
            href="mailto:talk2us@comply2reg.com"
            className="cta-btn-secondary"
            title="talk2us@comply2reg.com"
          >
            <svg
              className="cta-mail-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span>Email us</span>
          </a>
        </div>
      </div>
    </section>
  )
}

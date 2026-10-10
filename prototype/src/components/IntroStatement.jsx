import './IntroStatement.css'

export default function IntroStatement() {
  return (
    <section className="intro-statement-section">
      {/* AskLia Mascot on the left corner */}
      <div className="intro-screen-left-img">
        <img
          src={`${import.meta.env.BASE_URL}images/smile1.png`}
          alt="AskLia Mascot"
          className="intro-mascot-img"
        />
      </div>

      <div className="intro-statement-container">
        {/* Intro Text */}
        <div className="intro-statement-wrapper">
          <h2 className="intro-statement-text">
            <span className="intro-text-bold">
              AI-Powered Regulatory Compliance Made Simple.
            </span>{' '}
            <span className="intro-text-muted">
              Automate compliance, track regulatory changes, and reduce risk with an intelligent RegTech platform.
            </span>
          </h2>
        </div>
      </div>
    </section>
  )
}

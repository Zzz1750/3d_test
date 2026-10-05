import './IntroStatement.css'

export default function IntroStatement() {
  return (
    <section className="intro-statement-section">
      <div className="intro-statement-container">
        {/* AskLia Mascot on the left */}
        <div className="intro-screen-left-img">
          <img
            src={`${import.meta.env.BASE_URL}images/smile1.png`}
            alt="AskLia Mascot"
            className="intro-mascot-img"
          />
        </div>

        {/* Intro Paragraph text */}
        <div className="intro-statement-wrapper">
          <p className="intro-paragraph">
            <span className="intro-bold">AI-Powered Regulatory Compliance Made Simple.</span>{' '}
            Automate compliance, track regulatory changes, and reduce risk with an intelligent RegTech platform.
          </p>
        </div>
      </div>
    </section>
  )
}

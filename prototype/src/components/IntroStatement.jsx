import './IntroStatement.css'

export default function IntroStatement() {
  return (
    <section className="intro-statement-section">
      {/* AskLia Mascot on the left corner (Visible on desktop, removed on mobile) */}
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
              Agentic AI for regulatory compliance.
            </span>{' '}
            <span className="intro-text-muted">
              Comply2Reg reads every rule change, maps it to your controls, closes the gaps and keeps the evidence inside your bank.
            </span>
          </h2>
        </div>
      </div>
    </section>
  )
}

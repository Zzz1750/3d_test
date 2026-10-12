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
              Comply2Reg turns regulatory change into action.
            </span>{' '}
            <span className="intro-text-muted">
              Our agentic AI helps banks track new rules, identify compliance gaps and stay audit-ready.
            </span>
          </h2>
        </div>
      </div>
    </section>
  )
}

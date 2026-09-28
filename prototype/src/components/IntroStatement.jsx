import './IntroStatement.css'

export default function IntroStatement() {
  return (
    <section className="intro-statement-section">
      {/* Mascot stuck to the left side of the screen */}
      <div className="intro-screen-left-img">
        <img
          src={`${import.meta.env.BASE_URL}images/hi.png`}
          alt="Comply2Reg Mascot"
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
    </section>
  )
}

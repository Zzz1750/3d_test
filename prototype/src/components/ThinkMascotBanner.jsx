import './ThinkMascotBanner.css'

export default function ThinkMascotBanner() {
  return (
    <div className="think-mascot-transition-wrapper" aria-hidden="true">
      <div className="think-mascot-container">
        <div className="think-mascot-badge-wrap">
          <img
            src={`${import.meta.env.BASE_URL}images/think.png`}
            alt="AskLia Thinking"
            className="think-mascot-img"
          />
        </div>
      </div>
    </div>
  )
}

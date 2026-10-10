import './LoadingScreen.css'

export default function LoadingScreen({ progress, isLoaded }) {
  return (
    <div className={`loading-overlay ${isLoaded ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-logo-wrap">
          <img
            src={`${import.meta.env.BASE_URL}images/logo.png`}
            alt="Comply2Reg"
            className="loading-logo"
          />
        </div>

        <div className="loading-progress-container">
          <div className="loading-bar-track">
            <div
              className="loading-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="loading-status-row">
            <span className="loading-status-text">Prototype Version 0.3.9</span>
            <span className="loading-percentage">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

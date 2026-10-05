import { useState } from 'react'
import './RegulatoryTicker.css'

const FRAMEWORKS = [
  "FCA Rules",
  "PRA Standards",
  "Consumer Duty",
  "FSMA 2000",
  "UK GDPR",
  "MiFID II",
  "Basel 3.1",
  "T+1 Settlement",
  "DORA",
  "MiFIR",
  "CRD IV",
  "PSD2",
  "EMIR",
  "CSDR",
  "AIFMD",
  "UCITS",
  "SEC Rules",
  "FINRA",
  "Dodd-Frank",
  "SOX",
  "BSA/AML",
  "GLBA",
  "FCPA",
  "CFTC"
]

export default function RegulatoryTicker() {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <div
      className="regulatory-ticker-bar"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Supported Regulatory Frameworks: We Handle These All"
    >
      {/* Left Badge: Mention that we handle these all */}
      <div className="ticker-badge">
        <span className="ticker-badge-text">WE HANDLE</span>
      </div>

      <div className="ticker-viewport">
        <div className={`ticker-track ${isPaused ? 'paused' : ''}`}>
          {/* Double items for smooth infinite loop */}
          {[...FRAMEWORKS, ...FRAMEWORKS].map((framework, index) => (
            <div key={`${framework}-${index}`} className="ticker-framework-pill">
              <span className="ticker-framework-name">{framework}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ticker-edge-fade-left" aria-hidden="true" />
      <div className="ticker-edge-fade-right" aria-hidden="true" />
    </div>
  )
}

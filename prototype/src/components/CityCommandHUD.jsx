import { useState, useEffect, useRef } from 'react'
import './CityCommandHUD.css'

export const CITY_STATIONS = [
  {
    id: 'regpulse',
    code: '01',
    label: 'RegPulse',
    role: 'Monitor Regulatory Change',
    coords: { x: '39%', y: '36%' },
    explanation: 'Monitor Regulatory Change',
    input: 'Regulatory updates across jurisdictions and regulators',
    output: 'Relevant changes, classified and prioritised'
  },
  {
    id: 'regulens',
    code: '02',
    label: 'ReguLens',
    role: 'Assess Regulatory Impact',
    coords: { x: '24%', y: '50%' },
    explanation: 'Assess Regulatory Impact',
    input: 'Regulations + internal policies + business context',
    output: 'Applicable requirements across entities, products and business units'
  },
  {
    id: 'gapanalyser',
    code: '03',
    label: 'Gap Analyser',
    role: 'Identify Compliance Gaps',
    coords: { x: '58%', y: '46%' },
    explanation: 'Identify Compliance Gaps',
    input: 'Applicable requirements + internal policies and controls',
    output: 'Policy, process and control gaps requiring remediation'
  },
  {
    id: 'auditgeniee',
    code: '04',
    label: 'AuditGeniee',
    role: 'Evidence Compliance',
    coords: { x: '67%', y: '60%' },
    zoomedCoords: { x: '42%', y: '54%' },
    explanation: 'Evidence Compliance',
    input: 'Requirements + actions + supporting evidence',
    output: 'Audit-ready reports and a complete evidence trail',
    flow: ['Requirements', 'Actions', 'Evidence', 'Reports', 'Audit Trail']
  },
  {
    id: 'asklia',
    code: '05',
    label: 'AskLia',
    role: 'Orchestrate Compliance',
    coords: { x: '56%', y: '30%' },
    explanation: 'Orchestrate Compliance',
    input: 'Regulations + policies + controls + compliance context',
    output: 'Contextual insights, decisions and actions across the platform',
    flow: ['Ask', 'Analyse', 'Recommend', 'Act']
  }
]

// Subtle tactile audio feedback using native Web Audio API
function playTactileFeedback(freq = 560, type = 'sine', duration = 0.07) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(0.03, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {
    // Non-critical audio
  }
}

export default function CityCommandHUD({
  speed = 1.0,
  onSpeedChange,
  isLoaded = true
}) {
  const [activeStationId, setActiveStationId] = useState(null)
  const [isZoomingOut, setIsZoomingOut] = useState(false)

  // Listen for zoom-out complete event from 3D camera controller
  useEffect(() => {
    const handleZoomOutComplete = () => {
      setIsZoomingOut(false)
    }
    window.addEventListener('city-zoom-out-complete', handleZoomOutComplete)
    return () => window.removeEventListener('city-zoom-out-complete', handleZoomOutComplete)
  }, [])

  // Safety fallback timer for zoom-out transition
  useEffect(() => {
    let timer = null
    if (isZoomingOut) {
      timer = setTimeout(() => {
        setIsZoomingOut(false)
      }, 1200)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isZoomingOut])

  // Listen for Escape key to close the station HUD and reset camera
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeStationId) {
        setActiveStationId(null)
        setIsZoomingOut(true)
        window.dispatchEvent(new CustomEvent('city-focus-station', { detail: { stationId: null } }))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeStationId])

  const handleStationClick = (id) => {
    playTactileFeedback(480, 'sine', 0.05)
    setActiveStationId((prev) => {
      const nextId = prev === id ? null : id
      if (!nextId) {
        setIsZoomingOut(true)
      } else {
        setIsZoomingOut(false)
      }
      window.dispatchEvent(new CustomEvent('city-focus-station', { detail: { stationId: nextId } }))
      return nextId
    })
  }

  const handleClose = () => {
    setActiveStationId(null)
    setIsZoomingOut(true)
    window.dispatchEvent(new CustomEvent('city-focus-station', { detail: { stationId: null } }))
  }

  const activeStation = CITY_STATIONS.find((s) => s.id === activeStationId)

  return (
    <div className="city-command-hud-root" aria-label="3D Interactive Ecosystem Controller">

      {/* Calm & Minimal 3D Landmark Tags (Hidden while zooming out until camera settles) */}
      <div className={`hud-beacons-plane ${isZoomingOut ? 'zooming-out' : ''}`} aria-hidden={isZoomingOut}>
        {!isZoomingOut && CITY_STATIONS.map((station) => {
          const isActive = activeStationId === station.id

          // When zoomed in, ONLY show that particular active station tag!
          if (activeStationId && !isActive) return null

          const coords = (isActive && station.zoomedCoords) ? station.zoomedCoords : station.coords

          return (
            <div
              key={station.id}
              className={`hud-beacon ${isActive ? 'active' : ''}`}
              style={{ left: coords?.x || '50%', top: coords?.y || '50%' }}
              onClick={() => handleStationClick(station.id)}
              role="button"
              tabIndex={0}
              aria-label={`Select ${station.label}`}
            >
              <div className="beacon-header-row">
                <span className="beacon-num">{station.code}</span>
                <span className="beacon-title">{station.label}</span>
              </div>
              {station.role && (
                <span className="beacon-role">{station.role}</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Calm, Minimal Station Detail Card */}
      {activeStation && (
        <div className="hud-detail-card" role="dialog" aria-label={`${activeStation.label} Details`}>
          <div className="detail-card-header">
            <div className="detail-header-left">
              <span className="detail-badge">{activeStation.code}</span>
              <div>
                <h4 className="detail-title">{activeStation.label}</h4>
                <p className="detail-subtitle">{activeStation.role || activeStation.explanation}</p>
              </div>
            </div>
            <button
              type="button"
              className="detail-close-btn"
              onClick={handleClose}
              aria-label="Close details"
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>

          <div className="detail-card-body">
            <div className="detail-section">
              <span className="detail-section-label">Input</span>
              <p className="detail-section-text">{activeStation.input}</p>
            </div>

            <div className="detail-section">
              <span className="detail-section-label">Output</span>
              <p className="detail-section-text">{activeStation.output}</p>
            </div>

            {activeStation.flow && (
              <div className="detail-section">
                <span className="detail-section-label">Flow</span>
                <div className="detail-flow-chain">
                  {(Array.isArray(activeStation.flow)
                    ? activeStation.flow
                    : activeStation.flow.split('→').map((s) => s.trim())
                  ).map((step, idx, arr) => (
                    <span key={idx} className="detail-flow-item">
                      <span className="detail-flow-step">{step}</span>
                      {idx < arr.length - 1 && (
                        <span className="detail-flow-sep" aria-hidden="true">→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Interactive Dock: Brand Tagline */}
      <div className="hud-bottom-dock">
        <div className="hero-bottom-right-tag">
          Connected <strong>Compliance</strong>
        </div>
      </div>
    </div>
  )
}


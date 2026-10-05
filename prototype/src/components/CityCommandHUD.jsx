import { useState, useEffect, useRef } from 'react'
import './CityCommandHUD.css'

export const CITY_STATIONS = [
  {
    id: 'regpulse',
    label: 'RegPulse',
    code: '01',
    role: 'Horizon Scanning',
    coords: { x: '41%', y: '37%' },
    headline: 'Real-Time Horizon Scanning',
    summary: 'Continuously monitors 50+ global regulators, instantly deconstructing dense circulars into atomic compliance obligations.',
    points: [
      'Surfaces urgent circulars across RBI, SEBI, MAS & FCA within minutes',
      'Classifies statutory mandates vs advisory notices in under 90 seconds'
    ]
  },
  {
    id: 'regulens',
    label: 'ReguLens',
    code: '02',
    role: 'Applicability Engine',
    coords: { x: '24%', y: '50%' },
    headline: 'Entity Applicability Engine',
    summary: 'Directly evaluates incoming circulars against your institution’s licenses, product verticals, and core banking technology.',
    points: [
      'Eliminates 80%+ of non-applicable circulars to remove false-positive noise',
      'Pinpoints exact exposure across affected entities, APIs, and payment rails'
    ]
  },
  {
    id: 'gapanalyser',
    label: 'Gap Analyser',
    code: '03',
    role: 'Task Orchestration',
    coords: { x: '63%', y: '47%' },
    headline: 'Task Orchestration & Audit',
    summary: 'Transforms legal compliance mandates into trackable operational work items and instant supervisory examination proof.',
    points: [
      'Auto-generates structured Jira and ServiceNow tickets with clear RACI ownership',
      'Compiles 1-click immutable audit dossiers connecting code directly to regulation'
    ]
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
  const autoCloseTimerRef = useRef(null)

  // Auto-close station telemetry and zoom out after 8 seconds
  useEffect(() => {
    if (activeStationId) {
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current)
      autoCloseTimerRef.current = setTimeout(() => {
        setActiveStationId(null)
        window.dispatchEvent(new CustomEvent('city-focus-station', { detail: { stationId: null } }))
      }, 8000)
    } else {
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current)
    }

    return () => {
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current)
    }
  }, [activeStationId])

  // Listen for Escape key to close the station HUD and reset camera
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeStationId) {
        setActiveStationId(null)
        window.dispatchEvent(new CustomEvent('city-focus-station', { detail: { stationId: null } }))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeStationId])

  const handleStationClick = (id) => {
    playTactileFeedback(480, 'sine', 0.06)
    setActiveStationId((prev) => {
      const nextId = prev === id ? null : id
      window.dispatchEvent(new CustomEvent('city-focus-station', { detail: { stationId: nextId } }))
      return nextId
    })
  }

  const handleClose = () => {
    setActiveStationId(null)
    window.dispatchEvent(new CustomEvent('city-focus-station', { detail: { stationId: null } }))
  }

  const activeStation = CITY_STATIONS.find((s) => s.id === activeStationId)

  return (
    <div className="city-command-hud-root" aria-label="3D Interactive Ecosystem Controller">

      {/* Interactive 3D Landmark Beacons placed over the scene */}
      <div className="hud-beacons-plane" aria-hidden="false">
        {CITY_STATIONS.map((station) => {
          const isActive = activeStationId === station.id

          // When zoomed in, ONLY show that particular active station tag!
          if (activeStationId && !isActive) return null

          return (
            <div
              key={station.id}
              className={`hud-beacon ${isActive ? 'active' : ''}`}
              style={{ left: station.coords?.x || '50%', top: station.coords?.y || '50%' }}
              onClick={() => handleStationClick(station.id)}
            >
              <div className="beacon-radar-ring" />
              <div className="beacon-pin">
                <span className="beacon-num">{station.code}</span>
              </div>
              <div className="beacon-label-tag">
                <span className="beacon-name">{station.label}</span>
                {station.role && <span className="beacon-role">{station.role}</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Floating Glass Detail HUD Card (When Station is Selected) */}
      {activeStation && (
        <div className="hud-telemetry-card" role="dialog" aria-label={`${activeStation.label} Feature Details`}>
          {/* 8-Second Animated Border Timer Line (visual only, no text) */}
          <div className="telemetry-card-border-timer" key={activeStationId} aria-hidden="true" />

          <div className="telemetry-card-header">
            <div className="telemetry-station-titles">
              <span className="telemetry-station-badge">{activeStation.code}</span>
              <h4 className="telemetry-station-name">{activeStation.label}</h4>
            </div>
            <button
              type="button"
              className="telemetry-close-btn"
              onClick={handleClose}
              aria-label="Close feature details"
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>

          <h5 className="telemetry-card-headline">{activeStation.headline}</h5>
          <p className="telemetry-card-desc">{activeStation.summary}</p>

          <ul className="telemetry-bullets">
            {activeStation.points.map((pt, idx) => (
              <li key={idx} className="telemetry-bullet-item">
                {pt}
              </li>
            ))}
          </ul>
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


import { useState, useEffect, useRef } from 'react'
import './CityCommandHUD.css'

export const CITY_STATIONS = [
  {
    id: 'regpulse',
    code: '01',
    label: 'RegPulse',
    role: 'Monitor Regulatory Change',
    tagline: 'Monitors global regulatory updates and flags affected policies and controls on day of issue.',
    coords: { x: '39%', y: '36%' },
    explanation: 'Monitor Regulatory Change',
    inputs: [
      'Regulatory updates & circulars',
      'Global jurisdictional rules'
    ],
    input: 'Regulatory updates across jurisdictions and regulators',
    output: 'Relevant changes, classified and prioritised by impact'
  },
  {
    id: 'regulens',
    code: '02',
    label: 'ReguLens',
    role: 'Assess Regulatory Impact',
    tagline: 'Maps complex regulatory obligations directly across entities, products, and internal policies.',
    coords: { x: '24%', y: '50%' },
    explanation: 'Assess Regulatory Impact',
    inputs: [
      'Regulatory obligations & rules',
      'Internal policies & business context'
    ],
    input: 'Regulations + internal policies + business context',
    output: 'Applicable requirements across entities, products and business units'
  },
  {
    id: 'gapanalyser',
    code: '03',
    label: 'Gap Analyser',
    role: 'Identify Compliance Gaps',
    tagline: 'Continuously evaluates internal controls against applicable obligations to surface compliance gaps.',
    coords: { x: '58%', y: '46%' },
    explanation: 'Identify Compliance Gaps',
    inputs: [
      'Applicable requirements',
      'Internal policies & control registers'
    ],
    input: 'Applicable requirements + internal policies and controls',
    output: 'Policy, process and control gaps requiring remediation'
  },
  {
    id: 'auditgeniee',
    code: '04',
    label: 'AuditGeniee',
    role: 'Evidence Compliance',
    tagline: 'Automatically aggregates tamper-proof evidence and generates audit-ready inspection packs.',
    coords: { x: '67%', y: '60%' },
    zoomedCoords: { x: '42%', y: '54%' },
    explanation: 'Evidence Compliance',
    inputs: [
      'Obligation requirements',
      'Actions & supporting evidence'
    ],
    input: 'Requirements + actions + supporting evidence',
    output: 'Audit-ready reports and complete immutable evidence trail',
    flow: ['Requirements', 'Actions', 'Evidence', 'Reports', 'Audit Trail']
  },
  {
    id: 'asklia',
    code: '05',
    label: 'AskLia',
    role: 'Orchestrate Compliance',
    tagline: 'AI compliance copilot that reasons across regulations, controls, and telemetry to orchestrate remediation.',
    coords: { x: '56%', y: '30%' },
    explanation: 'Orchestrate Compliance',
    inputs: [
      'Regulations & internal policies',
      'Controls & platform telemetry'
    ],
    input: 'Regulations + policies + controls + compliance context',
    output: 'Contextual insights, decisions and automated platform actions',
    flow: ['Ask', 'Analyse', 'Recommend', 'Act']
  }
]

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
              <div>
                <h4 className="detail-title">{activeStation.label}</h4>
                <p className="detail-subtitle">
                  {activeStation.tagline || activeStation.role || activeStation.explanation}
                </p>
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

          {/* Architecture Input / Feature / Output Stage */}
          <div className="hud-diagram-stage">
            {/* Top Inputs */}
            <div className="hud-diagram-inputs-row">
              <div className="hud-diagram-input-col">
                <div className="hud-diagram-chip input-chip">
                  <span className="hud-chip-label">Input</span>
                  <span className="hud-chip-value">
                    {(activeStation.inputs && activeStation.inputs[0]) || activeStation.input}
                  </span>
                </div>
                <div className="hud-connector-line top-line" aria-hidden="true" />
              </div>

              <div className="hud-diagram-input-col">
                <div className="hud-diagram-chip input-chip">
                  <span className="hud-chip-label">Input</span>
                  <span className="hud-chip-value">
                    {(activeStation.inputs && activeStation.inputs[1]) || 'Internal policies & context'}
                  </span>
                </div>
                <div className="hud-connector-line top-line" aria-hidden="true" />
              </div>
            </div>

            {/* Feature Center Pill */}
            <div className="hud-feature-box" title={activeStation.label}>
              <span className="hud-feature-title">{activeStation.label}</span>
            </div>

            {/* Bottom Connector Line */}
            <div className="hud-connector-line bottom-line" aria-hidden="true" />

            {/* Bottom Output */}
            <div className="hud-diagram-output-wrap">
              <div className="hud-diagram-chip output-chip">
                <span className="hud-chip-label output-label">Output</span>
                <span className="hud-chip-value output-value">{activeStation.output}</span>
              </div>
            </div>
          </div>

          {activeStation.flow && (
            <div className="detail-flow-section">
              <span className="detail-flow-label">Execution flow</span>
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


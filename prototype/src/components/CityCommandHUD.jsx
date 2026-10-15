import { useState, useEffect } from 'react'
import './CityCommandHUD.css'

const CITY_STATIONS = [
  {
    id: 'regpulse',
    code: '01',
    label: 'RegPulse',
    role: 'Monitor Regulatory Change',
    coords: {
      desktop: { x: '39%', y: '36%' },
      tablet: { x: '43%', y: '39%' },
      mobile: { x: '38%', y: '38%' }
    }
  },
  {
    id: 'regulens',
    code: '02',
    label: 'ReguLens',
    role: 'Assess Regulatory Impact',
    coords: {
      desktop: { x: '24%', y: '50%' },
      tablet: { x: '29%', y: '55%' },
      mobile: { x: '22%', y: '56%' }
    }
  },
  {
    id: 'gapanalyser',
    code: '03',
    label: 'Gap Analyser',
    role: 'Identify Compliance Gaps',
    coords: {
      desktop: { x: '58%', y: '46%' },
      tablet: { x: '53%', y: '49%' },
      mobile: { x: '56%', y: '50%' }
    }
  },
  {
    id: 'auditgeniee',
    code: '04',
    label: 'AuditGeniee',
    role: 'Evidence Compliance',
    coords: {
      desktop: { x: '67%', y: '60%' },
      tablet: { x: '64%', y: '62%' },
      mobile: { x: '73%', y: '63%' }
    }
  },
  {
    id: 'asklia',
    code: '05',
    label: 'AskLia',
    role: 'Orchestrate Compliance',
    coords: {
      desktop: { x: '56%', y: '30%' },
      tablet: { x: '50%', y: '30%' },
      mobile: { x: '50%', y: '29%' }
    }
  }
]

function getDeviceMode() {
  if (typeof window === 'undefined') return 'desktop'
  if (window.innerWidth <= 640) return 'mobile'
  if (window.innerWidth <= 1080) return 'tablet'
  return 'desktop'
}

export default function CityCommandHUD() {
  const [deviceMode, setDeviceMode] = useState(getDeviceMode)

  useEffect(() => {
    const handleResize = () => setDeviceMode(getDeviceMode())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="city-command-hud-root" aria-label="3D Interactive Ecosystem Controller">
      {/* Calm & Minimal 3D Landmark Tags */}
      <div className="hud-beacons-plane">
        {CITY_STATIONS.map((station) => {
          const pos = station.coords[deviceMode] || station.coords.desktop
          return (
            <div
              key={station.id}
              className={`hud-beacon beacon-${deviceMode}`}
              style={{ left: pos.x, top: pos.y }}
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

      {/* Bottom Interactive Dock: Brand Tagline */}
      <div className="hud-bottom-dock">
        <div className="hero-bottom-right-tag">
          Connected <strong>Compliance</strong>
        </div>
      </div>
    </div>
  )
}

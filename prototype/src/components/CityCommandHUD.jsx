import './CityCommandHUD.css'

const CITY_STATIONS = [
  {
    id: 'regpulse',
    code: '01',
    label: 'RegPulse',
    role: 'Monitor Regulatory Change',
    coords: { x: '39%', y: '36%' }
  },
  {
    id: 'regulens',
    code: '02',
    label: 'ReguLens',
    role: 'Assess Regulatory Impact',
    coords: { x: '24%', y: '50%' }
  },
  {
    id: 'gapanalyser',
    code: '03',
    label: 'Gap Analyser',
    role: 'Identify Compliance Gaps',
    coords: { x: '58%', y: '46%' }
  },
  {
    id: 'auditgeniee',
    code: '04',
    label: 'AuditGeniee',
    role: 'Evidence Compliance',
    coords: { x: '67%', y: '60%' }
  },
  {
    id: 'asklia',
    code: '05',
    label: 'AskLia',
    role: 'Orchestrate Compliance',
    coords: { x: '56%', y: '30%' }
  }
]

export default function CityCommandHUD() {
  return (
    <div className="city-command-hud-root" aria-label="3D Interactive Ecosystem Controller">
      {/* Calm & Minimal 3D Landmark Tags */}
      <div className="hud-beacons-plane">
        {CITY_STATIONS.map((station) => (
          <div
            key={station.id}
            className="hud-beacon"
            style={{ left: station.coords?.x || '50%', top: station.coords?.y || '50%' }}
          >
            <div className="beacon-header-row">
              <span className="beacon-title">{station.label}</span>
            </div>
            {station.role && (
              <span className="beacon-role">{station.role}</span>
            )}
          </div>
        ))}
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

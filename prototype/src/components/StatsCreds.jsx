import './StatsCreds.css'

export default function StatsCreds() {
  const stats = [
    { value: '10', label: 'Global Jurisdictions' },
    { value: '25+', label: 'Regulatory Bodies' },
    { value: '24/7', label: 'Monitoring Engine' },
  ]

  return (
    <aside className="stats-creds-container" aria-label="Key Metrics">
      {stats.map((stat, idx) => (
        <div key={idx} className="stat-item">
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </aside>
  )
}

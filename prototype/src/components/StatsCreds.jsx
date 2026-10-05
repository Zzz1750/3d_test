import './StatsCreds.css'

export default function StatsCreds() {
  const stats = [
    { value: '60–90d', label: 'Audit-Ready Timeline' },
    { value: '50+', label: 'Global Regulators' },
    { value: '70%', label: 'Less Overhead' }
  ]

  return (
    <aside className="stats-creds-container" aria-label="Key Proof Metrics">
      {stats.map((stat, idx) => (
        <div key={idx} className="stat-minimal-item">
          <div className="stat-minimal-value">{stat.value}</div>
          <div className="stat-minimal-label">{stat.label}</div>
        </div>
      ))}
    </aside>
  )
}

import './StatsCreds.css'

export default function StatsCreds() {
  const stats = [
    { value: '10×', label: 'Rule Ownership' },
    { value: '8×', label: 'Audit Evidence' },
    { value: '100%', label: 'Evidenced Gaps' }
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

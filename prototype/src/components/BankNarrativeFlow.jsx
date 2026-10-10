import { useState, useEffect, useRef } from 'react'
import './BankNarrativeFlow.css'

// Clean 90-Degree Orthogonal Conduit Path
function getOrthogonalPath(x0, y0, xMid, x1, y1) {
  return `M ${x0} ${y0} L ${xMid} ${y0} L ${xMid} ${y1} L ${x1} ${y1}`
}

// Deterministic position along a 90-degree orthogonal path for progress p in [0, 1]
function getOrthogonalPoint(p, x0, y0, xMid, x1, y1) {
  const l1 = Math.abs(xMid - x0)
  const l2 = Math.abs(y1 - y0)
  const l3 = Math.abs(x1 - xMid)
  const total = l1 + l2 + l3
  const d = Math.max(0, Math.min(1, p)) * total

  if (d <= l1) {
    return { x: x0 + d, y: y0 }
  } else if (d <= l1 + l2) {
    const dy = d - l1
    const sign = y1 > y0 ? 1 : -1
    return { x: xMid, y: y0 + sign * dy }
  } else {
    const dx = d - l1 - l2
    return { x: xMid + dx, y: y1 }
  }
}

export default function BankNarrativeFlow() {
  const [time, setTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const sectionRef = useRef(null)
  const reqRef = useRef(null)
  const lastTimeRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio === 0) {
          setIsPlaying(false)
        } else {
          setIsPlaying(true)
        }
      },
      { threshold: [0, 0.01] }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      if (reqRef.current) cancelAnimationFrame(reqRef.current)
    }
  }, [])

  useEffect(() => {
    if (!isPlaying) {
      if (reqRef.current) cancelAnimationFrame(reqRef.current)
      lastTimeRef.current = null
      return
    }

    const loop = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const delta = (timestamp - lastTimeRef.current) / 1000
      lastTimeRef.current = timestamp

      setTime((prev) => (prev + delta) % 600)
      reqRef.current = requestAnimationFrame(loop)
    }

    reqRef.current = requestAnimationFrame(loop)
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current)
    }
  }, [isPlaying])

  // Coordinates
  const trunkX = 440
  const c2rIntakeTarget = { x: 620, y: 350 }
  const c2rOutputTarget = { x: 780, y: 350 }
  const bankerRightTarget = { x: 972, y: 350 }
  const outputMidX = 868

  // Y-coordinates of all 8 stream cards
  const streamY = {
    node1: 76,
    node2: 156,
    node3: 236,
    node4: 316,
    node5: 396,
    node6: 476,
    digitalAssets: 608,
    alternativeData: 690
  }

  // Outflow delivery animation from Comply2Reg to Banker
  const OUTFLOW_CYCLE = 2.4
  const OUTFLOW_FLIGHT = 1.6
  const cycleTime = time % OUTFLOW_CYCLE
  const outflowProgress = cycleTime < OUTFLOW_FLIGHT ? cycleTime / OUTFLOW_FLIGHT : -1
  const isStamping = cycleTime >= OUTFLOW_FLIGHT && cycleTime < (OUTFLOW_FLIGHT + 0.6)

  // Document renderer along orthogonal lines
  const renderMovingDoc = (progress, x0, y0, xMid, x1, y1, isDigital = false) => {
    if (progress < 0 || progress > 1) return null
    const { x, y } = getOrthogonalPoint(progress, x0, y0, xMid, x1, y1)

    return (
      <g transform={`translate(${x}, ${y})`} filter="url(#card-soft-shadow)">
        {isDigital ? (
          <g>
            <rect x="-12" y="-15" width="24" height="30" rx="3.5" fill="#eff6ff" stroke="#0070f3" strokeWidth="2" />
            <circle cx="-4" cy="-6" r="3" fill="#0070f3" />
            <line x1="-7" y1="2" x2="4" y2="2" stroke="#0070f3" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="-7" y1="7" x2="2" y2="7" stroke="#0070f3" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <rect x="-11" y="-14" width="22" height="28" rx="3" fill="#ffffff" stroke="#0f172a" strokeWidth="1.8" />
            <line x1="-6" y1="-6" x2="4" y2="-6" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="-6" y1="-1" x2="6" y2="-1" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="-6" y1="4" x2="3" y2="4" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="-6" y1="9" x2="-1" y2="9" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        )}
      </g>
    )
  }

  return (
    <section ref={sectionRef} className="flow-section" id="compliance-flow">
      <div className="flow-container">

        {/* Clear Contextual Header */}
        <div className="flow-header">
          <h2 className="flow-title">
            Why Banking Compliance Breaks Down: <span className="flow-title-accent">The Data Deluge</span>
          </h2>
          <p className="flow-subtitle">
            Banks receive high-speed feeds across payment rails, markets, and 24/7 digital assets into 40-year-old core systems. Comply2Reg unifies the chaos and delivers clean, verified compliance records directly to your team.
          </p>
        </div>

        {/* Unified Stage */}
        <div className="flow-stage-card">

          <svg
            className="unified-flow-svg"
            viewBox="0 0 1340 798"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="card-soft-shadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.04" />
              </filter>
              <filter id="c2r-glow-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#0070f3" floodOpacity="0.22" />
              </filter>
              <filter id="badge-soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* ==============================================================
                1. DATA PIPELINES (All feeds route into Comply2Reg, then to Banker)
                ============================================================== */}
            <g className="pipelines-c2r-layer">
              {/* Feeder Lines from Left Cards into Vertical Trunk */}
              <line x1="360" y1={streamY.node1} x2={trunkX} y2={streamY.node1} className="pipe-wire line-streaming" />
              <line x1="360" y1={streamY.node2} x2={trunkX} y2={streamY.node2} className="pipe-wire line-streaming" />
              <line x1="360" y1={streamY.node3} x2={trunkX} y2={streamY.node3} className="pipe-wire line-streaming" />
              <line x1="360" y1={streamY.node4} x2={trunkX} y2={streamY.node4} className="pipe-wire line-streaming" />
              <line x1="360" y1={streamY.node5} x2={trunkX} y2={streamY.node5} className="pipe-wire line-ondemand" />
              <line x1="360" y1={streamY.node6} x2={trunkX} y2={streamY.node6} className="pipe-wire line-batch" />
              <line x1="360" y1={streamY.digitalAssets} x2={trunkX} y2={streamY.digitalAssets} className="pipe-wire digital-line-surge" />
              <line x1="360" y1={streamY.alternativeData} x2={trunkX} y2={streamY.alternativeData} className="pipe-wire digital-line-surge" />

              {/* Vertical Trunk Backbone */}
              <line x1={trunkX} y1={streamY.node1} x2={trunkX} y2={streamY.alternativeData} className="pipe-wire line-trunk" />

              {/* Inflow line from Trunk into Comply2Reg Logo */}
              <line x1={trunkX} y1={c2rIntakeTarget.y} x2={c2rIntakeTarget.x} y2={c2rIntakeTarget.y} className="pipe-wire c2r-intake" />

              {/* Junction Dots */}
              <circle cx={trunkX} cy={streamY.node1} r="3.5" fill="#0070f3" />
              <circle cx={trunkX} cy={streamY.node2} r="3.5" fill="#0070f3" />
              <circle cx={trunkX} cy={streamY.node3} r="3.5" fill="#0070f3" />
              <circle cx={trunkX} cy={streamY.node4} r="3.5" fill="#0070f3" />
              <circle cx={trunkX} cy={streamY.node5} r="3.5" fill="#0070f3" />
              <circle cx={trunkX} cy={streamY.node6} r="3.5" fill="#0070f3" />
              <circle cx={trunkX} cy={streamY.digitalAssets} r="3.5" fill="#0070f3" />
              <circle cx={trunkX} cy={streamY.alternativeData} r="3.5" fill="#0070f3" />
              <circle cx={trunkX} cy={c2rIntakeTarget.y} r="4" fill="#0070f3" />

              {/* Outflow line from Comply2Reg to Banker on the right */}
              <path
                className="pipe-wire c2r-slow-flow"
                d={getOrthogonalPath(c2rOutputTarget.x, c2rOutputTarget.y, outputMidX, bankerRightTarget.x, bankerRightTarget.y)}
              />
            </g>

            {/* ==============================================================
                2. CONTINUOUS FLYING DOCUMENTS
                ============================================================== */}
            <g className="moving-docs-c2r">
              {/* Documents streaming from data feeds into Comply2Reg */}
              {renderMovingDoc((time % 1.6) / 1.6, 360, streamY.node1, trunkX, c2rIntakeTarget.x, c2rIntakeTarget.y)}
              {renderMovingDoc(((time + 0.5) % 1.6) / 1.6, 360, streamY.node3, trunkX, c2rIntakeTarget.x, c2rIntakeTarget.y)}
              {renderMovingDoc(((time + 1.0) % 1.6) / 1.6, 360, streamY.node5, trunkX, c2rIntakeTarget.x, c2rIntakeTarget.y)}
              {renderMovingDoc(((time + 0.3) % 1.5) / 1.5, 360, streamY.digitalAssets, trunkX, c2rIntakeTarget.x, c2rIntakeTarget.y, true)}
              {renderMovingDoc(((time + 0.8) % 1.5) / 1.5, 360, streamY.alternativeData, trunkX, c2rIntakeTarget.x, c2rIntakeTarget.y, true)}

              {/* Verified document with Comply2Reg logo delivered to Banker */}
              {outflowProgress >= 0 && outflowProgress <= 1 && (
                (() => {
                  const pt = getOrthogonalPoint(outflowProgress, c2rOutputTarget.x, c2rOutputTarget.y, outputMidX, bankerRightTarget.x, bankerRightTarget.y)
                  return (
                    <g transform={`translate(${pt.x}, ${pt.y})`} filter="url(#card-soft-shadow)">
                      <path
                        d="M -18 -26 L 10 -26 L 18 -18 L 18 26 L -18 26 Z"
                        fill="#ffffff"
                        stroke="#0070f3"
                        strokeWidth="2"
                      />
                      <path d="M 10 -26 L 10 -18 L 18 -18 Z" fill="#eff6ff" stroke="#0070f3" strokeWidth="1.5" />
                      <image
                        href={`${import.meta.env.BASE_URL}images/logo2.svg`}
                        x="-12"
                        y="-20"
                        width="24"
                        height="24"
                      />
                      <line x1="-12" y1="7" x2="12" y2="7" stroke="#0070f3" strokeWidth="2" strokeLinecap="round" />
                      <line x1="-12" y1="13" x2="8" y2="13" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
                      <line x1="-12" y1="18" x2="4" y2="18" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
                    </g>
                  )
                })()
              )}
            </g>

            {/* ==============================================================
                3. ALL 8 SOURCES ON LEFT (Always fully visible)
                ============================================================== */}
            <g className="sources-group">
              {/* Heading: Core Banking Data */}
              <g transform="translate(30, 22)">
                <text x="2" y="2" fontFamily="var(--font-sans)" fontSize="11.5" fontWeight="700" fill="#94a3b8" letterSpacing="0.08em">
                  CORE BANKING DATA
                </text>
              </g>

              {/* Node 1: Payment Rails */}
              <g transform="translate(30, 40)" filter="url(#card-soft-shadow)">
                <rect x="0" y="0" width="330" height="72" rx="15" fill="#ffffff" fillOpacity="0.96" stroke="#e2e8f0" strokeWidth="1.2" />
                <text x="22" y="30" fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" fill="#0f172a">Payment rails</text>
                <text x="308" y="30" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12.5" fontStyle="italic" fill="#0070f3">~ every second</text>
                <text x="22" y="53" fontFamily="var(--font-sans)" fontSize="12.5" fill="#64748b">cards, SWIFT, instant pay · ISO 20022</text>
              </g>

              {/* Node 2: Markets */}
              <g transform="translate(30, 120)" filter="url(#card-soft-shadow)">
                <rect x="0" y="0" width="330" height="72" rx="15" fill="#ffffff" fillOpacity="0.96" stroke="#e2e8f0" strokeWidth="1.2" />
                <text x="22" y="30" fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" fill="#0f172a">Markets & Exchanges</text>
                <text x="308" y="30" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12.5" fontStyle="italic" fill="#0070f3">~ millisecond</text>
                <text x="22" y="53" fontFamily="var(--font-sans)" fontSize="12.5" fill="#64748b">exchanges, price & rate feeds · FIX</text>
              </g>

              {/* Node 3: Customers */}
              <g transform="translate(30, 200)" filter="url(#card-soft-shadow)">
                <rect x="0" y="0" width="330" height="72" rx="15" fill="#ffffff" fillOpacity="0.96" stroke="#e2e8f0" strokeWidth="1.2" />
                <text x="22" y="30" fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" fill="#0f172a">Customers & KYC</text>
                <text x="308" y="30" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12.5" fontStyle="italic" fill="#0070f3">~ all day</text>
                <text x="22" y="53" fontFamily="var(--font-sans)" fontSize="12.5" fill="#64748b">apps, web, branches · video KYC</text>
              </g>

              {/* Node 4: Devices & Channels */}
              <g transform="translate(30, 280)" filter="url(#card-soft-shadow)">
                <rect x="0" y="0" width="330" height="72" rx="15" fill="#ffffff" fillOpacity="0.96" stroke="#e2e8f0" strokeWidth="1.2" />
                <text x="22" y="30" fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" fill="#0f172a">Devices & channels</text>
                <text x="308" y="30" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12.5" fontStyle="italic" fill="#0070f3">~ every second</text>
                <text x="22" y="53" fontFamily="var(--font-sans)" fontSize="12.5" fill="#64748b">phone, browser, ATM, POS · event logs</text>
              </g>

              {/* Node 5: Open Banking & Credit */}
              <g transform="translate(30, 360)" filter="url(#card-soft-shadow)">
                <rect x="0" y="0" width="330" height="72" rx="15" fill="#ffffff" fillOpacity="0.96" stroke="#e2e8f0" strokeWidth="1.2" />
                <text x="22" y="30" fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" fill="#0f172a">Open banking & credit</text>
                <text x="308" y="30" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12.5" fontStyle="italic" fill="#0070f3">~ on consent</text>
                <text x="22" y="53" fontFamily="var(--font-sans)" fontSize="12.5" fill="#64748b">other banks' data · JSON APIs · XBRL</text>
              </g>

              {/* Node 6: Watchlists & Regulators */}
              <g transform="translate(30, 440)" filter="url(#card-soft-shadow)">
                <rect x="0" y="0" width="330" height="72" rx="15" fill="#ffffff" fillOpacity="0.96" stroke="#e2e8f0" strokeWidth="1.2" />
                <text x="22" y="30" fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" fill="#0f172a">Watchlists & Regulators</text>
                <text x="308" y="30" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12.5" fontStyle="italic" fill="#0070f3">~ any hour</text>
                <text x="22" y="53" fontFamily="var(--font-sans)" fontSize="12.5" fill="#64748b">sanctions, PEPs · rules, consultations</text>
              </g>

              {/* Heading: New Digital Assets & Alt Data */}
              <g transform="translate(30, 556)">
                <text x="2" y="2" fontFamily="var(--font-sans)" fontSize="11.5" fontWeight="700" fill="#94a3b8" letterSpacing="0.08em">
                  NEW DIGITAL ASSETS & ALT DATA
                </text>
              </g>

              {/* Node 7: Digital Assets */}
              <g transform="translate(30, 572)" filter="url(#card-soft-shadow)">
                <rect x="0" y="0" width="330" height="72" rx="15" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.4" />
                <text x="22" y="30" fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" fill="#0070f3">Digital assets</text>
                <text x="308" y="30" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12.5" fontWeight="600" fill="#0070f3">~ 24/7, no weekends</text>
                <text x="22" y="53" fontFamily="var(--font-sans)" fontSize="12.5" fill="#475569">chains, custodians, VASPs · Travel Rule</text>
              </g>

              {/* Node 8: Alternative Data */}
              <g transform="translate(30, 654)" filter="url(#card-soft-shadow)">
                <rect x="0" y="0" width="330" height="72" rx="15" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.4" />
                <text x="22" y="30" fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" fill="#0070f3">Alternative data</text>
                <text x="308" y="30" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12.5" fontWeight="600" fill="#0070f3">~ daily to weekly</text>
                <text x="22" y="53" fontFamily="var(--font-sans)" fontSize="12.5" fill="#475569">satellite, weather, ESG, news · APIs</text>
              </g>

              {/* Speed Legend — Bottom-Right Corner */}
              <g transform="translate(1155, 680)">
                <text x="0" y="0" fontFamily="var(--font-sans)" fontSize="15" fontWeight="700" fill="#94a3b8" letterSpacing="0.04em">how fast it arrives:</text>

                <line x1="0" y1="24" x2="36" y2="24" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                <text x="46" y="29" fontFamily="var(--font-sans)" fontSize="15" fontWeight="500" fill="#64748b">streaming</text>

                <line x1="0" y1="56" x2="36" y2="56" stroke="#94a3b8" strokeWidth="2.8" strokeDasharray="6 4" strokeLinecap="round" />
                <text x="46" y="61" fontFamily="var(--font-sans)" fontSize="15" fontWeight="500" fill="#64748b">batch</text>

                <line x1="0" y1="88" x2="36" y2="88" stroke="#94a3b8" strokeWidth="2.8" strokeDasharray="2 5" strokeLinecap="round" />
                <text x="46" y="93" fontFamily="var(--font-sans)" fontSize="15" fontWeight="500" fill="#64748b">on consent</text>
              </g>
            </g>

            {/* ==============================================================
                4. COMPLY2REG LOGO IN THE MIDDLE (Always present)
                ============================================================== */}
            <g transform="translate(625, 275)" className="c2r-hero-group" filter="url(#c2r-glow-shadow)">
              <rect x="-5" y="-5" width="160" height="160" rx="32" fill="#ffffff" />
              <image
                href={`${import.meta.env.BASE_URL}images/logo2.svg`}
                x="20"
                y="20"
                width="120"
                height="120"
              />
            </g>

            {/* ==============================================================
                5. THE BANKER ON THE RIGHT (Always at final position 950px, 180px)
                ============================================================== */}
            <g
              className="banker-master-group"
              style={{
                transform: 'translate(950px, 180px)'
              }}
            >
              {/* Table Surface */}
              <line x1="20" y1="185" x2="310" y2="185" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
              <line x1="45" y1="185" x2="45" y2="235" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              <line x1="285" y1="185" x2="285" y2="235" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />

              {/* "THE BANK" Badge */}
              <g transform="translate(160, -12)">
                <rect x="-60" y="-14" width="120" height="28" rx="14" fill="#0f172a" />
                <text x="0" y="4" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="12.5" fontWeight="700" fill="#ffffff" letterSpacing="0.08em">THE BANK</text>
              </g>

              {/* Banker Robot Character (Removed - left empty) */}
              <g
                className="banker-character banker-robot-sticker"
                style={{
                  transform: isStamping ? 'translateY(3px)' : 'translateY(0)',
                  transition: 'transform 0.14s ease'
                }}
              >
                {/* Placeholder / empty for now */}
              </g>

              {/* Coffee Mug */}
              <g className="coffee-upright">
                <path d="M 254 150 Q 251 144 255 138" stroke="#94a3b8" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7" />
                <path d="M 263 151 Q 266 145 262 139" stroke="#94a3b8" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7" />
                <path d="M 272 163 C 283 163, 283 180, 272 180" fill="none" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />
                <rect x="246" y="156" width="26" height="29" rx="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2.4" />
                <line x1="248" y1="170" x2="270" y2="170" stroke="#0070f3" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Comply2Reg Clean Verified Stack on Desk */}
              <g className="desk-stack-layer">
                <g className="c2r-desk-stack">
                  {[0, 1, 2, 3].map((i) => {
                    const isTop = i === 3
                    const yPos = 175 - i * 7.5
                    const rotation = (i % 2 === 0 ? 1 : -1) * 1.5
                    return (
                      <g key={i} transform={`rotate(${rotation} 45 ${yPos})`} filter="url(#card-soft-shadow)">
                        <rect
                          x="22"
                          y={yPos}
                          width="52"
                          height="20"
                          rx="3.5"
                          fill="#ffffff"
                          stroke="#0070f3"
                          strokeWidth="1.6"
                        />
                        {isTop && (
                          <image
                            href={`${import.meta.env.BASE_URL}images/logo2.svg`}
                            x="26"
                            y={yPos + 2.5}
                            width="15"
                            height="15"
                          />
                        )}
                        <line x1={isTop ? "45" : "28"} y1={yPos + 7} x2="68" y2={yPos + 7} stroke="#0070f3" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1={isTop ? "45" : "28"} y1={yPos + 13} x2="64" y2={yPos + 13} stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
                      </g>
                    )
                  })}
                </g>
              </g>

              {/* Stamp Pop Feedback: Verified Green Checkmark */}
              {isStamping && (
                <g className="stamp-pop-badge">
                  <g className="banker-badge-tick" filter="url(#badge-soft-shadow)">
                    <circle cx="0" cy="0" r="16.5" fill="#10b981" stroke="#ffffff" strokeWidth="2.8" />
                    <path
                      d="M -6.8 0.5 L -2 5.3 L 7.5 -4.8"
                      stroke="#ffffff"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </g>
                </g>
              )}

              {/* Legacy Core Ledger */}
              <g transform="translate(30, 200)">
                <rect x="0" y="0" width="260" height="46" rx="12" fill="#f8fafc" fillOpacity="0.95" stroke="#e2e8f0" strokeWidth="1.2" />
                <text x="130" y="20" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="13.5" fontWeight="600" fill="#0f172a">Legacy Core Ledger (1983)</text>
                <text x="130" y="36" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="12" fill="#64748b">+ 40 years of patched systems</text>
              </g>
            </g>

          </svg>

        </div>

      </div>
    </section>
  )
}

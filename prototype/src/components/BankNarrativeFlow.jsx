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

// 8 Mobile Data Sources & Individual Conduit Paths
const mobileSources = [
  // Left column (4 sources)
  {
    side: 'left',
    idx: 0,
    title: 'Payment rails',
    yCard: 5,
    yExit: 19,
    channelX: 172,
    curveY: 152,
    portX: 154,
    isDigital: false,
    cycle: 2.8,
    offset: 0.0,
    lineStyle: 'line-streaming'
  },
  {
    side: 'left',
    idx: 1,
    title: 'Customers & KYC',
    yCard: 42,
    yExit: 56,
    channelX: 175,
    curveY: 156,
    portX: 164,
    isDigital: false,
    cycle: 3.2,
    offset: 1.1,
    lineStyle: 'line-streaming'
  },
  {
    side: 'left',
    idx: 2,
    title: 'Open banking & credit',
    yCard: 79,
    yExit: 93,
    channelX: 178,
    curveY: 160,
    portX: 174,
    isDigital: false,
    cycle: 3.5,
    offset: 2.0,
    lineStyle: 'line-consent'
  },
  {
    side: 'left',
    idx: 3,
    title: 'Digital assets',
    yCard: 116,
    yExit: 130,
    channelX: 181,
    curveY: 164,
    portX: 184,
    isDigital: true,
    cycle: 2.6,
    offset: 0.7,
    lineStyle: 'line-digital'
  },
  // Right column (4 sources)
  {
    side: 'right',
    idx: 0,
    title: 'Markets & Exchanges',
    yCard: 5,
    yExit: 19,
    channelX: 208,
    curveY: 152,
    portX: 226,
    isDigital: false,
    cycle: 2.7,
    offset: 1.4,
    lineStyle: 'line-streaming'
  },
  {
    side: 'right',
    idx: 1,
    title: 'Devices & channels',
    yCard: 42,
    yExit: 56,
    channelX: 205,
    curveY: 156,
    portX: 216,
    isDigital: false,
    cycle: 3.0,
    offset: 0.4,
    lineStyle: 'line-streaming'
  },
  {
    side: 'right',
    idx: 2,
    title: 'Watchlists & Regulators',
    yCard: 79,
    yExit: 93,
    channelX: 202,
    curveY: 160,
    portX: 206,
    isDigital: false,
    cycle: 3.6,
    offset: 2.2,
    lineStyle: 'line-batch'
  },
  {
    side: 'right',
    idx: 3,
    title: 'Alternative data',
    yCard: 116,
    yExit: 130,
    channelX: 199,
    curveY: 164,
    portX: 196,
    isDigital: true,
    cycle: 3.4,
    offset: 1.6,
    lineStyle: 'line-digital-alt'
  }
]

function getMobileConduitPath(s) {
  const xStart = s.side === 'left' ? 168 : 212
  return `M ${xStart} ${s.yExit} L ${s.channelX} ${s.yExit} L ${s.channelX} ${s.curveY} C ${s.channelX} ${s.curveY + 6}, ${s.portX} ${s.curveY + 6}, ${s.portX} 176`
}

function getMobilePoint(s, prog) {
  const xStart = s.side === 'left' ? 168 : 212
  const l1 = Math.abs(s.channelX - xStart)
  const l2 = Math.abs(s.curveY - s.yExit)
  const l3 = Math.sqrt(Math.pow(s.portX - s.channelX, 2) + Math.pow(176 - s.curveY, 2))
  const total = l1 + l2 + l3
  const d = Math.max(0, Math.min(1, prog)) * total

  if (d <= l1) {
    const t = d / (l1 || 1)
    return { x: xStart + t * (s.channelX - xStart), y: s.yExit }
  } else if (d <= l1 + l2) {
    const t = (d - l1) / (l2 || 1)
    return { x: s.channelX, y: s.yExit + t * (s.curveY - s.yExit) }
  } else {
    const t = (d - l1 - l2) / (l3 || 1)
    const p0x = s.channelX, p0y = s.curveY
    const p1x = s.channelX, p1y = s.curveY + 6
    const p2x = s.portX, p2y = 176
    const x = (1 - t) * (1 - t) * p0x + 2 * (1 - t) * t * p1x + t * t * p2x
    const y = (1 - t) * (1 - t) * p0y + 2 * (1 - t) * t * p1y + t * t * p2y
    return { x, y }
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
  const cardRightX = 364
  const trunkX = 436
  const c2rIntakeTarget = { x: 620, y: 370 }
  const c2rOutputTarget = { x: 780, y: 370 }
  const bankerRightTarget = { x: 960, y: 370 }
  const outputMidX = 868

  // Y-coordinates of all 8 stream cards
  const streamY = {
    node1: 78,
    node2: 156,
    node3: 234,
    node4: 312,
    node5: 390,
    node6: 468,
    digitalAssets: 588,
    alternativeData: 666
  }

  // Outflow delivery animation from Comply2Reg to Banker
  const OUTFLOW_CYCLE = 2.4
  const OUTFLOW_FLIGHT = 1.6
  const cycleTime = time % OUTFLOW_CYCLE
  const outflowProgress = cycleTime < OUTFLOW_FLIGHT ? cycleTime / OUTFLOW_FLIGHT : -1
  const isStamping = cycleTime >= OUTFLOW_FLIGHT && cycleTime < (OUTFLOW_FLIGHT + 0.6)

  // Clean, consistent document icon in white or Comply2Reg blue (no texts, no other colors)
  const renderDocIcon = (type = 'paper', scale = 1, rotation = 0) => (
    <g transform={`rotate(${rotation}) scale(${scale})`}>
      {type === 'digital' ? (
        <g>
          <rect x="-11" y="-14" width="22" height="28" rx="3.5" fill="#eff6ff" stroke="#0070f3" strokeWidth="1.8" />
          <circle cx="-4" cy="-6" r="2.8" fill="#0070f3" />
          <line x1="-7" y1="2" x2="5" y2="2" stroke="#0070f3" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="-7" y1="7" x2="2" y2="7" stroke="#0070f3" strokeWidth="1.5" strokeLinecap="round" />
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

  // Document renderer along orthogonal lines with random rotations and chaotic jumps
  const renderMovingDoc = (progress, x0, y0, xMid, x1, y1, isDigital = false, baseRot = 0, jumpAmount = 10) => {
    if (progress < 0 || progress > 1) return null
    const { x, y } = getOrthogonalPoint(progress, x0, y0, xMid, x1, y1)

    // Dynamic rotation: individual random base angle + gentle in-flight flutter
    const flightRot = baseRot + Math.sin(progress * Math.PI * 4) * 4

    // Gentle hop and micro-jitter
    const hop = Math.sin(progress * Math.PI * 2) * jumpAmount
    const jitter = Math.sin(progress * 8) * 1.2

    // Segment lengths to apply hop perpendicular to motion
    const l1 = Math.abs(xMid - x0)
    const l2 = Math.abs(y1 - y0)
    const total = l1 + l2 + Math.abs(x1 - xMid)
    const d = progress * total

    let offsetX = 0
    let offsetY = 0

    if (d <= l1) {
      // Horizontal feeder from card: jump vertically
      offsetY = hop + jitter
    } else if (d <= l1 + l2) {
      // Vertical trunk: jump horizontally off the line
      offsetX = hop + jitter
    } else {
      // Horizontal intake into Comply2Reg: jump vertically
      offsetY = hop + jitter
    }

    // Smooth suction into the logo at intake
    let scale = 1
    let opacity = 1
    if (progress > 0.90) {
      const p = (progress - 0.90) / 0.10
      scale = 1 - p * 0.3
      opacity = 1 - p * 0.85
      offsetX *= (1 - p)
      offsetY *= (1 - p)
    }

    return (
      <g
        transform={`translate(${x + offsetX}, ${y + offsetY}) scale(${scale})`}
        filter="url(#card-soft-shadow)"
        opacity={opacity}
      >
        {renderDocIcon(isDigital ? 'digital' : 'paper', 1, flightRot)}
      </g>
    )
  }

  // Multi-source streams with calmed pacing and unique rotation/hop
  const incomingStreams = [
    { y: streamY.node1, cycle: 3.6, offset: 0.0, isDigital: false, rot: -12, jump: 7 },
    { y: streamY.node1, cycle: 3.6, offset: 1.8, isDigital: true, rot: 10, jump: -6 },
    { y: streamY.node2, cycle: 3.0, offset: 0.5, isDigital: true, rot: 12, jump: -8 },
    { y: streamY.node2, cycle: 3.0, offset: 2.0, isDigital: false, rot: -10, jump: 6 },
    { y: streamY.node3, cycle: 3.8, offset: 0.3, isDigital: false, rot: -14, jump: 8 },
    { y: streamY.node3, cycle: 3.8, offset: 2.2, isDigital: false, rot: 11, jump: -7 },
    { y: streamY.node4, cycle: 3.2, offset: 0.8, isDigital: true, rot: 12, jump: -6 },
    { y: streamY.node4, cycle: 3.2, offset: 2.4, isDigital: false, rot: -10, jump: 7 },
    { y: streamY.node5, cycle: 4.0, offset: 1.0, isDigital: false, rot: -12, jump: 8 },
    { y: streamY.node6, cycle: 3.4, offset: 0.4, isDigital: false, rot: 14, jump: -7 },
    { y: streamY.node6, cycle: 3.4, offset: 2.1, isDigital: false, rot: -8, jump: 6 },
    { y: streamY.digitalAssets, cycle: 3.2, offset: 0.6, isDigital: true, rot: -14, jump: 8 },
    { y: streamY.digitalAssets, cycle: 3.2, offset: 2.2, isDigital: true, rot: 12, jump: -6 },
    { y: streamY.alternativeData, cycle: 4.2, offset: 1.2, isDigital: false, rot: 10, jump: -7 },
  ]

  return (
    <section ref={sectionRef} className="flow-section" id="compliance-flow">
      <div className="flow-container">

        {/* Clear Contextual Header */}
        <div className="flow-header">
          <h2 className="flow-title">
            The data deluge. <br /> <span className="flow-title-accent">Why banking compliance breaks down. </span>
          </h2>
          <p className="flow-subtitle">

          </p>
        </div>

        {/* Unified Desktop Stage (Strictly Preserved for Desktop) */}
        <div className="flow-stage-card flow-desktop-stage">

          <svg
            className="unified-flow-svg"
            viewBox="0 0 1340 760"
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
              <line x1={cardRightX} y1={streamY.node1} x2={trunkX} y2={streamY.node1} className="pipe-wire line-streaming" />
              <line x1={cardRightX} y1={streamY.node2} x2={trunkX} y2={streamY.node2} className="pipe-wire line-streaming" />
              <line x1={cardRightX} y1={streamY.node3} x2={trunkX} y2={streamY.node3} className="pipe-wire line-streaming" />
              <line x1={cardRightX} y1={streamY.node4} x2={trunkX} y2={streamY.node4} className="pipe-wire line-streaming" />
              <line x1={cardRightX} y1={streamY.node5} x2={trunkX} y2={streamY.node5} className="pipe-wire line-ondemand" />
              <line x1={cardRightX} y1={streamY.node6} x2={trunkX} y2={streamY.node6} className="pipe-wire line-batch" />
              <line x1={cardRightX} y1={streamY.digitalAssets} x2={trunkX} y2={streamY.digitalAssets} className="pipe-wire digital-line-surge" />
              <line x1={cardRightX} y1={streamY.alternativeData} x2={trunkX} y2={streamY.alternativeData} className="pipe-wire digital-line-surge" />

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
              {/* Flow streaming from all 8 sources with random rotations and chaotic jumps */}
              {incomingStreams.map((s, idx) => {
                const prog = ((time + s.offset) % s.cycle) / s.cycle
                return (
                  <g key={`stream-${idx}`}>
                    {renderMovingDoc(prog, cardRightX, s.y, trunkX, c2rIntakeTarget.x, c2rIntakeTarget.y, s.isDigital, s.rot, s.jump)}
                  </g>
                )
              })}

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
              <g transform="translate(24, 24)">
                <text x="2" y="2" fontFamily="var(--font-sans)" fontSize="12" fontWeight="700" fill="#94a3b8" letterSpacing="0.08em">
                  CORE BANKING DATA
                </text>
              </g>

              {/* Node 1: Payment Rails */}
              <g transform="translate(24, 44)" filter="url(#card-soft-shadow)">
                <rect x="0" y="0" width="340" height="68" rx="14" fill="#ffffff" fillOpacity="0.96" stroke="#e2e8f0" strokeWidth="1.2" />
                <text x="18" y="28" fontFamily="var(--font-sans)" fontSize="14.5" fontWeight="600" fill="#0f172a">Payment rails</text>
                <text x="322" y="28" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12" fontStyle="italic" fill="#0070f3">~ every second</text>
                <text x="18" y="52" fontFamily="var(--font-sans)" fontSize="13.5" fill="#64748b">cards, SWIFT, instant pay · ISO 20022</text>
              </g>

              {/* Node 2: Markets */}
              <g transform="translate(24, 122)" filter="url(#card-soft-shadow)">
                <rect x="0" y="0" width="340" height="68" rx="14" fill="#ffffff" fillOpacity="0.96" stroke="#e2e8f0" strokeWidth="1.2" />
                <text x="18" y="28" fontFamily="var(--font-sans)" fontSize="14.5" fontWeight="600" fill="#0f172a">Markets & Exchanges</text>
                <text x="322" y="28" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12" fontStyle="italic" fill="#0070f3">~ millisecond</text>
                <text x="18" y="52" fontFamily="var(--font-sans)" fontSize="13.5" fill="#64748b">exchanges, price & rate feeds · FIX</text>
              </g>

              {/* Node 3: Customers */}
              <g transform="translate(24, 200)" filter="url(#card-soft-shadow)">
                <rect x="0" y="0" width="340" height="68" rx="14" fill="#ffffff" fillOpacity="0.96" stroke="#e2e8f0" strokeWidth="1.2" />
                <text x="18" y="28" fontFamily="var(--font-sans)" fontSize="14.5" fontWeight="600" fill="#0f172a">Customers & KYC</text>
                <text x="322" y="28" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12" fontStyle="italic" fill="#0070f3">~ all day</text>
                <text x="18" y="52" fontFamily="var(--font-sans)" fontSize="13.5" fill="#64748b">apps, web, branches · video KYC</text>
              </g>

              {/* Node 4: Devices & Channels */}
              <g transform="translate(24, 278)" filter="url(#card-soft-shadow)">
                <rect x="0" y="0" width="340" height="68" rx="14" fill="#ffffff" fillOpacity="0.96" stroke="#e2e8f0" strokeWidth="1.2" />
                <text x="18" y="28" fontFamily="var(--font-sans)" fontSize="14.5" fontWeight="600" fill="#0f172a">Devices & channels</text>
                <text x="322" y="28" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12" fontStyle="italic" fill="#0070f3">~ every second</text>
                <text x="18" y="52" fontFamily="var(--font-sans)" fontSize="13.5" fill="#64748b">phone, browser, ATM, POS · event logs</text>
              </g>

              {/* Node 5: Open Banking & Credit */}
              <g transform="translate(24, 356)" filter="url(#card-soft-shadow)">
                <rect x="0" y="0" width="340" height="68" rx="14" fill="#ffffff" fillOpacity="0.96" stroke="#e2e8f0" strokeWidth="1.2" />
                <text x="18" y="28" fontFamily="var(--font-sans)" fontSize="14.5" fontWeight="600" fill="#0f172a">Open banking & credit</text>
                <text x="322" y="28" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12" fontStyle="italic" fill="#0070f3">~ on consent</text>
                <text x="18" y="52" fontFamily="var(--font-sans)" fontSize="13.5" fill="#64748b">other banks' data · JSON APIs · XBRL</text>
              </g>

              {/* Node 6: Watchlists & Regulators */}
              <g transform="translate(24, 434)" filter="url(#card-soft-shadow)">
                <rect x="0" y="0" width="340" height="68" rx="14" fill="#ffffff" fillOpacity="0.96" stroke="#e2e8f0" strokeWidth="1.2" />
                <text x="18" y="28" fontFamily="var(--font-sans)" fontSize="14.5" fontWeight="600" fill="#0f172a">Watchlists & Regulators</text>
                <text x="322" y="28" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12" fontStyle="italic" fill="#0070f3">~ any hour</text>
                <text x="18" y="52" fontFamily="var(--font-sans)" fontSize="13.5" fill="#64748b">sanctions, PEPs · rules, consultations</text>
              </g>

              {/* Heading: New Digital Assets & Alt Data */}
              <g transform="translate(24, 532)">
                <text x="2" y="2" fontFamily="var(--font-sans)" fontSize="12" fontWeight="700" fill="#94a3b8" letterSpacing="0.08em">
                  NEW DIGITAL ASSETS & ALT DATA
                </text>
              </g>

              {/* Node 7: Digital Assets */}
              <g transform="translate(24, 554)" filter="url(#card-soft-shadow)">
                <rect x="0" y="0" width="340" height="68" rx="14" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.4" />
                <text x="18" y="28" fontFamily="var(--font-sans)" fontSize="14.5" fontWeight="600" fill="#0070f3">Digital assets</text>
                <text x="322" y="28" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12" fontWeight="600" fill="#0070f3">~ 24/7, no weekends</text>
                <text x="18" y="52" fontFamily="var(--font-sans)" fontSize="13.5" fill="#475569">chains, custodians, VASPs · Travel Rule</text>
              </g>

              {/* Node 8: Alternative Data */}
              <g transform="translate(24, 632)" filter="url(#card-soft-shadow)">
                <rect x="0" y="0" width="340" height="68" rx="14" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.4" />
                <text x="18" y="28" fontFamily="var(--font-sans)" fontSize="14.5" fontWeight="600" fill="#0070f3">Alternative data</text>
                <text x="322" y="28" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12" fontWeight="600" fill="#0070f3">~ daily to weekly</text>
                <text x="18" y="52" fontFamily="var(--font-sans)" fontSize="13.5" fill="#475569">satellite, weather, ESG, news · APIs</text>
              </g>

              {/* Speed Legend — Bottom-Right Corner */}
              <g transform="translate(1145, 635)">
                <text x="0" y="0" fontFamily="var(--font-sans)" fontSize="14.5" fontWeight="700" fill="#94a3b8" letterSpacing="0.04em">how fast it arrives:</text>

                <line x1="0" y1="24" x2="36" y2="24" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                <text x="46" y="29" fontFamily="var(--font-sans)" fontSize="14" fontWeight="500" fill="#64748b">streaming</text>

                <line x1="0" y1="56" x2="36" y2="56" stroke="#94a3b8" strokeWidth="2.8" strokeDasharray="6 4" strokeLinecap="round" />
                <text x="46" y="61" fontFamily="var(--font-sans)" fontSize="14" fontWeight="500" fill="#64748b">batch</text>

                <line x1="0" y1="88" x2="36" y2="88" stroke="#94a3b8" strokeWidth="2.8" strokeDasharray="2 5" strokeLinecap="round" />
                <text x="46" y="93" fontFamily="var(--font-sans)" fontSize="14" fontWeight="500" fill="#64748b">on consent</text>
              </g>
            </g>

            {/* ==============================================================
                4. COMPLY2REG LOGO IN THE MIDDLE (Always present)
                ============================================================== */}
            <g transform="translate(620, 290)" className="c2r-hero-group" filter="url(#c2r-glow-shadow)">
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
                5. THE BANKER ON THE RIGHT (Always at final position 950px, 185px)
                ============================================================== */}
            <g
              className="banker-master-group"
              style={{
                transform: 'translate(950px, 185px)'
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

              {/* 2D Minimal Cartoon Banker Character with Seal Stamp */}
              <g
                className="banker-character"
                style={{
                  transform: isStamping ? 'translateY(5px)' : 'translateY(0)',
                  transition: 'transform 0.12s cubic-bezier(0.2, 0, 0, 1)'
                }}
              >
                <image
                  href={`${import.meta.env.BASE_URL}images/banker_guy.png`}
                  x="76"
                  y="11"
                  width="166"
                  height="174"
                  preserveAspectRatio="xMidYMid meet"
                />
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
                <rect x="0" y="0" width="270" height="52" rx="12" fill="#f8fafc" fillOpacity="0.95" stroke="#e2e8f0" strokeWidth="1.2" />
                <text x="135" y="23" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" fill="#0f172a">Legacy Core Ledger (1983)</text>
                <text x="135" y="41" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="13.5" fill="#64748b">+ 40 years of patched systems</text>
              </g>
            </g>

          </svg>

        </div>

        {/* Unified Mobile & Tablet Portrait Flow Diagram */}
        <div className="flow-stage-card flow-mobile-stage">
          <svg
            className="unified-flow-mobile-svg"
            viewBox="0 0 380 540"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="m-card-soft-shadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.05" />
              </filter>
              <filter id="m-badge-soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.2" />
              </filter>
            </defs>

            {/* ==============================================================
                1. 8 INDIVIDUAL CONDUIT LINES CONNECTING EVERY CARD TO COMPLY2REG
                ============================================================== */}
            <g className="mobile-conduits-group">
              {mobileSources.map((s, idx) => (
                <path
                  key={`m-line-${idx}`}
                  d={getMobileConduitPath(s)}
                  className={`mobile-conduit-line ${s.lineStyle}`}
                />
              ))}

              {/* Intake terminal dots at Comply2Reg top edge */}
              {mobileSources.map((s, idx) => (
                <circle key={`m-intake-${idx}`} cx={s.portX} cy="176" r="2.2" fill="#0070f3" />
              ))}
            </g>

            {/* ==============================================================
                2. ANIMATED DATA STREAMS (Traveling from Cards to Comply2Reg)
                ============================================================== */}
            <g className="mobile-moving-docs">
              {mobileSources.map((s, idx) => {
                const prog = ((time + s.offset) % s.cycle) / s.cycle
                const pt = getMobilePoint(s, prog)
                let scale = 0.52
                let opacity = 1
                if (prog > 0.88) {
                  const pFade = (prog - 0.88) / 0.12
                  scale = 0.52 * (1 - pFade * 0.4)
                  opacity = 1 - pFade * 0.9
                }
                return (
                  <g
                    key={`m-stream-${idx}`}
                    transform={`translate(${pt.x}, ${pt.y}) scale(${scale})`}
                    opacity={opacity}
                    filter="url(#m-badge-soft-shadow)"
                  >
                    {renderDocIcon(s.isDigital ? 'digital' : 'paper', 1, 0)}
                  </g>
                )
              })}
            </g>

            {/* ==============================================================
                3. ALL 8 SOURCE CARDS ON TOP (Clean Titles, Pushed Higher Up)
                ============================================================== */}
            <g className="mobile-cards-group">
              {mobileSources.map((s, idx) => {
                const isLeft = s.side === 'left'
                const cardX = isLeft ? 8 : 212
                const textCenterX = isLeft ? 88 : 292
                const pinX = isLeft ? 168 : 212

                return (
                  <g key={`m-card-${idx}`} filter="url(#m-card-soft-shadow)">
                    {/* Card Container */}
                    <rect
                      x={cardX}
                      y={s.yCard}
                      width="160"
                      height="28"
                      rx="7"
                      fill={s.isDigital ? "#f8faff" : "#ffffff"}
                      stroke={s.isDigital ? "rgba(0, 112, 243, 0.4)" : "#e2e8f0"}
                      strokeWidth="1.2"
                    />
                    {/* Uniform, Highly Legible Card Title */}
                    <text
                      x={textCenterX}
                      y={s.yCard + 14}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontFamily="var(--font-sans)"
                      fontSize="13"
                      fontWeight="600"
                      fill={s.isDigital ? "#0070f3" : "#0f172a"}
                      letterSpacing="-0.02em"
                    >
                      {s.title}
                    </text>
                    {/* Terminal Pin Dot */}
                    <circle cx={pinX} cy={s.yExit} r="2.5" fill={s.isDigital ? "#0070f3" : "#94a3b8"} />
                  </g>
                )
              })}
            </g>

            {/* ==============================================================
                4. COMPLY2REG LOGO IN THE MIDDLE (Balanced & True Vertical Center: 116x88 inside 128x96)
                ============================================================== */}
            <g className="mobile-core-box" filter="url(#m-card-soft-shadow)">
              <rect
                x="126"
                y="176"
                width="128"
                height="96"
                rx="20"
                fill="#ffffff"
                stroke="rgba(0, 112, 243, 0.3)"
                strokeWidth="1.5"
              />
              <image
                href={`${import.meta.env.BASE_URL}images/logo2.svg`}
                x="132"
                y="180"
                width="116"
                height="88"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>

            {/* ==============================================================
                5. OUTFLOW CONDUIT & DELIVERED VERIFIED DOCUMENT
                ============================================================== */}
            <line x1="190" y1="272" x2="190" y2="334" stroke="#0070f3" strokeWidth="2" strokeDasharray="5 3" />
            <circle cx="190" cy="272" r="3" fill="#0070f3" />
            <circle cx="190" cy="334" r="3" fill="#0070f3" />

            {/* Flying Verified Document Delivered Down into Banker */}
            {outflowProgress >= 0 && outflowProgress <= 1 && (
              <g transform={`translate(190, ${272 + outflowProgress * 62}) scale(0.85)`} filter="url(#m-badge-soft-shadow)">
                <rect x="-10" y="-13" width="20" height="26" rx="3.5" fill="#ffffff" stroke="#0070f3" strokeWidth="1.8" />
                <image href={`${import.meta.env.BASE_URL}images/logo2.svg`} x="-6" y="-9" width="12" height="12" />
                <line x1="-6" y1="5" x2="6" y2="5" stroke="#0070f3" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="-6" y1="9" x2="3" y2="9" stroke="#94a3b8" strokeWidth="1.1" strokeLinecap="round" />
              </g>
            )}

            {/* ==============================================================
                6. THE BANK, BANKER, DESK, STAMP & LEGACY CORE LEDGER
                ============================================================== */}
            <g transform="translate(0, 10)">
              {/* Table Surface */}
              <line x1="68" y1="462" x2="312" y2="462" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="88" y1="462" x2="88" y2="496" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="292" y1="462" x2="292" y2="496" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

              {/* "THE BANK" Badge */}
              <g transform="translate(190, 328)">
                <rect x="-60" y="-14" width="120" height="28" rx="14" fill="#0f172a" />
                <text x="0" y="5" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="13" fontWeight="700" fill="#ffffff" letterSpacing="0.08em">THE BANK</text>
              </g>

              {/* Banker Character */}
              <g
                className="banker-character"
                style={{
                  transform: isStamping ? 'translateY(4px)' : 'translateY(0)',
                  transition: 'transform 0.12s cubic-bezier(0.2, 0, 0, 1)'
                }}
              >
                <image
                  href={`${import.meta.env.BASE_URL}images/banker_guy.png`}
                  x="137"
                  y="350"
                  width="106"
                  height="112"
                  preserveAspectRatio="xMidYMid meet"
                />
              </g>

              {/* Coffee Mug */}
              <g className="coffee-upright">
                <path d="M 270 433 Q 267 428 271 422" stroke="#94a3b8" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7" />
                <path d="M 278 434 Q 281 429 277 423" stroke="#94a3b8" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7" />
                <path d="M 287 444 C 296 444, 296 458, 287 458" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
                <rect x="264" y="438" width="23" height="24" rx="3.5" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
                <line x1="266" y1="450" x2="285" y2="450" stroke="#0070f3" strokeWidth="1.8" strokeLinecap="round" />
              </g>

              {/* Comply2Reg Clean Verified Stack on Desk */}
              <g className="c2r-desk-stack">
                {[0, 1, 2, 3].map((i) => {
                  const isTop = i === 3
                  const yPos = 454 - i * 6.5
                  const rotation = (i % 2 === 0 ? 1 : -1) * 1.5
                  return (
                    <g key={i} transform={`rotate(${rotation} 97 ${yPos})`} filter="url(#m-card-soft-shadow)">
                      <rect
                        x="76"
                        y={yPos}
                        width="42"
                        height="17"
                        rx="3"
                        fill="#ffffff"
                        stroke="#0070f3"
                        strokeWidth="1.4"
                      />
                      {isTop && (
                        <image
                          href={`${import.meta.env.BASE_URL}images/logo2.svg`}
                          x="78"
                          y={yPos + 2}
                          width="13"
                          height="13"
                        />
                      )}
                      <line x1={isTop ? "94" : "80"} y1={yPos + 6} x2="112" y2={yPos + 6} stroke="#0070f3" strokeWidth="1.3" strokeLinecap="round" />
                      <line x1={isTop ? "94" : "80"} y1={yPos + 11} x2="108" y2={yPos + 11} stroke="#94a3b8" strokeWidth="1.1" strokeLinecap="round" />
                    </g>
                  )
                })}
              </g>

              {/* Stamp Pop Feedback: Smooth, Glitch-Free Verified Green Checkmark */}
              {isStamping && (() => {
                const sNorm = Math.max(0, Math.min(1, (cycleTime - OUTFLOW_FLIGHT) / 0.6))
                let popScale = 1
                let popOpacity = 1
                if (sNorm < 0.25) {
                  popScale = 0.5 + (sNorm / 0.25) * 0.6
                  popOpacity = sNorm / 0.25
                } else if (sNorm < 0.5) {
                  popScale = 1.1 - ((sNorm - 0.25) / 0.25) * 0.1
                  popOpacity = 1
                } else if (sNorm > 0.85) {
                  popScale = 1.0
                  popOpacity = 1 - ((sNorm - 0.85) / 0.15)
                }
                return (
                  <g
                    transform={`translate(116, 426) scale(${popScale})`}
                    opacity={popOpacity}
                    filter="url(#m-badge-soft-shadow)"
                  >
                    <circle cx="0" cy="0" r="14" fill="#10b981" stroke="#ffffff" strokeWidth="2.4" />
                    <path
                      d="M -5.5 0.5 L -1.5 4.5 L 6 -3.8"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </g>
                )
              })()}

              {/* Legacy Core Ledger */}
              <g transform="translate(50, 474)">
                <rect x="0" y="0" width="280" height="50" rx="12" fill="#f8fafc" fillOpacity="0.95" stroke="#e2e8f0" strokeWidth="1.2" />
                <text x="140" y="21" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="13" fontWeight="600" fill="#0f172a">Legacy Core Ledger (1983)</text>
                <text x="140" y="39" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="13" fill="#64748b">+ 40 years of patched systems</text>
              </g>
            </g>
          </svg>
        </div>

      </div>
    </section>
  )
}

import { useState, useEffect, useRef } from 'react'
import './BankNarrativeFlow.css'

// Clean 90-Degree Orthogonal Conduit Path (Sharp 90° circuit traces)
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
  // Clock starts ONLY when the user scrolls and reaches the section
  const [time, setTime] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const sectionRef = useRef(null)
  const reqRef = useRef(null)
  const lastTimeRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true)
        }
      },
      {
        threshold: 0.2, // Starts when 20% of section enters viewport
        rootMargin: '0px 0px -40px 0px'
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasStarted) return

    const loop = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const delta = (timestamp - lastTimeRef.current) / 1000
      lastTimeRef.current = timestamp

      setTime((prev) => prev + delta)
      reqRef.current = requestAnimationFrame(loop)
    }

    reqRef.current = requestAnimationFrame(loop)
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current)
    }
  }, [hasStarted])

  // -------------------------------------------------------------
  // STORY PHASES (Snappy, engaging, fast-paced for web visitors)
  // -------------------------------------------------------------
  // 0.0s - 1.2s: Initial stage appearance
  // 1.2s - 2.8s: Banker appears at desk in middle
  // 2.8s - 9.5s: Traditional sources arrive, files move along 90° trunk, desk stack grows
  // 9.5s - 14.5s: Digital sources arrive, stream files, stack piles high to 16 sheets
  // 14.5s onwards FOREVER: Comply2Reg enters at center, clears mess, delivers verified docs with logo
  const isBlank = time < 1.2
  const isBankerVisible = time >= 1.2
  const isTraditionalPhase = time >= 2.8 && time < 9.5
  const isDigitalOverload = time >= 9.5 && time < 14.5
  const isComply2RegActive = time >= 14.5 // Reaches Comply2Reg in 14.5 seconds!

  // Progressive appearance of stream nodes (fast, rhythmic succession)
  const showNode1 = time >= 2.8 // Payment Rails
  const showNode2 = time >= 3.6 // Markets
  const showNode3 = time >= 4.4 // Customers
  const showNode4 = time >= 5.2 // Devices & Channels
  const showNode5 = time >= 6.0 // Open Banking & Credit
  const showNode6 = time >= 6.8 // Watchlists & Regulators

  // Digital additions (arrive in Phase 3)
  const showDigitalAssets = time >= 9.6   // Digital assets
  const showAlternativeData = time >= 10.2 // Alternative data

  // -------------------------------------------------------------
  // 90-DEGREE UNCLUTTERED DATA TRUNK BUS COORDINATES
  // -------------------------------------------------------------
  const trunkX = 440
  const deskCenterTarget = { x: 695, y: 350 }
  const c2rIntakeTarget = { x: 620, y: 350 }
  const c2rOutputTarget = { x: 780, y: 350 }
  const bankerRightTarget = { x: 972, y: 350 }
  const outputMidX = 868

  // Y-coordinates of all 8 stream card connection points (aligned with 72px cards, 8px gap):
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

  // Traditional Documents: Each glides in 1.4s (snappy & clear along 90° trunk)
  const doc1Progress = time >= 3.2 && time <= 4.6 ? (time - 3.2) / 1.4 : -1
  const doc2Progress = time >= 4.6 && time <= 6.0 ? (time - 4.6) / 1.4 : -1
  const doc3Progress = time >= 6.0 && time <= 7.4 ? (time - 6.0) / 1.4 : -1
  const doc4Progress = time >= 7.2 && time <= 8.6 ? (time - 7.2) / 1.4 : -1
  const doc5Progress = time >= 8.0 && time <= 9.4 ? (time - 8.0) / 1.4 : -1
  const doc6Progress = -1

  // -------------------------------------------------------------
  // PHYSICAL DESK STACK BEHAVIOR (Fast, dynamic, zero panic)
  // -------------------------------------------------------------
  let deskStackCount = 0
  let isStamping = false

  if (isTraditionalPhase) {
    if (time >= 4.6 && time < 5.5) {
      deskStackCount = 1
    } else if (time >= 5.5 && time < 6.0) {
      deskStackCount = 1
      isStamping = true
    } else if (time >= 6.0 && time < 7.0) {
      deskStackCount = 1
    } else if (time >= 7.0 && time < 7.6) {
      deskStackCount = 2
    } else if (time >= 7.6 && time < 8.1) {
      deskStackCount = 2
      isStamping = true
    } else if (time >= 8.1 && time < 8.8) {
      deskStackCount = 2
    } else if (time >= 8.8 && time < 9.5) {
      deskStackCount = 3
    }
  } else if (isDigitalOverload) {
    // Digital stuff sends more files! Stacks up to 16 sheets briskly over 5 seconds
    const progress = Math.min((time - 9.5) / 4.5, 1)
    deskStackCount = Math.floor(3 + progress * 13) // Towers up to 16 sheets

    // Steady rhythmic stamping without panicking (every 1.4s)
    const stampCycle = (time - 9.5) % 1.4
    if (stampCycle >= 0.6 && stampCycle < 0.95) {
      isStamping = true
    }
  } else if (isComply2RegActive) {
    if (time < 16.5) {
      // Comply2Reg clears the old messy stack rapidly down to 0 in 2.0s
      const clearProgress = (time - 14.5) / 2.0
      deskStackCount = Math.max(0, Math.floor(16 * (1 - clearProgress)))
      isStamping = false
    } else {
      // Comply2Reg files arrive and stack up smoothly!
      // Each delivery has a cycle of 2.8s, with 1.8s gliding flight
      const elapsed = time - 16.5
      const flightDuration = 1.8
      const cycleTime = 2.8

      if (elapsed < flightDuration) {
        deskStackCount = 0
        isStamping = false
      } else if (elapsed < cycleTime + flightDuration) {
        deskStackCount = 1
        isStamping = (elapsed - flightDuration) >= 0.25 && (elapsed - flightDuration) < 0.65
      } else if (elapsed < cycleTime * 2 + flightDuration) {
        deskStackCount = 2
        isStamping = (elapsed - cycleTime - flightDuration) >= 0.25 && (elapsed - cycleTime - flightDuration) < 0.65
      } else if (elapsed < cycleTime * 3 + flightDuration) {
        deskStackCount = 3
        isStamping = (elapsed - cycleTime * 2 - flightDuration) >= 0.25 && (elapsed - cycleTime * 2 - flightDuration) < 0.65
      } else if (elapsed < cycleTime * 4 + flightDuration) {
        deskStackCount = 4
        isStamping = (elapsed - cycleTime * 3 - flightDuration) >= 0.25 && (elapsed - cycleTime * 3 - flightDuration) < 0.65
      } else {
        // Keeps stacking rhythmically
        const cycle = (elapsed - cycleTime * 4 - flightDuration) % cycleTime
        deskStackCount = cycle < (cycleTime / 2) ? 4 : 5
        isStamping = cycle >= 0.3 && cycle < 0.7
      }
    }
  }

  // Token in flight from Comply2Reg to Banker (takes 1.8s smooth glide every 2.8s)
  const deliveryStart = 16.5
  const elapsedDelivery = time - deliveryStart
  const slowTokenCycle = elapsedDelivery >= 0 ? elapsedDelivery % 2.8 : -1
  const slowTokenProgress = isComply2RegActive && elapsedDelivery >= 0 && slowTokenCycle < 1.8
    ? slowTokenCycle / 1.8
    : -1

  // Helper to render an interpolating document strictly along the 90-degree orthogonal line
  const renderMovingDoc = (progress, x0, y0, xMid, x1, y1, isDigital = false) => {
    if (progress < 0 || progress > 1) return null
    const { x, y } = getOrthogonalPoint(progress, x0, y0, xMid, x1, y1)
    return (
      <g transform={`translate(${x}, ${y})`}>
        {isDigital ? (
          <g>
            <rect x="-11" y="-13" width="22" height="26" rx="3.5" fill="#eff6ff" stroke="#0070f3" strokeWidth="2.2" />
            <circle cx="0" cy="-4" r="3.5" fill="#0070f3" />
            <path d="M -5 4 L 5 4 M -3 8 L 3 8" stroke="#0070f3" strokeWidth="1.8" />
          </g>
        ) : (
          <g>
            <rect x="-10" y="-12" width="20" height="24" rx="2.5" fill="#ffffff" stroke="#0070f3" strokeWidth="1.8" />
            <line x1="-5" y1="-5" x2="5" y2="-5" stroke="#94a3b8" strokeWidth="1.4" />
            <line x1="-5" y1="0" x2="5" y2="0" stroke="#94a3b8" strokeWidth="1.4" />
            <line x1="-5" y1="5" x2="3" y2="5" stroke="#94a3b8" strokeWidth="1.4" />
          </g>
        )}
      </g>
    )
  }

  return (
    <section ref={sectionRef} className="flow-section" id="compliance-flow">
      <div className="flow-container">

        {/* Clear Contextual Header (Centered & Perfectly Scaled) */}
        <div className="flow-header">
          <h2 className="flow-title">
            Why Banking Compliance Breaks Down: <span className="flow-title-accent">The Data Deluge</span>
          </h2>
          <p className="flow-subtitle">
            Banks receive high-speed feeds across payment rails, markets, and 24/7 digital assets into 40-year-old core systems. Comply2Reg unifies the chaos and delivers clean, verified compliance records directly to your team.
          </p>
        </div>

        {/* Clean Borderless Frosted Stage Card */}
        <div className={`flow-stage-card ${isBlank ? 'stage-blank' : 'stage-live'}`}>

          {/* Sit mascot — top-left corner decoration */}
          <img
            src={`${import.meta.env.BASE_URL}images/sit.png`}
            alt=""
            className="flow-sit-mascot"
          />

          <svg
            className="unified-flow-svg"
            viewBox="0 0 1340 798"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Card Drop Shadows */}
              <filter id="card-soft-shadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.04" />
              </filter>
              <filter id="c2r-glow-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#0070f3" floodOpacity="0.22" />
              </filter>
            </defs>

            {/* ==============================================================
                1. CLEAN DATA TRUNK HIGHWAY (Zero Congestion, 100% 90° Lines)
                ============================================================== */}

            {/* PHASE 2 & 3: Feeders join Trunk at 90°, Trunk feeds Banker */}
            {!isComply2RegActive && isBankerVisible && (
              <g className="pipelines-layer">
                {/* Horizontal Feeder Lines into Trunk Bus */}
                {showNode1 && <line x1="360" y1={streamY.node1} x2={trunkX} y2={streamY.node1} className="pipe-wire line-streaming" />}
                {showNode2 && <line x1="360" y1={streamY.node2} x2={trunkX} y2={streamY.node2} className="pipe-wire line-streaming" />}
                {showNode3 && <line x1="360" y1={streamY.node3} x2={trunkX} y2={streamY.node3} className="pipe-wire line-streaming" />}
                {showNode4 && <line x1="360" y1={streamY.node4} x2={trunkX} y2={streamY.node4} className="pipe-wire line-streaming" />}
                {showNode5 && <line x1="360" y1={streamY.node5} x2={trunkX} y2={streamY.node5} className="pipe-wire line-ondemand" />}
                {showNode6 && <line x1="360" y1={streamY.node6} x2={trunkX} y2={streamY.node6} className="pipe-wire line-batch" />}

                {/* Digital additions join trunk in Phase 3 */}
                {isDigitalOverload && (
                  <>
                    {showDigitalAssets && (
                      <line x1="360" y1={streamY.digitalAssets} x2={trunkX} y2={streamY.digitalAssets} className="pipe-wire digital-line-surge" />
                    )}
                    {showAlternativeData && (
                      <line x1="360" y1={streamY.alternativeData} x2={trunkX} y2={streamY.alternativeData} className="pipe-wire digital-line-surge" />
                    )}
                  </>
                )}

                {/* Vertical Data Trunk Backbone (Immediately active from Node 1 to Desk intake) */}
                {showNode1 && (
                  <line
                    x1={trunkX}
                    y1={streamY.node1}
                    x2={trunkX}
                    y2={
                      isDigitalOverload && showAlternativeData
                        ? streamY.alternativeData
                        : isDigitalOverload && showDigitalAssets
                        ? streamY.digitalAssets
                        : showNode6
                        ? streamY.node6
                        : deskCenterTarget.y
                    }
                    className="pipe-wire line-trunk"
                  />
                )}

                {/* Trunk Outlet to Banker Desk (Clean 90° delivery line) */}
                {showNode1 && (
                  <line x1={trunkX} y1={deskCenterTarget.y} x2={deskCenterTarget.x} y2={deskCenterTarget.y} className="pipe-wire line-streaming" />
                )}

                {/* Subtle Clean Junction Dots */}
                {showNode1 && <circle cx={trunkX} cy={streamY.node1} r="3.5" fill="#0070f3" />}
                {showNode2 && <circle cx={trunkX} cy={streamY.node2} r="3.5" fill="#0070f3" />}
                {showNode3 && <circle cx={trunkX} cy={streamY.node3} r="3.5" fill="#0070f3" />}
                {showNode4 && <circle cx={trunkX} cy={streamY.node4} r="3.5" fill="#0070f3" />}
                {showNode5 && <circle cx={trunkX} cy={streamY.node5} r="3.5" fill="#0070f3" />}
                {showNode6 && <circle cx={trunkX} cy={streamY.node6} r="3.5" fill="#0070f3" />}
                {isDigitalOverload && showDigitalAssets && <circle cx={trunkX} cy={streamY.digitalAssets} r="4" fill="#0070f3" />}
                {isDigitalOverload && showAlternativeData && <circle cx={trunkX} cy={streamY.alternativeData} r="4" fill="#0070f3" />}
                {showNode1 && <circle cx={trunkX} cy={deskCenterTarget.y} r="4" fill="#0070f3" />}
              </g>
            )}

            {/* PHASE 4: Trunk routes cleanly into Comply2Reg, then Comply2Reg feeds Banker */}
            {isComply2RegActive && (
              <g className="pipelines-c2r-layer">
                {/* Feeder Lines from All 8 Sources into Trunk */}
                <line x1="360" y1={streamY.node1} x2={trunkX} y2={streamY.node1} className="pipe-wire c2r-intake" />
                <line x1="360" y1={streamY.node2} x2={trunkX} y2={streamY.node2} className="pipe-wire c2r-intake" />
                <line x1="360" y1={streamY.node3} x2={trunkX} y2={streamY.node3} className="pipe-wire c2r-intake" />
                <line x1="360" y1={streamY.node4} x2={trunkX} y2={streamY.node4} className="pipe-wire c2r-intake" />
                <line x1="360" y1={streamY.node5} x2={trunkX} y2={streamY.node5} className="pipe-wire c2r-intake" />
                <line x1="360" y1={streamY.node6} x2={trunkX} y2={streamY.node6} className="pipe-wire c2r-intake" />
                <line x1="360" y1={streamY.digitalAssets} x2={trunkX} y2={streamY.digitalAssets} className="pipe-wire c2r-intake" />
                <line x1="360" y1={streamY.alternativeData} x2={trunkX} y2={streamY.alternativeData} className="pipe-wire c2r-intake" />

                {/* Vertical Trunk Line */}
                <line x1={trunkX} y1={streamY.node1} x2={trunkX} y2={streamY.alternativeData} className="pipe-wire line-trunk" />

                {/* Horizontal Inflow from Trunk into Comply2Reg */}
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

                {/* Comply2Reg sends ONE BY ONE SLOWLY to the Banker on the right via 90° orthogonal line */}
                <path className="pipe-wire c2r-slow-flow" d={getOrthogonalPath(c2rOutputTarget.x, c2rOutputTarget.y, outputMidX, bankerRightTarget.x, bankerRightTarget.y)} />
              </g>
            )}

            {/* ==============================================================
                2. FLYING DOCUMENTS (Gliding cleanly along 90-degree trunk)
                ============================================================== */}

            {/* Phase 2: Each file moves strictly from its active node along 90° trunk to the desk */}
            {isTraditionalPhase && (
              <g className="moving-docs-layer">
                {renderMovingDoc(doc1Progress, 360, streamY.node1, trunkX, deskCenterTarget.x, deskCenterTarget.y)}
                {renderMovingDoc(doc2Progress, 360, streamY.node2, trunkX, deskCenterTarget.x, deskCenterTarget.y)}
                {renderMovingDoc(doc3Progress, 360, streamY.node3, trunkX, deskCenterTarget.x, deskCenterTarget.y)}
                {renderMovingDoc(doc4Progress, 360, streamY.node4, trunkX, deskCenterTarget.x, deskCenterTarget.y)}
                {renderMovingDoc(doc5Progress, 360, streamY.node5, trunkX, deskCenterTarget.x, deskCenterTarget.y)}
                {renderMovingDoc(doc6Progress, 360, streamY.node6, trunkX, deskCenterTarget.x, deskCenterTarget.y)}
              </g>
            )}

            {/* Phase 3: Digital streams (Files glide smoothly along 90° trunk, dynamic & visible) */}
            {isDigitalOverload && (
              <g className="moving-docs-flood">
                {/* Smooth stream from Node 1 (1.4s flight) */}
                {renderMovingDoc(((time - 9.5) / 1.4) % 1, 360, streamY.node1, trunkX, deskCenterTarget.x, deskCenterTarget.y)}
                {/* Smooth stream from Node 3 (1.5s flight) */}
                {renderMovingDoc((((time - 9.5) + 0.7) / 1.5) % 1, 360, streamY.node3, trunkX, deskCenterTarget.x, deskCenterTarget.y)}
                {/* Smooth stream from Digital Assets (1.3s flight) */}
                {showDigitalAssets &&
                  renderMovingDoc((((time - 9.6) + 0.3) / 1.3) % 1, 360, streamY.digitalAssets, trunkX, deskCenterTarget.x, deskCenterTarget.y, true)}
                {/* Smooth stream from Alternative Data (1.4s flight) */}
                {showAlternativeData &&
                  renderMovingDoc((((time - 10.2) + 0.8) / 1.4) % 1, 360, streamY.alternativeData, trunkX, deskCenterTarget.x, deskCenterTarget.y, true)}
              </g>
            )}

            {/* Phase 4: Comply2Reg intake flow and output document */}
            {isComply2RegActive && (
              <g className="moving-docs-c2r">
                {/* Intake flows into Comply2Reg via 90° trunk */}
                {renderMovingDoc(((time - 14.5) / 1.6) % 1, 360, streamY.node1, trunkX, c2rIntakeTarget.x, c2rIntakeTarget.y)}
                {renderMovingDoc((((time - 14.5) + 0.6) / 1.7) % 1, 360, streamY.node5, trunkX, c2rIntakeTarget.x, c2rIntakeTarget.y)}
                {renderMovingDoc((((time - 14.5) + 1.1) / 1.6) % 1, 360, streamY.digitalAssets, trunkX, c2rIntakeTarget.x, c2rIntakeTarget.y, true)}

                {/* Verified document with official Comply2Reg logo delivered to Banker on right (1.8s flight) */}
                {slowTokenProgress >= 0 && slowTokenProgress <= 1 && (
                  (() => {
                    const pt = getOrthogonalPoint(slowTokenProgress, c2rOutputTarget.x, c2rOutputTarget.y, outputMidX, bankerRightTarget.x, bankerRightTarget.y)
                    return (
                      <g transform={`translate(${pt.x}, ${pt.y})`} filter="url(#card-soft-shadow)">
                        <path
                          d="M -18 -26 L 10 -26 L 18 -18 L 18 26 L -18 26 Z"
                          fill="#ffffff"
                          stroke="#0070f3"
                          strokeWidth="1.8"
                        />
                        <path d="M 10 -26 L 10 -18 L 18 -18 Z" fill="#eff6ff" stroke="#0070f3" strokeWidth="1.4" />
                        {/* ONLY Comply2Reg logo - NO tick! */}
                        <image
                          href={`${import.meta.env.BASE_URL}images/logo2.svg`}
                          x="-11"
                          y="-21"
                          width="22"
                          height="22"
                        />
                        <line x1="-12" y1="5" x2="12" y2="5" stroke="#0070f3" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="-12" y1="11" x2="10" y2="11" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round" />
                        <line x1="-12" y1="17" x2="6" y2="17" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round" />
                        <line x1="-12" y1="22" x2="11" y2="22" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round" />
                      </g>
                    )
                  })()
                )}
              </g>
            )}

            {/* ==============================================================
                3. SOURCES COLUMN ON LEFT (Clean, Spacious Cards With Classification)
                ============================================================== */}
            <g className="sources-group">

              {/* Classification Heading for Core Banking Feeds */}
              {showNode1 && (
                <g transform="translate(30, 22)" className="anim-fade-in">
                  <text x="2" y="2" fontFamily="var(--font-sans)" fontSize="10.5" fontWeight="700" fill="#94a3b8" letterSpacing="0.08em">
                    CORE BANKING DATA
                  </text>
                </g>
              )}

              {/* Node 1: Payment Rails */}
              {showNode1 && (
                <g transform="translate(30, 40)" filter="url(#card-soft-shadow)" className="anim-fade-in">
                  <rect x="0" y="0" width="330" height="72" rx="15" fill="#ffffff" fillOpacity="0.96" stroke="#e2e8f0" strokeWidth="1.2" />
                  <text x="22" y="30" fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" fill="#0f172a">Payment rails</text>
                  <text x="308" y="30" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12.5" fontStyle="italic" fill="#0070f3">~ every second</text>
                  <text x="22" y="53" fontFamily="var(--font-sans)" fontSize="12.5" fill="#64748b">cards, SWIFT, instant pay · ISO 20022</text>
                </g>
              )}

              {/* Node 2: Markets */}
              {showNode2 && (
                <g transform="translate(30, 120)" filter="url(#card-soft-shadow)" className="anim-fade-in">
                  <rect x="0" y="0" width="330" height="72" rx="15" fill="#ffffff" fillOpacity="0.96" stroke="#e2e8f0" strokeWidth="1.2" />
                  <text x="22" y="30" fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" fill="#0f172a">Markets & Exchanges</text>
                  <text x="308" y="30" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12.5" fontStyle="italic" fill="#0070f3">~ millisecond</text>
                  <text x="22" y="53" fontFamily="var(--font-sans)" fontSize="12.5" fill="#64748b">exchanges, price & rate feeds · FIX</text>
                </g>
              )}

              {/* Node 3: Customers */}
              {showNode3 && (
                <g transform="translate(30, 200)" filter="url(#card-soft-shadow)" className="anim-fade-in">
                  <rect x="0" y="0" width="330" height="72" rx="15" fill="#ffffff" fillOpacity="0.96" stroke="#e2e8f0" strokeWidth="1.2" />
                  <text x="22" y="30" fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" fill="#0f172a">Customers & KYC</text>
                  <text x="308" y="30" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12.5" fontStyle="italic" fill="#0070f3">~ all day</text>
                  <text x="22" y="53" fontFamily="var(--font-sans)" fontSize="12.5" fill="#64748b">apps, web, branches · video KYC</text>
                </g>
              )}

              {/* Node 4: Devices & channels */}
              {showNode4 && (
                <g transform="translate(30, 280)" filter="url(#card-soft-shadow)" className="anim-fade-in">
                  <rect x="0" y="0" width="330" height="72" rx="15" fill="#ffffff" fillOpacity="0.96" stroke="#e2e8f0" strokeWidth="1.2" />
                  <text x="22" y="30" fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" fill="#0f172a">Devices & channels</text>
                  <text x="308" y="30" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12.5" fontStyle="italic" fill="#0070f3">~ every second</text>
                  <text x="22" y="53" fontFamily="var(--font-sans)" fontSize="12.5" fill="#64748b">phone, browser, ATM, POS · event logs</text>
                </g>
              )}

              {/* Node 5: Open Banking & Credit */}
              {showNode5 && (
                <g transform="translate(30, 360)" filter="url(#card-soft-shadow)" className="anim-fade-in">
                  <rect x="0" y="0" width="330" height="72" rx="15" fill="#ffffff" fillOpacity="0.96" stroke="#e2e8f0" strokeWidth="1.2" />
                  <text x="22" y="30" fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" fill="#0f172a">Open banking & credit</text>
                  <text x="308" y="30" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12.5" fontStyle="italic" fill="#0070f3">~ on consent</text>
                  <text x="22" y="53" fontFamily="var(--font-sans)" fontSize="12.5" fill="#64748b">other banks' data · JSON APIs · XBRL</text>
                </g>
              )}

              {/* Node 6: Watchlists & Regulators */}
              {showNode6 && (
                <g transform="translate(30, 440)" filter="url(#card-soft-shadow)" className="anim-fade-in">
                  <rect x="0" y="0" width="330" height="72" rx="15" fill="#ffffff" fillOpacity="0.96" stroke="#e2e8f0" strokeWidth="1.2" />
                  <text x="22" y="30" fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" fill="#0f172a">Watchlists & Regulators</text>
                  <text x="308" y="30" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12.5" fontStyle="italic" fill="#0070f3">~ any hour</text>
                  <text x="22" y="53" fontFamily="var(--font-sans)" fontSize="12.5" fill="#64748b">sanctions, PEPs · rules, consultations</text>
                </g>
              )}

              {/* Classification Heading for Emerging Digital & Alternative Feeds */}
              {showDigitalAssets && (
                <g transform="translate(30, 556)" className="anim-fade-in">
                  <text x="2" y="2" fontFamily="var(--font-sans)" fontSize="10.5" fontWeight="700" fill="#94a3b8" letterSpacing="0.08em">
                    NEW DIGITAL ASSETS & ALT DATA
                  </text>
                </g>
              )}

              {/* Node 7: Digital Assets (Clear separation, highlighted border) */}
              {showDigitalAssets && (
                <g transform="translate(30, 572)" filter="url(#card-soft-shadow)" className="anim-fade-in">
                  <rect x="0" y="0" width="330" height="72" rx="15" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.4" />
                  <text x="22" y="30" fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" fill="#0070f3">Digital assets</text>
                  <text x="308" y="30" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12.5" fontWeight="600" fill="#0070f3">~ 24/7, no weekends</text>
                  <text x="22" y="53" fontFamily="var(--font-sans)" fontSize="12.5" fill="#475569">chains, custodians, VASPs · Travel Rule</text>
                </g>
              )}

              {/* Node 8: Alternative Data (Zero overlap, placed cleanly at y=540) */}
              {showAlternativeData && (
                <g transform="translate(30, 654)" filter="url(#card-soft-shadow)" className="anim-fade-in">
                  <rect x="0" y="0" width="330" height="72" rx="15" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.4" />
                  <text x="22" y="30" fontFamily="var(--font-sans)" fontSize="15" fontWeight="600" fill="#0070f3">Alternative data</text>
                  <text x="308" y="30" textAnchor="end" fontFamily="var(--font-sans)" fontSize="12.5" fontWeight="600" fill="#0070f3">~ daily to weekly</text>
                  <text x="22" y="53" fontFamily="var(--font-sans)" fontSize="12.5" fill="#475569">satellite, weather, ESG, news · APIs</text>
                </g>
              )}

              {/* Authentic Sketch Legend at Bottom */}
              <g transform="translate(940, 774)">
                <text x="0" y="10" fontFamily="var(--font-sans)" fontSize="12" fontWeight="600" fill="#94a3b8">how fast it arrives:</text>
                <line x1="125" y1="7" x2="142" y2="7" stroke="#94a3b8" strokeWidth="2" />
                <text x="148" y="10" fontFamily="var(--font-sans)" fontSize="12" fill="#64748b">streaming</text>
                <line x1="218" y1="7" x2="235" y2="7" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="4 3" />
                <text x="241" y="10" fontFamily="var(--font-sans)" fontSize="12" fill="#64748b">batch</text>
                <line x1="288" y1="7" x2="305" y2="7" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="1 3" />
                <text x="311" y="10" fontFamily="var(--font-sans)" fontSize="12" fill="#64748b">on consent</text>
              </g>

            </g>

            {/* ==============================================================
                4. COMPLY2REG LOGO (Materializes in Middle)
                ============================================================== */}
            {isComply2RegActive && (
              <g transform="translate(625, 275)" className="c2r-hero-group" filter="url(#c2r-glow-shadow)">
                {/* Clean Borderless Logo Surface */}
                <rect x="-5" y="-5" width="160" height="160" rx="32" fill="#ffffff" />
                {/* Official Comply2Reg SVG Image */}
                <image
                  href={`${import.meta.env.BASE_URL}images/logo2.svg`}
                  x="20"
                  y="20"
                  width="120"
                  height="120"
                />
              </g>
            )}

            <radialGradient id="c2r-radial-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0070f3" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0070f3" stopOpacity="0" />
            </radialGradient>

            {/* ==============================================================
                5. THE BANKER (Smoothly glides from 630 to 950 when C2R enters)
                ============================================================== */}
            {isBankerVisible && (
              <g
                className="banker-master-group"
                style={{
                  transform: isComply2RegActive ? 'translate(950px, 180px)' : 'translate(630px, 180px)',
                  transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Table Surface Line */}
                <line x1="20" y1="185" x2="310" y2="185" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
                <line x1="45" y1="185" x2="45" y2="235" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                <line x1="285" y1="185" x2="285" y2="235" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />

                {/* "THE BANK" Identification Badge (Above Character) */}
                <g transform="translate(160, -12)">
                  <rect x="-60" y="-14" width="120" height="28" rx="14" fill="#0f172a" />
                  <text x="0" y="4" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="12.5" fontWeight="700" fill="#ffffff" letterSpacing="0.08em">THE BANK</text>
                </g>

                {/* Robot Banker Character (Steady, Calm, Zero Panic!) */}
                <g className="banker-character" transform="translate(-20, 0)">
                  <rect x="172" y="105" width="16" height="10" rx="3" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />

                  <path
                    d="M 152 115 C 147 138, 147 168, 153 185 L 207 185 C 213 168, 213 138, 208 115 Z"
                    fill="#ffffff"
                    stroke="#0f172a"
                    strokeWidth="2.5"
                  />

                  <circle cx="170" cy="142" r="2.5" fill="#0f172a" />
                  <circle cx="180" cy="142" r="2.5" fill="#0f172a" />
                  <circle cx="190" cy="142" r="2.5" fill="#0f172a" />

                  <line x1="180" y1="45" x2="180" y2="22" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="180" cy="18" r="5" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />

                  <path d="M 145 65 C 137 65, 137 85, 145 85" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
                  <path d="M 215 65 C 223 65, 223 85, 215 85" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />

                  <rect x="145" y="45" width="70" height="60" rx="22" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
                  <rect x="153" y="53" width="54" height="44" rx="14" fill="#0f172a" />

                  {/* Eyes Expression: Always Calm & Focused! */}
                  <g className="eyes-calm">
                    <rect x="166" y="65" width="5.5" height="15" rx="2.75" fill="#ffffff" />
                    <rect x="188.5" y="65" width="5.5" height="15" rx="2.75" fill="#ffffff" />
                  </g>

                  {/* Arms Expression: Always Steady, working & stamping diligently */}
                  <g className="arms-steady">
                    <path d="M 152 122 Q 130 152 142 182" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path
                      d="M 208 122 Q 225 152 210 180"
                      stroke="#0f172a"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      className={isStamping ? 'arm-stamp-active' : ''}
                    />
                    <rect x="206" y={isStamping ? "178" : "174"} width="9" height="7" rx="1.5" fill="#0070f3" stroke="#0f172a" strokeWidth="1.5" />
                  </g>
                </g>

                {/* Laptop on desk */}
                <g className="laptop-desk" transform="translate(-20, 0)">
                  <path d="M 160 185 L 170 170 L 190 170 L 200 185 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="1.8" />
                  <path d="M 170 170 L 172 150 L 188 150 L 190 170 Z" fill="#0f172a" />
                </g>

                {/* Coffee Mug: Always Upright and Calm! */}
                <g className="coffee-upright" transform="translate(-20, 0)">
                  <rect x="245" y="170" width="14" height="15" rx="2" fill="#ffffff" stroke="#0f172a" strokeWidth="1.8" />
                  <path d="M 259 173 C 263 173, 263 181, 259 181" fill="none" stroke="#0f172a" strokeWidth="1.6" />
                </g>

                {/* Dynamic Visible Paper Stack on Desk */}
                <g className="desk-stack-layer">
                  {/* Traditional / Flood Stack (Phase 2 & 3, and while old stack clears in early Phase 4) */}
                  {(!isComply2RegActive || time < 16.5) && deskStackCount > 0 && (
                    <g className="traditional-desk-stack">
                      {Array.from({ length: Math.min(deskStackCount, 16) }).map((_, i) => {
                        const yPos = 181 - i * 6.5
                        const rotation = (i % 3 - 1) * 2.5
                        return (
                          <g key={i} transform={`rotate(${rotation} 45 ${yPos})`}>
                            <rect x="22" y={yPos} width="52" height="9" rx="1.5" fill="#ffffff" stroke="#0f172a" strokeWidth="1.8" />
                            <line x1="27" y1={yPos + 4.5} x2="48" y2={yPos + 4.5} stroke="#94a3b8" strokeWidth="1.2" />
                          </g>
                        )
                      })}
                    </g>
                  )}

                  {/* Comply2Reg Clean Stack (ONLY when verified documents actually arrive, time >= 16.5) */}
                  {isComply2RegActive && time >= 16.5 && deskStackCount > 0 && (
                    <g className="c2r-desk-stack">
                      {Array.from({ length: deskStackCount }).map((_, i) => {
                        const isTop = i === deskStackCount - 1
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
                            {/* ONLY our logo on top sheet, NO tick! */}
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
                  )}
                </g>

                {/* Stamp Pop Feedback */}
                {isStamping && (
                  <g className="stamp-pop-badge" transform="translate(110, 160)">
                    <rect x="-9" y="-9" width="18" height="18" rx="9" fill="#0070f3" />
                    <path d="M -4 0 L -1 3 L 4 -3" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </g>
                )}

                {/* Legacy Core Ledger */}
                <g transform="translate(30, 200)">
                  <rect x="0" y="0" width="260" height="46" rx="12" fill="#f8fafc" fillOpacity="0.95" stroke="#e2e8f0" strokeWidth="1.2" />
                  <text x="130" y="20" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="13.5" fontWeight="600" fill="#0f172a">Legacy Core Ledger (1983)</text>
                  <text x="130" y="36" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="12" fill="#64748b">+ 40 years of patched systems</text>
                </g>
              </g>
            )}

          </svg>

        </div>

      </div>
    </section>
  )
}

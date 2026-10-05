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
  // Timeline Constants:
  // 14.5s: Comply2Reg logo materializes at center
  // + 30.0s: play verified delivery and stamping with the logo
  // 44.5s: restart the narrative loop from the beginning
  const LOGO_APPEAR_TIME = 14.5
  const POST_LOGO_DURATION = 30.0
  const TOTAL_CYCLE_DURATION = LOGO_APPEAR_TIME + POST_LOGO_DURATION // 44.5s

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
        // ONLY when this component is completely out of the screen:
        // pause it, reset to the beginning
        if (!entry.isIntersecting || entry.intersectionRatio === 0) {
          setIsPlaying(false)
          setTime(0)
          lastTimeRef.current = null
        } else if (entry.isIntersecting) {
          // Starts immediately when user scrolls to the component
          setIsPlaying(true)
        }
      },
      {
        threshold: [0, 0.01]
      }
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

    lastTimeRef.current = null

    const loop = (timestamp) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp
      }
      const delta = (timestamp - lastTimeRef.current) / 1000
      lastTimeRef.current = timestamp

      setTime((prev) => {
        const nextTime = prev + delta
        if (nextTime >= TOTAL_CYCLE_DURATION) {
          // Loop back to beginning after 30 seconds of logo animation!
          return 0
        }
        return nextTime
      })

      reqRef.current = requestAnimationFrame(loop)
    }

    reqRef.current = requestAnimationFrame(loop)
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current)
    }
  }, [isPlaying])

  // -------------------------------------------------------------
  // STORY PHASES (Snappy, engaging, fast-paced for web visitors)
  // -------------------------------------------------------------
  // Stage is ALWAYS fully rendered and visible — zero blank delay!
  // Banker is at desk ready from 0.0s
  // 1.0s - 9.5s: Traditional sources arrive, files move along 90° trunk, desk stack grows
  // 9.5s - 14.5s: Digital sources arrive, stream files, stack piles high to 16 sheets
  // 14.5s - 44.5s (30s): Comply2Reg enters at center, clears mess, delivers verified docs with logo
  const isBankerVisible = true
  const isTraditionalPhase = time >= 1.0 && time < 9.5
  const isDigitalOverload = time >= 9.5 && time < 14.5
  const isComply2RegActive = time >= 14.5

  // Core stream cards are already established and visible — no empty page!
  const showNode1 = true
  const showNode2 = true
  const showNode3 = true
  const showNode4 = true
  const showNode5 = true
  const showNode6 = true

  // Digital additions (arrive dynamically in Phase 3)
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
  // PHYSICAL DESK STACK BEHAVIOR & BANKER FEEDBACK
  // -------------------------------------------------------------
  let deskStackCount = 0
  let isStamping = false
  let bankerSymbol = 'tick' // 'tick' = Solved, 'neutral' = Doubtful, 'cross' = Missed

  if (isTraditionalPhase) {
    if (time >= 4.6 && time < 6.0) {
      deskStackCount = 1
      isStamping = time >= 4.7 && time < 5.3
      bankerSymbol = 'tick' // Doc 1: Solved
    } else if (time >= 6.0 && time < 7.4) {
      deskStackCount = 2
      isStamping = time >= 6.1 && time < 6.7
      bankerSymbol = 'neutral' // Doc 2: Doubtful
    } else if (time >= 7.4 && time < 8.6) {
      deskStackCount = 3
      isStamping = time >= 7.5 && time < 8.1
      bankerSymbol = 'tick' // Doc 3: Solved
    } else if (time >= 8.6 && time < 9.5) {
      deskStackCount = 4
      isStamping = time >= 8.7 && time < 9.3
      bankerSymbol = 'cross' // Doc 4: Missed
    }
  } else if (isDigitalOverload) {
    // Digital flood: Stacks up to 16 sheets briskly over 5 seconds
    const progress = Math.min((time - 9.5) / 4.5, 1)
    deskStackCount = Math.floor(4 + progress * 12) // Towers up to 16 sheets

    // Rapid stamping under overload (every 1.0s)
    const stampCycle = (time - 9.5) % 1.0
    isStamping = stampCycle >= 0.25 && stampCycle < 0.75

    // Overload misses increase heavily! (75% missed, 25% doubtful)
    const cycleIndex = Math.floor((time - 9.5) / 1.0)
    const overloadPattern = ['cross', 'cross', 'neutral', 'cross', 'cross']
    bankerSymbol = overloadPattern[cycleIndex % overloadPattern.length]
  } else if (isComply2RegActive) {
    // After logo: strictly ONLY ticks! (100% Solved)
    bankerSymbol = 'tick'

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
      } else {
        const cycleIndex = Math.floor((elapsed - flightDuration) / cycleTime)
        const cycleProgress = (elapsed - flightDuration) % cycleTime
        deskStackCount = Math.min(cycleIndex + 1, 5)
        // Banker stamps when verified file arrives (starts right after arrival, lasts 0.6s)
        isStamping = cycleProgress >= 0.15 && cycleProgress < 0.75
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

  // High-contrast, prominent status badge shown on the Banker character
  // Implying: 'tick' = Solved, 'neutral' = Doubtful, 'cross' = Missed
  const renderBankerSymbol = (type) => {
    // Post-logo rule: strictly only ticks!
    const effectiveType = isComply2RegActive ? 'tick' : type

    if (effectiveType === 'tick') {
      return (
        <g className="banker-badge-tick" filter="url(#badge-soft-shadow)">
          {/* Bigger, bold emerald green verified badge (Solved) */}
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
      )
    }

    if (effectiveType === 'neutral') {
      return (
        <g className="banker-badge-neutral" filter="url(#badge-soft-shadow)">
          {/* Neutral symbol: question mark on white with sleek grey background (Doubtful) */}
          <circle cx="0" cy="0" r="16.5" fill="#64748b" stroke="#ffffff" strokeWidth="2.8" />
          <circle cx="0" cy="0" r="11.8" fill="#ffffff" />
          <text
            x="0"
            y="5.8"
            textAnchor="middle"
            fontFamily="var(--font-sans), system-ui, sans-serif"
            fontSize="16.5"
            fontWeight="900"
            fill="#475569"
          >
            ?
          </text>
        </g>
      )
    }

    if (effectiveType === 'cross') {
      return (
        <g className="banker-badge-cross" filter="url(#badge-soft-shadow)">
          {/* Cross symbol: crimson red alert badge (Missed) */}
          <circle cx="0" cy="0" r="16.5" fill="#ef4444" stroke="#ffffff" strokeWidth="2.8" />
          <path
            d="M -5.8 -5.8 L 5.8 5.8 M 5.8 -5.8 L -5.8 5.8"
            stroke="#ffffff"
            strokeWidth="3.6"
            strokeLinecap="round"
          />
        </g>
      )
    }

    return null
  }

  // Helper to render an interpolating document strictly along the 90-degree orthogonal line
  // Clean, unannotated data documents/packets
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
        <div className="flow-stage-card">

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
              <filter id="badge-soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.25" />
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
                {/* Feeder Lines — keep original styles so they look the same as before C2R appears */}
                <line x1="360" y1={streamY.node1} x2={trunkX} y2={streamY.node1} className="pipe-wire line-streaming" />
                <line x1="360" y1={streamY.node2} x2={trunkX} y2={streamY.node2} className="pipe-wire line-streaming" />
                <line x1="360" y1={streamY.node3} x2={trunkX} y2={streamY.node3} className="pipe-wire line-streaming" />
                <line x1="360" y1={streamY.node4} x2={trunkX} y2={streamY.node4} className="pipe-wire line-streaming" />
                <line x1="360" y1={streamY.node5} x2={trunkX} y2={streamY.node5} className="pipe-wire line-ondemand" />
                <line x1="360" y1={streamY.node6} x2={trunkX} y2={streamY.node6} className="pipe-wire line-batch" />
                <line x1="360" y1={streamY.digitalAssets} x2={trunkX} y2={streamY.digitalAssets} className="pipe-wire digital-line-surge" />
                <line x1="360" y1={streamY.alternativeData} x2={trunkX} y2={streamY.alternativeData} className="pipe-wire digital-line-surge" />

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

            {/* Phase 3: Digital streams (Files glide smoothly along 90° trunk into bank) */}
            {isDigitalOverload && (
              <g className="moving-docs-flood">
                {/* Smooth stream from Node 1 (1.4s flight) */}
                {renderMovingDoc(((time - 9.5) / 1.4) % 1, 360, streamY.node1, trunkX, deskCenterTarget.x, deskCenterTarget.y)}
                {/* Smooth stream from Node 3 (1.5s flight) */}
                {renderMovingDoc((((time - 9.5) + 0.7) / 1.5) % 1, 360, streamY.node3, trunkX, deskCenterTarget.x, deskCenterTarget.y)}
                {/* Smooth stream from Node 5 (1.6s flight) */}
                {renderMovingDoc((((time - 9.5) + 0.3) / 1.6) % 1, 360, streamY.node5, trunkX, deskCenterTarget.x, deskCenterTarget.y)}
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
                {renderMovingDoc((((time - 14.5) + 0.3) / 1.5) % 1, 360, streamY.alternativeData, trunkX, c2rIntakeTarget.x, c2rIntakeTarget.y, true)}

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
                          strokeWidth="2"
                        />
                        <path d="M 10 -26 L 10 -18 L 18 -18 Z" fill="#eff6ff" stroke="#0070f3" strokeWidth="1.5" />
                        {/* Official Comply2Reg logo */}
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

              {/* Authentic Sketch Legend — Bottom-Right Corner */}
              <g transform="translate(1155, 680)">
                <text x="0" y="0" fontFamily="var(--font-sans)" fontSize="16" fontWeight="700" fill="#94a3b8" letterSpacing="0.04em">how fast it arrives:</text>

                {/* Row 1 — streaming */}
                <line x1="0" y1="24" x2="36" y2="24" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                <text x="46" y="29" fontFamily="var(--font-sans)" fontSize="16" fontWeight="500" fill="#64748b">streaming</text>

                {/* Row 2 — batch */}
                <line x1="0" y1="56" x2="36" y2="56" stroke="#94a3b8" strokeWidth="2.8" strokeDasharray="6 4" strokeLinecap="round" />
                <text x="46" y="61" fontFamily="var(--font-sans)" fontSize="16" fontWeight="500" fill="#64748b">batch</text>

                {/* Row 3 — on consent */}
                <line x1="0" y1="88" x2="36" y2="88" stroke="#94a3b8" strokeWidth="2.8" strokeDasharray="2 5" strokeLinecap="round" />
                <text x="46" y="93" fontFamily="var(--font-sans)" fontSize="16" fontWeight="500" fill="#64748b">on consent</text>
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

                {/* AskLia Official Banker Character (Subtle overwhelmed face in Phase 3, calm face in Phase 4) */}
                <g
                  className="banker-character asklia-banker-sticker"
                  style={{
                    transform: isStamping ? 'translateY(3px)' : 'translateY(0)',
                    transition: 'transform 0.14s ease'
                  }}
                >
                  <image
                    href={`${import.meta.env.BASE_URL}images/${isDigitalOverload ? 'banker_asklia_overload.png' : 'banker_asklia.png'}`}
                    x="75"
                    y="24"
                    width="175"
                    height="161"
                    preserveAspectRatio="xMidYMid meet"
                  />
                </g>



                {/* Coffee Mug: Prominent, Upright & Steaming */}
                <g className="coffee-upright">
                  {/* Subtle Gentle Steam */}
                  <path d="M 254 150 Q 251 144 255 138" stroke="#94a3b8" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7" />
                  <path d="M 263 151 Q 266 145 262 139" stroke="#94a3b8" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7" />
                  {/* Mug Handle */}
                  <path d="M 272 163 C 283 163, 283 180, 272 180" fill="none" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />
                  {/* Mug Body */}
                  <rect x="246" y="156" width="26" height="29" rx="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2.4" />
                  {/* Accent Brand Line on Mug */}
                  <line x1="248" y1="170" x2="270" y2="170" stroke="#0070f3" strokeWidth="2" strokeLinecap="round" />
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
                            {/* Comply2Reg clean logo on top sheet */}
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

                {/* Stamp Pop Feedback on the Banker character:
                    Tick (Solved), Neutral ? on white with background (Doubtful), Cross (Missed) */}
                {isStamping && (
                  <g className="stamp-pop-badge">
                    {renderBankerSymbol(bankerSymbol)}
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

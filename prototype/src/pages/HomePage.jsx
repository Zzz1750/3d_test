import { useState, useEffect } from 'react'
import Scene3D from '../components/Scene3D'
import HeroText from '../components/HeroText'
import StatsCreds from '../components/StatsCreds'
import LoadingScreen from '../components/LoadingScreen'
import IntroStatement from '../components/IntroStatement'
import ProblemStatement from '../components/ProblemStatement'
import ThinkMascotBanner from '../components/ThinkMascotBanner'
import BankNarrativeFlow from '../components/BankNarrativeFlow'
import ProductShowcase from '../components/ProductShowcase'
import WorkflowIntegrations from '../components/WorkflowIntegrations'
import BlogStudiesShowcase from '../components/BlogStudiesShowcase'
import CityCommandHUD from '../components/CityCommandHUD'
import RegulatoryTicker from '../components/RegulatoryTicker'
import './HomePage.css'

export default function HomePage() {
  const [loadingProgress, setLoadingProgress] = useState(10)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isOverlayMounted, setIsOverlayMounted] = useState(true)

  useEffect(() => {
    let progressTimer = null
    let hasLoaded = false

    progressTimer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) return prev
        const step = Math.random() * 8 + 4
        return Math.min(Math.round(prev + step), 90)
      })
    }, 120)

    const handleReady = () => {
      if (hasLoaded) return
      hasLoaded = true

      if (progressTimer) clearInterval(progressTimer)
      setLoadingProgress(100)

      setTimeout(() => {
        setIsLoaded(true)
        setTimeout(() => {
          setIsOverlayMounted(false)
        }, 700)
      }, 400)
    }

    window.addEventListener('glb-model-ready', handleReady)

    const fallbackTimer = setTimeout(() => {
      handleReady()
    }, 6000)

    return () => {
      if (progressTimer) clearInterval(progressTimer)
      clearTimeout(fallbackTimer)
      window.removeEventListener('glb-model-ready', handleReady)
    }
  }, [])

  return (
    <div className="app-viewport">
      {/* Loading Screen */}
      {isOverlayMounted && (
        <LoadingScreen
          progress={loadingProgress}
          isLoaded={isLoaded}
        />
      )}

      {/* Hero Section Container: Split Layout with Ambient High-Tech Stage */}
      <section className="hero-viewport-section">
        {/* Ambient Stage Background: Subtle Blueprint Mesh & Soft Cyan Radiance */}
        <div className="hero-ambient-blueprint" aria-hidden="true" />
        <div className="hero-radiant-glow" aria-hidden="true" />

        <div className="hero-split-layout">
          {/* Left Column: Headline, Description, Interactive CTAs & Proof Cards */}
          <div className="hero-content-col">
            <HeroText />
            <StatsCreds />
          </div>

          {/* Right Column: 3D Scene + Interactive Command HUD Overlay */}
          <div className="hero-3d-col">
            <div className="hero-3d-scene-wrap">
              <Scene3D isLoaded={isLoaded} />
            </div>

            {/* Interactive City Command HUD */}
            <CityCommandHUD isLoaded={isLoaded} />
          </div>
        </div>

        {/* Live Horizon Regulatory Ticker (Base of Hero) */}
        <RegulatoryTicker />
      </section>

      {/* Centered Intro Statement */}
      <IntroStatement />

      {/* Problem Statement Section */}
      <ProblemStatement />

      {/* Epiphany Think Mascot: Between Problem Statement & Bank Narrative Flow */}
      <ThinkMascotBanner />

      {/* Centered Data Streams & Overloaded Banker Diagram (Directly Under Problem Statement) */}
      <section className="banker-diagram-section-wrapper">
        <BankNarrativeFlow />
      </section>

      {/* Product Showcase Section (Video on left, details & CTA on right) */}
      <ProductShowcase />

      {/* Blog & Regulatory Case Studies 3D Coverflow Showcase */}
      <BlogStudiesShowcase />

      {/* Workflow Integrations: ServiceNow, Teams, Confluence, Slack, SharePoint, Archer */}
      <WorkflowIntegrations />
    </div>
  )
}

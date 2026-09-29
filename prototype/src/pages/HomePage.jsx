import { useState, useEffect } from 'react'
import Scene3D from '../components/Scene3D'
import HeroText from '../components/HeroText'
import StatsCreds from '../components/StatsCreds'
import LoadingScreen from '../components/LoadingScreen'
import IntroStatement from '../components/IntroStatement'
import ProblemStatement from '../components/ProblemStatement'
import BankNarrativeFlow from '../components/BankNarrativeFlow'
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

      {/* Hero Section Container */}
      <section className="hero-viewport-section">
        <HeroText />
        <StatsCreds />
        <div className="vignette-overlay" aria-hidden="true" />
        <Scene3D isLoaded={isLoaded} />
      </section>

      {/* Centered Intro Statement */}
      <IntroStatement />

      {/* Problem Statement Section */}
      <ProblemStatement />

      {/* Centered Data Streams & Overloaded Banker Diagram (Directly Under Problem Statement) */}
      <section className="banker-diagram-section-wrapper">
        <BankNarrativeFlow />
      </section>
    </div>
  )
}

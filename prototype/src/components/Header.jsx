import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Header.css'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 30)

      if (currentScrollY > 90) {
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 6) {
          // Scrolling down -> hide header
          setIsHidden(true)
        } else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 6) {
          // Scrolling up -> show header
          setIsHidden(false)
        }
      } else {
        // Near top of page -> always visible
        setIsHidden(false)
      }

      lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Products', path: '/products' },
    { label: 'RegOS', path: '/regos' },
    { label: 'Blogs', path: '/blogs' },
    { label: 'About us', path: '/about' },
  ]

  return (
    <header
      className={`app-navbar ${isScrolled ? 'scrolled' : ''} ${
        isHidden ? 'hidden' : ''
      }`}
    >
      {/* Unified Frosted Cloud Background Layer */}
      <div className="navbar-cloud-bg" aria-hidden="true" />

      {/* Left: Brand Logo */}
      <div className="navbar-logo">
        <Link to="/" aria-label="Comply2Reg Home">
          <img
            src={`${import.meta.env.BASE_URL}images/logo.png`}
            alt="Comply2Reg Logo"
          />
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <nav className="navbar-links" aria-label="Main Navigation">
        {navLinks.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Right: Black and White Play Action Button */}
      <div className="navbar-actions">
        <button className="btn-play" type="button" aria-label="Play">
          <svg
            className="play-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>Play</span>
        </button>
      </div>
    </header>
  )
}

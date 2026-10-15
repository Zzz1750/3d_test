import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './Header.css'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const handleClickOutside = (e) => {
      if (!e.target.closest('.app-navbar')) {
        setIsMobileMenuOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 30)

      if (currentScrollY > 90) {
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 6) {
          // Scrolling down -> hide header on desktop
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
        isHidden && !isMobileMenuOpen ? 'hidden' : ''
      } ${isMobileMenuOpen ? 'menu-open' : ''}`}
    >
      {/* Unified Frosted Cloud Background Layer */}
      <div className="navbar-cloud-bg" aria-hidden="true" />

      {/* Left: Brand Logo */}
      <div className="navbar-logo">
        <Link to="/" aria-label="Comply2Reg Home" onClick={() => setIsMobileMenuOpen(false)}>
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

      {/* Right: Demo Action Button & Mobile Menu Toggle */}
      <div className="navbar-actions">
        <Link to="/demo" className="navbar-top-demo-link" style={{ textDecoration: 'none' }}>
          <button className="btn-header-demo" type="button" aria-label="Book a Demo">
            <img
              src={`${import.meta.env.BASE_URL}images/icon.png`}
              alt=""
              className="header-demo-icon"
            />
            <span>Book a Demo</span>
          </button>
        </Link>

        {/* Mobile & Tablet Hamburger Toggle */}
        <button
          className={`navbar-hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          type="button"
        >
          <span className="hamburger-bar top-bar" />
          <span className="hamburger-bar mid-bar" />
          <span className="hamburger-bar bot-bar" />
        </button>
      </div>

      {/* Mobile Drawer Navigation (<= 820px) */}
      <div className={`navbar-mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-inner">
          <nav className="mobile-nav-links" aria-label="Mobile Navigation">
            {navLinks.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `mobile-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <span>{item.label}</span>
                <span className="mobile-nav-arrow" aria-hidden="true">&rarr;</span>
              </NavLink>
            ))}
          </nav>

          <div className="mobile-drawer-footer">
            <Link
              to="/demo"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ textDecoration: 'none', width: '100%' }}
            >
              <button className="btn-mobile-drawer-demo" type="button">
                <img
                  src={`${import.meta.env.BASE_URL}images/icon.png`}
                  alt=""
                  className="header-demo-icon"
                />
                <span>Book a Demo</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

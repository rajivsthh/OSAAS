import React, { useState } from 'react'
import { Menu, LogOut, Settings, Bell } from 'lucide-react'
import './Navigation.css'

export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>Apricity</h1>
          <span className="tagline">Security Monitoring Hub</span>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu size={24} />
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="nav-links">
            <a href="/" className="nav-link">Dashboard</a>
            <a href="/alerts" className="nav-link">Alerts</a>
            <a href="/vulnerabilities" className="nav-link">Vulnerabilities</a>
            <a href="/network" className="nav-link">Network</a>
            <a href="/reports" className="nav-link">Reports</a>
          </div>

          <div className="nav-actions">
            <button className="nav-icon-btn">
              <Bell size={20} />
            </button>
            <button className="nav-icon-btn">
              <Settings size={20} />
            </button>
            <button className="logout-btn">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

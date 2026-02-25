import React from 'react'
import './index.css'

export * from './AlertCard'
export * from './StatCard'
export * from './Navigation'

export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`container ${className}`}>{children}</div>

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`card ${className}`}>{children}</div>

export const Button: React.FC<{
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  onClick?: () => void
  className?: string
}> = ({ children, variant = 'primary', onClick, className = '' }) => (
  <button className={`btn btn-${variant} ${className}`} onClick={onClick}>
    {children}
  </button>
)

'use client'

import { useState } from 'react'
import { ChevronDown, Settings, User, LogOut, Menu } from 'lucide-react'

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const [showAccountMenu, setShowAccountMenu] = useState(false)

  return (
    <header className="bg-card border-b border-border h-14 flex items-center justify-between px-4">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="lg:hidden p-1" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="font-bold text-base sm:text-lg">Based</span>
          <span className="text-xs bg-orange-500/20 text-orange-500 px-1.5 sm:px-2 py-0.5 rounded hidden sm:inline">BETA</span>
        </div>

        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 ml-4 xl:ml-8">
          <button className="flex items-center space-x-1 text-sm hover:text-primary transition-colors">
            <span>Trade</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          <a href="#" className="text-sm hover:text-primary transition-colors">Portfolio</a>
          <a href="#" className="text-sm hover:text-primary transition-colors">Markets</a>
          <a href="#" className="text-sm hover:text-primary transition-colors">Leaderboard</a>
        </nav>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
          Connect Wallet
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="flex items-center space-x-1 sm:space-x-2 bg-secondary px-2 sm:px-3 py-1.5 rounded hover:bg-muted transition-colors"
          >
            <User className="h-4 w-4" />
            <span className="text-xs sm:text-sm hidden sm:inline">Account</span>
            <ChevronDown className="h-3 w-3 hidden sm:block" />
          </button>

          {showAccountMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
              <a href="#" className="flex items-center space-x-2 px-4 py-3 hover:bg-muted transition-colors">
                <User className="h-4 w-4" />
                <span className="text-sm">Profile</span>
              </a>
              <a href="#" className="flex items-center space-x-2 px-4 py-3 hover:bg-muted transition-colors">
                <Settings className="h-4 w-4" />
                <span className="text-sm">Settings</span>
              </a>
              <hr className="border-border" />
              <button className="flex items-center space-x-2 px-4 py-3 hover:bg-muted transition-colors w-full text-left">
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
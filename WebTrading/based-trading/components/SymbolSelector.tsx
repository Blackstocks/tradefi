'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, Star, X } from 'lucide-react'
import { TRADING_PAIRS } from '@/utils/marketData'

interface SymbolSelectorProps {
  currentSymbol: string
  onSymbolChange: (symbol: string, name: string) => void
}

export default function SymbolSelector({ currentSymbol, onSymbolChange }: SymbolSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<'SPOT' | 'FUTURES' | 'FOREX' | 'STOCKS' | 'INDICES'>('SPOT')
  const [favorites, setFavorites] = useState<string[]>(['BINANCE:BTCUSDT', 'BINANCE:ETHUSDT'])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Get current symbol info
  const getCurrentSymbolInfo = () => {
    for (const category of Object.keys(TRADING_PAIRS) as Array<keyof typeof TRADING_PAIRS>) {
      const found = TRADING_PAIRS[category].find(pair => pair.symbol === currentSymbol)
      if (found) return found
    }
    return { symbol: currentSymbol, name: 'BTC/USDT', exchange: 'Binance' }
  }

  const currentSymbolInfo = getCurrentSymbolInfo()

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    )
  }

  const filteredPairs = TRADING_PAIRS[activeCategory].filter(pair =>
    pair.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pair.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const favoritePairs = favorites
    .map(fav => {
      for (const category of Object.keys(TRADING_PAIRS) as Array<keyof typeof TRADING_PAIRS>) {
        const found = TRADING_PAIRS[category].find(pair => pair.symbol === fav)
        if (found) return found
      }
      return null
    })
    .filter(Boolean)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-secondary hover:bg-muted rounded transition-colors"
      >
        <div className="text-left">
          <div className="font-semibold text-sm">{currentSymbolInfo.name}</div>
          <div className="text-xs text-muted-foreground">{currentSymbolInfo.exchange}</div>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-card border border-border rounded-lg shadow-xl z-50">
          {/* Search Bar */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search symbols..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary pl-9 pr-9 py-2 text-sm rounded focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex border-b border-border">
            {(Object.keys(TRADING_PAIRS) as Array<keyof typeof TRADING_PAIRS>).map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Symbol List */}
          <div className="max-h-96 overflow-y-auto">
            {/* Favorites Section */}
            {!searchQuery && favoritePairs.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs text-muted-foreground bg-muted/50">
                  Favorites
                </div>
                {favoritePairs.map(pair => pair && (
                  <button
                    key={pair.symbol}
                    onClick={() => {
                      onSymbolChange(pair.symbol, pair.name)
                      setIsOpen(false)
                    }}
                    className={`w-full px-4 py-3 hover:bg-muted transition-colors flex items-center justify-between group ${
                      currentSymbol === pair.symbol ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <div className="text-left">
                        <div className="font-medium">{pair.name}</div>
                        <div className="text-xs text-muted-foreground">{pair.exchange}</div>
                      </div>
                    </div>
                  </button>
                ))}
                <div className="border-b border-border" />
              </>
            )}

            {/* Regular Symbols */}
            <div className="px-4 py-2 text-xs text-muted-foreground bg-muted/50">
              {activeCategory} Markets
            </div>
            {filteredPairs.map(pair => (
              <div
                key={pair.symbol}
                onClick={() => {
                  onSymbolChange(pair.symbol, pair.name)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-3 hover:bg-muted transition-colors flex items-center justify-between group cursor-pointer ${
                  currentSymbol === pair.symbol ? 'bg-muted' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(pair.symbol)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-secondary rounded"
                  >
                    <Star className={`h-4 w-4 ${
                      favorites.includes(pair.symbol)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-muted-foreground'
                    }`} />
                  </button>
                  <div className="text-left">
                    <div className="font-medium">{pair.name}</div>
                    <div className="text-xs text-muted-foreground">{pair.exchange}</div>
                  </div>
                </div>
                {currentSymbol === pair.symbol && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
              </div>
            ))}

            {filteredPairs.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No symbols found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import { Search, Star } from 'lucide-react'
import Image from 'next/image'

interface Token {
  symbol: string
  price: number
  change24h: number
  volume: number
  volumeUSD?: number
  icon?: string
  iconImage?: string
  spot?: boolean
}

const mockTopVolume: Token[] = [
  { symbol: 'ETH:PERP', price: 4083.49, change24h: -3.64, volume: 78.448, iconImage: '/image/eth.png' },
  { symbol: 'BTC:PERP', price: 113782.01, change24h: -1.56, volume: 61.158, iconImage: '/image/bit.png' },
  { symbol: 'SOL:PERP', price: 198.85, change24h: -2.8, volume: 18.468, iconImage: '/image/sol.jpg' },
  { symbol: 'XRP:PERP', price: 2.6124, change24h: -1.31, volume: 7.988, icon: '❌' },
  { symbol: 'BNB:PERP', price: 1126.39, change24h: -1.97, volume: 6.738, icon: '🟡' },
  { symbol: 'ZEC:PERP', price: 327.97, change24h: -8.03, volume: 5.408, icon: '🟢' },
  { symbol: 'DOGE:PERP', price: 0.198645, change24h: -4.37, volume: 5.408, icon: '🐕' },
  { symbol: 'TRUMP:PERP', price: 6.7765, change24h: 8.56, volume: 4.148, icon: '🎯' }
]

const mockTopGainers: Token[] = [
  { symbol: 'IZEC', price: 0.003829, change24h: 130.52, volume: 1.33, volumeUSD: 1330 },
  { symbol: 'LICKO', price: 0.000121, change24h: 89.06, volume: 169.58, volumeUSD: 169580 },
  { symbol: 'COMMON', price: 0.01826, change24h: 82.6, volume: 78.78, volumeUSD: 78780 },
  { symbol: 'OL', price: 0.035181, change24h: 82.43, volume: 22.18, volumeUSD: 22180 },
  { symbol: 'OL:PERP', price: 0.03538, change24h: 81.49, volume: 798.10, volumeUSD: 798100 },
  { symbol: 'ZULU', price: 0.020914, change24h: 78.15, volume: 117.65, volumeUSD: 117650 },
  { symbol: 'DARK', price: 0.008606, change24h: 65.27, volume: 3.02, volumeUSD: 3020 },
  { symbol: 'AIBOT', price: 0.021397, change24h: 65.03, volume: 224.32, volumeUSD: 224320 },
  { symbol: 'SPEC', price: 0.3113, change24h: 53.96, volume: 12.17, volumeUSD: 12170 }
]

const mockTopLosers: Token[] = [
  { symbol: 'COAI3L', price: 0.002079, change24h: -66.14, volume: 2.48, volumeUSD: 2480 },
  { symbol: 'TRUMPSS', price: 0.004767, change24h: -51.1, volume: 1.91, volumeUSD: 1910 },
  { symbol: 'COMMON:PERP', price: 0.018455, change24h: -49.32, volume: 1.12, volumeUSD: 1120 },
  { symbol: 'NASDAQ', price: 0.10422, change24h: -43.55, volume: 8.37, volumeUSD: 8370 },
  { symbol: 'EVO', price: 0.000144, change24h: -40, volume: 415.07, volumeUSD: 415070 },
  { symbol: 'AI16Z3L', price: 0.04498, change24h: -39.32, volume: 223.32, volumeUSD: 223320 },
  { symbol: 'HBAR3S', price: 0.00594, change24h: -38.82, volume: 442.96, volumeUSD: 442960 },
  { symbol: '42:PERP', price: 0.16768, change24h: -36.48, volume: 1.60, volumeUSD: 1600 },
  { symbol: 'TRUMP3S', price: 0.01583, change24h: -36.16, volume: 1.32, volumeUSD: 1320 }
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [perpSpotToggle, setPerpSpotToggle] = useState<'perp' | 'spot'>('perp')

  const formatVolume = (volume: number, isUSD?: boolean) => {
    if (isUSD) {
      if (volume >= 1000000) {
        return `$${(volume / 1000000).toFixed(2)}M`
      } else if (volume >= 1000) {
        return `$${(volume / 1000).toFixed(1)}K`
      }
      return `$${volume}`
    }
    return `$${volume}K`
  }

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    } else if (price < 0.01) {
      return price.toFixed(6)
    } else if (price < 1) {
      return price.toFixed(6)
    }
    return price.toFixed(4)
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen flex flex-col text-white">
      <Header />
      
      <main className="flex-1 flex">
        {/* Left Sidebar - Watchlist (25%) */}
        <div className="w-[25%] bg-[#0f0f0f] border-r border-[#1a1a1a] p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Watchlist</h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Sort by:</span>
              <button className="text-orange-500 font-medium">Volume</button>
              <button className="text-gray-500">Price</button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search pairs or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#3a3a3a] placeholder-gray-600"
            />
          </div>

          {/* Column Headers */}
          <div className="flex justify-between text-xs text-gray-500 mb-4 px-1">
            <div>Pair/Volume</div>
            <div>Price / 24h Change</div>
          </div>

          {/* No favorite pairs */}
          <div className="text-center py-16">
            <div className="text-5xl mb-3 opacity-30">🔍</div>
            <div className="text-sm text-gray-500">No favorite pairs</div>
          </div>
        </div>

        {/* Right Main Content (75%) */}
        <div className="w-[75%] p-6">
          {/* Top Navigation */}
          <div className="flex items-center gap-6 mb-6">
            <button className="text-sm text-orange-500 font-medium border-b-2 border-orange-500 pb-1">
              Gainers & Losers
            </button>
            <button className="text-sm text-gray-400 hover:text-white">
              Funding Yield
            </button>
            <button className="text-sm text-gray-400 hover:text-white">
              Dex Explore
            </button>
          </div>

          {/* Three Column Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Top Volume */}
            <div className="bg-[#0f0f0f] rounded-lg p-4">
              <h2 className="text-base font-medium mb-3">Top Volume</h2>
              <div className="flex gap-1 mb-4">
                <button 
                  onClick={() => setPerpSpotToggle('perp')}
                  className={`px-2.5 py-0.5 text-xs rounded ${
                    perpSpotToggle === 'perp' ? 'bg-orange-500 text-black' : 'bg-[#1a1a1a] text-gray-400'
                  }`}
                >
                  Perp
                </button>
                <button 
                  onClick={() => setPerpSpotToggle('spot')}
                  className={`px-2.5 py-0.5 text-xs rounded ${
                    perpSpotToggle === 'spot' ? 'bg-orange-500 text-black' : 'bg-[#1a1a1a] text-gray-400'
                  }`}
                >
                  Spot
                </button>
              </div>
              <div className="space-y-3">
                {mockTopVolume.map((token) => (
                  <div 
                    key={token.symbol} 
                    className={`flex items-center justify-between px-2 py-1.5 -mx-2 rounded border border-transparent hover:bg-white/10 hover:border-white transition-all cursor-pointer ${
                      token.change24h >= 0 
                        ? 'bg-gradient-to-r from-transparent via-green-500/5 to-green-500/20' 
                        : 'bg-gradient-to-r from-transparent via-red-500/5 to-red-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <button className="text-gray-600 hover:text-orange-500">
                        <Star className="h-3.5 w-3.5" />
                      </button>
                      {token.iconImage ? (
                        <div className="w-6 h-6 relative">
                          <Image src={token.iconImage} alt={token.symbol} fill className="object-cover rounded-full" />
                        </div>
                      ) : (
                        <span className="text-lg">{token.icon}</span>
                      )}
                      <div>
                        <div className="text-sm font-medium">{token.symbol}</div>
                        <div className="text-xs text-gray-500">Volume: {formatVolume(token.volume)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">${formatPrice(token.price)}</div>
                      <div className={`text-xs ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Gainers */}
            <div className="bg-[#0f0f0f] rounded-lg p-4">
              <h2 className="text-base font-medium mb-4">Top Gainers</h2>
              <div className="space-y-3">
                {mockTopGainers.map((token) => (
                  <div 
                    key={token.symbol} 
                    className="flex items-center justify-between px-2 py-1.5 -mx-2 rounded border border-transparent hover:bg-white/10 hover:border-white transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <button className="text-gray-600 hover:text-orange-500">
                        <Star className="h-3.5 w-3.5" />
                      </button>
                      {token.iconImage && (
                        <div className="w-6 h-6 relative">
                          <Image src={token.iconImage} alt={token.symbol} fill className="object-cover rounded-full" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium">{token.symbol}</div>
                        <div className="text-xs text-gray-500">Volume: {formatVolume(token.volumeUSD!, true)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">${formatPrice(token.price)}</div>
                      <div className="text-xs text-green-500">+{token.change24h.toFixed(2)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Losers */}
            <div className="bg-[#0f0f0f] rounded-lg p-4">
              <h2 className="text-base font-medium mb-4">Top Losers</h2>
              <div className="space-y-3">
                {mockTopLosers.map((token) => (
                  <div 
                    key={token.symbol} 
                    className="flex items-center justify-between px-2 py-1.5 -mx-2 rounded border border-transparent hover:bg-white/10 hover:border-white transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <button className="text-gray-600 hover:text-orange-500">
                        <Star className="h-3.5 w-3.5" />
                      </button>
                      {token.iconImage && (
                        <div className="w-6 h-6 relative">
                          <Image src={token.iconImage} alt={token.symbol} fill className="object-cover rounded-full" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium">{token.symbol}</div>
                        <div className="text-xs text-gray-500">Volume: {formatVolume(token.volumeUSD!, true)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">${formatPrice(token.price)}</div>
                      <div className="text-xs text-red-500">{token.change24h.toFixed(2)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
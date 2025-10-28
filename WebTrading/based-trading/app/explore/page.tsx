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

const mockDexTokens = [
  { symbol: 'DUSD', icon: '💎', price: '0.9992709', change: 0, marketCap: '191.46M', liquidity: '360.16M', volume: '29.85M' },
  { symbol: 'TRUMP', icon: '👤', price: '6.894991', change: 0.36, marketCap: '1.38B', liquidity: '312.60M', volume: '29.18M' },
  { symbol: 'KOGE', icon: '🦅', price: '48.005517', change: 0, marketCap: '162.26M', liquidity: '55.46M', volume: '23.62M' },
  { symbol: 'quq', icon: '🐸', price: '0.002800399', change: -0.04, marketCap: '2.46M', liquidity: '3.71M', volume: '20.62M' },
  { symbol: 'VIRTUAL', icon: '🔵', price: '1.595295', change: 2.43, marketCap: '793.48M', liquidity: '16.50M', volume: '10.46M' },
  { symbol: 'syrupUS…', icon: '🍯', price: '1.133329', change: 0, marketCap: '261.57M', liquidity: '38.90M', volume: '9.19M' },
  { symbol: 'Anome', icon: '👾', price: '0.1558508', change: 1.47, marketCap: '4.68M', liquidity: '1.64M', volume: '6.19M' },
  { symbol: 'MERL', icon: '🔮', price: '0.3678219', change: 0.54, marketCap: '36.70M', liquidity: '2.31M', volume: '5.35M' },
  { symbol: 'AICel1', icon: '🤖', price: '0.002500167', change: 0.01, marketCap: '2.38M', liquidity: '2.65M', volume: '4.39M' },
  { symbol: 'BOOST', icon: '🚀', price: '0.1688181', change: -1.95, marketCap: '24.96M', liquidity: '2.39M', volume: '3.65M' },
  { symbol: 'HUMA', icon: '🧬', price: '0.02734113', change: 0.42, marketCap: '4.50M', liquidity: '195.93K', volume: '3.12M' },
  { symbol: 'PUMP', icon: '💧', price: '0.005039544', change: -0.82, marketCap: '5.04B', liquidity: '34.32M', volume: '2.62M' },
  { symbol: 'TAKE', icon: '🎯', price: '0.2799729', change: -0.54, marketCap: '23.58M', liquidity: '3.24M', volume: '2.27M' },
  { symbol: 'PIGGY', icon: '🐷', price: '1.574532', change: 8.32, marketCap: '125.96M', liquidity: '1.71M', volume: '2.11M' }
]

const mockFundingData = [
  { symbol: 'AIXBT', binance: 0.3373, bybit: 10.95, okx: -6.995, hyperliquid: -4.981, bitget: 10.95 },
  { symbol: 'SCR', icon: '📋', binance: 10.95, bybit: 10.95, okx: 66.336, hyperliquid: 10.95, bitget: 10.95 },
  { symbol: 'PAXTI', binance: -99.663, bybit: -40.011, okx: -63.068, hyperliquid: null, bitget: 113.442 },
  { symbol: 'ATOM', icon: '⚛️', binance: -30.511, bybit: -30.104, okx: -33.484, hyperliquid: -75.134, bitget: -30.66 },
  { symbol: 'GMT', icon: '😄', binance: 10.95, bybit: 10.95, okx: 10.95, hyperliquid: -15.559, bitget: 10.95 },
  { symbol: 'LRC', icon: '🔷', binance: 10.95, bybit: 5.075, okx: 4.261, hyperliquid: null, bitget: 10.95 },
  { symbol: 'MANTA', icon: '🐙', binance: -6.471, bybit: 10.95, okx: null, hyperliquid: 7.641, bitget: 10.95 },
  { symbol: 'GOAT', binance: 10.95, bybit: 10.95, okx: 10.95, hyperliquid: 10.95, bitget: 10.95 },
  { symbol: 'ICP', icon: '😀', binance: 7.349, bybit: 5.876, okx: 4.313, hyperliquid: null, bitget: 10.95 },
  { symbol: 'ANKR', icon: '⚪', binance: 10.95, bybit: 10.95, okx: null, hyperliquid: null, bitget: 10.95 },
  { symbol: 'RUNE', icon: '⚡', binance: 6.353, bybit: 9.869, okx: null, hyperliquid: 10.95, bitget: 10.95 },
  { symbol: 'NOM', binance: -2.875, bybit: -68.389, okx: null, hyperliquid: null, bitget: 10.95 },
  { symbol: '1000CAT', binance: 10.95, bybit: 10.95, okx: null, hyperliquid: null, bitget: 10.95 },
  { symbol: 'STBL', binance: 10.95, bybit: 10.95, okx: null, hyperliquid: 10.95, bitget: 10.95 },
  { symbol: 'BRETT', icon: '🔵', binance: -4.65, bybit: 10.95, okx: 10.95, hyperliquid: -75.731, bitget: 10.95 },
  { symbol: 'MEGA', binance: null, bybit: 10.95, okx: null, hyperliquid: 10.95, bitget: null },
  { symbol: 'SXT', binance: 9.778, bybit: 10.95, okx: null, hyperliquid: null, bitget: 10.95 }
]

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<'gainers' | 'funding' | 'dex'>('gainers')
  const [searchQuery, setSearchQuery] = useState('')
  const [perpSpotToggle, setPerpSpotToggle] = useState<'perp' | 'spot'>('perp')
  const [fundingSearch, setFundingSearch] = useState('')
  const [fundingTimeframe, setFundingTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('day')
  const [fundingSort, setFundingSort] = useState('APR')

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
    <div className="bg-[#0a0a0a] h-screen flex flex-col text-white overflow-hidden">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
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
          <div className="flex justify-between text-[10px] text-gray-500 mb-4 px-1">
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
        <div className="w-[75%] p-6 bg-[#0f0f0f] flex flex-col overflow-hidden">
          {/* Top Navigation */}
          <div className="flex items-center gap-6 mb-6">
            <button 
              onClick={() => setActiveTab('gainers')}
              className={`text-sm font-medium pb-1 ${
                activeTab === 'gainers' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Gainers & Losers
            </button>
            <button 
              onClick={() => setActiveTab('funding')}
              className={`text-sm font-medium pb-1 ${
                activeTab === 'funding' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Funding Yield
            </button>
            <button 
              onClick={() => setActiveTab('dex')}
              className={`text-sm font-medium pb-1 ${
                activeTab === 'dex' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Dex Explore
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'gainers' && (
            <div className="grid grid-cols-3 gap-4">
            {/* Top Volume */}
            <div className="bg-[#0f0f0f] rounded-lg p-4">
              <h2 className="text-base font-medium mb-3">Top Volume</h2>
              <div className="flex gap-1 mb-4">
                <button 
                  onClick={() => setPerpSpotToggle('perp')}
                  className={`px-2.5 py-0.5 text-[10px] rounded ${
                    perpSpotToggle === 'perp' ? 'bg-orange-500 text-black' : 'bg-[#1a1a1a] text-gray-400'
                  }`}
                >
                  Perp
                </button>
                <button 
                  onClick={() => setPerpSpotToggle('spot')}
                  className={`px-2.5 py-0.5 text-[10px] rounded ${
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
                        <div className="text-[10px] text-gray-500">Volume: {formatVolume(token.volume)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">${formatPrice(token.price)}</div>
                      <div className={`text-[10px] ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
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
                        <div className="text-[10px] text-gray-500">Volume: {formatVolume(token.volumeUSD!, true)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">${formatPrice(token.price)}</div>
                      <div className="text-[10px] text-green-500">+{token.change24h.toFixed(2)}%</div>
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
                        <div className="text-[10px] text-gray-500">Volume: {formatVolume(token.volumeUSD!, true)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">${formatPrice(token.price)}</div>
                      <div className="text-[10px] text-red-500">{token.change24h.toFixed(2)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {activeTab === 'funding' && (
            <div className="flex flex-col h-full space-y-3">
              {/* Funding Yield Header */}
              <div className="flex items-center justify-between flex-shrink-0">
                <h2 className="text-base font-medium">Funding Yield</h2>
                <div className="flex items-center gap-4">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search token..."
                      value={fundingSearch}
                      onChange={(e) => setFundingSearch(e.target.value)}
                      className="w-64 bg-[#0f0f0f] border border-[#2a2a2a] rounded-md pl-4 pr-4 py-2 text-sm focus:outline-none focus:border-[#3a3a3a] placeholder-gray-600"
                    />
                  </div>
                  
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <button className="flex items-center gap-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-md px-4 py-2 text-sm">
                      <span className="text-orange-500">⚡</span>
                      {fundingSort}
                      <span className="text-gray-400">▼</span>
                    </button>
                  </div>
                  
                  {/* Timeframe buttons */}
                  <div className="flex border border-[#2a2a2a] rounded overflow-hidden">
                    {(['day', 'week', 'month', 'year'] as const).map((tf, index) => (
                      <button
                        key={tf}
                        onClick={() => setFundingTimeframe(tf)}
                        className={`px-3 py-1.5 text-sm capitalize ${
                          index > 0 ? 'border-l border-[#2a2a2a]' : ''
                        } ${
                          fundingTimeframe === tf 
                            ? 'bg-[#1a1a1a] text-white' 
                            : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]/50'
                        }`}
                      >
                        {tf.charAt(0).toUpperCase() + tf.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Funding Table */}
              <div className="bg-black rounded-lg overflow-hidden p-1 flex-1 flex flex-col mb-4">
                <div className="overflow-auto flex-1">
                  <table className="w-full border-separate border-spacing-1">
                    <thead className="sticky top-0 bg-black z-10">
                      <tr>
                      <th className="text-left py-2 px-3 text-[10px] font-normal text-gray-400"></th>
                      <th className="text-left py-2 px-3 text-[10px] font-normal text-gray-400">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 relative">
                            <Image src="/image/binance.jpg" alt="Binance" fill className="object-cover rounded-full" />
                          </div>
                          <span>Binance</span> <span className="text-gray-600">⚡</span>
                        </div>
                      </th>
                      <th className="text-left py-2 px-3 text-[10px] font-normal text-gray-400">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 relative">
                            <Image src="/image/bybit.webp" alt="Bybit" fill className="object-cover rounded-full" />
                          </div>
                          <span>Bybit</span> <span className="text-gray-600">⚡</span>
                        </div>
                      </th>
                      <th className="text-left py-2 px-3 text-[10px] font-normal text-gray-400">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 relative">
                            <Image src="/image/okx.png" alt="OKX" fill className="object-cover rounded-full" />
                          </div>
                          <span>OKX</span> <span className="text-gray-600">⚡</span>
                        </div>
                      </th>
                      <th className="text-left py-2 px-3 text-[10px] font-normal text-gray-400">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 relative">
                            <Image src="/image/hyper.png" alt="Hyperliquid" fill className="object-cover rounded-full" />
                          </div>
                          <span>Hyperliquid</span> <span className="text-gray-600">⚡</span>
                        </div>
                      </th>
                      <th className="text-left py-2 px-3 text-[10px] font-normal text-gray-400">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 relative">
                            <Image src="/image/bitget.webp" alt="Bitget" fill className="object-cover rounded-full" />
                          </div>
                          <span>Bitget</span> <span className="text-gray-600">⚡</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockFundingData.map((token, index) => (
                      <>
                      <tr key={token.symbol}>
                        <td className="py-2 px-3 bg-black">
                          <div className="flex items-center gap-2">
                            <button className="text-gray-600 hover:text-orange-500">
                              <Star className="h-4 w-4" />
                            </button>
                            {token.icon && <span className="text-base">{token.icon}</span>}
                            <span className="text-[10px] font-medium">{token.symbol}</span>
                          </div>
                        </td>
                        <td className={`py-2 px-3 text-[10px] ${
                          token.binance !== null 
                            ? token.binance > 50 
                              ? 'bg-green-600/50 text-green-300' 
                              : token.binance > 10
                              ? 'bg-green-700/40 text-green-400'
                              : token.binance > 0
                              ? 'bg-green-900/30 text-green-500'
                              : token.binance < -50
                              ? 'bg-red-600/50 text-red-300'
                              : token.binance < -10
                              ? 'bg-red-700/40 text-red-400'
                              : 'bg-red-900/30 text-red-500'
                            : 'bg-black text-gray-600'
                        }`}>
                          {token.binance !== null 
                            ? `${token.binance > 0 ? '+' : ''}${token.binance.toFixed(2)}%`
                            : '-'
                          }
                        </td>
                        <td className={`py-2 px-3 text-[10px] ${
                          token.bybit !== null 
                            ? token.bybit > 50 
                              ? 'bg-green-600/50 text-green-300' 
                              : token.bybit > 10
                              ? 'bg-green-700/40 text-green-400'
                              : token.bybit > 0
                              ? 'bg-green-900/30 text-green-500'
                              : token.bybit < -50
                              ? 'bg-red-600/50 text-red-300'
                              : token.bybit < -10
                              ? 'bg-red-700/40 text-red-400'
                              : 'bg-red-900/30 text-red-500'
                            : 'bg-black text-gray-600'
                        }`}>
                          {token.bybit !== null 
                            ? `${token.bybit > 0 ? '+' : ''}${token.bybit.toFixed(2)}%`
                            : '-'
                          }
                        </td>
                        <td className={`py-2 px-3 text-[10px] ${
                          token.okx !== null 
                            ? token.okx > 50 
                              ? 'bg-green-600/50 text-green-300' 
                              : token.okx > 10
                              ? 'bg-green-700/40 text-green-400'
                              : token.okx > 0
                              ? 'bg-green-900/30 text-green-500'
                              : token.okx < -50
                              ? 'bg-red-600/50 text-red-300'
                              : token.okx < -10
                              ? 'bg-red-700/40 text-red-400'
                              : 'bg-red-900/30 text-red-500'
                            : 'bg-black text-gray-600'
                        }`}>
                          {token.okx !== null 
                            ? `${token.okx > 0 ? '+' : ''}${token.okx.toFixed(2)}%`
                            : '-'
                          }
                        </td>
                        <td className={`py-2 px-3 text-[10px] ${
                          token.hyperliquid !== null 
                            ? token.hyperliquid > 50 
                              ? 'bg-green-600/50 text-green-300' 
                              : token.hyperliquid > 10
                              ? 'bg-green-700/40 text-green-400'
                              : token.hyperliquid > 0
                              ? 'bg-green-900/30 text-green-500'
                              : token.hyperliquid < -50
                              ? 'bg-red-600/50 text-red-300'
                              : token.hyperliquid < -10
                              ? 'bg-red-700/40 text-red-400'
                              : 'bg-red-900/30 text-red-500'
                            : 'bg-black text-gray-600'
                        }`}>
                          {token.hyperliquid !== null 
                            ? `${token.hyperliquid > 0 ? '+' : ''}${token.hyperliquid.toFixed(2)}%`
                            : '-'
                          }
                        </td>
                        <td className={`py-2 px-3 text-[10px] ${
                          token.bitget !== null 
                            ? token.bitget > 50 
                              ? 'bg-green-600/50 text-green-300' 
                              : token.bitget > 10
                              ? 'bg-green-700/40 text-green-400'
                              : token.bitget > 0
                              ? 'bg-green-900/30 text-green-500'
                              : token.bitget < -50
                              ? 'bg-red-600/50 text-red-300'
                              : token.bitget < -10
                              ? 'bg-red-700/40 text-red-400'
                              : 'bg-red-900/30 text-red-500'
                            : 'bg-black text-gray-600'
                        }`}>
                          {token.bitget !== null 
                            ? `${token.bitget > 0 ? '+' : ''}${token.bitget.toFixed(2)}%`
                            : '-'
                          }
                        </td>
                      </tr>
                      {index < mockFundingData.length - 1 && (
                        <tr>
                          <td colSpan={6} className="py-0">
                            <div className="h-[1px] bg-white/20"></div>
                          </td>
                        </tr>
                      )}
                      </>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dex' && (
            <div className="space-y-4">
              {/* DEX Tokens Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg">DEX Tokens</h2>
                <div className="flex items-center gap-4">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search tokens..."
                      className="w-64 bg-[#0f0f0f] border border-[#2a2a2a] rounded-md pl-4 pr-4 py-2 text-sm focus:outline-none focus:border-[#3a3a3a] placeholder-gray-600"
                    />
                  </div>
                  
                  {/* Time buttons */}
                  <div className="flex gap-1">
                    {['5m', '1h', '4h', '24h'].map((time) => (
                      <button
                        key={time}
                        className={`px-3 py-1.5 text-sm ${
                          time === '24h' 
                            ? 'bg-[#1a1a1a] text-white' 
                            : 'text-gray-400 hover:text-white'
                        } rounded`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  
                  {/* Network dropdown */}
                  <div className="relative">
                    <button className="flex items-center gap-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-md px-4 py-2 text-sm">
                      All Networks
                      <span className="text-gray-400">▼</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* DEX Table */}
              <div className="bg-[#0f0f0f] rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="border-b border-[#1a1a1a]">
                    <tr>
                      <th className="text-left py-2 px-3 text-[10px] font-normal text-gray-400">Token</th>
                      <th className="text-right py-2 px-3 text-[10px] font-normal text-gray-400">Price</th>
                      <th className="text-right py-2 px-3 text-[10px] font-normal text-gray-400">
                        <div className="flex items-center justify-end gap-1">
                          Change % <span className="text-[8px]">⬇</span>
                        </div>
                      </th>
                      <th className="text-right py-2 px-3 text-[10px] font-normal text-gray-400">
                        <div className="flex items-center justify-end gap-1">
                          Market Cap <span className="text-[8px]">⬇</span>
                        </div>
                      </th>
                      <th className="text-right py-2 px-3 text-[10px] font-normal text-gray-400">Liquidity</th>
                      <th className="text-right py-2 px-3 text-[10px] font-normal text-gray-400">
                        <div className="flex items-center justify-end gap-1">
                          Volume <span className="text-[8px]">⬇</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDexTokens.map((token, index) => (
                      <tr key={index} className={`border-b border-gray-700/50 hover:bg-[#2a2a2a] transition-colors ${
                        index % 2 === 0 ? 'bg-[#0f0f0f]' : 'bg-[#141414]'
                      }`}>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <button className="text-gray-600 hover:text-orange-500">
                              <Star className="h-3 w-3" />
                            </button>
                            {token.icon && (
                              <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-800">
                                <span className="text-sm">{token.icon}</span>
                              </div>
                            )}
                            <span className="text-[10px] font-medium">{token.symbol}</span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right text-[10px]">
                          ${token.price}
                        </td>
                        <td className={`py-2 px-3 text-right text-[10px] ${
                          token.change >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {token.change >= 0 ? '+' : ''}{token.change}%
                        </td>
                        <td className="py-2 px-3 text-right text-[10px]">
                          ${token.marketCap}
                        </td>
                        <td className="py-2 px-3 text-right text-[10px]">
                          ${token.liquidity}
                        </td>
                        <td className="py-2 px-3 text-right text-[10px]">
                          ${token.volume}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
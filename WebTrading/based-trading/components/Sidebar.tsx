'use client'

import { useState } from 'react'
import { ChevronDown, Calendar, Plus, AlertCircle } from 'lucide-react'

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
  const [btcAmount, setBtcAmount] = useState('')
  const [usdtAmount, setUsdtAmount] = useState('')
  const [selectedOrderType, setSelectedOrderType] = useState('mid')
  const [oolPause, setOolPause] = useState(false)
  const [entry, setEntry] = useState(false)
  const [duration, setDuration] = useState('5')
  
  return (
    <aside className="w-full h-full bg-[#0e0e0e] flex flex-col overflow-y-auto">
      <div className="p-3 flex flex-col h-full">
        {/* Account Selector */}
        <div className="mb-3">
          <button className="w-full px-3 py-2 bg-black border border-[#2a2a2a] text-white rounded-md flex items-center justify-between text-xs hover:bg-[#1a1a1a] transition-colors">
            <span>Accounts</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Buy/Sell Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${
              activeTab === 'buy'
                ? 'bg-[#00d395] text-black'
                : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#252525]'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${
              activeTab === 'sell'
                ? 'bg-[#ff3b3b] text-white'
                : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#252525]'
            }`}
          >
            Sell
          </button>
        </div>

        {/* Amount Inputs with Slider */}
        <div className="space-y-3 mb-4">
          {/* BTC Input */}
          <div>
            <div className="relative">
              <input
                type="text"
                value={btcAmount}
                onChange={(e) => setBtcAmount(e.target.value)}
                placeholder="BTC"
                className="w-full bg-black border border-[#2a2a2a] rounded-md px-3 py-2.5 pr-12 text-white text-sm outline-none focus:border-[#3a3a3a] placeholder-gray-500"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                BTC
              </div>
            </div>
            {/* Slider */}
            <div className="mt-2">
              <input
                type="range"
                min="0"
                max="100"
                value="0"
                className="w-full h-1 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">
              ≈ 0.00 BTC
            </div>
          </div>

          {/* USDT Input */}
          <div>
            <div className="relative">
              <input
                type="text"
                value={usdtAmount}
                onChange={(e) => setUsdtAmount(e.target.value)}
                placeholder="USDT"
                className="w-full bg-black border border-[#2a2a2a] rounded-md px-3 py-2.5 pr-12 text-white text-sm outline-none focus:border-[#3a3a3a] placeholder-gray-500"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                USDT
              </div>
            </div>
            {/* Slider */}
            <div className="mt-2">
              <input
                type="range"
                min="0"
                max="100"
                value="0"
                className="w-full h-1 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">
              ≈ 0.00 USDT
            </div>
          </div>
        </div>

        {/* Strategy Section */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 mb-1.5 block">Strategy</label>
          <button className="w-full px-3 py-2 bg-black border border-[#2a2a2a] text-white rounded-md flex items-center justify-between text-xs hover:bg-[#1a1a1a] transition-colors">
            <span>Impact Minimization</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Limit Price */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-500">Limit Price</label>
            <button className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dynamic
            </button>
          </div>
        </div>

        {/* Order Type Options */}
        <div className="flex flex-wrap gap-3 mb-4">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input 
              type="radio" 
              name="orderType" 
              value="mid"
              checked={selectedOrderType === 'mid'}
              onChange={(e) => setSelectedOrderType(e.target.value)}
              className="w-4 h-4" 
            />
            <span className="text-xs text-gray-400">Mid</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input 
              type="radio" 
              name="orderType" 
              value="bid"
              checked={selectedOrderType === 'bid'}
              onChange={(e) => setSelectedOrderType(e.target.value)}
              className="w-4 h-4" 
            />
            <span className="text-xs text-gray-400">Bid</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input 
              type="radio" 
              name="orderType" 
              value="down1"
              checked={selectedOrderType === 'down1'}
              onChange={(e) => setSelectedOrderType(e.target.value)}
              className="w-4 h-4" 
            />
            <span className="text-xs text-gray-400">↓1%</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input 
              type="checkbox" 
              checked={oolPause}
              onChange={(e) => setOolPause(e.target.checked)}
              className="w-4 h-4 rounded" 
            />
            <span className="text-xs text-gray-400">OOL Pause</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input 
              type="checkbox" 
              checked={entry}
              onChange={(e) => setEntry(e.target.checked)}
              className="w-4 h-4 rounded" 
            />
            <span className="text-xs text-gray-400">Entry</span>
          </label>
        </div>

        {/* Duration and Timezone */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Duration (MIN)</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-black border border-[#2a2a2a] rounded-md px-3 py-2 text-white text-sm outline-none focus:border-[#3a3a3a]"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Timezone</label>
            <button className="w-full px-3 py-2 bg-black border border-[#2a2a2a] text-white rounded-md flex items-center justify-between text-xs hover:bg-[#1a1a1a] transition-colors">
              <span className="truncate">Asia/Calcutta UTC+05:30</span>
              <ChevronDown className="h-3 w-3 flex-shrink-0 ml-1" />
            </button>
          </div>
        </div>

        {/* Time Start/End */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Time Start (Asia/Calcutta)</label>
            <div className="relative">
              <input
                type="text"
                value="10/24/2025 17:45"
                className="w-full bg-black border border-[#2a2a2a] rounded-md px-3 py-2 pr-8 text-white text-xs outline-none focus:border-[#3a3a3a]"
                readOnly
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Time End (Asia/Calcutta)</label>
            <div className="relative">
              <input
                type="text"
                value="10/24/2025 17:50"
                className="w-full bg-black border border-[#2a2a2a] rounded-md px-3 py-2 pr-8 text-white text-xs outline-none focus:border-[#3a3a3a]"
                readOnly
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-2 mb-4">
          <button className="w-full px-3 py-2 bg-black border border-[#2a2a2a] text-white rounded-md flex items-center justify-between text-xs hover:bg-[#1a1a1a] transition-colors">
            <span>Exit Conditions</span>
            <Plus className="h-4 w-4" />
          </button>
          <button className="w-full px-3 py-2 bg-black border border-[#2a2a2a] text-white rounded-md flex items-center justify-between text-xs hover:bg-[#1a1a1a] transition-colors">
            <span>Scale Orders</span>
            <Plus className="h-4 w-4" />
          </button>
          <button className="w-full px-3 py-2 bg-black border border-[#2a2a2a] text-white rounded-md flex items-center justify-between text-xs hover:bg-[#1a1a1a] transition-colors">
            <span>Advanced Settings</span>
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Spacer to push bottom content down */}
        <div className="flex-1"></div>

        {/* Pre-Trade Analytics */}
        <div className="mb-4 bg-black border border-[#2a2a2a] rounded-md p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 border border-gray-400 rounded flex items-center justify-center">
              <span className="text-[10px] text-gray-400">i</span>
            </div>
            <span className="text-[10px] text-white font-medium">Pre-Trade Analytics</span>
          </div>
          <div className="space-y-1.5 text-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-[10px]">Participation Rate</span>
              <span className="text-gray-400">-</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-[10px]">Order Volatility</span>
              <span className="text-gray-400">-</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-[10px]">Market Volume</span>
              <span className="text-gray-400">-</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-[#ff6b00] text-white rounded-md text-[10px] font-medium hover:bg-[#e55a00] transition-colors">
              Save Templates
            </button>
            <button className="flex-1 py-2 bg-[#ff6b00] text-white rounded-md text-[10px] font-medium hover:bg-[#e55a00] transition-colors">
              Load Templates
            </button>
          </div>
          
          <button className="w-full py-2.5 bg-gray-700 text-white rounded-md text-xs font-medium hover:bg-gray-600 transition-colors">
            Submit Buy Order
          </button>
          
          <button className="w-full py-2.5 bg-[#00d395] text-black rounded-md text-xs font-medium hover:bg-[#00b37d] transition-colors">
            Confirmation
          </button>
        </div>
      </div>
    </aside>
  )
}
'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import { DollarSign, Link2, ChevronDown, RefreshCw, Info } from 'lucide-react'

interface BotHistoryItem {
  pair: string
  account: string
  volume: string
  netFees: string
  pnl: string | null
  filled: number
  status: 'Canceled' | 'Complete'
}

export default function BotPage() {
  const [activeStrategy, setActiveStrategy] = useState<'aggressive' | 'normal' | 'passive'>('normal')
  const [budget, setBudget] = useState('100')
  const [volume, setVolume] = useState('0')
  const [showActiveBots, setShowActiveBots] = useState(true)
  const [directionalBias, setDirectionalBias] = useState(50)

  const botHistory: BotHistoryItem[] = [
    {
      pair: 'BTC:PERP-USDT',
      account: 'Aster - H1_arch...',
      volume: '$0.00',
      netFees: '$0.00',
      pnl: null,
      filled: 0,
      status: 'Canceled'
    },
    {
      pair: 'BTC:PERP-USDT',
      account: 'Aster - H1_arch...',
      volume: '$579.62',
      netFees: '$0.03',
      pnl: '-$0.03',
      filled: 5,
      status: 'Canceled'
    },
    {
      pair: 'BTC:PERP-USDC',
      account: 'H2_archived_ba0...',
      volume: '$14.34K',
      netFees: '$5.02',
      pnl: '-$1.72',
      filled: 100,
      status: 'Complete'
    },
    {
      pair: 'BTC:PERP-USDC',
      account: 'H2_archived_ba0...',
      volume: '$437.13',
      netFees: '$0.15',
      pnl: '-$0.12',
      filled: 3,
      status: 'Canceled'
    },
    {
      pair: 'BTC:PERP-USDC',
      account: 'H1_archived_706...',
      volume: '$15.11K',
      netFees: '$5.20',
      pnl: '-$1.38',
      filled: 53,
      status: 'Complete'
    }
  ]

  const strategies = [
    {
      id: 'aggressive',
      title: 'Aggressive',
      description: 'Tight spreads, prioritize speed',
      details: '5 minutes'
    },
    {
      id: 'normal',
      title: 'Normal',
      description: 'Default settings',
      details: '15 minutes'
    },
    {
      id: 'passive',
      title: 'Passive',
      description: 'Wide spreads, capture volatility',
      details: '30 minutes'
    }
  ]

  return (
    <div className="bg-black min-h-screen text-white">
      <Header />
      <div className="flex bg-black">
        {/* Main Content */}
        <div className="flex-1 px-16 py-6">
          {/* Account Selection */}
          <div className="mb-8">
            <label className="text-xs text-gray-400 block mb-2">Account</label>
            <button className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3 text-left hover:border-[#2a2a2a] transition-colors">
              <div className="text-sm mb-1">Select Account</div>
            </button>
          </div>

          {/* Budget and Volume */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-xs text-gray-400 block mb-2">Budget</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg pl-8 pr-4 py-3 text-base focus:outline-none focus:border-[#2a2a2a]"
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs text-gray-400 block mb-2">Volume</label>
              <div className="flex items-center gap-4">
                <button className="p-2 rounded-lg border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors">
                  <Link2 className="h-4 w-4 text-gray-400" />
                </button>
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="text"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg pl-8 pr-4 py-3 text-base focus:outline-none focus:border-[#2a2a2a]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pair & Leverage */}
          <div className="mb-8">
            <label className="text-xs text-gray-400 block mb-2">Pair & Leverage</label>
            <div className="flex items-center gap-4">
              <button className="flex-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3 flex items-center justify-between hover:border-[#2a2a2a] transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-black">₿</span>
                  </div>
                  <span className="text-sm">BTC:PERP-USDT</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              <div className="text-sm text-gray-400">1x</div>
            </div>
          </div>

          {/* Trading Strategy */}
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-4">
              {strategies.map((strategy) => (
                <button
                  key={strategy.id}
                  onClick={() => setActiveStrategy(strategy.id as any)}
                  className={`border rounded-lg p-3 text-left transition-all ${
                    activeStrategy === strategy.id
                      ? strategy.id === 'aggressive' ? 'bg-red-500/10 border-red-500/50' :
                        strategy.id === 'passive' ? 'bg-green-500/10 border-green-500/50' :
                        'bg-[#1a1a1a] border-[#2a2a2a]'
                      : 'border-[#1a1a1a] hover:border-[#2a2a2a]'
                  }`}
                >
                  <h3 className={`text-xs font-medium mb-1 ${
                    activeStrategy === strategy.id
                      ? strategy.id === 'aggressive' ? 'text-red-500' :
                        strategy.id === 'passive' ? 'text-green-500' :
                        'text-white'
                      : 'text-white'
                  }`}>
                    {strategy.title}
                  </h3>
                  <p className="text-[10px] text-gray-400 mb-1">{strategy.description}</p>
                  <p className="text-[10px] text-gray-500">{strategy.details}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Directional Bias */}
          <div className="mb-8">
            <label className="text-xs text-gray-400 block mb-2">Directional Bias</label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={directionalBias}
                onChange={(e) => setDirectionalBias(parseInt(e.target.value))}
                className="w-full h-1 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #1a1a1a ${directionalBias}%, #1a1a1a ${directionalBias}%, #10b981 100%)`
                }}
              />
              <div 
                className="absolute top-0 w-3 h-3 bg-white rounded-full -translate-x-1/2 -translate-y-1/3 transition-all"
                style={{ left: `${directionalBias}%` }}
              />
            </div>
          </div>

          {/* Start Trading Button */}
          <button className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg py-3 text-sm font-medium transition-colors">
            Start Trading
          </button>

          {/* History Section */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-normal">History</h2>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showActiveBots}
                  onChange={(e) => setShowActiveBots(e.target.checked)}
                  className="w-3 h-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded"
                />
                <span className="text-xs text-gray-400">Active Bots Only</span>
              </label>
            </div>

            {/* History Table */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1a1a1a]">
                    <th className="text-left px-4 py-3 text-xs font-normal text-gray-400">Pair</th>
                    <th className="text-left px-4 py-3 text-xs font-normal text-gray-400">Account</th>
                    <th className="text-right px-4 py-3 text-xs font-normal text-gray-400">Volume</th>
                    <th className="text-right px-4 py-3 text-xs font-normal text-gray-400">Net Fees</th>
                    <th className="text-right px-4 py-3 text-xs font-normal text-gray-400">MM PnL</th>
                    <th className="text-right px-4 py-3 text-xs font-normal text-gray-400">Filled</th>
                    <th className="text-right px-4 py-3 text-xs font-normal text-gray-400">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-normal text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {botHistory.map((item, index) => (
                    <tr key={index} className="border-b border-[#1a1a1a] last:border-0">
                      <td className="px-4 py-3 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-black">₿</span>
                          </div>
                          <span>{item.pair}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs flex items-center gap-1">
                        <Info className="h-2 w-2 text-gray-400" />
                        <span className="text-gray-300">{item.account}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-right">{item.volume}</td>
                      <td className="px-4 py-3 text-xs text-right">{item.netFees}</td>
                      <td className="px-4 py-3 text-xs text-right">
                        {item.pnl ? (
                          <span className={item.pnl.startsWith('-') ? 'text-red-500' : 'text-green-500'}>
                            {item.pnl}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-right">
                        <div className="inline-flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            item.filled === 100 
                              ? 'bg-green-500/20 text-green-500' 
                              : item.filled > 0 
                                ? 'bg-orange-500/20 text-orange-500'
                                : 'bg-gray-500/20 text-gray-500'
                          }`}>
                            {item.filled}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-right">
                        <span className={`${
                          item.status === 'Complete' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-right">
                        <button className="p-1 hover:bg-[#1a1a1a] rounded transition-colors">
                          <RefreshCw className="h-2 w-2 text-orange-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Pro-Trade Analytics */}
        <div className="w-80 bg-[#0a0a0a] border-l border-[#1a1a1a] p-6 mr-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <h3 className="text-xs font-normal">Pro-Trade Analytics</h3>
          </div>

          <div className="space-y-3 text-[10px]">
            <div>
              <p className="text-gray-400 mb-0.5 text-[10px]">Available Margin</p>
              <p className="text-gray-500">—————————————————</p>
            </div>
            
            <div>
              <p className="text-gray-400 mb-0.5 text-[10px]">Recommended Margin</p>
              <p className="text-gray-500">—————————————————</p>
            </div>
            
            <div className="flex justify-between">
              <p className="text-gray-400 text-[10px]">Exchange Fees</p>
              <p className="text-white text-[10px]">$100.00</p>
            </div>
            
            <div>
              <p className="text-gray-400 mb-0.5 text-[10px]">PnL Est.</p>
              <p className="text-gray-500">—————</p>
            </div>
            
            <div>
              <p className="text-gray-400 mb-0.5 text-[10px]">Total Est. Fees</p>
              <p className="text-gray-500">—————————————————</p>
            </div>

            <div className="pt-3 border-t border-[#1a1a1a]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                <h4 className="text-xs">Configuration</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-400 text-[10px]">Duration</p>
                  <p className="text-white text-[10px]">15 minutes</p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-gray-400 text-[10px]">Passiveness</p>
                  <p className="text-white text-[10px]">3.0%</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1a1a1a]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                <h4 className="text-xs">Lifetime Summary</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-400 text-[10px]">Volume</p>
                  <p className="text-white text-[10px]">$30.47K</p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-gray-400 text-[10px]">Net Fees</p>
                  <p className="text-white text-[10px]">$10.40</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
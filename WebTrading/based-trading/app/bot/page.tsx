'use client'

import React, { useState } from 'react'
import { ChevronDown, Activity, DollarSign, TrendingUp, RotateCcw, Play, Pause, Ban } from 'lucide-react'

export default function BotPage() {
  const [selectedAccount, setSelectedAccount] = useState('Select Account')
  const [budget, setBudget] = useState('100')
  const [volume, setVolume] = useState('0')
  const [pair, setPair] = useState('BTC:PERP-USDT')
  const [leverage, setLeverage] = useState('1')
  const [aggressive, setAggressive] = useState(50)
  const [normal, setNormal] = useState(50)
  const [passive, setPassive] = useState(50)
  const [directionalBias, setDirectionalBias] = useState(50)
  const [duration, setDuration] = useState('15')
  const [passiveness, setPassiveness] = useState('3.0')
  const [activeBotsOnly, setActiveBotsOnly] = useState(false)

  const history = [
    {
      pair: 'BTC:PERP-USDT',
      account: 'Aster',
      volume: '$579.62',
      netFees: '$0.03',
      mmPnl: '$0.03',
      filled: 5,
      status: 'Cancelled',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      pair: 'BTC:PERP-USDC',
      account: 'H2',
      volume: '$14.34K',
      netFees: '$5.02',
      mmPnl: '$1.72',
      filled: 100,
      status: 'Complete',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      pair: 'BTC:PERP-USDC',
      account: 'H2',
      volume: '$437.13',
      netFees: '$0.15',
      mmPnl: '$0.12',
      filled: 3,
      status: 'Cancelled',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      pair: 'BTC:PERP-USDC',
      account: 'H1_archived_70c...',
      volume: '$15.11K',
      netFees: '$5.20',
      mmPnl: '$1.38',
      filled: 63,
      status: 'Complete',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    }
  ]

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="flex-1 p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Trading Panel */}
          <div className="col-span-9 bg-card rounded-lg p-6">
            {/* Account Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Account</h3>
              <button className="w-full bg-secondary text-foreground px-4 py-3 rounded-lg flex items-center justify-between hover:bg-muted transition-colors">
                <span>{selectedAccount}</span>
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Budget and Volume */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Budget</h3>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-secondary text-foreground pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Volume</h3>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                  <input
                    type="text"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full bg-secondary text-foreground pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Pair & Leverage</h3>
                <div className="flex gap-2">
                  <button className="flex-1 bg-secondary text-foreground px-4 py-3 rounded-lg flex items-center justify-between hover:bg-muted transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold">B</div>
                      <span className="text-sm">{pair}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <input
                    type="text"
                    value={leverage + 'x'}
                    onChange={(e) => setLeverage(e.target.value.replace('x', ''))}
                    className="w-16 bg-secondary text-foreground text-center py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Trading Style Sliders */}
            <div className="space-y-6 mb-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-primary">Aggressive</span>
                  <span className="text-sm text-muted-foreground">Tight spreads, prioritize speed</span>
                  <span className="text-sm text-muted-foreground">5 minutes</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={aggressive}
                  onChange={(e) => setAggressive(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #f97316 0%, #f97316 ${aggressive}%, #262626 ${aggressive}%, #262626 100%)`
                  }}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Normal</span>
                  <span className="text-sm text-muted-foreground">Default settings</span>
                  <span className="text-sm text-muted-foreground">15 minutes</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={normal}
                  onChange={(e) => setNormal(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-green-500">Passive</span>
                  <span className="text-sm text-muted-foreground">Wide spreads, capture volatility</span>
                  <span className="text-sm text-muted-foreground">30 minutes</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={passive}
                  onChange={(e) => setPassive(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Directional Bias */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Directional Bias</h3>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={directionalBias}
                  onChange={(e) => setDirectionalBias(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Long</span>
                  <span>Neutral</span>
                  <span>Short</span>
                </div>
              </div>
            </div>

            {/* Start Trading Button */}
            <button className="w-full bg-secondary text-foreground py-4 rounded-lg font-medium hover:bg-muted transition-colors">
              Start Trading
            </button>
          </div>

          {/* Right Sidebar - Analytics */}
          <div className="col-span-3 bg-card rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Pre-Trade Analytics
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Available Margin</p>
                <p className="text-xl font-semibold text-foreground">-</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Recommended Margin</p>
                <p className="text-xl font-semibold text-foreground">-</p>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">Exchange Fees</p>
                <p className="text-lg font-semibold text-foreground">$100.00</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">PnL Est.</p>
                <p className="text-lg font-semibold text-foreground">-</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Est. Fees</p>
                <p className="text-lg font-semibold text-foreground">-</p>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Configuration
                </h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <span className="text-sm text-foreground">{duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Passiveness</span>
                    <span className="text-sm text-foreground">{passiveness}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Lifetime Summary
                </h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Volume</span>
                    <span className="text-sm text-foreground">$30.47K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Net Fees</span>
                    <span className="text-sm text-foreground">$10.40</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="mt-6 bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">History</h3>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={activeBotsOnly}
                onChange={(e) => setActiveBotsOnly(e.target.checked)}
                className="rounded border-border bg-secondary text-primary focus:ring-primary"
              />
              Active Bots Only
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b border-border">
                  <th className="pb-3">Pair</th>
                  <th className="pb-3">Account</th>
                  <th className="pb-3">Volume</th>
                  <th className="pb-3">Net Fees</th>
                  <th className="pb-3">MM PnL</th>
                  <th className="pb-3">Filled</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold">B</div>
                        <span className="text-sm">{row.pair}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {row.account === 'Aster' && (
                          <img src="/image/aster.png" alt="Aster" className="w-5 h-5 rounded-full" />
                        )}
                        {row.account === 'H2' && (
                          <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold">H2</div>
                        )}
                        {row.account.startsWith('H1') && (
                          <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center text-xs">?</div>
                        )}
                        <span className="text-sm">{row.account}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm">{row.volume}</td>
                    <td className="py-3 text-sm">{row.netFees}</td>
                    <td className="py-3 text-sm text-red-400">{row.mmPnl}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-16 h-6 ${row.bgColor} rounded-full flex items-center justify-center`}>
                          <span className={`text-xs font-medium ${row.color}`}>{row.filled}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`text-sm font-medium ${row.color}`}>{row.status}</span>
                    </td>
                    <td className="py-3">
                      <button className="text-primary hover:text-primary/80">
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
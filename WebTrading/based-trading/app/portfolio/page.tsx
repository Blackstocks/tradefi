'use client'

import { useMemo, useState } from 'react'
import { Pencil, Info, Clock } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/Header'
import MobileDrawer from '@/components/MobileDrawer'
import Sidebar from '@/components/Sidebar'

type Timeframe = '1d' | '7d' | '30d' | '1y'
type TabType = 'portfolio' | 'funding' | 'vcefi'

export default function PortfolioPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('7d')
  const [selectedAccount, setSelectedAccount] = useState<string | null>('A111')
  const [activeTab, setActiveTab] = useState<TabType>('portfolio')

  const accounts = [
    {
      name: 'Hyperliquid',
      logo: '/image/hyper.png',
      accounts: [
        {
          id: 'H1',
          status: '92%',
          statusColor: 'green',
          balance: '$155.00',
          change: '+0.06%',
          changeDirection: 'up',
          lastUpdate: '9 minutes ago',
        },
        {
          id: 'H2',
          status: '56%',
          statusColor: 'orange',
          balance: '$78.00',
          change: '-2.98%',
          changeDirection: 'down',
          lastUpdate: '13 minutes ago',
        },
      ],
    },
    {
      name: 'OKXDEX',
      logo: '/image/meta.webp',
      accounts: [
        {
          id: 'A111',
          balance: '$0.00',
          lastUpdate: '5 minutes ago',
          isSelected: true,
        },
      ],
    },
    {
      name: 'Aster',
      logo: '/image/aster.png',
      accounts: [
        {
          id: 'Aster',
          balance: '$19.00',
          lastUpdate: '13 minutes ago',
        },
      ],
    },
  ]

  const walletInfo = {
    type: 'ETH (Ethereum)',
    linkedWallet: '0x017751adB809febe674061add1001000bcc884139',
    tradingWallet: '0xA8773A842224F8C99da459A7bFD2a8050D19277D',
  }

  const handleAccountClick = (accountId: string) => {
    setSelectedAccount(accountId)
    setActiveTab('portfolio') // Reset to portfolio tab when switching accounts
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header onMenuClick={() => setSidebarOpen((v) => !v)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <MobileDrawer isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
            <Sidebar />
          </MobileDrawer>
        </div>

        <main className="flex w-full h-full bg-black">
          {/* Left Panel — Accounts - 30% */}
          <aside className="w-[30%] bg-[#0a0a0a] border-r border-[#1a1a1a] p-4 overflow-y-auto">
              <h1 className="text-2xl font-normal text-white mb-4">Accounts</h1>

              <div className="space-y-6">
                {accounts.map((platform, index) => (
                  <div key={index}>
                    {/* Platform header */}
                    <h2 className={`text-gray-400 font-normal ${platform.name === 'Hyperliquid' ? 'text-sm mb-3' : 'text-base mb-0'}`}>{platform.name}</h2>
                    
                    {/* Platform accounts */}
                    <div className="space-y-0">
                      {platform.accounts.map((account: any, accIndex) => (
                        <div
                          key={accIndex}
                          onClick={() => handleAccountClick(account.id)}
                          className={`bg-[#0f0f0f] border ${
                            selectedAccount === account.id ? 'border-orange-500' : 'border-[#1a1a1a]'
                          } rounded-lg p-4 relative overflow-hidden group cursor-pointer transition-all duration-300`}
                        >
                          {/* Glass hover effect */}
                          <div className="absolute inset-0 -translate-x-full group-hover:animate-[slideRight_0.5s_ease-out_forwards] pointer-events-none">
                            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-2xl" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {/* Platform logo and account info */}
                              <div className="relative">
                                <Image
                                  src={platform.logo}
                                  alt={platform.name}
                                  width={platform.name === 'Hyperliquid' ? 20 : 28}
                                  height={platform.name === 'Hyperliquid' ? 20 : 28}
                                  className="rounded-lg"
                                />
                                {platform.name === 'Hyperliquid' && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-400 rounded-full border-2 border-[#0f0f0f] flex items-center justify-center">
                                    <span className="text-black text-[8px] font-bold">H</span>
                                  </div>
                                )}
                                {platform.name === 'OKXDEX' && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-[#0f0f0f]"></div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <span className="text-white text-sm font-medium">{account.id}</span>
                                <Pencil className="h-3 w-3 text-gray-500 cursor-pointer" />
                                
                                {account.status && (
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    account.statusColor === 'green' 
                                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                  }`}>
                                    <span className="mr-1">✓</span> {account.status}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Balance and change */}
                            <div className="text-right">
                              <p className="text-white text-lg font-normal">{account.balance}</p>
                              {account.change && (
                                <p className={`text-xs ${
                                  account.changeDirection === 'up' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {account.change} <span className="text-gray-500">1d</span>
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Update time */}
                          <div className="flex items-center gap-1 mt-3">
                            <span className="text-gray-500 text-xs">Updated {account.lastUpdate}</span>
                            <Clock className="h-3 w-3 text-orange-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

          {/* Right Panel — Portfolio - 70% */}
          <section className="w-[70%] bg-black overflow-y-auto">
            {/* Header with wallet info and actions - always shown */}
            <div className="bg-[#0f0f0f] border-b border-[#1a1a1a] p-4">
              <div className="flex items-center justify-between">
                {/* Left side - Profile info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center relative">
                    <span className="text-black font-bold text-sm">578</span>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#0f0f0f]"></div>
                  </div>
                  <div>
                    <h2 className="text-xl font-normal text-white">{selectedAccount}</h2>
                    <p className="text-gray-500 text-base">
                      {selectedAccount === 'A111' ? 'OKXDEX' : 
                       selectedAccount === 'H1' || selectedAccount === 'H2' ? 'Hyperliquid' :
                       selectedAccount === 'Aster' ? 'Aster' : ''}
                    </p>
                    <p className="text-gray-500 text-xs">developer_other@eterna Trading Wallet</p>
                  </div>
                </div>
                
                {/* Middle - Wallet info in vertical layout */}
                <div className="flex flex-col gap-1 flex-1 max-w-2xl mx-8">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 text-xs w-24">Wallet Type</span>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 rounded-full bg-blue-500" />
                      <span className="text-white text-xs">{walletInfo.type}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 text-xs w-24">Linked Wallet</span>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 rounded-full bg-orange-500" />
                      <span className="text-white text-xs font-mono">{walletInfo.linkedWallet}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 text-xs w-24">Trading Wallet</span>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 rounded-full bg-gray-500" />
                      <span className="text-white text-xs font-mono">{walletInfo.tradingWallet}</span>
                    </div>
                  </div>
                </div>
                
                {/* Right side - Actions */}
                <div className="flex items-center gap-2">
                  <button className="bg-orange-500 text-black px-6 py-2 rounded font-medium text-sm">Deposit</button>
                  <button className="bg-[#1a1a1a] text-white px-6 py-2 rounded font-medium text-sm border border-[#2a2a2a]">
                    Withdraw
                  </button>
                </div>
              </div>
            </div>

            {selectedAccount === 'A111' ? (
              // Original A111 portfolio view
              <div className="bg-black">
                <div className="border-b border-[#1a1a1a] px-4 pt-4">
                  <button className="text-orange-500 pb-2 border-b-2 border-orange-500 font-medium text-base">Portfolio</button>
                </div>

                {/* KPI tiles */}
                <div className="grid grid-cols-2 gap-6 p-4">
                  <div>
                    <div className="space-y-1">
                      <p className="text-gray-500 text-sm">Total Equity</p>
                      <p className="text-2xl font-medium text-white">0 USD</p>
                      <p className="text-gray-500 text-xs mt-1">0.00% 1d</p>
                    </div>
                  </div>

                  <div>
                    <div className="space-y-1">
                      <p className="text-gray-500 text-sm">Directional Bias</p>
                      <p className="text-2xl font-medium text-white">0 USDT</p>
                      <p className="text-gray-500 text-xs mt-1">Delta Neutral 50% Adjusted L/S</p>
                    </div>
                  </div>
                </div>

                {/* Chart header */}
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs">Total Equity</span>
                      <Info className="h-3 w-3 text-gray-500" />
                      <span className="text-orange-500 text-xs">Gross Market Value (GMV)</span>
                      <Info className="h-3 w-3 text-gray-500" />
                    </div>

                    <div className="flex items-center gap-2">
                      {(['1d', '7d', '30d', '1y'] as Timeframe[]).map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setSelectedTimeframe(tf)}
                          className={`px-2 py-0.5 rounded text-xs ${
                            selectedTimeframe === tf ? 'bg-[#1a1a1a] text-white' : 'text-gray-500 hover:text-white'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                      <button className="p-1 text-gray-500 hover:text-white">
                        <span className="text-sm leading-none align-middle">⬇</span> <span className="text-xs">CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Chart area (empty state with dashed midline + ticks) */}
                  <ChartPlaceholder timeframe={selectedTimeframe} />
                </div>
              </div>
            ) : (
              // H1/H2/Aster portfolio view
              <div className="h-full bg-[#0a0a0a]">
                {/* Tabs */}
                <div className="flex border-b border-[#1a1a1a]">
                  <button
                    onClick={() => setActiveTab('portfolio')}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                      activeTab === 'portfolio' 
                        ? 'text-orange-500' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Portfolio
                    {activeTab === 'portfolio' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('funding')}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                      activeTab === 'funding' 
                        ? 'text-orange-500' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Funding
                    {activeTab === 'funding' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('vcefi')}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                      activeTab === 'vcefi' 
                        ? 'text-orange-500' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    vCeFi
                    {activeTab === 'vcefi' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                    )}
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'portfolio' && <PortfolioTabContent />}
                {activeTab === 'funding' && <FundingTabContent />}
                {activeTab === 'vcefi' && <VCeFiTabContent />}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

function PortfolioTabContent() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')

  return (
    <div className="bg-[#0a0a0a] h-full">
      {/* Top metrics - dark cards with borders */}
      <div className="grid grid-cols-3 gap-0 border-b border-[#1a1a1a]">
        <div className="bg-[#0a0a0a] border-r border-[#1a1a1a] p-6">
          <h3 className="text-gray-500 text-xs mb-2 tracking-wider">Total Equity</h3>
          <p className="text-lg font-light text-white mb-2">155.33 <span className="text-xs text-gray-400">USD</span></p>
          <p className="text-xs">
            <span className="text-green-400">↗</span>
            <span className="text-green-400 ml-1">0.05%</span>
            <span className="text-gray-500 ml-2">1d</span>
          </p>
        </div>

        <div className="bg-[#0a0a0a] border-r border-[#1a1a1a] p-6">
          <h3 className="text-gray-500 text-xs mb-2 tracking-wider">Directional Bias</h3>
          <p className="text-lg font-light text-white mb-2">
            <span className="text-red-400">-60.14</span> <span className="text-xs text-gray-400">USDT</span>
          </p>
          <p className="text-xs text-red-400">Short Bias 60.96% Adjusted L/S</p>
        </div>

        <div className="bg-[#0a0a0a] p-6">
          <h3 className="text-gray-500 text-xs mb-2 tracking-wider">Unrealized PnL</h3>
          <p className="text-lg font-light text-white mb-2">
            <span className="text-red-400">-9.97</span> <span className="text-xs text-gray-400">USDT</span>
          </p>
          <p className="text-xs text-red-400">-14.22% ROI</p>
        </div>
      </div>

      {/* Main chart */}
      <div className="bg-[#0a0a0a] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Total Equity</span>
              <div className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-[10px] text-gray-300">i</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-400 text-sm underline decoration-dotted underline-offset-4">Gross Market Value (GMV)</span>
              <div className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-[10px] text-gray-300">i</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {['1d', '7d', '30d', '1y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-3 py-1.5 text-sm font-medium transition-all ${
                  selectedTimeframe === tf 
                    ? 'bg-gray-700 text-white rounded' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tf}
              </button>
            ))}
            <button className="px-3 py-1.5 text-gray-500 hover:text-gray-300 text-sm ml-2 flex items-center gap-1 border border-gray-700 rounded">
              <span>⬇</span> <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Chart area with proper grid and orange line */}
        <div className="relative h-64 mt-4">
          {/* Y-axis labels */}
          <div className="absolute -left-16 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
            <span>$331.98</span>
            <span>$300.00</span>
            <span>$250.00</span>
            <span>$200.00</span>
            <span>$150.00</span>
            <span>$100.00</span>
            <span>$68.21</span>
          </div>

          {/* Chart background with grid */}
          <div className="h-full bg-[#0a0a0a] border border-[#1a1a1a] relative overflow-hidden">
            {/* Horizontal grid lines */}
            <div className="absolute inset-0">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-t border-[#1a1a1a]"
                  style={{ top: `${(i * 100) / 6}%` }}
                />
              ))}
            </div>

            {/* Orange line chart */}
            <svg className="absolute inset-0 w-full h-full">
              <path
                d="M 0 220 L 100 210 L 200 190 L 300 180 L 400 175 L 500 170 L 600 165 L 700 160 L 800 155"
                stroke="#f97316"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-3 gap-0 border-t border-[#1a1a1a]">
        {/* Notional Exposure */}
        <div className="bg-[#0a0a0a] border-r border-[#1a1a1a] p-6">
          <h3 className="text-gray-400 text-sm mb-4">Notional Exposure</h3>
          <p className="text-lg text-white mb-4">$107.23</p>
          
          <div className="relative h-40">
            {/* Y-axis labels */}
            <div className="absolute -left-8 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
              <span>$50.00</span>
              <span className="invisible">$25.00</span>
              <span>$0.00</span>
              <span className="invisible">-$25.00</span>
              <span>-$50.00</span>
            </div>
            
            <div className="ml-4 h-full relative">
              {/* Grid background */}
              <div className="absolute inset-0 border-l border-b border-[#2a2a2a]">
                {/* Horizontal grid lines */}
                <div className="absolute w-full h-[25%] border-t border-[#2a2a2a]"></div>
                <div className="absolute w-full h-[50%] border-t border-[#2a2a2a]"></div>
                <div className="absolute w-full h-[75%] border-t border-[#2a2a2a]"></div>
              </div>
              
              {/* Line chart - oscillating around zero */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 160" preserveAspectRatio="none">
                <path
                  d="M 0 80 L 20 70 L 40 55 L 60 45 L 80 40 L 100 38 L 120 40 L 140 45 L 160 55 L 180 70 L 200 85 L 220 95 L 240 100 L 260 95 L 280 85 L 300 80"
                  stroke="#10b981"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            
            {/* Bottom label */}
            <div className="absolute -bottom-6 right-4 text-[10px] text-gray-500">-$97.25</div>
          </div>
        </div>

        {/* Unrealized PnL */}
        <div className="bg-[#0a0a0a] border-r border-[#1a1a1a] p-6">
          <h3 className="text-gray-400 text-sm mb-4">Unrealized PnL</h3>
          <p className="text-lg text-white mb-4">$2.06</p>
          
          <div className="relative h-40">
            <div className="absolute -left-8 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
              <span>$0.00</span>
              <span>-$2.00</span>
              <span>-$4.00</span>
              <span>-$6.00</span>
              <span>-$8.00</span>
            </div>
            
            <div className="ml-4 h-full relative">
              {/* Grid lines */}
              <div className="absolute inset-0 border-l border-b border-[#2a2a2a]">
                <div className="absolute w-full h-[20%] border-t border-[#2a2a2a]"></div>
                <div className="absolute w-full h-[40%] border-t border-[#2a2a2a]"></div>
                <div className="absolute w-full h-[60%] border-t border-[#2a2a2a]"></div>
                <div className="absolute w-full h-[80%] border-t border-[#2a2a2a]"></div>
              </div>
              
              {/* Red line chart - sharp drop then gradual */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 160" preserveAspectRatio="none">
                <path
                  d="M 0 0 L 5 20 L 10 35 L 15 48 L 20 58 L 25 65 L 30 70 L 35 74 L 40 77 L 50 82 L 60 86 L 70 89 L 80 91 L 90 93 L 100 95 L 120 98 L 140 100 L 160 102 L 180 104 L 200 105 L 220 106 L 240 107 L 260 108 L 280 109 L 300 110"
                  stroke="#ef4444"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-4 text-[10px] text-gray-500">
              <span>-$10.00</span>
              <span>-$11.07</span>
            </div>
          </div>
        </div>

        {/* Liquidation Risk */}
        <div className="bg-[#0a0a0a] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm underline decoration-dotted underline-offset-4">Liquidation Risk</h3>
            <span className="text-green-400 text-lg">Safe (92%)</span>
          </div>
          
          <div className="relative h-3 bg-[#1a1a1a] rounded-full mb-6 overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
          </div>

          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 mb-2 underline decoration-dotted underline-offset-4">Liquidation Buffer</p>
                <p className="text-white text-base">$138.73</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2 underline decoration-dotted underline-offset-4">Maintenance Margin</p>
                <p className="text-white text-base">$16.60</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-gray-400 mb-2 underline decoration-dotted underline-offset-4">Margin Ratio</p>
                <p className="text-green-400 text-base">6.0%</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2 underline decoration-dotted underline-offset-4">Average Leverage</p>
                <p className="text-white text-base">8.37x</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FundingTabContent() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')

  return (
    <div className="p-6">
      {/* Top metrics */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Total Equity</h3>
          <p className="text-2xl font-light text-white">155.33 <span className="text-sm">USD</span></p>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Cumulative Funding</h3>
          <p className="text-2xl font-light text-white">
            <span className="text-green-500">0.02</span> <span className="text-sm">USD</span>
          </p>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Funding Return</h3>
          <p className="text-2xl font-light text-white">
            <span className="text-green-500">+0.012956%</span>
          </p>
        </div>
      </div>

      {/* Funding Payments Chart */}
      <div className="bg-[#1a1a1a] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white text-lg mb-1">Funding Payments</h3>
            <p className="text-gray-400 text-sm">Track funding, deposits and withdrawals by day</p>
          </div>

          <div className="flex items-center gap-2">
            {['1D', '7D', '30D', '1Y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf.toLowerCase())}
                className={`px-3 py-1 rounded text-sm ${
                  selectedTimeframe === tf.toLowerCase()
                    ? 'bg-orange-500 text-black' 
                    : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="relative h-80">
          <div className="absolute left-0 top-0 -ml-16 h-full flex flex-col justify-between text-xs text-gray-500">
            <span>0.025</span>
            <span>0.02</span>
            <span>0.015</span>
            <span>0.01</span>
            <span>0.005</span>
            <span>0</span>
          </div>

          <div className="h-full border-l border-b border-[#2a2a2a] ml-4">
            <div className="relative h-full">
              {/* Bar at the end */}
              <div className="absolute right-4 bottom-0 w-12 bg-green-500 h-[60%]" />
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 -mb-6">
                <span>Sep 26</span>
                <span>Sep 30</span>
                <span>Oct 4</span>
                <span>Oct 8</span>
                <span>Oct 12</span>
                <span>Oct 16</span>
                <span>Oct 20</span>
                <span>Oct 24</span>
                <span>Oct 27</span>
              </div>
            </div>
          </div>

          {/* Y-axis label */}
          <div className="absolute -left-20 top-1/2 -rotate-90 text-xs text-gray-500">
            Amount ($)
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 justify-center mt-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-400 text-sm">Daily Funding</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-400 text-sm">Deposits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-gray-400 text-sm">Withdrawals</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function VCeFiTabContent() {
  return (
    <div className="p-6">
      {/* Top metrics */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Total Equity</h3>
          <p className="text-2xl font-light text-white">0 <span className="text-sm">USDT</span></p>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Unrealized PnL</h3>
          <p className="text-2xl font-light text-white">0 <span className="text-sm">USDT</span></p>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-2">Notional Exposure</h3>
          <p className="text-2xl font-light text-white">0 <span className="text-sm">USDT</span></p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-4">Unrealized PnL</h3>
          <div className="h-48 border-l border-b border-[#2a2a2a] relative">
            <div className="absolute left-0 bottom-0 text-xs text-gray-500">$0.00</div>
            <div className="absolute left-0 top-0 text-xs text-gray-500">$1.00</div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 -mb-6">
              <span>Oct 27</span>
              <span>Oct 28</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="text-gray-400 text-sm mb-4">Notional Exposure</h3>
          <div className="h-48 border-l border-b border-[#2a2a2a] relative">
            <div className="absolute left-0 bottom-0 text-xs text-gray-500">$0.00</div>
            <div className="absolute left-0 top-0 text-xs text-gray-500">$1.00</div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 -mb-6">
              <span>Oct 27</span>
              <span>Oct 28</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cumulative Volume */}
      <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
        <h3 className="text-gray-400 text-sm mb-4">
          Cumulative Volume - <span className="text-white">0 USDT</span>
        </h3>
        <div className="h-48 border-b border-[#2a2a2a] relative">
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 -mb-6">
            <span>Sep 29</span>
            <span>Oct 06</span>
            <span>Oct 13</span>
            <span>Oct 20</span>
            <span>Oct 27</span>
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <div className="grid grid-cols-4 gap-6 text-sm">
        <div className="bg-[#1a1a1a] rounded-lg p-4">
          <p className="text-gray-400 mb-1">Exchange Account</p>
          <p className="text-white">-</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-lg p-4">
          <p className="text-gray-400 mb-1">Data</p>
          <p className="text-white">-</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-lg p-4">
          <p className="text-gray-400 mb-1">🔓 Block</p>
          <p className="text-white">-</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-lg p-4">
          <p className="text-gray-400 mb-1">Trade Window</p>
          <p className="text-white">-</p>
        </div>
      </div>

      <div className="mt-6 text-center text-gray-500">
        No proofs found
      </div>
    </div>
  )
}

/** A pixel-match "empty chart" with dashed midline, y-axis labels, and date ticks. */
function ChartPlaceholder({ timeframe }: { timeframe: '1d' | '7d' | '30d' | '1y' }) {
  const ticks = useMemo(() => {
    switch (timeframe) {
      case '1d':
        return ['', '', '', '', '']
      case '7d':
        return ['Oct 23', 'Oct 24', 'Oct 25', 'Oct 26', 'Oct 27']
      case '30d':
        return ['Oct 1', 'Oct 8', 'Oct 15', 'Oct 22', 'Oct 29']
      default:
        return ['2022', '2023', '2024', '2025', '2026']
    }
  }, [timeframe])

  return (
    <div className="relative h-48 border border-[#1a1a1a] rounded-lg bg-black overflow-hidden">
      {/* Y grid lines */}
      <div className="absolute inset-0">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-[#151515]"
            style={{ top: `${(i * 100) / 5}%` }}
          />
        ))}
      </div>

      {/* Dashed midline (white-ish) */}
      <div
        className="absolute left-0 right-0 border-t border-dashed"
        style={{ top: '50%', borderColor: 'rgba(255,255,255,0.45)' }}
      />

      {/* Y-axis labels */}
      <div className="absolute left-2 top-2 text-[10px] text-gray-400">$1.00</div>
      <div className="absolute left-2 bottom-2 text-[10px] text-gray-400">-$1.00</div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">-$0.20</div>

      {/* Center message */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-gray-500 text-sm mb-2">No assets found</p>
        <div className="h-px w-full bg-[#1a1a1a]" />
      </div>

      {/* X-axis ticks */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-between px-6 text-[10px] text-gray-500">
        {ticks.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  )
}
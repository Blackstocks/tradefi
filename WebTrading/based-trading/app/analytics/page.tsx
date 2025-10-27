'use client'

import { useState } from 'react'
import { CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import Header from '@/components/Header'
import MobileDrawer from '@/components/MobileDrawer'
import Sidebar from '@/components/Sidebar'

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [account, setAccount] = useState('Account')
  const [pair, setPair] = useState('Pair')
  const [side, setSide] = useState('Side')
  const [strategy, setStrategy] = useState('Strategy')
  const [marketType, setMarketType] = useState('Market Type')
  const [itemsPerPage, setItemsPerPage] = useState('1000')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredArea, setHoveredArea] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  return (
    <div className="bg-[#0a0a0a] min-h-screen flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Drawer */}
        {/* <div className="lg:hidden">
          <MobileDrawer isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
            <Sidebar />
          </MobileDrawer>
        </div> */}
        
        {/* Desktop Sidebar */}
        {/* <aside className="hidden lg:block w-64 bg-[#0a0a0a] border-r border-[#1a1a1a]">
          <Sidebar />
        </aside> */}
        
        <main className="flex-1 overflow-hidden bg-black">
          <div className="p-1">
            {/* Filters Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 p-4">
              {/* Date From */}
              <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-2 rounded-md min-w-[160px]">
                <span className="text-xs text-gray-500">Date From</span>
                <input 
                  type="text" 
                  placeholder=""
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-transparent border-none text-white text-sm focus:outline-none flex-1 w-20"
                />
                <CalendarIcon className="h-4 w-4 text-gray-500" />
              </div>

              {/* Date To */}
              <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-2 rounded-md min-w-[160px]">
                <span className="text-xs text-gray-500">Date To</span>
                <input 
                  type="text" 
                  placeholder=""
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-transparent border-none text-white text-sm focus:outline-none flex-1 w-20"
                />
                <CalendarIcon className="h-4 w-4 text-gray-500" />
              </div>

              {/* Account Dropdown */}
              <button className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2 rounded-md text-sm text-gray-300 hover:border-[#3a3a3a] transition-colors min-w-[140px]">
                <span>{account}</span>
                <ChevronDown className="h-4 w-4 text-gray-500 ml-auto" />
              </button>

              {/* Pair Dropdown */}
              <button className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2 rounded-md text-sm text-gray-300 hover:border-[#3a3a3a] transition-colors min-w-[120px]">
                <span>{pair}</span>
                <ChevronDown className="h-4 w-4 text-gray-500 ml-auto" />
              </button>

              {/* Side Dropdown */}
              <button className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2 rounded-md text-sm text-gray-300 hover:border-[#3a3a3a] transition-colors min-w-[100px]">
                <span>{side}</span>
                <ChevronDown className="h-4 w-4 text-gray-500 ml-auto" />
              </button>

              {/* Strategy Dropdown */}
              <button className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2 rounded-md text-sm text-gray-300 hover:border-[#3a3a3a] transition-colors min-w-[140px]">
                <span>{strategy}</span>
                <ChevronDown className="h-4 w-4 text-gray-500 ml-auto" />
              </button>

              {/* Market Type Dropdown */}
              <button className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2 rounded-md text-sm text-gray-300 hover:border-[#3a3a3a] transition-colors min-w-[160px]">
                <span>{marketType}</span>
                <ChevronDown className="h-4 w-4 text-gray-500 ml-auto" />
              </button>
            </div>

            {/* Pagination at top */}
            <div className="flex items-center justify-center gap-4 p-4">
              <button className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2 rounded-md text-sm text-gray-300 hover:border-[#3a3a3a] transition-colors">
                <span>{itemsPerPage} per page</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              <div className="flex items-center">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="p-2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <button className="mx-2 px-4 py-2 bg-orange-500 text-black rounded-md font-medium text-sm">
                  {currentPage}
                </button>
                
                <button 
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Top Row - 2 columns */}
            <div className="grid grid-cols-12 gap-1">
              
              {/* Summary Panel - 3 columns */}
              <div className="col-span-12 xl:col-span-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-5">
                <h2 className="text-white text-lg font-medium mb-6">Summary</h2>
                
                {/* Two column grid for metrics */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-[#6b7280] text-[11px] mb-1">Number of orders</p>
                    <p className="text-white text-xl font-medium">5</p>
                  </div>
                  
                  <div>
                    <p className="text-[#6b7280] text-[11px] mb-1">Number of pairs</p>
                    <p className="text-white text-xl font-medium">2</p>
                  </div>
                  
                  <div>
                    <p className="text-[#6b7280] text-[11px] mb-1">Value of orders</p>
                    <p className="text-white text-xl font-medium">$14.35K</p>
                  </div>
                  
                  <div>
                    <p className="text-[#6b7280] text-[11px] mb-1">Average duration</p>
                    <p className="text-white text-xl font-medium">1812s</p>
                  </div>
                  
                  <div>
                    <p className="text-[#6b7280] text-[11px] mb-1">Participation Rate</p>
                    <p className="text-white text-xl font-medium">0.00%</p>
                  </div>
                  
                  <div>
                    <p className="text-[#6b7280] text-[11px] mb-1">Sided Interval Return</p>
                    <p className="text-red-500 text-xl font-medium">1.391 bps</p>
                  </div>
                </div>

                {/* Benchmarks */}
                <h3 className="text-white text-base font-medium mt-8 mb-5">Benchmarks</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-[#6b7280] text-[11px] mb-1">Arrival</p>
                    <p className="text-red-500 text-xl font-medium">1.1997 bps</p>
                  </div>
                  
                  <div>
                    <p className="text-[#6b7280] text-[11px] mb-1">VWAP</p>
                    <p className="text-red-500 text-xl font-medium">1.2029 bps</p>
                  </div>
                  
                  <div>
                    <p className="text-[#6b7280] text-[11px] mb-1">Departure Cost</p>
                    <p className="text-white text-xl font-medium">-0.1917 bps</p>
                  </div>
                  
                  <div>
                    <p className="text-[#6b7280] text-[11px] mb-1">Exchange Fee</p>
                    <p className="text-white text-xl font-medium">3.5020 bps</p>
                  </div>
                </div>
              </div>

              {/* Order Breakdown and Fill Breakdown stacked - full width */}
              <div className="col-span-12 xl:col-span-9 flex flex-col gap-0">
                {/* Order Breakdown */}
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-5">
                  <h2 className="text-white text-lg font-medium mb-6">Order Breakdown</h2>
                  
                  <div 
                    className="relative h-[280px] bg-gradient-to-r from-[#10b981] via-[#34d399] to-[#6ee7b7] rounded-lg"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const x = e.clientX - rect.left
                      const y = e.clientY - rect.top
                      setTooltipPosition({ x, y })
                      
                      // Determine which area is being hovered
                      if (x < rect.width / 2) {
                        setHoveredArea('twap')
                      } else {
                        setHoveredArea('vwap')
                      }
                    }}
                    onMouseLeave={() => setHoveredArea(null)}
                  >
                    {/* TWAP Label */}
                    <div className="absolute top-3 left-3 bg-black/70 px-3 py-1 rounded">
                      <span className="text-white text-xs font-medium">TWAP</span>
                    </div>
                    
                    {/* VWAP Label */}
                    <div className="absolute top-3 right-3 bg-black/70 px-3 py-1 rounded">
                      <span className="text-white text-xs font-medium">VWAP</span>
                    </div>
                    
                    {/* Trading Pairs */}
                    <div className="absolute inset-0 flex items-center justify-center gap-32">
                      <span className="text-black font-semibold text-sm">BTC:PERP-USDC</span>
                      <span className="text-black font-semibold text-sm">HYPE:PERP-USDC</span>
                    </div>
                    
                    {/* Tooltip */}
                    {hoveredArea && (
                      <div 
                        className="absolute bg-white border border-gray-200 rounded-lg p-3 shadow-lg pointer-events-none z-10"
                        style={{
                          left: `${tooltipPosition.x + 10}px`,
                          top: `${tooltipPosition.y - 40}px`,
                          transform: tooltipPosition.x > 200 ? 'translateX(-100%)' : 'translateX(0)'
                        }}
                      >
                        <div className="text-black text-sm space-y-1">
                          <div>
                            <span className="text-gray-600">Strategy: </span>
                            <span className="font-semibold">{hoveredArea === 'twap' ? 'TWAP' : 'VWAP'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Notional: </span>
                            <span className="font-semibold">29452.03875</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Slippage: </span>
                            <span className="font-semibold">-7.2129370132021541</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fill Breakdown */}
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-5">
                  <h2 className="text-white text-lg font-medium mb-6">Fill Breakdown</h2>
                  
                  <div className="grid grid-cols-2 gap-8">
                    {/* Left Column - Role and Exchange */}
                    <div className="flex gap-8">
                      {/* Role Section */}
                      <div className="flex-1">
                        <p className="text-[#6b7280] text-[11px] mb-3">Role</p>
                        
                        <div className="flex items-center gap-4">
                          {/* Donut Chart */}
                          <div className="relative">
                            <svg width="60" height="60" viewBox="0 0 60 60">
                              <circle cx="30" cy="30" r="20" fill="none" stroke="#1a1a1a" strokeWidth="12"/>
                              <circle cx="30" cy="30" r="20" fill="none" stroke="#10b981" strokeWidth="12"
                                      strokeDasharray="75 50" strokeDashoffset="0" transform="rotate(-90 30 30)"/>
                              <circle cx="30" cy="30" r="20" fill="none" stroke="#ef4444" strokeWidth="12"
                                      strokeDasharray="50 75" strokeDashoffset="-75" transform="rotate(-90 30 30)"/>
                              <circle cx="30" cy="30" r="14" fill="#0a0a0a"/>
                            </svg>
                          </div>
                          
                          {/* Legend */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-[2px] bg-[#10b981]"></div>
                              <span className="text-[#9ca3af] text-[10px] uppercase tracking-wider">MAKE</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-[2px] bg-[#ef4444]"></div>
                              <span className="text-[#9ca3af] text-[10px] uppercase tracking-wider">TAKE</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Exchange Section */}
                      <div className="flex-1">
                        <p className="text-[#6b7280] text-[11px] mb-3">Exchange</p>
                        
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <svg width="60" height="60" viewBox="0 0 60 60">
                              <circle cx="30" cy="30" r="20" fill="#6b7280"/>
                              <circle cx="30" cy="30" r="14" fill="#0a0a0a"/>
                            </svg>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#6b7280] rounded-sm"></div>
                            <span className="text-[#9ca3af] text-[11px]">Hyperliquid</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Trading Activity Chart */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 border border-[#3b82f6] bg-[#3b82f6]"></div>
                        <span className="text-[#6b7280] text-[11px]">Traded Notional</span>
                      </div>
                      
                      <div className="relative h-20 ml-6">
                        <div className="absolute -left-6 top-0 h-full flex flex-col justify-between text-[9px] text-[#6b7280]">
                          <span>31K</span>
                          <span>30K</span>
                          <span>29K</span>
                          <span>28K</span>
                          <span>27K</span>
                        </div>
                        
                        <div className="h-full border-l border-b border-[#2a2a2a] relative w-full">
                          <div className="absolute top-[20%] left-0 right-0 border-t border-[#1a1a1a]"></div>
                          <div className="absolute top-[40%] left-0 right-0 border-t border-[#1a1a1a]"></div>
                          <div className="absolute top-[60%] left-0 right-0 border-t border-[#1a1a1a]"></div>
                          <div className="absolute top-[80%] left-0 right-0 border-t border-[#1a1a1a]"></div>
                          
                          <span className="absolute -bottom-4 left-0 text-[9px] text-[#6b7280]">2025-10-22</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - 3 equal panels */}
            <div className="grid grid-cols-3 gap-1">
              
              {/* Order Size Distribution */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3 relative">
                <h2 className="text-white text-xl font-normal mb-1">Order Size Distribution</h2>
                <h2 className="text-[#f97316] text-lg font-medium absolute top-3 right-3">Switch Graph</h2>
                <p className="text-[#9ca3af] text-xs mb-3">★ Minsorized (5%/95%)</p>
                
                {/* Legend above chart */}
                <div className="flex gap-8 mb-2 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-[#f97316]"></div>
                    <span className="text-[#6b7280] text-sm">Buy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-[#6b7280]"></div>
                    <span className="text-[#6b7280] text-sm">Sell</span>
                  </div>
                </div>
                
                <div className="relative h-32">
                  {/* Y-axis label */}
                  <div className="absolute -left-20 top-1/2 -translate-y-1/2 -rotate-90 text-[#6b7280] text-[10px] whitespace-nowrap">
                    Number of Orders
                  </div>
                  
                  {/* Y-axis values */}
                  <div className="absolute -left-5 top-0 h-full flex flex-col justify-between text-[10px] text-[#6b7280]">
                    <span>1.0</span>
                    <span>0.5</span>
                    <span>0</span>
                  </div>
                  
                  {/* Chart area with grid */}
                  <div className="h-full ml-3 relative">
                    {/* Horizontal grid lines */}
                    <div className="absolute inset-0">
                      <div className="absolute top-0 left-0 right-0 border-t border-[#2a2a2a]"></div>
                      <div className="absolute top-1/2 left-0 right-0 border-t border-[#2a2a2a] border-dashed opacity-50"></div>
                      <div className="absolute bottom-0 left-0 right-0 border-t border-[#3a3a3a]"></div>
                    </div>
                    
                    {/* Bars container */}
                    <div className="h-full flex items-end gap-[2px] px-2 pb-10">
                      {/* First bar - tall orange */}
                      <div className="flex-1 bg-[#f97316]" style={{height: '95%', minWidth: '8px'}}></div>
                      {/* Small orange bars */}
                      <div className="flex-1 bg-[#f97316]" style={{height: '2%', minWidth: '8px'}}></div>
                      <div className="flex-1 bg-[#f97316]" style={{height: '1%', minWidth: '8px'}}></div>
                      <div className="flex-1 bg-[#f97316]" style={{height: '1%', minWidth: '8px'}}></div>
                      <div className="flex-1 bg-[#f97316]" style={{height: '1%', minWidth: '8px'}}></div>
                      <div className="flex-1 bg-[#f97316]" style={{height: '1%', minWidth: '8px'}}></div>
                      <div className="flex-1 bg-[#f97316]" style={{height: '1%', minWidth: '8px'}}></div>
                      <div className="flex-1 bg-[#f97316]" style={{height: '1%', minWidth: '8px'}}></div>
                      <div className="flex-1 bg-[#f97316]" style={{height: '1%', minWidth: '8px'}}></div>
                      <div className="flex-1 bg-[#f97316]" style={{height: '1%', minWidth: '8px'}}></div>
                      <div className="flex-1 bg-[#f97316]" style={{height: '1%', minWidth: '8px'}}></div>
                      <div className="flex-1 bg-[#f97316]" style={{height: '1%', minWidth: '8px'}}></div>
                      <div className="flex-1 bg-[#f97316]" style={{height: '1%', minWidth: '8px'}}></div>
                      {/* Last bar - tall gray */}
                      <div className="flex-1 bg-[#6b7280]" style={{height: '90%', minWidth: '8px'}}></div>
                    </div>
                    
                    {/* X-axis labels */}
                    <div className="absolute -bottom-2 left-0 right-0 flex justify-between px-2">
                      <span className="text-[9px] text-[#6b7280] transform -rotate-45 origin-top-left translate-y-3">$547.38</span>
                      <span className="text-[9px] text-[#6b7280] transform -rotate-45 origin-top-left translate-y-3">$1.09K</span>
                      <span className="text-[9px] text-[#6b7280] transform -rotate-45 origin-top-left translate-y-3">$1.64K</span>
                      <span className="text-[9px] text-[#6b7280] transform -rotate-45 origin-top-left translate-y-3">$2.19K</span>
                      <span className="text-[9px] text-[#6b7280] transform -rotate-45 origin-top-left translate-y-3">$2.74K</span>
                      <span className="text-[9px] text-[#6b7280] transform -rotate-45 origin-top-left translate-y-3">$3.28K</span>
                      <span className="text-[9px] text-[#6b7280] transform -rotate-45 origin-top-left translate-y-3">$3.83K</span>
                      <span className="text-[9px] text-[#6b7280] transform -rotate-45 origin-top-left translate-y-3">$4.38K</span>
                      <span className="text-[9px] text-[#6b7280] transform -rotate-45 origin-top-left translate-y-3">$4.93K</span>
                      <span className="text-[9px] text-[#6b7280] transform -rotate-45 origin-top-left translate-y-3">$5.47K</span>
                      <span className="text-[9px] text-[#6b7280] transform -rotate-45 origin-top-left translate-y-3">$6.02K</span>
                      <span className="text-[9px] text-[#6b7280] transform -rotate-45 origin-top-left translate-y-3">$6.57K</span>
                      <span className="text-[9px] text-[#6b7280] transform -rotate-45 origin-top-left translate-y-3">$7.12K</span>
                      <span className="text-[9px] text-[#6b7280] transform -rotate-45 origin-top-left translate-y-3">$7.66K</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10"></div> {/* Bottom spacer to maintain height */}
              </div>

              {/* VWAP Graph */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
                <div className="h-[52px]"></div> {/* Spacer to align with other panels */}
                
                <div className="relative h-32 mt-4">
                  {/* VWAP Label at top */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[#f97316] text-sm font-medium">VWAP</div>
                  
                  {/* Y-axis labels */}
                  <div className="absolute -left-3 top-0 h-full flex flex-col justify-between text-[10px] text-[#6b7280]">
                    <span>0.7</span>
                    <span>0.6</span>
                    <span>0.5</span>
                    <span>0.4</span>
                    <span>0.3</span>
                    <span>0.2</span>
                    <span>0.1</span>
                    <span>0</span>
                  </div>
                  
                  {/* Graph area */}
                  <div className="h-full ml-6 relative">
                    <svg className="w-full h-full" viewBox="0 0 400 140" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="140" x2="400" y2="140" stroke="#2a2a2a" strokeWidth="1"/>
                      <line x1="0" y1="0" x2="0" y2="140" stroke="#2a2a2a" strokeWidth="1"/>
                      
                      {/* First mountain shape - narrow and taller */}
                      <path d="M 100 140 
                               C 115 120, 125 80, 135 20
                               C 145 -20, 155 -20, 165 20
                               C 175 80, 185 120, 200 140
                               L 200 140 Z" 
                            fill="#f97316" 
                            opacity="0.8"/>
                      
                      {/* Second mountain shape - narrow and shorter */}
                      <path d="M 250 140 
                               C 260 125, 270 95, 280 65
                               C 290 35, 300 35, 310 65
                               C 320 95, 330 125, 340 140
                               L 340 140 Z" 
                            fill="#f97316" 
                            opacity="0.8"/>
                    </svg>
                    
                    {/* X-axis labels */}
                    <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] text-[#6b7280]">
                      <span>-1.78</span>
                      <span>-1.33</span>
                      <span>-0.89</span>
                      <span>-0.44</span>
                      <span>0.0</span>
                      <span>0.44</span>
                      <span>0.89</span>
                      <span>1.33</span>
                      <span>1.78</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10"></div> {/* Bottom spacer to match height */}
              </div>

              {/* Arrival Graph */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3">
                <div className="h-[52px]"></div> {/* Spacer to align with other panels */}
                
                <div className="relative h-32 mt-4">
                  {/* Arrival Label at top */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[#f97316] text-sm font-medium">Arrival</div>
                  
                  {/* Y-axis labels */}
                  <div className="absolute -left-3 top-0 h-full flex flex-col justify-between text-[10px] text-[#6b7280]">
                    <span>0.35</span>
                    <span>0.30</span>
                    <span>0.25</span>
                    <span>0.20</span>
                    <span>0.15</span>
                    <span>0.10</span>
                    <span>0.05</span>
                    <span>0</span>
                  </div>
                  
                  {/* Graph area */}
                  <div className="h-full ml-6 relative">
                    <svg className="w-full h-full" viewBox="0 0 400 140" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="140" x2="400" y2="140" stroke="#2a2a2a" strokeWidth="1"/>
                      <line x1="0" y1="0" x2="0" y2="140" stroke="#2a2a2a" strokeWidth="1"/>
                      
                      {/* Three mountain shapes - narrower */}
                      <path d="M 60 140 
                               C 75 110, 85 70, 95 30
                               C 105 -10, 115 -10, 125 30
                               C 135 70, 145 110, 160 140
                               L 160 140 Z" 
                            fill="#f97316" 
                            opacity="0.8"/>
                            
                      <path d="M 190 140 
                               C 200 120, 210 85, 220 50
                               C 230 15, 240 15, 250 50
                               C 260 85, 270 120, 280 140
                               L 280 140 Z" 
                            fill="#f97316" 
                            opacity="0.8"/>
                            
                      <path d="M 310 140 
                               C 320 125, 330 95, 340 65
                               C 345 50, 350 50, 355 65
                               C 365 95, 375 125, 385 140
                               L 385 140 Z" 
                            fill="#f97316" 
                            opacity="0.8"/>
                    </svg>
                    
                    {/* X-axis labels */}
                    <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] text-[#6b7280]">
                      <span>-1.78</span>
                      <span>-1.33</span>
                      <span>-0.89</span>
                      <span>-0.44</span>
                      <span>0.0</span>
                      <span>0.44</span>
                      <span>0.89</span>
                      <span>1.33</span>
                      <span>1.78</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10"></div> {/* Bottom spacer to match height */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
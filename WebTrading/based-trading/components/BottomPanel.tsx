'use client'

import { useState } from 'react'
import { Search, Filter, RotateCcw, Pause, Info, Share2 } from 'lucide-react'

type TabType = 'orders' | 'positions' | 'balances'

export default function BottomPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('orders')
  const [currentPair, setCurrentPair] = useState(false)

  const tabs = [
    { id: 'orders', label: 'Orders' },
    { id: 'positions', label: 'Positions' },
    { id: 'balances', label: 'Balances' }
  ]

  // Filter buttons for orders
  const filterButtons = [
    { label: 'Active', active: true },
    { label: 'Canceled', active: false },
    { label: 'Finished', active: false },
    { label: 'Scheduled', active: false },
    { label: 'Paused', active: false },
    { label: 'Conditional', active: false }
  ]

  return (
    <div className="bg-black h-full flex flex-col">
      {/* Tabs and Controls Header */}
      <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2">
        <div className="flex items-center gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`text-xs font-medium pb-2 transition-colors relative ${
                activeTab === tab.id
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'orders' && (
          <div className="flex items-center gap-4">
            {/* Filter Buttons */}
            <div className="flex gap-2">
              {filterButtons.map((filter) => (
                <button
                  key={filter.label}
                  className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                    filter.active
                      ? 'bg-[#1a1a1a] text-white'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-[10px] text-gray-400">
                <input
                  type="checkbox"
                  checked={currentPair}
                  onChange={(e) => setCurrentPair(e.target.checked)}
                  className="w-3 h-3"
                />
                <span>Current pair</span>
              </label>
              
              <button className="text-orange-500 text-[10px] hover:text-orange-400">
                Cancel All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'orders' && (
          <div className="p-0">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] text-gray-500 border-b border-[#1a1a1a]">
                  <th className="text-left px-4 py-2 font-normal">Pair</th>
                  <th className="text-left px-4 py-2 font-normal">Side</th>
                  <th className="text-left px-4 py-2 font-normal">Target Qty</th>
                  <th className="text-left px-4 py-2 font-normal">Filled</th>
                  <th className="text-left px-4 py-2 font-normal">Time Start</th>
                  <th className="text-left px-4 py-2 font-normal">Strategy</th>
                  <th className="text-center px-4 py-2 font-normal">Status</th>
                  <th className="text-center px-4 py-2 font-normal"></th>
                </tr>
              </thead>
              <tbody>
                {/* Example rows based on the image */}
                <tr className="text-[11px] text-white border-b border-[#0a0a0a] hover:bg-[#0a0a0a]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-[10px]">B</div>
                      <span>BTC:PERP-USDC</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">Multi</td>
                  <td className="px-4 py-3">0.066347 BTC:PERP 7,170.93 USDC</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full" style={{ width: '100%' }}></div>
                      </div>
                      <span className="text-green-500">100%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">2025-10-22 18:21:13</td>
                  <td className="px-4 py-3">TWAP</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-green-500">Finished</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1 hover:bg-[#1a1a1a] rounded">
                        <RotateCcw className="h-3 w-3 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-[#1a1a1a] rounded">
                        <Pause className="h-3 w-3 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-[#1a1a1a] rounded">
                        <Info className="h-3 w-3 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-[#1a1a1a] rounded">
                        <Share2 className="h-3 w-3 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="text-[11px] text-white border-b border-[#0a0a0a] hover:bg-[#0a0a0a]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[10px]">H</div>
                      <span>HYPE:PERP-USDC</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">Buy</td>
                  <td className="px-4 py-3">11 USDC</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full" style={{ width: '99%' }}></div>
                      </div>
                      <span className="text-green-500">99%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">2025-10-22 18:09:29</td>
                  <td className="px-4 py-3">VWAP</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-green-500">Finished</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1 hover:bg-[#1a1a1a] rounded">
                        <RotateCcw className="h-3 w-3 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-[#1a1a1a] rounded">
                        <Pause className="h-3 w-3 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-[#1a1a1a] rounded">
                        <Info className="h-3 w-3 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-[#1a1a1a] rounded">
                        <Share2 className="h-3 w-3 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="text-[11px] text-white border-b border-[#0a0a0a] hover:bg-[#0a0a0a]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-[10px]">B</div>
                      <span>BTC:PERP-USDC</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">Multi</td>
                  <td className="px-4 py-3">7,175.86 USDC 0.066347 BTC:PERP</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full" style={{ width: '3%' }}></div>
                      </div>
                      <span className="text-orange-500">3%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">2025-10-22 17:42:22</td>
                  <td className="px-4 py-3">TWAP</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-red-500">Canceled</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1 hover:bg-[#1a1a1a] rounded">
                        <RotateCcw className="h-3 w-3 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-[#1a1a1a] rounded">
                        <Pause className="h-3 w-3 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-[#1a1a1a] rounded">
                        <Info className="h-3 w-3 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-[#1a1a1a] rounded">
                        <Share2 className="h-3 w-3 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="text-[11px] text-white border-b border-[#0a0a0a] hover:bg-[#0a0a0a]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-[10px]">B</div>
                      <span>BTC:PERP-USDC</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">Multi</td>
                  <td className="px-4 py-3">14,316.38 USDC 0.132688 BTC:PERP</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full" style={{ width: '53%' }}></div>
                      </div>
                      <span className="text-red-500">53%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">2025-10-22 17:41:45</td>
                  <td className="px-4 py-3">TWAP</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-green-500">Finished</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1 hover:bg-[#1a1a1a] rounded">
                        <RotateCcw className="h-3 w-3 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-[#1a1a1a] rounded">
                        <Pause className="h-3 w-3 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-[#1a1a1a] rounded">
                        <Info className="h-3 w-3 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-[#1a1a1a] rounded">
                        <Share2 className="h-3 w-3 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'positions' && (
          <div className="flex items-center justify-center h-full text-gray-500 text-xs">
            No open positions
          </div>
        )}
        
        {activeTab === 'balances' && (
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] text-gray-500 border-b border-[#1a1a1a]">
                  <th className="text-left pb-2 font-normal">Asset</th>
                  <th className="text-left pb-2 font-normal">Free</th>
                  <th className="text-left pb-2 font-normal">In Order</th>
                  <th className="text-left pb-2 font-normal">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-[11px] text-white">
                  <td className="py-3">USDC</td>
                  <td className="py-3">0.00</td>
                  <td className="py-3">0.00</td>
                  <td className="py-3">0.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
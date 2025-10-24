'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import LoadingState from '@/components/LoadingState'
import MobileDrawer from '@/components/MobileDrawer'

// Import components with dynamic loading to prevent hydration issues
const Header = dynamic(() => import('@/components/Header'), { 
  ssr: false,
  loading: () => <div className="h-14 bg-card border-b border-border" />
})
const Sidebar = dynamic(() => import('@/components/Sidebar'), { 
  ssr: false,
  loading: () => <div className="w-full bg-black border-l border-[#1a1a1a] h-full" />
})
const TradingChart = dynamic(() => import('@/components/TradingChart'), { 
  ssr: false,
  loading: () => <div className="bg-card border border-border h-full" />
})
const OrderBook = dynamic(() => import('@/components/OrderBook'), { 
  ssr: false,
  loading: () => <div className="bg-card border border-border h-full" />
})
const MarketHeader = dynamic(() => import('@/components/MarketHeader'), { 
  ssr: false,
  loading: () => <div className="h-20 bg-black border-b border-[#2a2e39]" />
})
const BottomPanel = dynamic(() => import('@/components/BottomPanel'), { 
  ssr: false,
  loading: () => <div className="h-[300px] bg-black border-t border-[#1a1a1a]" />
})
const DraggableLayout = dynamic(() => import('@/components/DraggableLayout'), { 
  ssr: false,
  loading: () => <div className="h-full bg-black" />
})
const SafeDraggableChart = dynamic(() => import('@/components/SafeDraggableChart'), { 
  ssr: false,
  loading: () => <div className="h-full bg-black" />
})

export default function TradingPage() {
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentSymbol, setCurrentSymbol] = useState('BINANCE:BTCUSDT')
  const [symbolName, setSymbolName] = useState('BTC/USDT')
  const [isDraggable, setIsDraggable] = useState(false)
  const [marketData, setMarketData] = useState({
    symbol: 'BTC-USD',
    price: 120251,
    change: 1414.8,
    changePercent: 1.19,
    high: 120500,
    low: 118500,
    volume: '$3,384,338,959.15',
    openInterest: '$3,720,390,539.49',
    fundingRate: '0.0013',
    fundingCountdown: '50:21'
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSymbolChange = (symbol: string, name: string) => {
    setCurrentSymbol(symbol)
    setSymbolName(name)
    // Update market data based on symbol
    setMarketData(prev => ({ ...prev, symbol: name.replace('/', '-') }))
  }

  if (!mounted) {
    return <LoadingState />
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Drawer */}
        {mounted && (
          <div className="lg:hidden">
            <MobileDrawer isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
              <Sidebar />
            </MobileDrawer>
          </div>
        )}
        
        <main className="flex-1 overflow-hidden flex flex-col h-full">
          <div>
            {/* Mobile Layout - Vertical Stack */}
            <div className="lg:hidden flex flex-col h-full overflow-y-auto">
              <MarketHeader
                currentSymbol={currentSymbol}
                symbolName={symbolName}
                onSymbolChange={handleSymbolChange}
                marketData={marketData}
              />
              <div className="h-[400px]">
                <TradingChart 
                  currentSymbol={currentSymbol}
                  symbolName={symbolName}
                  showHeader={false}
                />
              </div>
              <div className="h-[300px]">
                <OrderBook />
              </div>
              <div className="p-4">
                <Sidebar />
              </div>
              <div className="min-h-[300px]">
                <BottomPanel />
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex lg:flex-col lg:h-full lg:overflow-hidden">
              {/* Toggle button for draggable mode */}
              <div className="absolute top-16 right-4 z-50">
                <button
                  onClick={() => setIsDraggable(!isDraggable)}
                  className="px-3 py-1 bg-black border border-[#1a1a1a] rounded text-xs text-white hover:bg-[#0a0a0a] transition-colors"
                >
                  {isDraggable ? 'Lock Layout' : 'Unlock Layout'}
                </button>
              </div>

              {isDraggable ? (
                <div className="h-[calc(100vh-56px)] overflow-hidden">
                  <DraggableLayout>
                    {{
                      marketHeader: (
                        <MarketHeader
                          currentSymbol={currentSymbol}
                          symbolName={symbolName}
                          onSymbolChange={handleSymbolChange}
                          marketData={marketData}
                        />
                      ),
                      chart: (
                        <SafeDraggableChart 
                          currentSymbol={currentSymbol}
                          symbolName={symbolName}
                          showHeader={false}
                        />
                      ),
                      orderBook: <OrderBook />,
                      sidebar: <Sidebar />,
                      bottomPanel: <BottomPanel />
                    }}
                  </DraggableLayout>
                </div>
              ) : (
                <>
                  {/* Main trading interface with sidebar */}
                  <div className="flex h-[calc(100vh-56px)]">
                    {/* Left Side - Chart, OrderBook and History - 75% */}
                    <div className="w-full lg:w-[75%] flex flex-col">
                      {/* Market Header - Only above left content */}
                      <MarketHeader
                        currentSymbol={currentSymbol}
                        symbolName={symbolName}
                        onSymbolChange={handleSymbolChange}
                        marketData={marketData}
                      />
                      
                      {/* Trading Chart and Order Book Row */}
                      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
                        {/* Trading Chart */}
                        <div className="flex-1 min-w-0">
                          <TradingChart 
                            currentSymbol={currentSymbol}
                            symbolName={symbolName}
                            showHeader={false}
                          />
                        </div>

                        {/* Order Book */}
                        <div className="w-full lg:w-[280px] flex-shrink-0">
                          <OrderBook />
                        </div>
                      </div>
                      
                      {/* History Section Below Chart/OrderBook */}
                      <div className="h-[280px] border-t border-[#1a1a1a] bg-black">
                        <BottomPanel />
                      </div>
                    </div>
                    
                    {/* Right Side - Trading Form - 25% */}
                    <div className="hidden lg:block lg:w-[25%] min-w-[300px] bg-[#0e0e0e] border-l border-[#1a1a1a]">
                      <Sidebar />
                    </div>
                  </div>
                </>
              )}
              
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
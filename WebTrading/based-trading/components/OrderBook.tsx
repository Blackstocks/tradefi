'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface OrderBookEntry {
  price: number
  size: number
  total: number
}

interface OrderBookData {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
}

function generateMockOrderBook(): OrderBookData {
  const midPrice = 122108
  const bids: OrderBookEntry[] = []
  const asks: OrderBookEntry[] = []

  // Generate asks (sells) - prices above mid price
  const askPrices = [122117, 122116, 122115, 122114, 122113, 122112, 122111, 122110, 122109, 122108]
  const askSizes = [1.91442, 0.01666, 0.90065, 0.64007, 0.10565, 1.62284, 4.16299, 2.86562, 0.00311, 4.08993]
  let askTotal = 0
  for (let i = 0; i < askPrices.length; i++) {
    askTotal += askSizes[i]
    asks.push({ price: askPrices[i], size: askSizes[i], total: askTotal })
  }

  // Generate bids (buys) - prices below mid price
  const bidPrices = [122107, 122106, 122105, 122104, 122103, 122102, 122101, 122100, 122099, 122098]
  const bidSizes = [1.49365, 0.00311, 0.12299, 0.00011, 0.98216, 2.98742, 0.27678, 0.08402, 0.00011, 0.4913]
  let bidTotal = 0
  for (let i = 0; i < bidPrices.length; i++) {
    bidTotal += bidSizes[i]
    bids.push({ price: bidPrices[i], size: bidSizes[i], total: bidTotal })
  }

  return { bids, asks }
}

export default function OrderBook() {
  const [orderBook, setOrderBook] = useState<OrderBookData>(generateMockOrderBook())
  const [activeTab, setActiveTab] = useState<'book' | 'trades'>('book')
  const [selectedAsset, setSelectedAsset] = useState('BTC')
  const [precision, setPrecision] = useState(1)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setOrderBook(generateMockOrderBook())
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const spread = orderBook.asks.length > 0 && orderBook.bids.length > 0 
    ? orderBook.asks[0].price - orderBook.bids[0].price 
    : 1
  const spreadPercent = orderBook.bids.length > 0 
    ? ((spread / orderBook.bids[0].price) * 100).toFixed(2)
    : '0.00'

  const maxSize = Math.max(
    ...orderBook.bids.map(b => b.size),
    ...orderBook.asks.map(a => a.size)
  )

  return (
    <div className="bg-black border border-[#1a1a1a] h-full flex flex-col">
      <div className="flex border-b border-[#1a1a1a]">
        <button
          onClick={() => setActiveTab('book')}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${
            activeTab === 'book'
              ? 'text-[#ff6b00] border-b-2 border-[#ff6b00]'
              : 'text-[#787b86] hover:text-white'
          }`}
        >
          Order Book
        </button>
        <button
          onClick={() => setActiveTab('trades')}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${
            activeTab === 'trades'
              ? 'text-[#ff6b00] border-b-2 border-[#ff6b00]'
              : 'text-[#787b86] hover:text-white'
          }`}
        >
          Trades
        </button>
      </div>

      {activeTab === 'book' ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] text-[#787b86] border-b border-[#1a1a1a]">
            <span>Price</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Total</span>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-none">
            {/* Asks (sells) - Red */}
            <div className="flex flex-col-reverse">
              {orderBook.asks.slice().reverse().map((ask, i) => (
                <div
                  key={`ask-${i}`}
                  className="relative grid grid-cols-3 px-3 py-1 hover:bg-[#0a0a0a] transition-colors"
                >
                  <div
                    className="absolute inset-0 bg-[#ff3b3b]/5"
                    style={{
                      width: `${(ask.size / maxSize) * 100}%`,
                      right: 0,
                      left: 'auto'
                    }}
                  />
                  <span className="relative text-[11px] font-mono text-[#ff3b3b] tabular-nums">
                    {ask.price.toLocaleString()}
                  </span>
                  <span className="relative text-[11px] font-mono text-white text-right tabular-nums">
                    {ask.size.toFixed(5)}
                  </span>
                  <span className="relative text-[11px] font-mono text-white text-right tabular-nums">
                    {ask.total.toFixed(5)}
                  </span>
                </div>
              ))}
            </div>

            {/* Spread */}
            <div className="bg-black px-3 py-2 border-y border-[#1a1a1a]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#787b86]">Spread</span>
                <span className="text-white font-mono tabular-nums">{spread.toFixed(0)}</span>
                <span className="text-white font-mono tabular-nums">{spreadPercent}%</span>
              </div>
            </div>

            {/* Bids (buys) - Green */}
            <div>
              {orderBook.bids.map((bid, i) => (
                <div
                  key={`bid-${i}`}
                  className="relative grid grid-cols-3 px-3 py-1 hover:bg-[#0a0a0a] transition-colors"
                >
                  <div
                    className="absolute inset-0 bg-[#00c582]/5"
                    style={{
                      width: `${(bid.size / maxSize) * 100}%`,
                      right: 0,
                      left: 'auto'
                    }}
                  />
                  <span className="relative text-[11px] font-mono text-[#00c582] tabular-nums">
                    {bid.price.toLocaleString()}
                  </span>
                  <span className="relative text-[11px] font-mono text-white text-right tabular-nums">
                    {bid.size.toFixed(5)}
                  </span>
                  <span className="relative text-[11px] font-mono text-white text-right tabular-nums">
                    {bid.total.toFixed(5)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="border-t border-[#1a1a1a] p-2 flex items-center justify-between gap-2">
            {/* Depth Indicators */}
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#00c582] rounded-sm"></div>
              <div className="w-3 h-3 bg-[#787b86] rounded-sm"></div>
              <div className="w-3 h-3 bg-[#ff3b3b] rounded-sm"></div>
            </div>
            
            {/* Asset Selector */}
            <button className="flex items-center gap-1 px-2 py-1 bg-black border border-[#1a1a1a] rounded text-xs text-white hover:bg-[#0a0a0a] transition-colors">
              <span>{selectedAsset}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            
            {/* Precision Selector */}
            <button className="flex items-center gap-1 px-2 py-1 bg-black border border-[#1a1a1a] rounded text-xs text-white hover:bg-[#0a0a0a] transition-colors">
              <span>{precision}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] text-[#787b86] border-b border-[#1a1a1a]">
            <span>Price</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Time</span>
          </div>

          {/* Mock trades */}
          {Array.from({ length: 20 }).map((_, i) => {
            const isBuy = i % 3 !== 0
            const price = 122100 + ((i * 7) % 20 - 10)
            const size = 0.1 + (i % 10) * 0.05
            const minutesAgo = i * 5
            const timeStr = `${Math.floor(minutesAgo / 60)}:${(minutesAgo % 60).toString().padStart(2, '0')}`

            return (
              <div
                key={`trade-${i}`}
                className="grid grid-cols-3 px-4 py-1.5 hover:bg-[#1a1a1a] transition-colors"
              >
                <span className={`text-[11px] font-mono tabular-nums ${isBuy ? 'text-[#00c582]' : 'text-[#ff3b3b]'}`}>
                  {price.toLocaleString()}
                </span>
                <span className="text-[11px] font-mono text-white text-right tabular-nums">
                  {size.toFixed(5)}
                </span>
                <span className="text-[11px] font-mono text-[#787b86] text-right tabular-nums">
                  {timeStr}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
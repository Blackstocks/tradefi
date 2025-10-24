'use client'

import { useState } from 'react'
import { X, TrendingUp, TrendingDown } from 'lucide-react'

type TabType = 'positions' | 'orders' | 'history'

interface Position {
  id: string
  symbol: string
  side: 'long' | 'short'
  size: number
  entryPrice: number
  markPrice: number
  pnl: number
  pnlPercent: number
  margin: number
}

interface Order {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  type: 'limit' | 'market' | 'stop'
  price: number
  size: number
  filled: number
  status: 'open' | 'partial' | 'filled' | 'cancelled'
  time: string
}

const mockPositions: Position[] = [
  {
    id: '1',
    symbol: 'BTC-USD',
    side: 'long',
    size: 0.5,
    entryPrice: 42000,
    markPrice: 43250.5,
    pnl: 625.25,
    pnlPercent: 2.98,
    margin: 2100
  },
  {
    id: '2',
    symbol: 'ETH-USD',
    side: 'short',
    size: 5,
    entryPrice: 2300,
    markPrice: 2280.75,
    pnl: 96.25,
    pnlPercent: 0.84,
    margin: 460
  }
]

const mockOrders: Order[] = [
  {
    id: '1',
    symbol: 'BTC-USD',
    side: 'buy',
    type: 'limit',
    price: 42500,
    size: 0.25,
    filled: 0,
    status: 'open',
    time: '10:30:45'
  },
  {
    id: '2',
    symbol: 'SOL-USD',
    side: 'sell',
    type: 'stop',
    price: 105,
    size: 10,
    filled: 0,
    status: 'open',
    time: '09:15:20'
  }
]

export default function PositionsPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('positions')
  const [positions] = useState(mockPositions)
  const [orders, setOrders] = useState(mockOrders)

  const handleCancelOrder = (orderId: string) => {
    setOrders(orders.filter(o => o.id !== orderId))
  }

  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0)

  return (
    <div className="bg-card border border-border flex flex-col h-full">
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('positions')}
          className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'positions'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Positions ({positions.length})
          {activeTab === 'positions' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'orders'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Open Orders ({orders.length})
          {activeTab === 'orders' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'history'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          History
          {activeTab === 'history' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {activeTab === 'positions' && (
          <>
            {positions.length > 0 && (
              <div className="px-4 py-2 bg-muted/50 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total PnL</span>
                  <span className={`font-medium ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)} USD
                  </span>
                </div>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-muted-foreground">
                    <th className="text-left px-4 py-2">Symbol</th>
                    <th className="text-right px-4 py-2">Side</th>
                    <th className="text-right px-4 py-2">Size</th>
                    <th className="text-right px-4 py-2">Entry Price</th>
                    <th className="text-right px-4 py-2">Mark Price</th>
                    <th className="text-right px-4 py-2">PnL (USD)</th>
                    <th className="text-right px-4 py-2">PnL %</th>
                    <th className="text-right px-4 py-2">Margin</th>
                    <th className="text-right px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map(position => (
                    <tr key={position.id} className="border-t border-border hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{position.symbol}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-medium ${
                          position.side === 'long' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {position.side.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm">{position.size}</td>
                      <td className="px-4 py-3 text-right text-sm">${position.entryPrice.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-sm">${position.markPrice.toLocaleString()}</td>
                      <td className={`px-4 py-3 text-right text-sm font-medium ${
                        position.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        <div className="flex items-center justify-end space-x-1">
                          {position.pnl >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span>{position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-right text-sm ${
                        position.pnlPercent >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-right text-sm">${position.margin.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-muted-foreground hover:text-foreground">
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th className="text-left px-4 py-2">Time</th>
                  <th className="text-left px-4 py-2">Symbol</th>
                  <th className="text-right px-4 py-2">Type</th>
                  <th className="text-right px-4 py-2">Side</th>
                  <th className="text-right px-4 py-2">Price</th>
                  <th className="text-right px-4 py-2">Size</th>
                  <th className="text-right px-4 py-2">Filled</th>
                  <th className="text-right px-4 py-2">Status</th>
                  <th className="text-right px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm text-muted-foreground">{order.time}</td>
                    <td className="px-4 py-3 font-medium">{order.symbol}</td>
                    <td className="px-4 py-3 text-right text-sm capitalize">{order.type}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-medium ${
                        order.side === 'buy' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {order.side.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm">${order.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-sm">{order.size}</td>
                    <td className="px-4 py-3 text-right text-sm">{order.filled}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.status === 'open' 
                          ? 'bg-blue-500/20 text-blue-500'
                          : order.status === 'partial'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : order.status === 'filled'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-sm">No trade history</p>
          </div>
        )}
      </div>
    </div>
  )
}
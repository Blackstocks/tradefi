'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import SymbolSelector from './SymbolSelector'

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  volume: string
  openInterest: string
  fundingRate: string
  fundingCountdown: string
}

interface MarketHeaderProps {
  currentSymbol: string
  symbolName: string
  onSymbolChange: (symbol: string, name: string) => void
  marketData: MarketData
}

export default function MarketHeader({ 
  currentSymbol, 
  symbolName, 
  onSymbolChange, 
  marketData 
}: MarketHeaderProps) {
  return (
    <div className="bg-black border-b border-[#2a2e39] px-4 py-2">
      <div className="flex items-center justify-between gap-3">
        {/* Symbol Selector */}
        <div className="flex items-center gap-4">
          <SymbolSelector 
            currentSymbol={currentSymbol} 
            onSymbolChange={onSymbolChange}
          />
          
          {/* Mark Price */}
          <div className="flex flex-col">
            <span className="text-[#787b86] text-[10px]">Mark</span>
            <span className="text-[#d1d4dc] text-sm font-medium">
              {marketData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Oracle Price */}
          <div className="flex flex-col">
            <span className="text-[#787b86] text-[10px]">Oracle</span>
            <span className="text-[#d1d4dc] text-sm font-medium">
              {(marketData.price - 10).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* 24h Change */}
          <div className="flex flex-col">
            <span className="text-[#787b86] text-[10px]">24h Change</span>
            <div className={`flex items-center gap-1 ${marketData.changePercent >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
              <span className="text-sm font-medium">
                {marketData.change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs">
                {marketData.changePercent >= 0 ? '+' : ''}{marketData.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* 24h Volume */}
          <div className="flex flex-col">
            <span className="text-[#787b86] text-[10px]">24h Vol</span>
            <span className="text-[#d1d4dc] text-sm font-medium">{marketData.volume}</span>
          </div>
        </div>

        {/* Right side metrics */}
        <div className="flex items-center gap-4">
          {/* Open Interest */}
          <div className="flex flex-col">
            <span className="text-[#787b86] text-[10px]">Open Interest</span>
            <span className="text-[#d1d4dc] text-sm font-medium">{marketData.openInterest}</span>
          </div>

          {/* Funding/Countdown */}
          <div className="flex flex-col">
            <span className="text-[#787b86] text-[10px]">Funding / Countdown</span>
            <div className="flex items-center gap-1">
              <span className={`text-sm font-medium ${parseFloat(marketData.fundingRate) >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                {marketData.fundingRate}%
              </span>
              <span className="text-[#787b86] text-xs">/</span>
              <span className="text-[#d1d4dc] text-sm">{marketData.fundingCountdown}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
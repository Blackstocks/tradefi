'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import Header from '@/components/Header'
import { MOCK_STRATEGIES } from '@/lib/exploreData'

export default function StrategyDetail({ params }: { params: { id: string } }) {
  const strategy = useMemo(() => MOCK_STRATEGIES.find((s) => s.id === params.id), [params.id])

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-4">
          <div className="mb-4 text-sm">
            <Link href="/explore" className="text-muted-foreground hover:text-foreground">← Back to Explore</Link>
          </div>

          {!strategy ? (
            <div className="bg-card border border-border rounded-lg p-8">
              <h1 className="text-xl font-semibold mb-2">Not found</h1>
              <p className="text-muted-foreground">We couldn’t find this strategy.</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">{strategy.name}</h1>
                  <p className="text-muted-foreground text-sm">{strategy.pair}</p>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-semibold ${strategy.roi30d >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{strategy.roi30d}%</div>
                  <div className="text-muted-foreground text-xs">30d ROI</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="bg-black/40 border border-[#1a1a1a] rounded px-3 py-2">
                  <div className="text-muted-foreground">AUM</div>
                  <div className="font-medium">${(strategy.aum / 1000).toFixed(1)}k</div>
                </div>
                <div className="bg-black/40 border border-[#1a1a1a] rounded px-3 py-2">
                  <div className="text-muted-foreground">Followers</div>
                  <div className="font-medium">{strategy.followers}</div>
                </div>
                <div className="bg-black/40 border border-[#1a1a1a] rounded px-3 py-2">
                  <div className="text-muted-foreground">Win Rate</div>
                  <div className="font-medium">{strategy.winRate}%</div>
                </div>
                <div className="bg-black/40 border border-[#1a1a1a] rounded px-3 py-2">
                  <div className="text-muted-foreground">7d ROI</div>
                  <div className={`font-medium ${strategy.roi7d >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{strategy.roi7d}%</div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-medium mb-2">About</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {strategy.description || 'No description provided.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


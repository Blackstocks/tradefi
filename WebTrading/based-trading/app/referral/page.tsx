'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import { Copy, RefreshCw } from 'lucide-react'

interface TabItem {
  id: string
  label: string
  active: boolean
}

export default function ReferralPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)
  
  const referralId = 'LO5JTK0V'
  const referralLink = `https://app.tread.fi/referral/${referralId}`
  
  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', active: true },
    { id: 'referrals', label: 'Referrals', active: false },
    { id: 'payouts', label: 'Payouts', active: false },
    { id: 'settings', label: 'Settings', active: false }
  ]
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Page Header */}
        <section className="mb-6">
          <h1 className="text-2xl font-normal mb-2">Affiliate Dashboard</h1>
          <p className="text-sm text-gray-400">
            Earn trading fee commissions by inviting your friends to trade.
          </p>
        </section>

        {/* Share Your Link Section */}
        <section className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 gap-8">
            {/* Left side - Referral Info */}
            <div>
              <div className="mb-6">
                <label className="text-sm text-gray-400 mb-2 block">Referral ID</label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-mono">{referralId}</span>
                  <button
                    onClick={() => copyToClipboard(referralId)}
                    className="p-1.5 hover:bg-[#1a1a1a] rounded transition-colors"
                  >
                    <Copy className="h-4 w-4 text-orange-500" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Your Referral Link</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-gray-300">{referralLink}</span>
                  <button
                    onClick={() => copyToClipboard(referralLink)}
                    className="p-1.5 hover:bg-[#1a1a1a] rounded transition-colors"
                  >
                    <Copy className="h-4 w-4 text-orange-500" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right side - Share Instructions */}
            <div className="border-l border-[#1a1a1a] pl-8">
              <h3 className="text-base font-normal mb-3">Share Your Link</h3>
              <p className="text-sm text-gray-400 mb-2">
                Invite traders with your custom referral link and track engagement instantly.
              </p>
              <p className="text-sm text-gray-400">
                Earn trading fee commissions from your referred users with tiered rewards.
              </p>
            </div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <div className="border-b border-[#1a1a1a] mb-8">
          <nav className="flex gap-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-normal transition-colors relative ${
                  activeTab === tab.id 
                    ? 'text-orange-500' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Earnings Cards */}
            <section className="grid grid-cols-3 gap-6 mb-12">
              {/* Pending Earnings */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                <h3 className="text-xs uppercase text-gray-400 mb-4">PENDING EARNINGS</h3>
                <p className="text-2xl mb-2">$2.42</p>
                <p className="text-xs text-gray-500">0.8 bps of executed notional</p>
              </div>
              
              {/* Available Earnings */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                <h3 className="text-xs uppercase text-gray-400 mb-4">AVAILABLE EARNINGS</h3>
                <p className="text-2xl mb-2">$0.00</p>
                <p className="text-xs text-gray-500">Ready to withdraw, minimum $1,000</p>
              </div>
              
              {/* Lifetime Earnings */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                <h3 className="text-xs uppercase text-gray-400 mb-4">LIFETIME EARNINGS</h3>
                <p className="text-2xl mb-2">$2.42</p>
                <p className="text-xs text-gray-500">Total earnings all time</p>
              </div>
            </section>

            {/* Recent Referrals */}
            <section>
              <h2 className="text-xl font-normal mb-6">Recent Referrals</h2>
              
              {/* Empty State */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-24 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-4">
                  <RefreshCw className="h-6 w-6 text-gray-600" />
                </div>
                <p className="text-gray-400">You have no referrals</p>
              </div>
            </section>
          </>
        )}

        {activeTab === 'referrals' && (
          <div className="text-gray-400">Referrals content coming soon...</div>
        )}

        {activeTab === 'payouts' && (
          <div className="text-gray-400">Payouts content coming soon...</div>
        )}

        {activeTab === 'settings' && (
          <div className="text-gray-400">Settings content coming soon...</div>
        )}
      </div>

      {copied && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-black px-4 py-2 rounded">
          Copied to clipboard!
        </div>
      )}
    </div>
  )
}
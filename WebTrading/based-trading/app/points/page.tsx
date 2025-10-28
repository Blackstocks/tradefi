'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import { TrendingUp, BarChart, CheckCircle, Trophy, User, Users, DollarSign, Bot } from 'lucide-react'

interface Badge {
  id: number
  active: boolean
  icon: React.ReactNode
}

interface ChartData {
  date: string
  value: number
}

interface TaskCard {
  icon: React.ReactNode
  title: string
  description: string
  points: number
  status: string
}

interface Achievement {
  icon: React.ReactNode
  title: string
  description: string
  points: number
  completed: boolean
}

interface PointsHistoryItem {
  date: string
  source: string
  volume: string | null
  points: number
}

export default function PointsPage() {
  const [chartTimeframe, setChartTimeframe] = useState<'7D' | '1M' | '1Y'>('1M')
  
  // Constants
  const TOTAL_POINTS = '27.11'
  const TOTAL_VOLUME = '$30,921.53'
  
  const badges: Badge[] = [
    { id: 1, active: true, icon: <Trophy className="h-4 w-4" /> },
    { id: 2, active: true, icon: <User className="h-4 w-4" /> },
    { id: 3, active: false, icon: null },
    { id: 4, active: false, icon: null }
  ]
  
  const chartData: ChartData[] = [
    { date: '09-29', value: 0 },
    { date: '10-06', value: 0 },
    { date: '10-13', value: 0 },
    { date: '10-20', value: 20 },
    { date: '10-27', value: 10 }
  ]
  
  const dailyTasks: TaskCard[] = [
    {
      icon: <TrendingUp className="h-4 w-4 text-gray-400" />,
      title: 'Daily Trade',
      description: 'Execute at least one trade today',
      points: 5,
      status: 'Incomplete'
    },
    {
      icon: <BarChart className="h-4 w-4 text-gray-400" />,
      title: 'Spot Trader',
      description: 'Complete at least one spot trade today',
      points: 2.5,
      status: 'Incomplete'
    },
    {
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      title: 'Perp Trader',
      description: 'Complete at least one perpetual contract trade today',
      points: 2.5,
      status: 'Incomplete'
    }
  ]

  const achievements: Achievement[] = [
    {
      icon: <Users className="h-4 w-4" />,
      title: 'First Referral',
      description: 'Refer another user and get them to complete their first trade',
      points: 10,
      completed: false
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      title: 'First Trade',
      description: 'Execute your first trade on tread.fi',
      points: 10,
      completed: true
    },
    {
      icon: <Bot className="h-4 w-4" />,
      title: 'First Algo Order',
      description: 'Execute your first algorithmic order',
      points: 1.5,
      completed: true
    },
    {
      icon: <BarChart className="h-4 w-4" />,
      title: 'First Automated Strategy',
      description: 'Execute with our auto strategy tool',
      points: 1.5,
      completed: false
    },
    {
      icon: <DollarSign className="h-4 w-4" />,
      title: 'High Volume Trader',
      description: 'Trade at least $100,000 in total volume',
      points: 2.5,
      completed: false
    }
  ]

  const pointsHistory: PointsHistoryItem[] = [
    { date: '2025-10-27 13:05:43', source: '56c5e71e...49d341', volume: '$194.63', points: 0.00389 },
    { date: '2025-10-27 13:05:12', source: '09f66ea9...7c1cbb', volume: '$92.65', points: 0.00185 },
    { date: '2025-10-27 13:04:41', source: '9ffe029c...a0090f', volume: '$14.4', points: 0.000288 },
    { date: '2025-10-27 13:03:50', source: 'bb935664...801c31', volume: '$24.43', points: 0.000489 },
    { date: '2025-10-27 13:03:16', source: 'Perp Trader achievement', volume: null, points: 2.5 },
    { date: '2025-10-27 13:03:16', source: 'Daily Trade achievement', volume: null, points: 5 },
    { date: '2025-10-27 13:03:16', source: 'beb45585...507286', volume: '$115.76', points: 0.00116 },
    { date: '2025-10-27 12:58:06', source: 'e174ac83...4b200f', volume: '$347.76', points: 0.00348 }
  ]

  const getBarHeight = (value: number) => {
    const maxValue = Math.max(...chartData.map(d => d.value))
    return maxValue > 0 ? (value / maxValue) * 100 : 0
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Page Header */}
        <section className="mb-8">
          <h1 className="text-2xl font-normal mb-2">Points</h1>
          <p className="text-sm text-gray-400">
            Accumulate points by trading on tread.fi. 
            <a href="#" className="text-orange-500 ml-1 hover:underline">Learn more</a>
          </p>
        </section>

        {/* Stats Container */}
        <section className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg mb-10">
          <div className="flex">
            {/* Total Points */}
            <div className="w-[300px] p-6 border-r border-[#1a1a1a]">
              <h3 className="text-sm text-gray-500 mb-3">Total Points</h3>
              <p className="text-2xl mb-6">{TOTAL_POINTS}</p>
              
              <h3 className="text-sm text-gray-500 mb-3">Badges</h3>
              <div className="flex gap-2">
                {badges.map(badge => (
                  <div
                    key={badge.id}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      badge.active && badge.icon
                        ? 'bg-gradient-to-br from-orange-600/20 to-orange-500/10 border border-orange-500/30'
                        : 'border border-[#2a2a2a] bg-[#1a1a1a]'
                    }`}
                  >
                    {badge.active && badge.icon ? (
                      <span className="text-orange-500">{badge.icon}</span>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Total Volume */}
            <div className="w-[300px] p-6 border-r border-[#1a1a1a]">
              <h3 className="text-sm text-gray-500 mb-3">Total Volume</h3>
              <p className="text-2xl">{TOTAL_VOLUME}</p>
            </div>

            {/* Points Chart */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm text-gray-500">Points Chart</h3>
                <div className="flex">
                  {(['7D', '1M', '1Y'] as const).map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setChartTimeframe(timeframe)}
                      className={`px-3 py-1 text-xs transition-colors ${
                        chartTimeframe === timeframe
                          ? timeframe === '1M' 
                            ? 'bg-orange-500 text-black' 
                            : 'bg-[#1a1a1a] text-white'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Visualization */}
              <div className="h-40 relative">
                <div className="absolute left-0 top-0 text-xs text-gray-500">20</div>
                <div className="absolute left-0 bottom-6 text-xs text-gray-500">0</div>
                
                <div className="absolute inset-0 flex items-end justify-between px-8 pb-6">
                  {chartData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full max-w-[40px] bg-orange-500 rounded-sm transition-all duration-300"
                        style={{ height: `${getBarHeight(data.value)}px` }}
                      />
                      <span className="text-xs text-gray-500 mt-2">{data.date}</span>
                    </div>
                  ))}
                </div>
                
                {/* Horizontal grid lines */}
                <div className="absolute inset-x-8 top-6 h-[1px] bg-[#1a1a1a]" />
                <div className="absolute inset-x-8 bottom-6 h-[1px] bg-[#1a1a1a]" />
              </div>
            </div>
          </div>
        </section>

        {/* Daily Tasks */}
        <section className="mb-10">
          <h2 className="text-xl font-normal mb-2">Daily Tasks</h2>
          <p className="text-sm text-gray-400 mb-6">Earn points by completing daily tasks.</p>
          
          <div className="grid grid-cols-3 gap-4">
            {dailyTasks.map((task, index) => (
              <div key={index} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-5 h-[160px] flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  {task.icon}
                  <h3 className="text-base font-normal">{task.title}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-auto">{task.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-orange-500 font-medium">+{task.points} points</span>
                  <span className="text-sm text-gray-500">{task.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* One-Time Achievements */}
        <section className="mb-10">
          <h2 className="text-xl font-normal mb-2">One-Time Achievements</h2>
          <p className="text-sm text-gray-400 mb-6">Unlock badges and earn points by completing the following tasks.</p>
          
          <div className="grid grid-cols-3 gap-4">
            {achievements.slice(0, 3).map((achievement, index) => (
              <div 
                key={index} 
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-5 h-[150px] flex flex-col"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={achievement.completed ? 'text-gray-400' : 'text-gray-400'}>
                    {achievement.icon}
                  </span>
                  <h3 className="text-base font-normal">{achievement.title}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-auto">{achievement.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className={`text-sm font-medium ${achievement.completed ? 'text-gray-600' : 'text-orange-500'}`}>
                    +{achievement.points} points
                  </span>
                  <span className={`text-sm ${achievement.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                    {achievement.completed ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {achievements.slice(3).map((achievement, index) => (
              <div 
                key={index + 3} 
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-5 h-[150px] flex flex-col"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={achievement.completed ? 'text-gray-400' : 'text-gray-400'}>
                    {achievement.icon}
                  </span>
                  <h3 className="text-base font-normal">{achievement.title}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-auto">{achievement.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className={`text-sm font-medium ${achievement.completed ? 'text-gray-600' : 'text-orange-500'}`}>
                    +{achievement.points} points
                  </span>
                  <span className={`text-sm ${achievement.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                    {achievement.completed ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Points History */}
        <section>
          <h2 className="text-xl font-normal mb-2">Points History</h2>
          <p className="text-sm text-gray-400 mb-6">Track your points earned from trading activities.</p>
          
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  <th className="text-left px-4 py-3 text-xs font-normal text-gray-400">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-normal text-gray-400">Source</th>
                  <th className="text-left px-4 py-3 text-xs font-normal text-gray-400">Volume</th>
                  <th className="text-right px-4 py-3 text-xs font-normal text-gray-400">Points</th>
                </tr>
              </thead>
              <tbody>
                {pointsHistory.map((item, index) => (
                  <tr key={index} className="border-b border-[#1a1a1a] last:border-0">
                    <td className="px-4 py-2.5 text-xs text-gray-300">{item.date}</td>
                    <td className="px-4 py-2.5 text-xs">
                      {item.source.includes('...') ? (
                        <span className="text-orange-500 font-mono">{item.source}</span>
                      ) : (
                        <span className="text-gray-300">{item.source}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-300">
                      {item.volume || '-'}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-right text-gray-300">
                      {item.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
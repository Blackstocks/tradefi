'use client'

import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react'

interface AccountStat {
  label: string
  value: string
  change?: number
  icon?: React.ReactNode
}

export default function AccountOverview() {
  const stats: AccountStat[] = [
    {
      label: 'Account Value',
      value: '$125,432.50',
      change: 12.5,
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      label: 'Available Balance',
      value: '$45,230.00',
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      label: 'Unrealized PnL',
      value: '+$3,250.75',
      change: 8.3,
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      label: 'Margin Used',
      value: '35.2%',
      icon: <Percent className="h-4 w-4" />
    }
  ]

  return (
    <div className="bg-card border border-border p-4">
      <h3 className="font-semibold mb-4">Account Overview</h3>
      
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {stat.icon && (
                <div className="p-1.5 bg-muted rounded">
                  {stat.icon}
                </div>
              )}
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <div className="text-right">
              <div className="font-medium">{stat.value}</div>
              {stat.change !== undefined && (
                <div className={`flex items-center justify-end space-x-1 text-xs ${
                  stat.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Buying Power</span>
          <span className="font-medium">$45,230.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Margin Ratio</span>
          <span className="font-medium">65.8%</span>
        </div>
      </div>

      <button className="w-full mt-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded font-medium text-sm transition-colors">
        Deposit Funds
      </button>
    </div>
  )
}
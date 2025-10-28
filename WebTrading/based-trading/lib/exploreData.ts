export type Strategy = {
  id: string
  name: string
  pair: string
  tags: string[]
  roi7d: number
  roi30d: number
  aum: number
  followers: number
  winRate: number
  pnl7d: number[]
  description?: string
}

export const MOCK_STRATEGIES: Strategy[] = [
  {
    id: 's1',
    name: 'Momentum Alpha',
    pair: 'BTC/USDC',
    tags: ['Momentum', 'Intraday'],
    roi7d: 12.4,
    roi30d: 36.9,
    aum: 125000,
    followers: 842,
    winRate: 62,
    pnl7d: [2, 4, 3, 7, 10, 12, 12.4],
    description: 'A momentum-following intraday strategy focusing on BTC trends.'
  },
  {
    id: 's2',
    name: 'Mean Reversion Plus',
    pair: 'ETH/USDC',
    tags: ['Mean Reversion', 'Low Vol'],
    roi7d: 5.2,
    roi30d: 14.1,
    aum: 83000,
    followers: 421,
    winRate: 57,
    pnl7d: [0, 1, 2, 1.2, 3.8, 5.4, 5.2],
    description: 'Seeks short-term dislocations and reversion to mean on ETH.'
  },
  {
    id: 's3',
    name: 'GridMaster',
    pair: 'SOL/USDC',
    tags: ['Grid', 'Neutral'],
    roi7d: 8.9,
    roi30d: 21.3,
    aum: 54000,
    followers: 693,
    winRate: 65,
    pnl7d: [1.4, 2.1, 4, 4.4, 6.2, 8.1, 8.9],
    description: 'Classic grid execution with dynamic bands on SOL.'
  },
  {
    id: 's4',
    name: 'Arb Scout',
    pair: 'HYPE/USDC',
    tags: ['Arbitrage', 'HF'],
    roi7d: 2.1,
    roi30d: 7.6,
    aum: 218000,
    followers: 128,
    winRate: 71,
    pnl7d: [0.1, 0.4, 0.9, 1.2, 1.6, 2.4, 2.1],
    description: 'Lightweight arbitrage scout focusing on micro-inefficiencies.'
  },
  {
    id: 's5',
    name: 'Breakout Rider',
    pair: 'BTC/USDC',
    tags: ['Momentum', 'Breakout'],
    roi7d: 15.8,
    roi30d: 42.4,
    aum: 192000,
    followers: 1042,
    winRate: 59,
    pnl7d: [3.1, 4.8, 6.2, 9.5, 12.2, 14.1, 15.8],
    description: 'Breakout detection with adaptive volatility filters.'
  },
  {
    id: 's6',
    name: 'Swing Synth',
    pair: 'OP/USDC',
    tags: ['Swing', 'Discretionary'],
    roi7d: -1.2,
    roi30d: 6.4,
    aum: 26000,
    followers: 92,
    winRate: 48,
    pnl7d: [2.2, 2.8, 1.9, 0.4, -0.6, -0.9, -1.2],
    description: 'Discretionary swing trading with risk caps.'
  }
]


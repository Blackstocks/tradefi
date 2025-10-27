import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: '#ffffff',
        card: '#111111',
        'card-foreground': '#ffffff',
        primary: '#f97316',
        'primary-foreground': '#ffffff',
        secondary: '#1e1e1e',
        'secondary-foreground': '#ffffff',
        muted: '#262626',
        'muted-foreground': '#a3a3a3',
        accent: '#f97316',
        'accent-foreground': '#ffffff',
        destructive: '#ef4444',
        'destructive-foreground': '#ffffff',
        border: '#262626',
        input: '#262626',
        ring: '#f97316',
        chart: {
          '1': '#22c55e',
          '2': '#ef4444',
          '3': '#f97316',
          '4': '#3b82f6',
          '5': '#a855f7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', '14px'],
        'xs': ['12px', '18px'],
        'sm': ['13px', '20px'],
        'base': ['14px', '22px'],
        'lg': ['16px', '24px'],
        'xl': ['18px', '26px'],
      },
    },
  },
  plugins: [],
}
export default config

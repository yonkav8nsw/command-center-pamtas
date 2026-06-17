/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        hud: {
          bg:          '#050810',
          surface:     '#070e0a',
          panel:       '#060d08',
          border:      'rgba(0,255,136,0.18)',
          green:       '#00ff88',
          'green-dim': 'rgba(0,255,136,0.5)',
          red:         '#ff3333',
          'red-dim':   'rgba(255,51,51,0.5)',
          amber:       '#ffaa00',
          blue:        '#4488ff',
          purple:      '#bb88ff',
          text:        '#c8d6e5',
          muted:       'rgba(200,214,229,0.45)',
          faint:       'rgba(200,214,229,0.18)',
        },
        // Legacy aliases — dipakai komponen sebelumnya
        military: {
          bg:      '#050810',
          surface: '#070e0a',
          card:    '#060d08',
          border:  'rgba(0,255,136,0.18)',
          accent:  '#00ff88',
          accent2: '#00cc6a',
          danger:  '#ff3333',
          warning: '#ffaa00',
          info:    '#4488ff',
          muted:   '#0e1a10',
          text:    '#c8d6e5',
          subtext: 'rgba(200,214,229,0.5)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px', letterSpacing: '0.05em' }],
      },
      boxShadow: {
        'hud':        '0 0 20px rgba(0,255,136,0.1), inset 0 1px 0 rgba(0,255,136,0.05)',
        'hud-strong': '0 0 30px rgba(0,255,136,0.2)',
        'hud-red':    '0 0 20px rgba(255,51,51,0.15)',
        'hud-amber':  '0 0 20px rgba(255,170,0,0.15)',
      },
      animation: {
        'fade-in':     'fadeIn 0.25s ease',
        'pulse-slow':  'pulse 3s ease-in-out infinite',
        'pulse-danger':'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

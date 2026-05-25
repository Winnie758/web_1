
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7f0',
          100: '#d8ecd8',
          200: '#b2d9b2',
          300: '#7dbe7d',
          400: '#4fa04f',
          500: '#2e7d32',
          600: '#256427',
          700: '#1b4d1d',
          800: '#123614',
          900: '#0a200b',
        },
        sky: {
          50: '#e8f4fd',
          100: '#c5e4f8',
          200: '#8ec9f1',
          300: '#54aae8',
          400: '#2589d8',
          500: '#1565c0',
          600: '#104f9a',
          700: '#0c3a72',
          800: '#07264d',
          900: '#031428',
        },
        earth: {
          50: '#fdf6ee',
          100: '#f7e4cc',
          200: '#eec898',
          300: '#e2a85e',
          400: '#d4882e',
          500: '#b5651d',
          600: '#8f4e16',
          700: '#6a3910',
          800: '#47260a',
          900: '#271405',
        },
        teal: {
          50: '#e0f7f5',
          100: '#b2ece7',
          200: '#7dddd6',
          300: '#45ccc3',
          400: '#1ab8ae',
          500: '#00897b',
          600: '#006d62',
          700: '#005249',
          800: '#003832',
          900: '#001f1b',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Lexend', 'Inter var', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'glass-light': 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 100%)',
        'glass-dark': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        card: '0 2px 16px rgba(46,125,50,0.10)',
      },
      animation: {
        'count-up': 'countUp 1.5s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        countUp: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};

export default config;

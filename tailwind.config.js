/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '380px',
      },
      colors: {
        midnight: {
          DEFAULT: '#100B13',
          50: '#23182b',
          100: '#1a1220',
          200: '#140e1a',
          900: '#0a070c'
        },
        wine: {
          DEFAULT: '#321426',
          light: '#421a32',
          dark: '#240e1b'
        },
        burgundy: {
          DEFAULT: '#591D35',
          light: '#722645',
          dark: '#411527'
        },
        rose: {
          DEFAULT: '#D98BA9',
          light: '#e6a8bf',
          soft: '#f1cbd8',
          dark: '#c46f90'
        },
        champagne: {
          DEFAULT: '#F3D8C4',
          light: '#faebe0',
          dark: '#e2beaa',
          glow: '#fff0e5'
        },
        cream: {
          DEFAULT: '#FFF8F5',
          muted: '#e8dbd5'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        handwriting: ['"Alex Brush"', '"Great Vibes"', 'cursive']
      },
      boxShadow: {
        'glow-rose': '0 0 25px rgba(217, 139, 169, 0.45)',
        'glow-gold': '0 0 25px rgba(243, 216, 196, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1.5deg)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    },
  },
  plugins: [],
}


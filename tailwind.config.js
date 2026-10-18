/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm ivory / alabaster surfaces
        ivory: {
          DEFAULT: '#FAF7F2',
          50: '#FFFDFA',
          100: '#FAF7F2',
          200: '#F4EEE6',
          300: '#EDE4D8',
          400: '#E3D7C7',
        },
        // Ink text scale
        ink: {
          DEFAULT: '#1D1A16',
          900: '#1D1A16',
          800: '#2C2823',
          700: '#3D382F',
          500: '#6B6459',
          400: '#8A8277',
          300: '#A9A196',
        },
        // Restrained terracotta accent
        terracotta: {
          50: '#FBF1EC',
          100: '#F6E2D8',
          200: '#EDC7B5',
          300: '#E0A588',
          400: '#CE7F5C',
          500: '#B85C38',
          600: '#9E4B2C',
          700: '#7E3B22',
          800: '#5F2C1A',
          900: '#431F13',
        },
        line: '#E7DFD4',
        sand: '#F1EAE0',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        // Editorial display sizes
        'display-sm': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'display-md': ['3.25rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['4rem', { lineHeight: '1.02', letterSpacing: '-0.022em' }],
        'display-xl': ['4.75rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
      },
      maxWidth: {
        prose: '68ch',
        wrap: '76rem',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(29, 26, 22, 0.04), 0 8px 24px -12px rgba(29, 26, 22, 0.14)',
        lift: '0 2px 4px rgba(29, 26, 22, 0.04), 0 18px 40px -18px rgba(29, 26, 22, 0.22)',
        ring: '0 0 0 1px rgba(29, 26, 22, 0.06)',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'rise': {
          '0%, 100%': { transform: 'scaleY(0.35)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        rise: 'rise 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

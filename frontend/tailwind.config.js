/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
    './app/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        vitoria: {
          green: '#009739',
          black: '#000000',
          white: '#FFFFFF',
          gray:  '#6B7280',
        },
        brand: {
          primary: '#007A3D', // Euskadi green
          accent:  '#D52B1E', // Euskadi red
        },
        neutral: {
          background: '#F7FAF9',
          surface:    '#FFFFFF',
        },
      },
      backgroundImage: {
        'vitoria-gradient': 'linear-gradient(90deg, #009739 0%, #000000 100%)',
        'brand-gradient':   'linear-gradient(90deg, #007A3D 0%, #D52B1E 100%)',
        'soft-surface':     'linear-gradient(180deg, #FFFFFF 0%, #F7FAF9 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'ui-serif', 'serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
      },
    },
  },
  plugins: [],
}

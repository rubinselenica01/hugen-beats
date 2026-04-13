import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1bbb83',
        'primary-hover': '#1ed796',
        'background-light': '#f6f8f7',
        'background-dark': '#0A0A0A',
        surface: '#181818',
        'surface-hover': '#282828',
        'text-main': '#FFFFFF',
        'text-muted': '#B3B3B3',
        nav: '#111715',
        'nav-border': '#293833',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        full: '9999px',
      },
      transitionDuration: {
        300: '300ms',
        500: '500ms',
        700: '700ms',
      },
      boxShadow: {
        glow: '0 0 30px rgba(27, 187, 131, 0.3)',
      },
    },
  },
  plugins: [typography],
}

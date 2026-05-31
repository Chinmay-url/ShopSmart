/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d7ff2',
        'background-light': '#f5f7f8',
        'background-dark': '#101922',
        background: '#f5f7f8',
        foreground: '#0f172a',
        card: '#ffffff',
        'card-foreground': '#0f172a',
        border: '#e2e8f0',
        muted: '#f1f5f9',
        'muted-foreground': '#64748b',
        destructive: '#ef4444',
        'primary-foreground': '#ffffff',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      boxShadow: {
        'primary': '0 10px 40px -10px rgba(13, 127, 242, 0.3)',
      },
      backgroundImage: {
        'geometric': 'radial-gradient(#0d7ff21a 1px, transparent 1px)',
      },
      backgroundSize: {
        'geometric': '24px 24px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

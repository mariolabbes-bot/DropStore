module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A', // Slate 900 - Dark and premium
        secondary: '#3B82F6', // Blue 600 - Valid accessible link color
        accent: '#F59E0B', // Amber 500
        'brand-gray': {
          50: '#F8FAFC', // Slate 50
          100: '#F1F5F9', // Slate 100
          200: '#E2E8F0', // Slate 200
          300: '#94A3B8', // Slate 400 (Darker than original 300)
          400: '#64748B', // Slate 500 (Much darker for secondary text)
          500: '#475569', // Slate 600 (Base text)
          600: '#334155', // Slate 700
          700: '#1E293B', // Slate 800
          800: '#0F172A', // Slate 900
          900: '#020617', // Slate 950 (Almost black for headings)
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    }
  },
  plugins: []
}

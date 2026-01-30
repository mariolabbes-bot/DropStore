/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Slate Scale (Premium Gray)
        'brand-gray': {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',  // Text body / secondary icons
          600: '#475569',
          700: '#334155',
          800: '#1E293B',  // Primary Text
          900: '#0F172A',  // Headings / Heavy elements
          950: '#020617',
        },
        primary: '#0F172A', // Deep Blue / Slate 900 (Serious Base)
        secondary: '#6366F1', // Indigo 500 (Vibrant Tech Accent)
        accent: '#0EA5E9', // Sky 500 (Trust/Clarity)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 20px 40px -5px rgba(0, 0, 0, 0.05), 0 10px 20px -5px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

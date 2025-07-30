/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2B3A67', // Classic navy blue
        accent: '#A7C7E7',  // Soft blue accent
        background: '#FFFFFF', // White background
        border: '#E5E7EB', // Light gray border
        text: '#2B2B2B', // Classic dark text
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
        body: ['Georgia', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}

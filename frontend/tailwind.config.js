module.exports = {
  darkMode: 'class', // enables class-based dark mode support
  content: ['./src/**/*.{js,ts,jsx,tsx}'], // adjust based on your folder structure
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
};

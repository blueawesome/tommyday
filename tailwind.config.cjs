module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'paper': '#F7F4ED',
        'ink': '#11100D',
        'muted': '#5F5A50',
        'riso-yellow': '#F7E733',
        'riso-pink': '#FF4FA3'
      },
      fontSize: {
        // match global base used in CSS
        base: '1.125rem',
        lg: '1.25rem'
      }
    }
  },
  plugins: []
};

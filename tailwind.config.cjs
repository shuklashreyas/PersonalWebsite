const typography = require('@tailwindcss/typography');

module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        bg: '#0B0E14',
        surface: '#121826',
        text: '#E6EAF2',
        muted: '#9AA3B2',
        'muted-subtle': '#6B7280',
        accent: '#7AA2F7'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif']
      },
      borderRadius: {
        DEFAULT: '0.375rem'
      },
      maxWidth: {
        measure: '68ch'
      }
    }
  },
  plugins: [
    typography({
      modifiers: []
    })
  ]
};

import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Instagram brand gradient stops (used on the auth panel)
      colors: {
        ig: {
          purple: '#833ab4',
          red: '#e1306c',
          orange: '#fcaf45',
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    darkTheme: 'instagram-dark',
    themes: [
      {
        // Instagram-like blue (darkened for readable white text), neutral greys
        instagram: {
          primary: '#0074d9',
          'primary-content': '#ffffff',
          secondary: '#e1306c',
          'secondary-content': '#ffffff',
          accent: '#833ab4',
          'accent-content': '#ffffff',
          neutral: '#262626',
          'neutral-content': '#fafafa',
          'base-100': '#fdfdfd',
          'base-200': '#f4f4f5',
          'base-300': '#dcdce0',
          'base-content': '#1c1c1f',
          info: '#0074d9',
          'info-content': '#ffffff',
          success: '#16a34a',
          'success-content': '#ffffff',
          warning: '#d97706',
          'warning-content': '#ffffff',
          error: '#ed4956',
          'error-content': '#ffffff',
          '--rounded-box': '0.75rem',
          '--rounded-btn': '0.5rem',
        },
      },
      {
        'instagram-dark': {
          primary: '#4aa8ff',
          'primary-content': '#04121f',
          secondary: '#ff3040',
          'secondary-content': '#ffffff',
          accent: '#a855f7',
          'accent-content': '#ffffff',
          neutral: '#f5f5f5',
          'neutral-content': '#000000',
          'base-100': '#0b0b0c',
          'base-200': '#151517',
          'base-300': '#2c2c30',
          'base-content': '#ededef',
          info: '#4aa8ff',
          'info-content': '#04121f',
          success: '#4ade80',
          'success-content': '#000000',
          warning: '#fbbf24',
          'warning-content': '#000000',
          error: '#ff3040',
          'error-content': '#ffffff',
          '--rounded-box': '0.75rem',
          '--rounded-btn': '0.5rem',
        },
      },
    ],
  },
};

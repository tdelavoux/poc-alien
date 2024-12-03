/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './templates/*.html',
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      'white': '#ffffff',
      'midnight': '#041215',
      'primary': '#124c4e',
      'text': '#55b0b3',
      'light': '#b6e7e9',
      'yellow': '#e3b536',
      'red': '#e76666',
    },
    backgroundSize: {
      'auto': 'auto',
      'cover': 'cover',
      'contain': 'contain',
      '300': '300%',
    },
    extend: {
      keyframes: {
        animStar: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-135rem)' },
        },
        animStarRotate: {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '100%': { transform: 'translateY(30rem) translateX(-100rem)' },
        },
      },
      animation: {
        animStarRotate: 'animStarRotate 50s linear infinite',
        animStar: 'animStar 30s linear infinite',
      },
      backdropBlur: {
        '1rem': '1rem',
      },
      backgroundSize: {
        '300%': '300%',
      },
      transitionDuration: {
        '0.5s': '0.5s',
      },
    }
  },
  plugins: [],
}


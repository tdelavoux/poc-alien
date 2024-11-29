/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./templates/*.html'],
  theme: {
    colors: {
      transparent: 'transparent',
      'white': '#ffffff',
      'base': '#041215',
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
          '0%, 100%': { transform: 'transtateY(-150px)' },
        }
      },
      animation: {
        'anim-star': 'animStar 3s linear infinite',
      }
    }
  },
  plugins: [],
}


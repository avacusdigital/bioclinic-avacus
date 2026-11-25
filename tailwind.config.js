/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#FDF8F6',
          100: '#FAF0EC',
          200: '#F7E4DE',
          300: '#EED0C6',
          400: '#DFB3A4',
        },
        rosegold: {
          light: '#E4C2B4',
          DEFAULT: '#C79282',
          dark: '#9E6657',
          metallic: '#B87E6E',
        },
        wine: {
          50: '#F9F0EE',
          100: '#EEDAD6',
          600: '#762626',
          700: '#5E1818',
          800: '#4A1010',
          900: '#340A0A',
        },
        ivory: '#FFFDFB',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        editorial: '0 22px 54px -20px rgba(74, 16, 16, 0.16)',
        'soft-rose': '0 14px 36px -14px rgba(199, 146, 130, 0.30)',
        card: '0 10px 30px -12px rgba(74, 16, 16, 0.09)',
        'card-hover': '0 20px 44px -14px rgba(74, 16, 16, 0.18)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

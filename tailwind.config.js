/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#FDF9F7',
          100: '#FAF1ED',
          200: '#F7E4DE',
          300: '#EED0C6',
          400: '#DFB3A4',
        },
        rosegold: {
          light: '#E3C0B2',
          DEFAULT: '#C79282',
          dark: '#A46D5E',
          metallic: '#B98272',
        },
        wine: {
          50: '#F8F0F0',
          100: '#EEDCDC',
          600: '#782B2B',
          700: '#611C1C',
          800: '#4A1010',
          900: '#350A0A',
        },
        ivory: '#FFFDFB',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Alex Brush"', 'cursive'],
        sans: ['"Montserrat"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'editorial': '0 24px 60px -20px rgba(74, 16, 16, 0.14)',
        'soft-rose': '0 14px 40px -14px rgba(199, 146, 130, 0.28)',
        'card': '0 10px 32px -12px rgba(74, 16, 16, 0.08)',
        'card-hover': '0 22px 48px -16px rgba(74, 16, 16, 0.16)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

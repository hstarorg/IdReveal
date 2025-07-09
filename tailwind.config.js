/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [require('tailwindcss-animate')],
  theme: {
    extend: {
      animation: {
        ripple: 'ripple 8s linear infinite',
        'ripple-inner': 'rippleInner 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        rippleInner: {
          '0%, 100%': { opacity: 0, transform: 'scale(0)' },
          '50%': { opacity: 0.3, transform: 'scale(1)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
};

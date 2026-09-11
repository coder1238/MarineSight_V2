/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          DEFAULT: '#087EA4',
          deep: '#075985',
          navy: '#0B2942',
          bright: '#1597C7',
          sky: '#E6F5FA',
          light: '#F3FAFC',
          hover: '#096e90',
        },
        text: {
          primary: '#102A43',
          secondary: '#526777',
          muted: '#8295A3',
        },
        border: {
          marine: '#D9EAF0',
        },
        status: {
          success: '#198754',
          warning: '#F4A62A',
          danger: '#D9534F',
          info: '#198FD1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'marine-sm': '0 1px 3px rgba(11, 41, 66, 0.05), 0 1px 2px rgba(11, 41, 66, 0.03)',
        'marine-md': '0 4px 6px -1px rgba(11, 41, 66, 0.08), 0 2px 4px -1px rgba(11, 41, 66, 0.04)',
        'marine-lg': '0 10px 15px -3px rgba(11, 41, 66, 0.08), 0 4px 6px -2px rgba(11, 41, 66, 0.04)',
        'radar-glow': '0 0 15px rgba(21, 151, 199, 0.35)',
      }
    },
  },
  plugins: [],
}

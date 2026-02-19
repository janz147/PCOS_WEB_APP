/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: {
          DEFAULT: 'var(--color-primary)', /* coral pink */
          foreground: 'var(--color-primary-foreground)' /* white */
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', /* light coral */
          foreground: 'var(--color-secondary-foreground)' /* deep purple-navy */
        },
        accent: {
          DEFAULT: 'var(--color-accent)', /* vibrant coral */
          foreground: 'var(--color-accent-foreground)' /* white */
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', /* red-500 */
          foreground: 'var(--color-destructive-foreground)' /* white */
        },
        success: {
          DEFAULT: 'var(--color-success)', /* emerald-500 */
          foreground: 'var(--color-success-foreground)' /* white */
        },
        warning: {
          DEFAULT: 'var(--color-warning)', /* amber-500 */
          foreground: 'var(--color-warning-foreground)' /* gray-800 */
        },
        error: {
          DEFAULT: 'var(--color-error)', /* red-500 */
          foreground: 'var(--color-error-foreground)' /* white */
        },
        muted: {
          DEFAULT: 'var(--color-muted)', /* gray-100 / elevated dark */
          foreground: 'var(--color-muted-foreground)' /* gray-500 / gray-400 */
        },
        popover: {
          DEFAULT: 'var(--color-popover)', /* white / elevated dark */
          foreground: 'var(--color-popover-foreground)' /* deep purple-navy / white reduced */
        },
        card: {
          DEFAULT: 'var(--color-card)', /* white / elevated dark */
          foreground: 'var(--color-card-foreground)' /* deep purple-navy / white reduced */
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '18px',
        '2xl': '24px'
      },
      fontFamily: {
        sans: ['Source Sans 3', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        caption: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem'
      },
      maxWidth: {
        'prose': '70ch'
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      },
      transitionDuration: {
        'default': '250ms'
      },
      ringOffsetWidth: {
        '3': '3px'
      },
      ringWidth: {
        '3': '3px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate')
  ]
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Ensures Tailwind purges unused styles in production
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#e6f2ff',   // Light blue
          500: '#3a86ff',    // Brand blue
          700: '#2667cc',    // Darker blue
        },
        secondary: {
          500: '#8338ec',    // Purple accent
        },
        neutral: {
          100: '#f8f9fa',    // Light background
          200: '#e9ecef',    // Slightly darker background
          800: '#343a40',    // Dark text
        },
        success: '#52b788',    // Success green
        warning: '#ffbe0b',    // Warning yellow
        error: '#ef233c',      // Error red
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      spacing: {
        18: '4.5rem',      // Custom spacing
        128: '32rem',      // Extra large spacing
      },
      borderRadius: {
        xl: '1rem',        // Extra large radius
        '2xl': '2rem',     // Extra extra large radius
      },
      boxShadow: {
        'soft': '0 4px 14px rgba(0, 0, 0, 0.1)',  // Soft shadow
        'hard': '0 4px 20px rgba(0, 0, 0, 0.15)', // Harder shadow
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',  // Slow pulse animation
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),   // Ensures form styling works well with Tailwind
    require('@tailwindcss/typography'), // Useful for long-form content like blog posts
  ],
}

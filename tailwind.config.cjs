/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx,html}",
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        /** SendScale-inspired landing accents */
        scale: {
          purple: "#6B46FE",
          "purple-dark": "#5B36E6",
          "purple-deep": "#4A2FC9",
          lavender: "#F4F0FF",
          mist: "#FAF8FF",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        "card-hover": "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
        "scale-soft":
          "0 25px 50px -12px rgb(107 70 254 / 0.15), 0 12px 24px -8px rgb(0 0 0 / 0.08)",
        "scale-glow": "0 0 80px -20px rgb(107 70 254 / 0.45)",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "gradient-drift": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1) translate(0,0)" },
          "50%": { opacity: "0.75", transform: "scale(1.05) translate(2%, -2%)" },
        },
      },
      animation: {
        "float-slow": "float-slow 6s ease-in-out infinite",
        "gradient-drift": "gradient-drift 12s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

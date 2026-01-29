/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        "exo-bg": "#0d1117"
      },
      fontFamily: {
        techno: ["'Orbitron'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"]
      },
      boxShadow: {
        glass: "0 0 0 1px rgba(148,163,184,0.2), 0 20px 40px rgba(15,23,42,0.45)"
      }
    }
  },
  plugins: []
};

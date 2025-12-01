/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "gantt-grow": {
          "0%": { transform: "scaleX(0.2)", opacity: "0" },
          "100%": { transform: "scaleX(1)", opacity: "1" },
        },
      },
      animation: {
        "gantt-grow": "gantt-grow 600ms ease-out",
      },
    },
  },
  safelist: [
    { pattern: /col-start-(1[0-3]|[1-9])/ },
    { pattern: /col-end-(1[0-4]|[1-9])/ },
    { pattern: /gantt-delay-[0-4]/ },
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        eaTheme: {
          primary: "#38bdf8",
          secondary: "#a855f7",
          accent: "#22c55e",
          neutral: "#111827",
          "base-100": "#020617",
          "base-200": "#020617",
          "base-300": "#020617",
          info: "#38bdf8",
          success: "#22c55e",
          warning: "#facc15",
          error: "#f97373",
        },
      },
      "dark",
    ],
  },
};

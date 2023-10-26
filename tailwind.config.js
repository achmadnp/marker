module.exports = {
  darkMode: "media",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./page-components/**/*.{js,ts,jsx,tsx}",
    // "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 3s ease-in-out forwards",
        blink: "blink 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        fadeIn1s: "fadeIn 1s ease-in-out forwards",
        pulsingBorder: "pulsingBorder 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounceReduced: "bounceReduce 1s cubic-bezier(0.8, 0, 1, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        blink: {
          "0%": { opacity: 0.2 },
          "20%": { opacity: 1 },
          "100%": { opacity: 0.2, transform: "scale(1.2)" },
        },
        pulsingBorder: {
          "0%": { borderWidth: "1px" },
          "50%": { borderWidth: "3px" },
          "100%": { borderWidth: "1px" },
        },
        bounceReduce: {
          "0%, 100%": { transform: "translateY(10%)" },
          "50%": { translateY: "0%" },
        },
      },
      transitionProperty: {
        width: "width",
      },
    },
    container: {
      center: true,
    },
  },
};

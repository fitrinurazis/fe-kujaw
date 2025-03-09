module.exports = {
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
        fadeIn: "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translate(-50%, -20px)" },
          "100%": { opacity: "1", transform: "translate(-50%, 0)" },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

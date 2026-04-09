/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#1A3D7C",
          secondary: "#1DB9A0",
          cta: "#FF8A00",
          background: "#F6F6F6",
          text: "#1D1D1F",
          muted: "#697386",
          surface: "#FFFFFF",
          border: "#D9E0EA"
        }
      },
      boxShadow: {
        soft: "0 20px 50px rgba(15, 23, 42, 0.08)",
        focus: "0 0 0 4px rgba(29, 185, 160, 0.18)",
        hero: "0 30px 70px rgba(10, 37, 84, 0.35)"
      },
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "serif"]
      },
      backgroundImage: {
        "brand-radial": "radial-gradient(circle at top left, rgba(29, 185, 160, 0.18), transparent 38%), radial-gradient(circle at top right, rgba(255, 138, 0, 0.14), transparent 26%)"
      }
    }
  },
  plugins: []
};


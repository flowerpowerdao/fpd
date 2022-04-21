/* import tailwind default theme */
const defaultTheme = require("tailwindcss/defaultTheme");

const config = {
  darkMode: "class",
  mode: "jit",
  content: ["index.html", "./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      boxShadow: {
        DEFAULT: "3px 3px 0px #000000",
      },
      fontFamily: {
        sans: ["TWK Everett", ...defaultTheme.fontFamily.sans],
        mono: ["Space Mono", ...defaultTheme.fontFamily.mono],
        "everett-medium": [
          "TWK Everett Medium",
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
  plugins: [],
};

module.exports = config;

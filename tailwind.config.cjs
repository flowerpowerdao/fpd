/* import tailwind default theme */
const defaultTheme = require("tailwindcss/defaultTheme");

const config = {
  mode: "jit",
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["TWK Everett", ...defaultTheme.fontFamily.sans],
        mono: ["Space Mono", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};

module.exports = config;

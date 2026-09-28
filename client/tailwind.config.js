/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef0fa",
          100: "#dde1f4",
          500: "#525EA7",
          600: "#525EA7",
          700: "#424b86",
          DEFAULT: "#525EA7",
        },
        secondary: {
          50: "#eff8fc",
          100: "#dff1f8",
          200: "#bfe3f1",
          500: "#5FACD3",
          600: "#5FACD3",
          700: "#4c8aaa",
          DEFAULT: "#5FACD3",
        },
      },
    },
  },
  plugins: [],
};

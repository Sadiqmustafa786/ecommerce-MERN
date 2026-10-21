/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#007979",
        secondary: "#24B1B1",
      },
    },
  },
  plugins: [],
};

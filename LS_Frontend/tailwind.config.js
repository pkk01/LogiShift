/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        bg: "var(--bg)",
        surface: "var(--surface)",
        textPrimary: "var(--textPrimary)",
        textSecondary: "var(--textSecondary)",
        alert: "var(--alert)",
        success: "var(--success)",
        error: "var(--error)",
      },
    },
  },
  plugins: [],
};

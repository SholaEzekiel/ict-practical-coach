import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        mist: "#f6f8fb",
        line: "#dfe5ed",
        ocean: "#176b87",
        leaf: "#2f7d5b",
        coral: "#c75946",
        amber: "#d7942a"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 32, 38, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0202BE",
        "primary-dark": "#01018a",
        background: "#f5f5f5",
        card: "#ffffff",
        text: "#282d30",
        "text-light": "#74798c",
      },
    },
  },
  plugins: [],
};

export default config;

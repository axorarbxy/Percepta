import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {
    colors: { royal: { DEFAULT: "#1B3A8C", dark: "#12275E" }, tomato: { DEFAULT: "#FF6347", dark: "#D94F35" }, ink: "#0A1428", mist: "#F4F6FB" },
    fontFamily: { heading: ["Avant Garde Gothic", "Century Gothic", "Poppins", "sans-serif"], body: ["Cooper BT", "Bookman Old Style", "Georgia", "serif"] },
    borderRadius: { card: "12px", pill: "999px" },
    boxShadow: { soft: "0 12px 32px rgba(27, 58, 140, 0.10)" },
  } },
  plugins: [],
};
export default config;

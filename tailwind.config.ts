import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bark: "#5e3b20",
        cedar: "#7a5230",
        tan: "#ecd8aa",
        moss: "#5d7441",
        sage: "#b8c793",
        plum: "#8f6f8d",
        cream: "#f6ebc9",
        ember: "#a35633"
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', '"Courier New"', "monospace"],
        body: ['"Trebuchet MS"', "Verdana", "sans-serif"]
      },
      boxShadow: {
        pixel: "0 0 0 2px #3d2413, 0 0 0 4px #8b613c, 8px 8px 0 0 rgba(61, 36, 19, 0.45)",
        insetWood: "inset 0 0 0 2px #f7edcf, inset 0 0 0 4px #ad7b4a",
        review: "0 0 0 2px #5d7441, 0 0 0 4px #d4dba1, 8px 8px 0 0 rgba(93, 116, 65, 0.4)"
      },
      backgroundImage: {
        wood:
          "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.12)), repeating-linear-gradient(90deg, #8a6037 0 18px, #7b512f 18px 36px, #6f472a 36px 54px)",
        meadow:
          "radial-gradient(circle at top, rgba(255,255,255,0.18), transparent 40%), linear-gradient(180deg, #b0c77b 0%, #8daa5b 35%, #607d46 100%)"
      }
    }
  },
  plugins: []
};

export default config;

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
};

export default config;

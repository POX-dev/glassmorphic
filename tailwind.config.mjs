/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				glass: {
					100: 'rgba(255, 255, 255, 0.1)',
					200: 'rgba(255, 255, 255, 0.2)',
					300: 'rgba(255, 255, 255, 0.3)',
					border: 'rgba(255, 255, 255, 0.2)',
				}
			},
			backdropBlur: {
				xs: '2px',
			},
			boxShadow: {
				glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
			}
		},
	},
	plugins: [],
}
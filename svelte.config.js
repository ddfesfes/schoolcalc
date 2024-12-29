 import adapter from '@sveltejs/adapter-cloudflare';

export default {
	kit: {
		adapter: adapter({
			fallback: '200.html' // may differ from host to host
		})
	},
	
	onwarn: (warning, handler) => {
		// console.log('** onwarn code:', warning.code);
		if (warning.code.startsWith('a11y-')) {
		  return;
		}
		handler(warning);
	  },
};

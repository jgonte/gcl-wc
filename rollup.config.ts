import typescript from 'rollup-plugin-typescript2';
import css from "rollup-plugin-import-css";

export default [{
	input: './dist/js/index.js',
	output: {
		file: './dist/js/bundle.js',
		format: 'esm'
	},
	context: 'window',
	
	plugins: [
		css({
			minify: true
		}),
		typescript({
			typescript: require('typescript')
		})
	]
}];
import typescript from 'rollup-plugin-typescript2';
import css from "rollup-plugin-import-css";

export default [{
	input: 'lib/index.js',
	output: {
		file: 'dist/bundle.js',
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
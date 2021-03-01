const rollup = require('rollup')
const path = require('path')
const processs = require('process')
// const progress = require('./progress')
const UglifyJS = require('uglify-js')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const json = require('@rollup/plugin-json')
const fs = require('fs')

function current() {
	return (new Date()).toLocaleString()
}

const inputOption = {
	input: path.resolve(__dirname, '../index.js'),
	plugins: [
		commonjs(),
		babel(),
		json()
	]
	// plugins: [progress({
	// 	scope: {
	// 		total: 0
	// 	}
	// })]
}

const outputOption = {
	format: 'umd',
	file: path.resolve(__dirname, '../dist/drawRender.js'),
	sourcemap: true,
	name: 'drawRender'
}

function minify(outPath) {
	const fileMinPath = outPath.replace(/.js$/, '.min.js')
	const code = fs.readFileSync(outPath, 'utf-8')
	const uglifyResult = UglifyJS.minify(code)
	if (uglifyResult.error) {
		throw new Error(uglifyResult.error)
	}
	fs.writeFileSync(fileMinPath, uglifyResult.code, 'utf-8')
}

if (processs.argv.includes('--watch')) {
	const watcher = rollup.watch({
		...inputOption,
		output: [outputOption],
		watch: {
			clearScreen: true
		}
	})
	watcher.on('event', event => {
		switch(event.code) {
			case 'BUNDLE_START':
				console.log(
					current(),
					'File changed. Begin to bundle'
				)
				break
			case 'BUNDLE_END':
				console.log(
					current(),
					'Finished bundle'
				)
				break
			case 'ERROR':
				console.log(
					current(),
					event.error
				)
				break
		}
	})
}
else {
	rollup.rollup({
		...inputOption
	}).then(bundle => {
		bundle.write(outputOption).then(function () {
			if (process.argv.indexOf('--minify') >= 0) {
				minify(outputOption.file)
			}
		})
	})
}
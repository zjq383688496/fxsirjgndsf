import { version } from './package.json'

import { getClass, getOffset, deepCopy } from './src/utils'
import * as shapeRender from './src/shape'

import './src/prototype'

const allowTypeMap = {
	String: container => document.querySelector(`#${container}`),
	HTMLDivElement: container => container
}

const defaultOptions = {

}

class DRender {
	constructor(container, options = {}) {
		let type  = getClass(container),
			allow = allowTypeMap[type], $container
		if (!allow) return console.error('请指定图画布容器的 id 或 div元素')
		$container = allow(container)
		if (!$container) return console.error('请指定图画布容器的 id 或 div元素')

		this.container = $container
		this.options = { ...deepCopy(defaultOptions), ...options }
		this.optionsInit($container, this.options)
		this.init($container, this.options)
		this.version = version

		console.log('version ' + version)
	}
	// 配置初始化
	optionsInit(container, options) {
		let { scrollWidth, scrollHeight } = container
		let { width, height } = options
		if (width  === undefined) options.width  = scrollWidth
		if (height === undefined) options.height = scrollHeight
	}
	// 初始化
	init(container, options) {
		this.nodes = []

		this.createCanvas()

		this.eventListener()
	}
	// 创建画布
	createCanvas() {
		const { container, options } = this
		const { width, height } = options
		const canvas = this.graph = document.createElement('canvas')
		const ctx    = this.ctx   = canvas.getContext('2d')
		Object.assign(canvas, {
			width,
			height
		})

		container.appendChild(canvas)
	}
	// 事件监听
	eventListener() {
		const { container, ctx, nodes } = this
		container.addEventListener('click', function(e) {
			let { offsetX, offsetY } = e
			let offset  = getOffset(container)
			// console.log(offset, offsetX, offsetY, inPath)
			console.log(offsetX, offsetY)
			let curNode
			nodes.forEach(node => {
				let isIn = node.pointIn(offsetX, offsetY)
				if (!isIn) return
				curNode = node
			})
			if (!curNode) return
			console.log(curNode)
		}, false)
	}
	// 添加图形
	addNode(shapeName, config = {}) {
		const Shape = shapeRender[shapeName]
		if (!Shape) return console.error(`${shapeName} 图形不存在!`)
		const shape = new Shape(config, this)
		this.nodes.push(shape)
	}
}
export default DRender

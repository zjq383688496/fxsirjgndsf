var { abs, pow, sqrt } = Math

export class InputLine {
	constructor(data, index, parent, group) {
		Object.assign(this, { data, index, parent, group })

		this.state = {
			isMove: false,
			startX: 0,
			startY: 0,
			endX: 0,
			endY: 0,
			// centerX: 0,
			// centerY: 0,
		}

		this.init()
	}
	color = '#000'
	// 初始化
	// startX: 起始点 X
	// startY: 起始点 Y
	// endX:   终点 X
	// endY:   终点 Y
	// color:  样式
	init = (startX, startY, endX, endY, color = '#000') => {
		var { data, index } = this,
			{ layout, input } = data,
			{ cx, cy, w, h, r } = layout,
			{ bind, init = {} } = input[index]

		// 起始坐标
		if (!startX && !startY) {
			if (bind) {
				var { id, index } = bind,
					lay = __Redux__.Config.Nodes[id].layout
				startX = lay.cx
				startY = lay.cy
			} else {
				var { offsetX = -20, offsetY = -40 } = init
				startX = (endX || cx) + offsetX
				startY = (endY || cy) + offsetY
			}
		}
		
		// 结束坐标
		if (!endX && !endY) {
			var startPos = { startX, startY },
				point = __Node__.getPoint(startPos, layout)
			
			if ((point.x + '') === 'NaN') {
				debugger
				__Node__.getPoint(startPos, layout)
			}
			
			endX = point.x
			endY = point.y
		}


		// var centerX = startX + (endX - startX) / 2,
		// 	centerY = startY + (endY - startY) / 2
		

		var newState = {
			startX,
			startY,
			endX,
			endY,
			// centerX,
			// centerY,
		}
		if (color) this.color = color
		Object.assign(this.state, newState)

		this.draw()

		return newState
	}
	draw = () => {
		var { color, group, state } = this,
			{ centerX, centerY, startX, startY, endX, endY } = state

		if (!this.line) {
			// this.line  = group.path(`M ${startX},${startY} L ${centerX},${centerY} ${endX},${endY}`).stroke({ width: 2, color })
			this.line  = group.path(`M ${startX},${startY} L ${endX},${endY}`).stroke({ width: 2, color })
			
			var arrow = group.marker(8, 4, add => {
				this.arrow = add.path('M 0,0 L 0,4 L 6,2 z').fill(color)//.center(3, 2)
			})
			this.line.marker('end', arrow)
		} else {
			this.line.plot(`M ${startX},${startY} L ${endX},${endY}`).stroke(color)
			this.arrow.fill(color)
		}
	}
}

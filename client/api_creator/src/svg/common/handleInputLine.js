export class InputLine {
	constructor(data, index, parent, group, _data) {
		Object.assign(this, { data, index, parent, group, _data })

		this.state = {
			isMove: false,
			startX: 0,
			startY: 0,
			endX: 0,
			endY: 0,
			startForce: false,
		}

		this.init()
	}
	// 初始化
	// targetX: 目标点 X
	// targetY: 目标点 Y
	// startX:  起始点 X
	// startY:  起始点 Y
	// startForce: 强制使用起始点
	init = (targetX, targetY, startX, startY, startForce = false) => {
		var { data, index, parent } = this,
			{ props, state }  = parent,
			{ input, layout } = props.data,
			length = input.length,
			{ w, h, r } = layout,
			x  = targetX || state.x,
			y  = targetY || state.y,
			cx = r? x + r: x + w / 2,				// 目标中点 X
			cy = r? y + r: y + h / 2,				// 目标中点 Y
			sx = startX || (cx + (-length * 40 / 2) + index * 40),		// 线段默认开始点 X
			sy = startY || (cy - 40	)								// 线段默认开始点 Y

		Object.assign(this.state, {
			startX: sx,
			startY: sy,
			endX:   cx,
			endY:   cy,
			startForce
		})

		this.draw()
	}
	draw = () => {
		var { group, parent, state, _data } = this,
			{ startX, startY, endX, endY, startForce } = state,
			{ bind } = _data

		if (bind && !startForce) {
			var { id } = bind,
				node = __Redux__.Config.Nodes[id]

			if (node) {
				var { cx, cy } = node.layout
				startX = cx
				startY = cy
			}
		}

		var centerX = startX + (endX - startX) / 2,
			centerY = startY + (endY - startY) / 2
			// lineObj = { startX, startY, centerX, centerY, endX, endY }

		// Object.keys(lineObj).map(_ => { lineObj[_] = lineObj[_] * Scale })

		// var { startX, startY, centerX, centerY, endX, endY } = lineObj

		if (!this.line) {
			this.line = group.path(`M ${startX},${startY} L ${centerX},${centerY} ${endX},${endY}`).stroke({ width: 2, color: '#000' })
			this.line.marker('end', __Node__._arrow)
		} else {
			this.line.plot(`M ${startX},${startY} L ${centerX},${centerY} ${endX},${endY}`)
		}
	}
}


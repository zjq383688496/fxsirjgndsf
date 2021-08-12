let p0 = { x: 364, y: 5 }
let p1 = { x: 40,  y: 440 }
let p2 = { x: 880, y: 480 }
let p3 = { x: 587, y: 165 }

let _p0 = { x: 364 - 100, y: 5 }
let _p1 = { x: 40,  y: 440 }
let _p2 = { x: 880 - 200, y: 480 }
let _p3 = { x: 587 - 200, y: 165 }

let bezier  = new DBezier(p0, p1, p2, p3)
let bezier2 = new DBezier(_p0, _p1, _p2, _p3)

let line = { p1: { x: 200, y: 300 }, p2: { x: 700, y: 150 } }

let app = new Vue({
	el: '#app',
	data: {
		points:  [p0, p1, p2, p3],
		path:    getPath(p0, p1, p2, p3),
		path2:   getPath(_p0, _p1, _p2, _p3),
		x: 0,
		y: 0,
		bbox: bezier.bbox(),
		line: {
			p1: { ...line.p1 },
			p2: { ...line.p2 }
		},
		lineInter:  bezier.intersects(line),
		curveInter: bezier.intersects(bezier2).map(pair => {
			var t = pair.split('/').map(v => +v)
			return bezier.get(t[0])
		}),
	},
	methods: {
		getPos(e) {
			let { pageX, pageY } = e,
				st = document.documentElement.scrollTop
			this.x = pageX
			this.y = pageY + st
		}
	}
})

function getPath(p0, p1, p2, p3) {
	return `M${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`
}

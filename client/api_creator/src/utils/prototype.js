/* 原型链扩展 */

module.exports = (function (window) {
	var RP = {
		isHsl: /^hsla?/i,
		isRgb: /^rgba?/i,
		isHex: /^#([0-9a-f]{3}|[0-9a-f]{6})$/,
		hex16: /^#(\S{2})(\S{2})(\S{2})$/,
		hex8:  /^#(\S)(\S)(\S)$/,
		rgb:   /\((.*)\)/,
		hsl:   /\((.*)\)/
	}

	/* String */
	Object.assign(String.prototype, {
		// 提取RGB
		colorRGB() {
			var sColor = this.toLowerCase(),
				reg   = /^#([0-9a-f]{3}|[0-9a-f]{6})$/,
				reg8  = /^#(\S)(\S)(\S)$/
			// 如果是16进制颜色
			if (sColor && reg.test(sColor)) {
				if (sColor.length === 4) sColor = sColor.replace(reg8, '#$1$1$2$2$3$3')
				// 处理六位的颜色值
				var sColorChange = []
				for (var i = 1; i < 7; i += 2) {
					sColorChange.push(parseInt('0x'+sColor.slice(i, i + 2)))
				}
				return sColorChange
			}
			return sColor
		},
		// 简易模板引擎
		substitute(str) {
			return str && typeof(str) == 'object'? this.replace(/\{\{([^{}]+)\}\}/g, (m, k) => {
				return str[k] || 0
			}): this.toString()
		},
		// 颜色转换相关
		getColor() {
			var col = this.toLowerCase().replace(/\s/g, '')
			if (RP.isHex.test(col))      return getColorByHex(col)
			else if (RP.isRgb.test(col)) return getColorByRgb(col)
			else if (RP.isHsl.test(col)) return getColorByHsl(col)
			return null
		},
	})

	// 根据HEX获取颜色
	function getColorByHex(col) {
		var r, g, b, a = 1
		if (col.length === 4) col = col.replace(RP.hex8, '#$1$1$2$2$3$3')
		col.replace(RP.hex16, (str, $1, $2, $3) => {
			r = parseInt(`0x${$1}`)
			g = parseInt(`0x${$2}`)
			b = parseInt(`0x${$3}`)
		})
		return Object.assign({ r, g, b, a }, rgbToHsl(r, g, b))
	}
	// 根据RGB获取颜色
	function getColorByRgb(col) {
		var r, g, b, a, arr
		col.replace(RP.rgb, (str, $1) => arr = $1.split(','))
		r = ~~arr[0]
		g = ~~arr[1]
		b = ~~arr[2]
		a = arr.length === 4? parseFloat(arr[3]): 1
		return Object.assign({ r, g, b, a }, rgbToHsl(r, g, b))
	}
	// 根据HSL获取颜色
	function getColorByHsl(col) {
		var h, s, l, a, arr
		col.replace(RP.hsl, (str, $1) => arr = $1.split(','))
		h = arr[0] / 360
		s = parseInt(arr[1]) / 100
		l = parseInt(arr[2]) / 100
		a = arr.length === 4? parseFloat(arr[3]): 1
		return Object.assign({ h, s, l, a }, hslToRgb(h, s, l))
	}

	// RGB & HSL 互转
	function rgbToHsl(r, g, b) {
		r /= 255
		g /= 255
		b /= 255
		var max = Math.max(r, g, b),
			min = Math.min(r, g, b),
			h,
			s,
			l = Math.round((max + min) / 2 * 100)

		if (max == min) h = s = 0
		else {
			var d = max - min
			s = l > .5? d / (2 - max - min): d / (max + min)
			s = Math.round(s * 100)
			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break
				case g: h = (b - r) / d + 2; break
				case b: h = (r - g) / d + 4; break
			}
			h = Math.round(h * 60)
		}
		return { h, s, l }
	}
	function hslToRgb(h, s, l) {
		var r, g, b
		if (s == 0) r = g = b = l
		else {
			var hue2rgb = function hue2rgb(p, q, t) {
				if (t < 0) t += 1
				if (t > 1) t -= 1
				if (t < 1/6) return p + (q - p) * 6 * t
				if (t < 1/2) return q
				if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
				return p
			}
			var q = l < .5? l * (1 + s): l + s - l * s,
				p = 2 * l - q
			r = hue2rgb(p, q, h + 1/3)
			g = hue2rgb(p, q, h)
			b = hue2rgb(p, q, h - 1/3)
		}
		return {
			r: Math.round(r * 255),
			g: Math.round(g * 255),
			b: Math.round(b * 255)
		}
	}

}(window))
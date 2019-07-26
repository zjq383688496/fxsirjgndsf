var Ajax = function(url, opts = {}) {
	return new Promise((res, rej) => {
		if (!url) return rej({ code: '9001' })
		fetch(url, opts)
		.then(res => res.text())
		.then(data => {
			try {
				var obj = JSON.parse(data)
				return typeof obj == 'object'? res(obj): rej(data)
			} catch(e) {
				return res(data)
			}
			res(data)
		})
		.catch(err => {
			rej(err)
		})
	})
}

Ajax('/sql/find').then(o => {
	console.log(o)
}).catch(err => {
	console.log(err)
})
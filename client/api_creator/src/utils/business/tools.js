var { nodes } = require('@var')

module.exports = {
	addNode: ({ target }) => {
		var key = target.getAttribute('data-key'),
			{ actions } = __Redux__
		actions.addNode(key)
	}
}
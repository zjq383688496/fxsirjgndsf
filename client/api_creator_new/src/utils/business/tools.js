var { nodes } = require('@var')

module.exports = {
	addNode: key => {
		var { actions } = __Redux__
		actions.addNode(key)
	}
}
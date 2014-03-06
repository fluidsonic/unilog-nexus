'use strict';

var fs = require('fs');
var path = require('path');


module.exports = function unilogNexus(options) {
	options = options || {};

	var redirectors = fs.readdirSync(path.join(__dirname, 'redirectors'));
	redirectors.forEach(function(fileName) {
		if (!fileName.endsWith('.js')) {
			return;
		}

		var id = path.basename(fileName).replace(/\.[^.]*$/, '');
		if (options.hasOwnProperty(id) && !options[id]) {
			// redirector disabled
			return;
		}

		require('./redirectors/' + id)(options[id] || {});
	});
};

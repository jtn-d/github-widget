(function () {
	'use strict'
	function Widget(opts) {
		this.window = opts.window
		this.document = opts.document

		var d = this.document.createElement('div')
		d.innerHTML = this.html()
		this.element = d.firstChild

		if (opts.query) {
			var pairs = opts.query.split('&');
			for (var i = 0; i < pairs.length; i++) {
					var pair = pairs[i].split('=');
					this[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1])
			}
		}
	}

	Widget.prototype.html = function () {
		return '<div></div>'
	}

	Widget.prototype.mount = function (target) {
		if (typeof target === 'string') target = this.document.querySelector(target)
		target.appendChild(this.element)
	}

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
		module.exports = Widget
	else
		window.Widget = Widget
}())

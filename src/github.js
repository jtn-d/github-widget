(function () {
	'use strict'
	var Widget;
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
		Widget = require('./widget')
	else
		Widget = window.Widget

	function GitHub(opts) {
		Widget.call(this, opts)

		if (this.user === undefined) {
			throw new Error('user is not defined')
		}
	}

	GitHub.prototype = Object.create(Widget.prototype)

	GitHub.prototype.constructor = Widget

	GitHub.prototype.html = function () {
		return '<button><img id="avatar"/><span></span></button>'
	}

	GitHub.prototype.mount = function (target) {
		Widget.prototype.mount.call(this, target)

		var self = this
		this.element.addEventListener('click', function() {
			openHtml.call(self)
		})
		this.element.disabled = true
		this.avatar = this.element.querySelector('img')
		this.badge = this.element.querySelector('span')

		getProfile.call(this)
	};

	function getProfile() {
		var self = this
		var xhr = new XMLHttpRequest()
		xhr.open('GET', 'https://api.github.com/users/' + self.user, true)
		xhr.onload = processRequest
		xhr.send()

		function processRequest(e) {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var response = JSON.parse(xhr.responseText)
				self.htmlUrl = response.html_url
				self.badge.innerHTML = response.public_repos
				self.avatar.src = response.avatar_url
				self.element.disabled = false
			}
		}
	}

	function openHtml() {
		this.window.open(this.htmlUrl, '_blank')
	}

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
		module.exports = GitHub
	else
		window.GitHub = GitHub
}())

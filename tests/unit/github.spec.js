var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var Widget = require('../../src/widget.js')
var GitHub = require('../../src/github.js')

describe('GitHub', function() {

	var window = {
		open: function(strUrl, strWindowName) {}
	}
	var callback = null
	var child = {innerHTML: '', src: ''}
	var element = {
		disabled: false,
		addEventListener: function(type, listener) {
			callback = listener
		},
		querySelector: function(selectors) {
			return child;
		}
	}
	var div = { innerHTML: '', firstChild: element }
	var document = { createElement: function(tagName) { return div } }
	var mockDocument
	var target = { appendChild: function(child) {} }
	var requests

	beforeEach(function() {
		requests = []
		global.XMLHttpRequest = sinon.useFakeXMLHttpRequest()
		global.XMLHttpRequest.onCreate = function (request) {
			requests.push(request)
		}
		sinon.spy(window, 'open')
		sinon.spy(document, 'createElement')
		sinon.spy(target, 'appendChild')
		sinon.spy(element, 'addEventListener')
		sinon.spy(element, 'querySelector')
	})

	afterEach(function() {
		global.XMLHttpRequest.restore()
		window.open.restore()
		document.createElement.restore()
		target.appendChild.restore()
		element.addEventListener.restore()
		element.querySelector.restore()
	})

	it('ctor w/o user should throw error', function() {
		try {
			new GitHub({window: window, document: document})
		} catch (e) {
			expect(e.message).to.be.equal('user is not defined')
		}
	})

	it('ctor w/ user should return new object', function() {
		var widget = new GitHub({window: window, document: document, query: 'user=test'})

		expect(widget).to.not.be.null
		expect(widget).to.have.property('window', window)
		expect(widget).to.have.property('document', document)
		expect(widget).to.have.property('user', 'test')

		expect(document.createElement).to.have.been.calledWith('div')
		expect(div.innerHTML).to.be.string(widget.html())
	})

	it('mount should init and get profile', function() {
		var user = 'test'
		var widget = new GitHub({window: window, document: document, query: 'user=' + user})

		widget.mount(target)

		expect(target.appendChild).to.have.been.calledWith(element)

		expect(element).to.have.property('disabled', true)
		expect(element.addEventListener).to.have.been.calledWith('click')
		expect(element.querySelector).to.have.been.calledWith('img')
		expect(element.querySelector).to.have.been.calledWith('span')

		expect(requests).to.have.length(1)
		expect(requests[0].method).to.be.equal('GET')
		expect(requests[0].url).to.be.equal('https://api.github.com/users/' + user)
	})

	it('profile response should update dom', function() {
		var widget = new GitHub({window: window, document: document, query: 'user=test'})
		widget.mount(target)

		var profile = {
			"login": "angular",
			"id": 139426,
			"avatar_url": "https://avatars.githubusercontent.com/u/139426?v=3",
			"gravatar_id": "",
			"url": "https://api.github.com/users/angular",
			"public_repos": 158,
			"public_gists": 0,
			"followers": 0,
			"following": 0
		}
		requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(profile))

		expect(element).to.have.property('disabled', false)
		expect(child.innerHTML).to.be.equal(profile.public_repos)
		expect(child.src).to.be.equal(profile.avatar_url)
	})

	it('click should open new window', function() {
		var widget = new GitHub({window: window, document: document, query: 'user=test'})

		widget.mount(target)
		var profile = {
			"login": "angular",
			"html_url": "https://github.com/angular"
		}
		requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(profile))
		callback()

		expect(window.open).to.have.been.calledWith(profile.html_url, '_blank')
	})
})

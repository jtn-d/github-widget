var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var Widget = require('../src/widget.js')

describe('Widget', function() {

	var window = {}
	var element = {}
	var div = { innerHTML: '', firstChild: element }
	var document = { createElement: function(tagName) { return div } }
	var mockDocument
	var target = { appendChild: function(child) {} }

	beforeEach(function() {
		sinon.spy(document, 'createElement')
		sinon.spy(target, 'appendChild')
	})

	afterEach(function() {
		document.createElement.restore()
		target.appendChild.restore()
	})

	it('ctor w/o query should return new object', function() {
		var widget = new Widget({window: window, document: document})

		expect(widget).to.not.be.null
		expect(widget).to.have.property('window', window)
		expect(widget).to.have.property('document', document)

		expect(document.createElement).to.have.been.calledWith('div')
		expect(div.innerHTML).to.be.string(widget.html())
	})

	it('ctor w/ query should return new object with query params', function() {
		var widget = new Widget({window: window, document: document, query: 'field1=value1&field2=value2'})

		expect(widget).to.not.be.null
		expect(widget).to.have.property('window', window)
		expect(widget).to.have.property('document', document)
		expect(widget).to.have.property('field1', 'value1')
		expect(widget).to.have.property('field2', 'value2')

		expect(document.createElement).to.have.been.calledWith('div')
		expect(div.innerHTML).to.be.string(widget.html())
	})

	it('html should return valid string', function() {
		var widget = new Widget({window: window, document: document})

		var html = widget.html()

		expect(html).to.not.be.empty
		expect(html).to.be.equal('<div></div>')
	})

	it('mount should append element to target', function() {
		var widget = new Widget({window: window, document: document})

		widget.mount(target)

		expect(target.appendChild).to.have.been.calledWith(element)
	})
})

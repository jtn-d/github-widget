describe('/widget.html?user=jtn-d', function() {
	var user = 'jtn-d'

	before(function() {
		browser.url('/widget.html?user=' + user)
	})

	it('should have elements', function () {
		var button = browser.element('button')
		expect(button).to.be.not.null

		var avatar = $('#avatar')
		expect(avatar).to.be.not.null

		var badge = browser.element('span')
		expect(badge).to.be.not.null
	})

	it('should have badge number', function () {
		var badge = browser.element('span')
		badge.waitForText(2000)
		expect(badge.getText()).to.be.equal('10')
	})

	it('should have avatar image', function () {
		var avatar = $('#avatar')
		expect(avatar.getAttribute('src')).to.be.equal('https://avatars.githubusercontent.com/u/12123091?v=3')
	})

	it('should open user\'s site when widget is clicked', function () {
		var button = browser.element('button')
		button.click()

		var windowHandles = browser.windowHandles()
		expect(windowHandles.value.length).to.be.equal(2)
		browser.window(windowHandles.value[1])
		expect(browser.getUrl()).to.be.equal('https://github.com/' + user)
	})
})

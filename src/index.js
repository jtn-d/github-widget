(function() {
	var query = window.location.search.substring(1)
	var widget = new GitHub({window: window, document: window.document, query: query})
	widget.mount(document.body)
})();

Handlebars.registerHelper('JKY-replace-space-br', function() {
	var myLabel = arguments[1].data.view.content.label;
	myLabel = myLabel.replace(' ', '<br>')
	return new Handlebars.SafeString(myLabel);
});

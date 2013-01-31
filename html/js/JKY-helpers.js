Handlebars.registerHelper('JKY-replace-space-br', function() {
	var myLabel = arguments[1].data.view.content.label;
	myLabel = myLabel.replace(' ', '<br>')
	return new Handlebars.SafeString(myLabel);
});

Handlebars.registerHelper('JKY-selected', function(language, selected) {
	var my_language = this.get(language);
	var my_selected = this.get(selected);
//	var my_string = (this.label === selected) ? 'selected="selected"' : '';
	var my_string = 'selected=' + my_selected + my_language; 
	return new Handlebars.SafeString(my_string);
});

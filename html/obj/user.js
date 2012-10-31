JKY.User = Em.Object.extend({
	first_name	: '',
	last_name	: '',
	user_role	: '',
	start_page	: '',

	set_first_name	: function(value) 	{this.first_name	= value;},
	set_last_name	: function(value) 	{this.last_name		= value;},
	set_user_role	: function(value) 	{this.user_role		= value;},
	set_start_page	: function(value) 	{this.start_page	= value;},

	get_first_name	: function()	{return this.first_name	;},
	get_last_name	: function()	{return this.last_name	;},
	get_user_role	: function()	{return this.user_role	;},
	get_start_page	: function()	{return this.start_page	;},
	
});


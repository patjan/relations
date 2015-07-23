"use strict";

/**
 * JKY.Session - process all Session interface
 *
 * method:	JKY.Session.load_values()
 *			JKY.Session.set_value(key, value)
 *			JKY.Session.get_value(key)
 *
 * example:	JKY.Session.load_values();
 *			JKY.Session.set_value('language', 'taiwanese');
 *			JKY.Session.get_value('language');		//	taiwanese
 *
 * require:	JKY.Utils.js	(JKY.AJAX_URL)
 */
JKY.Session = function() {
	var my_session = [];

	function my_load_values() {
		var my_data = {method:'get_session'};
		JKY.ajax(false, my_data, my_load_values_success);
	};

	function my_load_values_success(response) {
		my_session = response.data;
	};

//	it is incomplete, not sure if it is needed.
	function my_save_values() {
		var my_rows = [];
		$.ajax({
			url		: JKY.AJAX_URL + 'POST' ,
			asycn	: true,
			success	: function(response) {
				if (response.status === 'ok') {
					my_rows = response.data;
				}else{
					JKY.display_message(response.message);
				}
			}
		});
		return my_rows;
	};

	$(function() {
		my_load_values();
	});

	return {
			load_values	: function()			{		my_load_values()		;}
		,	save_values	: function()			{		my_save_values()		;}
		,	set_value	: function(key, value)	{		my_session[key] = value	;}
		,	get_value	: function(key)			{return my_session[key]			;}
	};
}();
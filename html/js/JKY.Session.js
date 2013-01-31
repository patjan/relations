JKY.Session = function() {
	var my_array = [];

	function my_read_values() {
		var my_rows = [];

		my_rows.company_name	= 'JKY Software Corp';
		my_rows.company_logo	= 'relations';
		my_rows.event_name		= '2013 Annual Event';
	//	my_rows.user_name		= 'patjan';
		my_rows.copyright		= '© 2013 JKY Software Corp';
		my_rows.contact_us		= 'Contact Us';
		my_rows.language		= 'Taiwanese';
		my_rows.languages		= ['English', 'Chinese', 'Taiwanese', 'Portugues'];
/*
		$.ajax({
			url		: JKY.AJAX_URL + 'get_session' ,
			asycn	: true,
			type	: 'post',
			dataType: 'json',
			success	: function(response) {
				if (response.status === 'ok') {
					my_rows = response.data;
				}else{
					JKY.display_message(response.message);
				}
			},
			error	: function(jq_XHR, text_status, error_thrown) {
				JKY.display_message('Error from backend server, please re-try later.');
			}
		});
*/
		return my_rows;
	}
	
	function my_save_values() {
		var my_rows = [];
		$.ajax({
			url		: JKY.AJAX_URL + 'POST' ,
			asycn	: true,
			type	: 'post',
			dataType: 'json',
			success	: function(response) {
				if (response.status === 'ok') {
					my_rows = response.data;
				}else{
					JKY.display_message(response.message);
				}
			},
			error	: function(jq_XHR, text_status, error_thrown) {
				JKY.display_message('Error from backend server, please re-try later.');
			}
		});
		return my_rows;
	}
	
	return {
		  read_values	: function()			{		my_array = my_read_values()	;}
		, save_values	: function()			{		my_save_values()			;}
		,  set_value	: function(key, value)	{		my_array[key] = value		;}
		,  get_value	: function(key)			{return my_array[key]				;}
	};
}();
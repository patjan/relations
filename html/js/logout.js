/**
 *	JKY.logout_start
 *
 *	process logout and clean up User's info
 *  initiated from index.js submenu [Log Out]
 */
JKY.logout_start = function(){
	display_trace('JKY.logout_start');
	var data = {command:'log_out'};
	$.ajax({
		async	: false,
		data	: data,

		//	process success condition from server and reset user's info from server
		success: function(json){
			//	clean up User's info
			JKY.user = JKY.User.create();
			JKY.user.set_first_name	('');
			JKY.user.set_last_name	('');
			JKY.user.set_user_role	('');
			JKY.user.set_start_page	('');

			//	delete welcome info with User's first name
			$('.jky-user-name').html('');

			//	disable all anchor from Menu
			$('.dashboard a'	).removeAttr('href').attr('class', 'disabled');
			$('.view-orders a'	).removeAttr('href').attr('class', 'disabled');
			$('.admin a'		).removeAttr('href').attr('class', 'disabled');
			$('.my-profile a'	).removeAttr('href').attr('class', 'disabled');
			$('.controls a'		).removeAttr('href').attr('class', 'disabled');
			$('.logout a'		).removeAttr('href').attr('class', 'disabled');

			//	redirect to login page
			JKY.router.transitionTo('login');
		} // callback success
	}); // ajax
}
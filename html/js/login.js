/**
 *	JKY.login_start
 *
 * 	start login process
 *  initiated from index.js
 */
JKY.login_start = function(){
	display_trace('JKY.login_start');
	if (Em.TEMPLATES['login']){
		JKY.login_setup();
	}else{
		setTimeout(function(){JKY.login_start()}, 100);
	}
}

/**
 *	JKY.login_setup
 *
 * 	setup login form
 *  initiated from JKY.login_start
 */
JKY.login_setup = function(){
	display_trace('JKY.login_setup');
	if ($('#user-name')){

		$('.signup-form').validate({
			success: function(label) {
				label
					.text('OK!').addClass('valid')
					.closest('.control-group').addClass('success');
			},

			//	to avoid to submit request to server and re-load new page
			submitHandler: function(form) {
//alert('submitHandler');
				return false;
			}				
		});
/*		jquery validate displays user-name and password to url on address bar (Chrome and Safari)
		$('.login-form').validate({
			success: function(label){
				label
					.text('OK!').addClass('valid')
					.closest('.control-group').addClass('success');
			},

			//	to avoid to submit request to server and re-load new page
			submitHandler: function(form){
alert('submitHandler');
				return false;
			}				
		});
*/
		on_enter_focus_next();
		set_focus('user-name');
	}else{
		setTimeout(function(){JKY.login_setup();}, 100);
	}
}

/**
 *	JKY.signup_submit
 *
 *	process signup submit validation
 *	and display the start-page controlled from server
 */
JKY.signup_submit = function() {
	display_trace('JKY.signup_submit');
}

/**
 *	JKY.login_submit
 *
 *	process login submit validation
 *	and display the start-page controlled from server
 */
JKY.login_submit = function(){
	display_trace('JKY.login_submit');
//	clean up previous message
	reset_message('log-in');
	set_focus('user-name');

//	IE8 - Object doesn't support property or method [trim] 
//	var userName = $('#user-name').val().trim();
//	var password = $('#password' ).val().trim();
	var userName = $('.user-name').val();
	var password = $('.password' ).val();
	if (userName == '' || password == ''){
		set_message('log-in', 'Missing required field(s).');
		return false;
	}
	
//	ready to start backend processs
	var data = {command:'log_in', user_name:userName, encrypted:$.md5(password)};
	$.ajax({
		async: false,
		data: data,
		//	process success condition from server and save user's info from server
		success: function(json){
			var status 	= json['status'	];
			var message = json['message'];
			var data	= json['data'	];
			
			if (status != 'ok'){
				display_message('log-in', 'User Name or Password are invalid.');
			}else{
				JKY.initiate_login(data);

//				JKY.router.transitionTo('dashboard');
//				JKY.router.transitionTo(JKY.user.get('start_page'));
				JKY.router.transitionTo('controls');
			} // else
		} // callback success
	}); // ajax
};

/**
 *	JKY.initiate_login
 *
 *	initiate login setting from backend
 */
JKY.initiate_login = function(data){
	display_trace('JKY.initiate_login');

	//	save User's info into model
	JKY.user = JKY.User.create();
	JKY.user.set_first_name(data['first_name']);
	JKY.user.set_last_name (data['last_name' ]);
	JKY.user.set_user_role (data['user_role' ]);
	JKY.user.set_start_page(data['start_page']);

	//	insert welcome info with User's first name
	$('.jky-user-name').html(JKY.user.get('first_name'));

	//	enable all anchor from Menu
	$('.dashboard a'	).removeAttr('class').attr('href', '#/dashboard'	);
	$('.view-orders a'	).removeAttr('class').attr('href', '#/view-orders'	);
	$('.admin a'		).removeAttr('class').attr('href', '#/admin'		);
	$('.my-profile a'	).removeAttr('class').attr('href', '#/my-profile'	);
	$('.controls a'		).removeAttr('class').attr('href', '#/controls'		);
	$('.logout a'		).removeAttr('class').attr('href', '#/logout'		);
}

/**
 *	JKY.is_session_gone
 *
 *	check from backend if this session is gone
 *  return true or false
 */
JKY.is_session_gone = function(){
return false;
	display_trace('JKY.is_session_gone');
	var result;
	var data = {command:'check-session'};
	$.ajax({
//		url: JKY.AJAX_URL,
		async: false, 
//		dataType: 'json',
		data: data,

		//	process error condition from server
		error: function(x, t, m){
			alert('error, message: ' + m);
		}, // callback error

		//	process success condition from server
		success: function(json){
			var status 	= json['status'	];
			var data	= json['data'	];

			if (status != 'ok') {
				result = true;
			}else{
				JKY.initiate_login(data);
				result = false;
			}
		} // callback success
	}); // ajax
	return result;
};
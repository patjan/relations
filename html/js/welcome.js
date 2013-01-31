"use strict";

/**
 * welcome.html
 */

/**
 * start program
 */
JKY.start_program = function() {
	JKY.display_trace('start_program');
	var name	= 'Welcome to Advent Registration System';
	var buttons = [];
	JKY.set_body_header(name, buttons);
	JKY.set_body_content();
	JKY.set_body_events();
	JKY.set_buttons_event();
}

/**
 *	set body content
 */
JKY.set_body_content = function() {
	JKY.display_trace('set_body_content');
	if ($('#jky-body-loaded').length > 0) {
		$('#jky-log-in-user-name').val('patjan');
		$('#jky-log-in-password' ).val('brazil');
		JKY.set_button_log_in();
		JKY.set_focus('jky-log-in-user-name');
	} else {
		setTimeout(function() {JKY.set_body_content();}, 100);
	}
}

/**
 *	set body events (run only once per load)
 */
JKY.set_body_events = function() {
	JKY.display_trace('set_body_events');
	if ($('#jky-body-loaded').length > 0) {
		$('#jky-sign-up-user-name'		).change(function() {JKY.change_sign_up_name	(this)	;});
		$('#jky-sign-up-email-address'	).change(function() {JKY.change_email_address	(this)	;});
		$('#jky-button-sign-up'			).click (function() {JKY.process_sign_up		()		;});

		$('#jky-log-in-user-name'		).change(function() {JKY.change_log_in_name		(this)	;});
		$('#jky-log-in-password'		).change(function() {JKY.change_password		(this)	;});
		$('#jky-button-log-in'			).click (function() {JKY.process_log_in			()		;});
	} else {
		setTimeout(function() {JKY.set_body_events();}, 100);
	}
}

JKY.change_sign_up_name= function(user_name) {
	var my_user_name = user_name.value;
	JKY.display_trace('change_sign_up_name: ' + my_user_name);
	$('#jky-log-in-user-name' ).val(my_user_name);
	JKY.set_button_sign_up();
}

JKY.change_email_address= function(email_address) {
	var my_email_address = email_address.value;
	JKY.display_trace('change_email_address: ' + my_email_address);
	JKY.set_button_sign_up();
}

JKY.set_button_sign_up = function() {
	JKY.display_trace('set_button_sign_up');
	var my_user_name 	= $('#jky-sign-up-user-name'	).val();
	var my_email_address= $('#jky-sign-up-email-address').val();
	if (my_user_name === '' || my_email_address === '') {
		JKY.disabled_id('jky-button-sign-up');
	}else{
		JKY.enabled_id ('jky-button-sign-up');
	}
}

JKY.process_sign_up = function() {
	JKY.display_trace('process_sign_up');
}

JKY.change_log_in_name= function(user_name) {
	var my_user_name = user_name.value;
	JKY.display_trace('change_log_in_name: ' + my_user_name);
	$('#jky-sign-up-user-name').val(my_user_name);
	JKY.set_button_log_in();
}

JKY.change_password= function(password) {
	var my_password = password.value;
	JKY.display_trace('change_password: ' + my_password);
	JKY.set_button_log_in();
}

JKY.set_button_log_in = function() {
	JKY.display_trace('set_button_log_in');
	var my_user_name 	= $('#jky-log-in-user-name'	).val();
	var my_password		= $('#jky-log-in-password'	).val();
	if (my_user_name === '' || my_password === '') {
		JKY.disabled_id('jky-button-log-in');
	}else{
		JKY.enabled_id ('jky-button-log-in');
	}
}

JKY.process_log_in = function() {
	JKY.display_trace('process_log_in');
	var my_user_name = $('#jky-log-in-user-name').val();
	var my_password  = $('#jky-log-in-password' ).val();
	var my_data =
		{ method		: 'log_in'
		, user_name		: my_user_name
//		, encrypted		: $.md5(JKY.user_time + $.md5(my_password))
		, encrypted		: $.md5(my_password)
		};
	JKY.ajax(false, my_data, JKY.process_log_in_success);
	JKY.display_trace('process_log_in end');
}

JKY.process_log_in_success = function(response) {
	JKY.display_trace('process_log_in_success');
	var my_data = response.data;
	JKY.display_message( 'Full Name: ' + my_data. full_name);
	JKY.display_message('First Name: ' + my_data.first_name);
	JKY.display_message( 'Last Name: ' + my_data. last_name);
	JKY.display_message( 'User Role: ' + my_data. user_role);
	JKY.display_message('Start Page: ' + my_data.start_page);
	JKY.set_user_info (my_data.full_name );
	JKY.process_action(my_data.start_page);
}
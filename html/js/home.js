/**
 * home.html
 */
JKY.ApplicationController	= Em.Controller.extend();
JKY.HeaderController		= Em.Controller.extend();
JKY.FooterController		= Em.Controller.extend();
JKY.ButtonsController		= Em.Controller.extend();
JKY.BodyController			= Em.Controller.extend();

JKY.ApplicationView	= Em.View.extend({templateName:'template-wrapper'	});
JKY.	 HeaderView	= Em.View.extend({templateName:'template-header'	});
JKY.	 FooterView	= Em.View.extend({templateName:'template-footer'	});
JKY.	ButtonsView	= Em.View.extend({templateName:'template-buttons'	});
JKY.	   BodyView	= Em.View.extend({templateName:'template-body'		});

JKY.Router = Em.Router.extend(
	{ enableLogging: true
	, root: Em.Route.extend()
	}
);

/**
 * main function
 */
$(function() {
	JKY.display_trace('$(function() {})');
	JKY.start_program();
});

/** ------------------------------------------------------------------------ **/

/**
 * initiate Ember Router and set bindings
 */
JKY.start_program = function() {
	JKY.display_trace('start_program');
	JKY.router.get('applicationController').connectOutlet('outlet-header'	, 'header'	);
	JKY.router.get('applicationController').connectOutlet('outlet-footer'	, 'footer'	);
	JKY.router.get('applicationController').connectOutlet('outlet-buttons'	, 'buttons'	);
	JKY.router.get('applicationController').connectOutlet('outlet-body'		, 'body'	);
	JKY.get_session		();
	JKY.set_header		();
	JKY.set_footer		();
	JKY.set_buttons		();
	JKY.set_body		();
	JKY.set_all_events	();
	JKY.set_all_infos	();
};

/**
 * get session from backend
 */
JKY.get_session = function() {
	JKY.session = new Array();

	JKY.session['company_name'	] = 'JKY Software Corp';
	JKY.session['company_logo'	] = 'relations';
	JKY.session['event_name'	] = '2013 Annual Event';
//	JKY.session['user_name'		] = 'patjan';

	JKY.session['copyright'		] = '© 2013 JKY Software Corp';
	JKY.session['contact_us'	] = 'Contact Us';

	JKY.session['language'		] = 'Taiwanese';
	JKY.session['languages'		] = ['English', 'Chinese', 'Taiwanese', 'Portugues'];
}

/**
 * set header view
 */
JKY.set_header = function() {
	JKY.HeaderView = Em.View.extend(
		{ company_name	: JKY.session['company_name']
		, company_logo	: JKY.session['company_logo']
		, event_name	: JKY.session['event_name'	]
		, user_name		: JKY.session['user_name'	]

//		, setUserName	: function(user_name)	{this.user_name = user_name;}
//		, getUserName	: function()			{return this.user_name;		}
		}
	);
}

/**
 * set footer view
 */
JKY.set_footer = function() {
	JKY.FooterView = Em.View.extend(
		{ copyright		: JKY.session['copyright'	]
		, contact_us	: JKY.session['contact_us'	]
		}
	);
}

/**
 * set buttons view
 */
JKY.set_buttons = function() {
	JKY.ButtonsView = Em.View.extend(
		{ menus			: []
		, admins		: []
		, language		: JKY.session['language'	]
		, languages		: JKY.session['languages'	]
//		, language		: 'Chinese'
//		, languages		: ['English', 'Chinese', 'Taiwanese', 'Portugues']
		}
	);
}

/**
 * set body view
 */
JKY.set_body = function() {
	JKY.BodyView = Em.View.extend(
		{ icon		: 'th'
		, name		: 'Welcome to Advent Registration System'
		}
	);
}

/**
 *	set all events (run only once per load)
 */
JKY.set_all_events = function() {
	JKY.display_trace('set_all_events');
	if ($('#jky-loaded').length > 0) {
		$('#jky-sign-up'				).click (function() {JKY.display_sign_up		()		;});
		$('#jky-log-in'					).click (function() {JKY.display_log_in			()		;});
		$('#jky-profile'				).click (function() {JKY.display_profile		()		;});
		$('#jky-log-out'				).click (function() {JKY.display_log_out		()		;});

		$('#jky-company-logo'			).click (function() {JKY.display_wordpress		()		;});
		$('#jky-company-name'			).click (function() {JKY.display_company		(this)	;});
		$('#jky-event-name'				).click (function() {JKY.display_event			(this)	;});

		$('#jky-copyright'				).click (function() {JKY.display_copyright		()		;});
		$('#jky-contact-us'				).click (function() {JKY.display_contact_us		()		;});

		$('#jky-select-language'		).change(function() {JKY.change_language		(this)	;});

		$('#jky-sign-up-user-name'		).change(function() {JKY.change_sign_up_name	(this)	;});
		$('#jky-sign-up-email-address'	).change(function() {JKY.change_email_address	(this)	;});
		$('#jky-button-sign-up'			).click (function() {JKY.process_sign_up		()		;});

		$('#jky-log-in-user-name'		).change(function() {JKY.change_log_in_name		(this)	;});
		$('#jky-log-in-password'		).change(function() {JKY.change_password		(this)	;});
		$('#jky-button-log-in'			).click (function() {JKY.process_log_in			()		;});
	} else {
		setTimeout(function() {JKY.set_all_events();}, 100);
	}
}

/**
 *	set all infos
 */
JKY.set_all_infos = function() {
	JKY.display_trace('set_all_infos');
	if ($('#jky-loaded').length > 0) {
//		$('#jky-language option:')
		$('#jky-log-in-user-name').val('patjan');
		$('#jky-log-in-password' ).val('brazil');
		JKY.set_button_log_in();
		JKY.set_focus('jky-log-in-user-name');
	} else {
		setTimeout(function() {JKY.set_all_infos();}, 100);
	}
}

/** ------------------------------------------------------------------------ **/

JKY.display_sign_up = function() {
	JKY.display_trace('display_sign_up');
}

JKY.display_log_in = function() {
	JKY.display_trace('display_log_in');
}

JKY.display_profile = function() {
	JKY.display_trace('display_profile');
}

JKY.display_log_out = function() {
	JKY.display_trace('display_log_out');
}

JKY.display_wordpress = function() {
	JKY.display_trace('display_wordpress');
}

JKY.display_company = function(company_name) {
	var my_company_name = $(company_name).text();
	JKY.display_trace('display_company: ' + my_company_name);
}

JKY.display_event = function(event_name) {
	var my_event_name = $(event_name).text();
	JKY.display_trace('display_event: ' + my_event_name);
}

JKY.display_copyright = function() {
	JKY.display_trace('display_copyright');
}

JKY.display_contact_us = function() {
	JKY.display_trace('display_contact_us');
}

JKY.change_language = function(language) {
	var my_language = language.options[language.selectedIndex].value;
	JKY.display_trace('language: ' + my_language);
}

/** ------------------------------------------------------------------------ **/

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
	var my_user_name 	= $('#jky-sign-up-user-name'	).val();
	var my_email_address= $('#jky-sign-up-email-address').val();
	if (my_user_name == '' || my_email_address == '') {
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
	var my_user_name 	= $('#jky-log-in-user-name'	).val();
	var my_password		= $('#jky-log-in-password'	).val();
	if (my_user_name == '' || my_password == '') {
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

JKY.process_log_in_success = function(data) {
	JKY.display_trace('process_log_in_success');
	JKY.display_message('First Name: ' + data.first_name);
	JKY.display_message( 'Last Name: ' + data.last_name );
	JKY.display_message( 'User Role: ' + data.user_role );
	JKY.display_message('Start Page: ' + data.start_page);
}
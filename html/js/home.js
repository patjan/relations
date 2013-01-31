"use strict";

/**
 * main function
 */
$(function() {
	JKY.display_trace('$(function() {})');
//	JKY.get_session();
	JKY.Session.read_values();
	JKY.set_company_name( JKY.Session.get_value('company_name'	));
	JKY.set_user_info	( JKY.Session.get_value('full_name'		));
	JKY.set_company_logo( JKY.Session.get_value('company_logo'	));
	JKY.set_event_name	( JKY.Session.get_value('event_name'	));
	JKY.set_copyright	( JKY.Session.get_value('copyright'		));
	JKY.set_contact_us	( JKY.Session.get_value('contact_us'	));
	JKY.set_buttons_menus([]);
	JKY.set_buttons_control([], JKY.Session.get_value('language'), JKY.Session.get_value('languages'));
	JKY.set_events();
	JKY.process_action('welcome');
//	JKY.process_action('controls');
});

/**
 * get session from backend
 */
JKY.get_session = function() {
	JKY.display_trace('get_session');
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
 *	set events (run only once per load)
 */
JKY.set_events = function() {
	JKY.display_trace('set_events');
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

	} else {
		setTimeout(function() {JKY.set_events();}, 100);
	}
}

/**
 *	set buttons event
 */
JKY.set_buttons_event = function() {
	JKY.display_trace('set_events');
	if ($('#jky-loaded').length > 0) {
		$('#jky-home'					).click (function() {JKY.process_home			()		;});
		$('#jky-help'					).click (function() {JKY.process_help			()		;});
		$('#jky-my-info'				).click (function() {JKY.process_my_info		()		;});
		$('#jky-control-language'		).change(function() {JKY.change_language		(this)	;});
	} else {
		setTimeout(function() {JKY.set_events();}, 100);
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

JKY.process_home = function() {
	JKY.display_trace('process_home');
	JKY.process_action('welcome');
}

JKY.process_help = function() {
	JKY.display_trace('process_help');
}

JKY.process_my_info = function() {
	JKY.display_trace('process_my_info');
}
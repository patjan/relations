/**
 * define JKY namespace for all application
 */
window.JKY = Em.Application.create({rootElement:'body'});

JKY.ApplicationController	= Em.Controller.extend();
JKY. HeaderController		= Em.Controller.extend();
JKY. FooterController		= Em.Controller.extend();
JKY.ButtonsController		= Em.Controller.extend();
JKY.   BodyController		= Em.Controller.extend();
JKY.  TableController		= Em.Controller.extend();

JKY.ApplicationView	= Em.View.extend({templateName:'template-wrapper'	});
JKY. HeaderView 	= Em.View.extend({templateName:'template-header'	});
JKY. FooterView 	= Em.View.extend({templateName:'template-footer'	});
JKY.ButtonsView 	= Em.View.extend({templateName:'template-buttons'	});
JKY.   BodyView 	= Em.View.extend({templateName:'template-body'		});
JKY.  TableView 	= Em.View.extend({templateName:'template-table'		});

JKY.Router = Em.Router.extend(
	{ enableLogging: true
	, root: Em.Route.extend(
		{ loadNewSet: Em.Route.transitionTo('newSet')

		, index: Em.Route.extend(
			{ route: '/'
			, connectOutlets: function(router, context) {
				JKY.displayTrace('JKY.Router.index');
				JKY.loadNewSet('Root');
				}
			})

		, newSet: Em.Route.extend(
			{ route: '/newSet/:name'
			, deserialize	: function(router, context) {
				return (context.name)
				}
			, serialize		: function(router, context) {
				return {name: context}
				}
			, connectOutlets: function(router, controlSet) {
				JKY.displayTrace('JKY.Router.newSet, newSet: ' + controlSet);
				JKY.loadNewSet2(controlSet);
				}
			})
		})
	});

$(function() {
	$.ajaxSetup({
		dataType: 'json',
		error	: function(jqXHR, textStatus, errorThrown) {
			JKY.hideLoading();
			JKY.displayMessage('Error from backend server, please re-try later.');
		}
	});

	JKY.displayTrace('$(function() {})');
	JKY.controlsStart();
});

/**
 * JKY.controlsStart
 * wait until the template is compiled by handlebars
 *
 * initiate Ember Router and set bindings
 */
JKY.controlsStart = function() {
	JKY.displayTrace('JKY.controlsStart');
	JKY.router.get('applicationController').connectOutlet('outlet-header'	, 'header'	);
	JKY.router.get('applicationController').connectOutlet('outlet-footer'	, 'footer'	);
	JKY.router.get('applicationController').connectOutlet('outlet-buttons'	, 'buttons'	);
	JKY.router.get('applicationController').connectOutlet('outlet-body'		, 'body'	);
	JKY.router.get(       'bodyController').connectOutlet('outlet-table'	, 'table'	);
	JKY.setHeader	();
	JKY.setFooter	();
	JKY.setButtons	();
	JKY.setBody		();
//	JKY.loadNewSet('Root');
};

/**
 * load new set
 */
JKY.loadNewSet = function(controlSet) {
	JKY.displayTrace('JKY.loadNewSet, controlSet: ' + controlSet);
/*
	$.ajax({
		url		: JKY.AJAX_URL + 'GetUserRoles',
		success	: function(response) {
			JKY.displayTrace('JKY.loadNewSet, ajax, success');
			if (response.Status != 'ok') {
				JKY.displayMessage(response.Error.Message);
			} else {
				JKY.saveUserRoles(response.Data);
			}
		}
	});
*/
	JKY.TableView = Em.View.extend(
		{ table_body	:
			[{ 'sequence': 0, 'control-name': 'Company Type', 'control-value': '', 'status': 'active'}
			,{ 'sequence': 0, 'control-name': 'Display Rows', 'control-value': '', 'status': 'active'}
			,{ 'sequence': 0, 'control-name': 'Group Types'	, 'control-value': '', 'status': 'active'}
			,{ 'sequence': 0, 'control-name': 'Priorities'	, 'control-value': '', 'status': 'active'}
			,{ 'sequence': 0, 'control-name': 'Root'		, 'control-value': '', 'status': 'active'}
			,{ 'sequence': 0, 'control-name': 'Status Codes', 'control-value': '', 'status': 'active'}
			]
		});
}

/**
 * load new set
 */
JKY.loadNewSet2 = function(controlSet) {
	JKY.displayTrace('JKY.loadNewSet2, controlSet: ' + controlSet);
/*
	$.ajax({
		url		: JKY.AJAX_URL + 'GetUserRoles',
		success	: function(response) {
			JKY.displayTrace('JKY.loadNewSet, ajax, success');
			if (response.Status != 'ok') {
				JKY.displayMessage(response.Error.Message);
			} else {
				JKY.saveUserRoles(response.Data);
			}
		}
	});
*/
	JKY.TableView = Em.View.extend(
		{ table_body	:
			[{ 'sequence': 10, 'control-name': 'Company Type', 'control-value': '', 'status': 'active'}
			,{ 'sequence': 10, 'control-name': 'Display Rows', 'control-value': '', 'status': 'active'}
			,{ 'sequence': 10, 'control-name': 'Group Types'	, 'control-value': '', 'status': 'active'}
			,{ 'sequence': 10, 'control-name': 'Priorities'	, 'control-value': '', 'status': 'active'}
			,{ 'sequence': 10, 'control-name': 'Root'		, 'control-value': '', 'status': 'active'}
			,{ 'sequence': 10, 'control-name': 'Status Codes', 'control-value': '', 'status': 'active'}
			]
		});
}

JKY.setHeader = function() {
	JKY.HeaderView = Em.View.extend(
		{ company_name	: 'JKY Software Corp'
		, company_logo	: 'relations'
		, user_name		: 'Pat Jan'
		, event_name	: '2012 Annual Event'

		, setUserName	: function(user_name)	{this.user_name = user_name;}
		, getUserName	: function()			{return this.user_name;		}
		});
}

JKY.setFooter = function() {
	JKY.FooterView = Em.View.extend(
		{ copyright		: '© 2013 JKY Software Corp'
		, contact_us	: 'Contact Us'
		});
}

JKY.setButtons = function() {
	JKY.ButtonsView = Em.View.extend(
		{ menus		:
			[{ label: 'Home'			, icon: 'home'			}
			,{ label: 'Help'			, icon: 'question-sign'	}
			,{ label: 'My Info'			, icon: 'user'			}
			]
		, admins	:
			[{ label: 'Dictionary'		, icon: 'tasks'			}
			,{ label: 'Summary'			, icon: 'tasks'			}
			,{ label: 'Groups'			, icon: 'tasks'			}
			,{ label: 'Templates'		, icon: 'tasks'			}
			,{ label: 'Organizations'	, icon: 'tasks'			}
			,{ label: 'Permissions'		, icon: 'tasks'			}
			,{ label: 'Settings'		, icon: 'tasks'			}
			,{ label: 'Controls'		, icon: 'tasks'			}
			]
		});
}

JKY.setBody = function() {
	JKY.BodyView = Em.View.extend(
		{ name		: 'Controls'
		, icon		: 'tasks'
		, buttons	:
			[{ label: 'Add New'			, icon: 'tasks'			}
			,{ label: 'Export'			, icon: 'tasks'			}
			,{ label: 'Publish'			, icon: 'tasks'			}
			,{ label: 'Combine'			, icon: 'tasks'			}
			,{ label: 'Upload'			, icon: 'tasks'			}
			,{ label: 'Print'			, icon: 'tasks'			}
			]
		, filter	: 'filter...'
		, loaded	: 123
		, counter	: 1234
		, table_header	:
			[{ id: 'sequence'		, label: 'Seq'				}
			,{ id: 'control-name'	, label: 'Control Name'		}
			,{ id: 'control-value'	, label: 'Control Value'	}
			,{ id: 'status'			, label: 'Status'			}
			]
		});
}


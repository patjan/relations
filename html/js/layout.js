/**
 * define JKY namespace for all application
 */
window.JKY = Em.Application.create({rootElement:'body'});

JKY.ApplicationController	= Em.Controller.extend();
JKY. HeaderController		= Em.Controller.extend();
JKY.  IconsController	 	= Em.Controller.extend();
JKY.ButtonsController		= Em.Controller.extend();
JKY.   BodyController		= Em.Controller.extend();
JKY. FooterController		= Em.Controller.extend();

JKY.ApplicationView	= Em.View.extend({templateName:'template-wrapper'	});
JKY. HeaderView 	= Em.View.extend({templateName:'template-header'	});
JKY.  IconsView 	= Em.View.extend({templateName:'template-icons'		});
JKY.ButtonsView 	= Em.View.extend({templateName:'template-buttons'	});
JKY.   BodyView 	= Em.View.extend({templateName:'template-body'		});
JKY. FooterView 	= Em.View.extend({templateName:'template-footer'	});

JKY.Router = Em.Router.extend({
	enableLogging: true,
	root: Em.Route.extend({
		index: Em.Route.extend({
		})
	})
});


$(function() {
	JKY.router.get('applicationController').connectOutlet('outlet-header'	, 'header'	);
	JKY.router.get('applicationController').connectOutlet('outlet-icons'	, 'icons'	);
	JKY.router.get('applicationController').connectOutlet('outlet-buttons'	, 'buttons'	);
	JKY.router.get('applicationController').connectOutlet('outlet-body'		, 'body'	);
	JKY.router.get('applicationController').connectOutlet('outlet-footer'	, 'footer'	);
	JKY.setHeader	();
	JKY.setFooter	();
	JKY.setIcons	();
	JKY.setButtons	();
	JKY.setBody		();

//setTimeout( function() {
//	alert('wait 1: ' + JKY.headerView.toString());
//	JKY.headerView.setUserName('Joel XXX');
//}, 1000);

});

JKY.setHeader = function() {
	JKY.HeaderView = Em.View.extend(
		{ company_name	: 'JKY Software Corp'
		, user_name		: 'Pat Jan'

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

JKY.setIcons = function() {
	JKY.IconsView = Em.View.extend(
		{ company_logo	: 'relations'
		, event_name	: '2012 Annual Event'
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
		, table_body	:
			[{ 'sequence': 0, 'control-name': 'Company Type', 'control-value': '', 'status': 'active'}
			,{ 'sequence': 0, 'control-name': 'Display Rows', 'control-value': '', 'status': 'active'}
			,{ 'sequence': 0, 'control-name': 'Group Types'	, 'control-value': '', 'status': 'active'}
			,{ 'sequence': 0, 'control-name': 'Priorities'	, 'control-value': '', 'status': 'active'}
			,{ 'sequence': 0, 'control-name': 'Root'		, 'control-value': '', 'status': 'active'}
			,{ 'sequence': 0, 'control-name': 'Status Codes', 'control-value': '', 'status': 'active'}
			]
		});
}


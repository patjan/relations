JKY.rows = [];


JKY.ApplicationController	= Em.Controller.extend();
JKY.HeaderController		= Em.Controller.extend();
JKY.FooterController		= Em.Controller.extend();
JKY.ButtonsController		= Em.Controller.extend();
JKY.BodyController			= Em.Controller.extend();
JKY.TableController			= Em.Controller.extend();

JKY.ApplicationView	= Em.View.extend({templateName:'template-wrapper'	});
JKY.	 HeaderView	= Em.View.extend({templateName:'template-header'	});
JKY.	 FooterView	= Em.View.extend({templateName:'template-footer'	});
JKY.	ButtonsView	= Em.View.extend({templateName:'template-buttons'	});
JKY.	   BodyView	= Em.View.extend({templateName:'template-body'		});
JKY.	  TableView	= Em.View.extend({templateName:'template-table'		});

//JKY.tableView = JKY.TableView.create();

JKY.Router = Em.Router.extend(
	{ enableLogging: true
	, root: Em.Route.extend(
		{ loadNewSet: Em.Route.transitionTo('newSet')

		, index: Em.Route.extend(
			{ route: '/'
			, connectOutlets: function(router, context) {
				JKY.display_trace('JKY.Router.index');
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
				JKY.display_trace('JKY.Router.newSet, newSet: ' + controlSet);
				JKY.loadNewSet(controlSet);
				}
			})
		})
	});

/**
 * main function
 */
$(function() {
	JKY.display_trace('$(function() {})');
	JKY.controlsStart();
});

/**
 * JKY.controlsStart
 *
 * initiate Ember Router and set bindings
 */
JKY.controlsStart = function() {
	JKY.display_trace('JKY.controlsStart');
	JKY.router.get('applicationController').connectOutlet('outlet-header'	, 'header'	);
	JKY.router.get('applicationController').connectOutlet('outlet-footer'	, 'footer'	);
	JKY.router.get('applicationController').connectOutlet('outlet-buttons'	, 'buttons'	);
	JKY.router.get('applicationController').connectOutlet('outlet-body'		, 'body'	);
	JKY.router.get(       'bodyController').connectOutlet('outlet-table'	, 'table'	);
	JKY.setHeader	();
	JKY.setFooter	();
	JKY.setButtons	();
	JKY.setBody		();
	JKY.filter_value = '';
	JKY.control_set  = Em.Object.create({selected: 'Root', content: JKY.loadControlSet('Root'			)});
	JKY.display_rows = Em.Object.create({selected: 'All' , content: JKY.loadControlSet('Display+Rows'	)});
	JKY.bindingOnScroll();	//	table scroll  can be bond only once
	JKY.bindingOnResize();	//	window resize can be bond only once
};

/**
 * binding on scroll
 * wait until any order is loaded, to binding on scroll
 *
 * !!! important !!!
 * table scroll can be bond only once per load
 */
JKY.bindingOnScroll = function() {
	if (JKY.rows.length > 0) {
		$('.tablescroll_wrapper').scroll(function() {
			if (JKY.isScrollAtEnd('tablescroll_wrapper')) {
//				JKY.loadMoreRows();
			}
		});
	} else {
		setTimeout(function() {JKY.bindingOnScroll();}, 100);
	}
}

/**
 * binding on resize
 * not to bind on IE < 9, it will cause infinite loops
 * wait until any order is loaded, to binding on scroll
 *
 * !!! important !!!
 * window resize can be bond only once per load
 */
JKY.bindingOnResize = function() {
	if (JKY.isBrowser('msie') && $.browser.version < 9) {
		return;
	}
	if (JKY.rows.length > 0) {
		$(window).bind('resize', function() {
			JKY.setTableWidthHeight('jky-body-table', 924, 378, 550);
		});
	} else {
		setTimeout(function() {JKY.bindingOnResize();}, 100);
	}
}

/**
 * load control set
 */
JKY.loadControlSet = function(controlSet) {
	JKY.display_trace('JKY.loadControlSet, controlSet: ' + controlSet);
	var my_rows = [];

	$.ajax({
		url		: JKY.AJAX_URL + 'command=get_index&table=Controls&order_by=sequence,control_name&select=' + controlSet,
		async	: false,
		success	: function(response) {
			JKY.display_trace('JKY.setBody, ajax, success');
			if (response.status != 'ok') {
				JKY.displayMessage(response.message);
			} else {
				for(var i=0; i<response.rows.length; i+=1) {
					var my_row = [];
					my_name = response.rows[i]['control_name'];
					my_rows.push(my_name);
				}
			}
		}
	})
	return my_rows;
}

/**
 * load new set
 */
JKY.loadNewSet = function(controlSet) {
	JKY.display_trace('JKY.loadNewSet, controlSet: ' + controlSet);
	JKY.showLoading();

	$.ajax({
		url		: JKY.AJAX_URL + 'command=get_index&table=Controls&order_by=sequence,control_name&select=' + controlSet,
		success	: function(response) {
			JKY.display_trace('JKY.loadNewSet, ajax, success');
			if (response.status != 'ok') {
				JKY.displayMessage(response.message);
			} else {
				JKY.rows = response.rows;
				JKY.displayByFilter();
			}
		}
	});
}

/**
 * sort by column
 */
JKY.sortByColumn = function(column_name) {
	if (typeof(column_name) != 'undefined') {
		if (JKY.sort_name == column_name) {
			JKY.sort_seq   = JKY.sort_seq * -1;
		}else{
			JKY.sort_name  = column_name;
		}
	}

	if (JKY.sort_id) {
		JKY.sort_id.removeClass();
	}
//	JKY.sort_id = $('a[onclick=\'JKY.sort_by("' + JKY.sort_name + '")\']');
	JKY.sort_id = $('a[onclick*="\"' + JKY.sort_name + '\""]');
	JKY.sort_id.addClass('sorted_' + (JKY.sort_seq > 0 ? 'asc' : 'desc'));

	JKY.rows.sort(function(a, b) {
		var value_a = a[JKY.sort_name];
		var value_b = b[JKY.sort_name];

		if (isNaN(value_a) || isNaN(value_b)) {
			if ( !value_a )      value_a = '';
			if ( !value_b )      value_b = '';
			if (  value_a < value_b ) return JKY.sort_seq * -1;
			if (  value_a > value_b ) return JKY.sort_seq *  1;
		}else{
			difference = value_a - value_b;
			if (  difference < 0 )    return JKY.sort_seq * -1;
			if (  difference > 0 )    return JKY.sort_seq *  1;
		}

          var  value_a = a['id'];
          var  value_b = b['id'];
          if(  value_a < value_b )      return JKY.sort_seq * -1;
          if(  value_a > value_b )      return JKY.sort_seq *  1;
          return 0;
    });
    JKY.display_rows();
};

/**
 * display by filter
 */
JKY.displayByFilter = function() {
	JKY.display_trace('JKY.displayByFilter');
	var my_exp  = new RegExp(JKY.filter_value, 'i');
	var my_rows = [];

	for(var i=0; i<JKY.rows.length; i+=1) {
		var the_row = JKY.rows[i];
		if (the_row['sequence'		].search(my_exp) > -1
		||  the_row['control_name'	].search(my_exp) > -1
		||  the_row['control_value'	].search(my_exp) > -1
		||  the_row['status'		].search(my_exp) > -1) {
			var my_row = [];
			my_row['sequence'		] = the_row['sequence'		];
			my_row['control-name'	] = the_row['control_name'	];
			my_row['control-value'	] = the_row['control_value'	];
			my_row['status'			] = the_row['status'		];
			my_rows.push(my_row);
		}
	}
	JKY.hideId('jky-body-table');
	JKY.router.get('bodyController').connectOutlet('table', my_rows);
	JKY.set_focus('jky-filter');
//	JKY.setTableWidthHeight('jky-body-table', 924, 378, 550);
setTimeout(function() {
	JKY.setTableWidthHeight('jky-body-table', 924, 378, 550);
	JKY.showId('jky-body-table');
	$('#scroll-bar').css('width', '0');
}, 10);
//	JKY.showClass('tablescroll');
}

/**
 * set header
 */
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

/**
 * set footer
 */
JKY.setFooter = function() {
	JKY.FooterView = Em.View.extend(
		{ copyright		: '© 2013 JKY Software Corp'
		, contact_us	: 'Contact Us'
		});
}

/**
 * set buttons
 */
JKY.setButtons = function() {
	JKY.ButtonsView = Em.View.extend(
		{ menus		:
			[{ label: 'Home'			, icon: 'home'			}
			,{ label: 'Help'			, icon: 'question-sign'	}
			,{ label: 'My Info'			, icon: 'user'			}
			]
		, admins	:
			[{ label: 'Dictionary'		, icon: 'font'			}
			,{ label: 'Summary'			, icon: 'plus-sign'		}
			,{ label: 'Groups'			, icon: 'th-list'		}
			,{ label: 'Templates'		, icon: 'film'			}
			,{ label: 'Organizations'	, icon: 'tasks'			}
			,{ label: 'Permissions'		, icon: 'road'			}
			,{ label: 'Settings'		, icon: 'move'			}
			,{ label: 'Controls'		, icon: 'off'			}
			]
		});
}

/**
 * set body
 */
JKY.setBody = function() {
	JKY.BodyView = Em.View.extend(
		{ name		: 'Controls'
		, icon		: 'tasks'
		, buttons	:
			[{ label: 'Publish'	, icon: 'tasks', on_click: 'JKY.processPublish	()'}
			,{ label: 'Export'	, icon: 'tasks', on_click: 'JKY.processExport	()'}
			,{ label: 'Add New'	, icon: 'tasks', on_click: 'JKY.processAddNew	()'}
//			,{ label: 'Combine'	, icon: 'tasks', on_click: 'JKY.processAddNew	()'}
//			,{ label: 'Upload'	, icon: 'tasks', on_click: 'JKY.processAddNew	()'}
//			,{ label: 'Print'	, icon: 'tasks', on_click: 'JKY.processAddNew	()'}
			]
		, filter	: 'filter...'
		, loaded	: 123
//		, click		: function(event) {alert('click')}
		, change	: function(event) {
				target_id		= event.target.id;
				target_value	= event.target.value;
				if (target_id == 'jky-filter') {
					JKY.display_trace('JKY.setBody: change, jky-filter: ' + target_value);
					JKY.filter_value = target_value;
					JKY.displayByFilter();
				}
				if (target_id == 'jky-select') {
					JKY.loadNewSet(target_value);
				}
			}
		, counter	: 1234
/*
		, table_header	:
			[{ id: 'sequence'		, label: 'Seq'				}
			,{ id: 'control-name'	, label: 'Control Name'		}
			,{ id: 'control-value'	, label: 'Control Value'	}
			,{ id: 'status'			, label: 'Status'			}
			]
*/
		});
/*
	JKY.control_set = Em.Object.create(
		{ selected: 'Root'
		, content:
			[ 'Company Types'
			, 'Display Rows'
			, 'Group Types'
			, 'Priorities'
			, 'Root'
			, 'Status Codes'
			, 'Summary'
			, 'System Defaults'
			, 'System Keys'
			, 'Template Types'
			, 'User Actions'
			, 'User Resources'
			, 'User Roles'
			]
		});
*/
}

JKY.processAddNew = function() {
alert('processAddNew');
}
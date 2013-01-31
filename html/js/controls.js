"use strict";

/**
 * controls.html
 */
JKY.rows = [];


/**
 * start program
 */
JKY.start_program = function() {
	JKY.display_trace('start_program');

	var menus =
		[{ id:'jky-home'	, label:'Home'		, icon:'home'			}
		,{ id:'jky-help'	, label:'Help'		, icon:'question-sign'	}
		,{ id:'jky-my-info'	, label:'My Info'	, icon:'user'			}
		];
	JKY.set_buttons_menus(menus);

	var admins =
		[{ label: 'Dictionary'		, icon: 'font'			}
		,{ label: 'Summary'			, icon: 'plus-sign'		}
		,{ label: 'Groups'			, icon: 'th-list'		}
		,{ label: 'Templates'		, icon: 'film'			}
		,{ label: 'Organizations'	, icon: 'tasks'			}
		,{ label: 'Permissions'		, icon: 'road'			}
		,{ label: 'Settings'		, icon: 'move'			}
		,{ label: 'Controls'		, icon: 'off'			}
		];
	JKY.set_buttons_control(admins, JKY.Session.get_value('language'), JKY.Session.get_value('languages'));

	var name	= 'Controls Dashboard';
	var buttons = 
		[{ label: 'Publish'	, icon: 'tasks', on_click: 'JKY.process_publish	()'}
		,{ label: 'Export'	, icon: 'tasks', on_click: 'JKY.process_export	()'}
		,{ label: 'Add New'	, icon: 'tasks', on_click: 'JKY.process_add_new	()'}
//		,{ label: 'Combine'	, icon: 'tasks', on_click: 'JKY.process_combine	()'}
//		,{ label: 'Upload'	, icon: 'tasks', on_click: 'JKY.process_upload	()'}
//		,{ label: 'Print'	, icon: 'tasks', on_click: 'JKY.process_print	()'}
		];
	JKY.set_body_header(name, buttons);
	JKY.set_body_filter();
	JKY.set_body_events();
	JKY.set_buttons_event();
	JKY.load_new_set('Root');
//	JKY.setBody		();
};

JKY.set_body_filter = function() {
	JKY.display_trace('set_body_filter');
	if ($('#jky-body-loaded').length > 0) {
		JKY.set_html('jky-body-select'	, JKY.set_control_set('Root', 'Root'));
		JKY.set_html('jky-body-display'	, JKY.set_control_set('All' , 'Display Rows'));
		JKY.set_html('jky-body-loaded'	, '123');
		JKY.set_html('jky-body-total'	, '123');
	} else {
		setTimeout(function() {JKY.set_body_filter();}, 100);
	}
};

/**
 *	set body events (run only once per load)
 */
JKY.set_body_events = function() {
	JKY.display_trace('set_body_events');
	if ($('#jky-body-loaded').length > 0) {
		$('#jky-body-filter'	).change(function() {JKY.change_body_filter	(this);});
		$('#jky-body-select'	).change(function() {JKY.change_body_select	(this);});
		$('#jky-body-display'	).change(function() {JKY.chnage_body_display(this);});
	} else {
		setTimeout(function() {JKY.set_body_events();}, 100);
	}
}

/**	
 * change body filter
 */
JKY.change_body_filter = function(event) {
	var my_filter = event.value;
	JKY.display_trace('change_body_filter: ' + my_filter);
//	JKY.display_by_filter(my_filter);
}
/**	
 * change body select
 */
JKY.change_body_select = function(event) {
	var my_select = event.value;
	JKY.display_trace('change_body_select: ' + my_select);
	JKY.load_new_set(my_select);
}

/**
 * load new set
 */
JKY.load_new_set = function(control_set) {
	JKY.display_trace('load_new_set: ' + control_set);
	JKY.showLoading();

	var my_data =
		{ method	: 'get_index'
		, table		: 'Controls'
		, order_by	: 'sequence,control_name'
		, select	: control_set
		};
	JKY.ajax(false, my_data, JKY.load_new_set_success);
}

JKY.load_new_set_success = function(response) {
	JKY.rows = response.rows;
	JKY.display_by_filter(JKY.rows);
}

/**
 * sort by column
 */
JKY.sortByColumn = function(column_name) {
	if (typeof(column_name) != 'undefined') {
		if (JKY.sort_name === column_name) {
			JKY.sort_seq  = JKY.sort_seq * -1;
		}else{
			JKY.sort_name = column_name;
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
JKY.display_by_filter = function(rows) {
	JKY.display_trace('display_by_filter');
	var my_html ='';
	var my_exp  = new RegExp($('#jky-body-filter').val(), 'i');

	for(var i=0; i<rows.length; i+=1) {
		var my_row = rows[i];
		if (my_row['sequence'		].search(my_exp) > -1
		||  my_row['control_name'	].search(my_exp) > -1
		||  my_row['control_value'	].search(my_exp) > -1
		||  my_row['status'			].search(my_exp) > -1) {
			my_html += '<tr>'
					+  '<td class="sequence"		>' + my_row['sequence'		] + '</td>'
					+  '<td class="control-name"	>' + my_row['control_name'	] + '</td>'
					+  '<td class="control-value">' + my_row['control_value'	] + '</td>'
					+  '<td class="status"		>' + my_row['status'		] + '</td>'
					+  '</tr>'
					;
		}
	}
	$('#jky-table-body').html(my_html);
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
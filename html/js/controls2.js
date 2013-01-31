/**
 *	JKY.controls_start
 *
 * 	start controls process
 *  initiated from main menu
 */
JKY.controls_start = function() {
	display_trace('JKY.controls_start');
	//	if server session is gone, then redirect to Login Page
	if (JKY.is_session_gone()){
		JKY.router.transitionTo('login');
		return;
	}else{
		JKY.controls_setup();
	}
}

/**
 *	JKY.controls_setup
 *
 * 	setup controls form
 *  initiated from JKY.control_start
 */
JKY.controls_setup = function() {
	display_trace('JKY.controls_setup');
	if (Em.TEMPLATES["controls"]){
JC.table            = 'Controls'        ;   //  DB table name
JC.order_by         = 'control_name'    ;   //  first field name to be ordered by
JC.order_seq        = 'ASC'             ;   //  first field name to be sequenced by ( ASC, DESC )
JC.select_name      = 'Root'            ;   //  first field name to be selected
JC.focus_name       = 'sequence'        ;   //  first field name to be focused
JC.display_limit    = 'All'             ;   //  limit rows to be displayed
		JKY.controls_get_data();
	}else{
		setTimeout(function(){JKY.controls_setup()}, 100);
	}
}	

/**
 *	JKY.controls_get_data
 *
 * 	get data from server
 */
JKY.controls_get_data = function(){
	display_trace('JKY.controls_get_data');	
filter = '';
order_by = JC.order_by;
specific = '';
JC.select_name = 'User Resources';
	var  data = {command:'get_index', table:JC.table, filter:filter, select:JC.select_name, display:JC.display_limit, order_by:order_by, specific:specific};
	$('#jky_loading').show();
    $.ajax({data:data, success:JKY.display_index});
}
	
/**
 *	JKY.display_index
 *
 * 	display index
 */
JKY.display_index = function(data, text_status, jq_XHR) {
	display_trace('JKY.display_index');	
	JC.skip_add_new = false;
	$('#jky_loading').hide();

	if (data['status'] != 'ok') {
		display_message(data['message']);
		return;
	}

	$.each(data, function(name, value) {
		if (name == 'rows') {
			JC.rows = value;
//			JC.sort_by();
			JC.display_rows();
		}
	})
};

    JC.table            = 'Controls'        ;   //  DB table name
    JC.order_by         = 'control_name'    ;   //  first field name to be ordered by
    JC.order_seq        = 'ASC'             ;   //  first field name to be sequenced by ( ASC, DESC )
    JC.select_name      = 'Root'            ;   //  first field name to be selected
    JC.focus_name       = 'sequence'        ;   //  first field name to be focused
    JC.display_limit    = 'All'             ;   //  limit rows to be displayed

JC.select_setup = function() {
    $('#jky_display'    ).load(JC.ajax_url, {command:'get_options', control_set:'Display Rows', select:JC.display_limit, initial:'All'});
    $('#status'         ).load(JC.ajax_url, {command:'get_options', control_set:'Status Codes'});
//  $('#control_name'   ).change(JC.change);
    JC.refresh_select();
    JC.request_index ();
};

JC.refresh_select = function() {
    $('#jky_select').load(JC.ajax_url, {command:'get_options', control_set:'Root', select:JC.select_name});
};

JC.display_row = function(row) {
    return ''
        + '<td class=C>' + row['sequence'       ] + '</td>'
        + '<td class=L>' + row['control_name'   ] + '</td>'
        + '<td class=L>' + row['control_value'  ] + '</td>'
        + '<td class=C>' + row['status'         ] + '</td>'
        ;
};

JC.set_new = function() {
	$('#status'         ).val('active');
	$('#control_set'    ).val($('#jky_select').val());
	$('#sequence'       ).val(0);
	$('#control_name'   ).val('');
	$('#control_value'  ).val('');
};

JC.return_set = function() {
	var error = '';
	error += jky_verify('sequence'     );
	error += jky_verify('control_name' );

	if (error != '') {
		JC.display_message(error, JC.focus_name);
		return '';
	} else {
		return '            status=' + jky_get_text('status'       )
			+ ',       control_set=' + jky_get_text('control_set'  )
			+ ',          sequence=' + jky_get_text('sequence'     )
			+ ',      control_name=' + jky_get_text('control_name' )
			+ ',     control_value=' + jky_get_text('control_value')
			;
	}
};

//   for every new control created, add new extra field(s)
JC.prep_insert = function(row_id) {
	return ', company_id= ' + JC.control_company;
};

JC.post_insert = function(row_id) {
	JC.refresh_select();
};

JC.post_update = function(row_id) {
	JC.refresh_select();
};

// -----------------------------------------------------------------------------
JC.publish = function() {
    var control_set = '';
    if (JC.table == 'Controls')
        control_set = JC.select_name;

    var data = {command:'publish', table:JC.table, control_set:control_set};
    $.ajax({data:data}).success(function(data) {
        JC.display_message(data['message']);
    });
};

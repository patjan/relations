"use strict";

/**
 * JKY.Util.js
 * generic functions for the JKY application
 */

/**
 * define JKY namespace for all application
 */
var JKY = JKY || {};

/**
 * define all constants
 */
JKY.TRACE		= true;						//	on production, should be set to false, help developement to trace sequence flow
JKY.AJAX_APP	= '../';					//  relative to application directory
//JKY.AJAX_URL	= '../jky_proxy.php?';		//  relative to remote directory
JKY.AJAX_URL	= '../index.php/ajax?';		//  relative to remote directory

JKY.sort_name	= '';
JKY.sort_seq	=  1;

/**
 * run after jquery loaded
 * setup ajax
 */
$(function() {
	$.ajaxSetup({
		async	: false,
		type	: 'post',
		dataType: 'json',
		error	: function(jqXHR, textStatus, errorThrown) {
			JKY.hide('jky-loading');
			JKY.display_message('Error from backend server, please re-try later.');
		}
	});
	if ($('#jky-utils').length === 0)	{
		$('body').append('<div id="jky-utils"></div>');
		JKY.load_html('jky-utils', 'JKY.utils.html'	);
	}
});

/**
 * re direct
 * @param	program_name
 */
JKY.re_direct = function(program_name) {
	alert('re direct to ' + program_name);
}

/**
 * run when is template ready
 * wait until the template is ready
 * @param	template_name
 * @param	function_name
 */
JKY.run_when_is_ready = function(template_name, function_name) {
	JKY.display_trace('run_when_is_ready: ' + template_name);
	if (Em.TEMPLATES[template_name]) {
		function_name();
	}else{
		setTimeout( function() {JKY.run_when_is_ready(template_name, function_name);}, 100);
	}
}

/**
 * translate
 *
 * @param	text
 * @return	translated text
 * @example JKY.t('Home')
 */
JKY.t = function(text) {
	return JKY.Translation.translate(text);
}

/**
 * load html into specific id
 * wait until the id is rendered
 * @param	id_name
 * @param	file_name
 */
JKY.load_html = function(id_name, file_name) {
//	JKY.display_trace('load_html: ' + id_name);
	if ($('#' + id_name).length > 0) {
		$('#' + id_name).load('../' + file_name);
//		JKY.display_trace('load_html: ' + id_name + ' DONE');
	}else{
		setTimeout(function() {JKY.load_html(id_name, file_name);}, 100);
	}
}

/**
 * process action
 * @param	action
 */
JKY.process_action = function(action) {
	JKY.load_html('jky-body-content', action + '.html');
	$.getScript(JKY.AJAX_APP + 'js/' + action + '.js', function() {
		JKY.start_program();
	});
}

/**
 * load handlebar into specific template
 * @param	template_name
 * @param	file_name
 */
JKY.load_hb = function(template_name, file_name) {
	JKY.display_trace('load_hb: ' + template_name);
	if ($('#jky-hb').length > 0) {
		$('#jky-hb').load('../hb/' + file_name, function(src) {
			Em.TEMPLATES[template_name] = Em.Handlebars.compile(src);
			$('#jky-hb').html('');
		});
		JKY.display_trace('load_hb: ' + template_name + ' DONE');
	}else{
		setTimeout(function() {JKY.load_hb(template_name, file_name);}, 100);
	}
}

/**
 * replace in template into specific id
 * wait until the template is loaded
 * @param	template_name
 * @param	id_name
 * @return	(new)View
 */
JKY.replace_in = function(template_name, id_name, view_object) {
	JKY.display_trace('replace_in: ' + template_name);
	if (Em.TEMPLATES[template_name] && $('#' + id_name)) {
		view_object.replaceIn('#' + id_name);
		JKY.display_trace('replace_in: ' + template_name + ' DONE');
	}else{
		setTimeout(function() {JKY.replace_in(template_name, id_name, view_object)}, 100);
	}
}

/**
 * fix flag
 * @param	flag_value
 * @param	true_value
 * @param	false_value
 * @return	&nbsp;
 * @return	true_value
 * @return	false_value
 */
JKY.fix_flag = function(flag_value, true_value, false_value){
	if (flag_value) {
		if (flag_value === 't') {
			return true_value;
		}else{
			return false_value;
		}
	}else{
		return '&nbsp;';
	}
}

/**
 * fix break line
 * replace ' ' with '<br />'
 * @param	string_value
 * @return	&nbsp;
 * @return	string_value
 */
JKY.fix_br = function(string_value){
	if (string_value) {
		if (typeof string_value === 'string') {
			return string_value.replace(' ', '<br />');
		}else{
			return string_value;
		}
	}else{
		return '&nbsp;';
	}
}

/**
 * fix date time
 * replace ' @ ' with '<br />'
 * @param	date_time	mm/dd/yy @ hh:mm xm
 * @return	&nbsp;
 * @return	date_time	mm/dd/yy<br />hh:mm xm
 */
JKY.fix_date = function(date_time){
	if (date_time) {
		date_time = date_time.replace(' @ ', '<br />');
		date_time = date_time.replace(' @', '');
		return date_time;
	}else{
		return '&nbsp;';
	}
}

/**
 * fix name
 * return lastName, firstName
 * @param	trailer		'<br />'
 * @param	first_name
 * @param	last_name
 * @return	&nbsp;
 * @return	full_name
 */
JKY.fix_name = function(trailer, first_name, last_name){
	if (first_name && last_name) {
		return trailer + last_name + ', ' + first_name;
	}else{
		return '&nbsp;';
	}
}

/**
 * fix null value
 * replace 'undefined' with '&nbsp;'
 * @param	string_value
 * @return	&nbsp;
 * @return	string_value
 */
JKY.fix_null = function(string_value){
	if (string_value) {
		return string_value;
	}else{
		return '&nbsp;';
	}
}

/**
 * set table width and height
 * adjust height minus offset height, but not less than minimum height
 * @param	tableId
 * @param	width
 * @param	minHeight
 * @param	offHeight
 */
JKY.XsetTableWidthHeight = function(tableId, width, minHeight, offHeight) {
	/*
	 * jquery 1.7.x the function .height() was working for all 4 browsers (IE,FF,CH,SF)
	 * but on 1.8.x it was working only on IE
	 */
	var myHeight = $(window).height();
	if (!JKY.is_browser('msie')) {
		myHeight = document.body[ "clientHeight" ];
	}
	myHeight -= offHeight;

	if (myHeight < minHeight) {
		myHeight = minHeight;
	}
	JKY.display_trace('setTableWidthHeight, width: ' + width + ', height: ' + myHeight);
//	$('#' + tableId).tableScroll({width :width		});
//	$('#' + tableId).tableScroll({height:myHeight	});
setTimeout(function() {
//$('#' + tableId).tableScroll({width:width, height:270});
$('#' + tableId).tableScroll({width:width, height:myHeight});
$('#scroll-bar').css('width', '4px');
}, 100);
}

/**
 * display message on right bottom corner
 * it will stay be displayed long enought to be read
 * if provided id_name, will set focus after timeout
 * @param	message
 * @param	id_name
 *
 * dependency	#jky-message
 *				#jky-message-body
 *
 */
JKY.display_message = function(message, id_name) {
	if (message === '') {
		return;
	}
	if (message.substr(0, 4) === '<br>') {
		message = message.substr(4);
	}
	var my_message = $('#jky-message-body').html() + '<br>' + message;

	$('#jky-message-body').html(my_message);
	$('#jky-message').css('display', 'block');

    var my_time = my_message.length / 10;
		 if (my_time <  2)		{my_time =  2;}
    else if (my_time > 30)		{my_time = 30;}

	if (JKY.last_time_out){
		clearTimeout(JKY.last_time_out);
	}
	JKY.last_time_out = setTimeout(function(){
		$('#jky-message').css('display', 'none');
		$('#jky-message-body').html('');
		if (typeof(id_name) !== 'undefined') {
			JKY.set_focus(id_name);
		}
	}, my_time * 1000);
}

/**
 * display trace on left bottom corner
 * it will be displayed if JKY.TRACE = true
 * @param	message
 */
JKY.display_trace = function(message){
	if(!JKY.TRACE) {		//	this control is set on [setup definition of constants] of [index.js]
		return
	}
	var my_date = new Date();
	var my_msec = (my_date.getMilliseconds() + 1000).toString().substr(1);
	var my_time = my_date.getMinutes() + ':' + my_date.getSeconds() + '.' + my_msec;
	console.log(my_time + ' ' + message);

    var my_html = my_time + ' ' + message + '<br />' + $('#jky-trace-body').html();
    $('#jky-trace-body').html(my_html);
    $('#jky-trace').css('display', 'block');

}

/**
 * set specific id with html content
 * @param	id_name
 * @param	html
 */
JKY.set_html = function(id_name, html){
	$('#' + id_name).html(html);
}

/**
 * set specific id with value
 * @param	id_name
 * @param	value
 */
JKY.set_val = function(id_name, value){
	$('#' + id_name).val(value);
}

/**
 * set 'active' class on specific id
 * @param	id_name
 */
JKY.set_active = function(id_name){
	$('#' + id_name).addClass('active');
}

/**
 * show specific id name
 * @param	id_name
 */
JKY.show = function(id_name){
//	$('#' + id_name).css('display', 'block');
	$('#' + id_name).show();
}

/**
 * hide specific id name
 * @param	id_name
 */
JKY.hide = function(id_name){
//	$('#' + id_name).css('display', 'none');
	$('#' + id_name).hide();
}

/**
 * return true if specific browser is running
 * @param	browserName
 * @return  true | false
 *
 * @example
 *			JKY.is_browser('msie')
 *			JKY.is_browser('firefox')
 *			JKY.is_browser('chrome')
 *			JKY.is_browser('safari')
 */
JKY.is_browser = function(browserName){
	var myUserAgent = navigator.userAgent.toLowerCase();
	if (myUserAgent.indexOf(browserName) > -1) {
		return true;
	}else{
		return false;
	}
}

/**
 * scroll to top if the table
 * @param	class_name
 */
JKY.scroll_to_top = function(class_name){
	$('.' + class_name).scrollTop(0);
}

/**
 * return true if scroll bar is at end of table
 * @param	class_name
 * @return  true | false
 */
JKY.is_scroll_at_end = function(class_name){
	var my_id = $('.' + class_name)[0];
	var my_offset = my_id.scrollHeight - my_id.scrollTop - my_id.offsetHeight;
	if (my_offset < 0) {
		return true;
	}else{
		return false;
	}
}

//        JKY.show_layer('login', 'user_name', 200)
//        ----------------------------------------------------------------------
JKY.show_layer = function(layer, field, z_index) {
     var   layer_name = layer + '-layer' ;
     var  shadow_name = layer + '-shadow';
/*
     var  JKY.shadow = document.getElementById(shadow_name);
     if( !JKY.shadow ) {
          JKY.shadow = document.createElement('div');
          JKY.shadow.setAttribute('id', shadow_name);
          JKY.shadow.setAttribute('class', 'shadow');
          document.body.appendChild(JKY.shadow);
     }
*/
     $('#' + shadow_name).show().css('z-index', z_index  );
     $('#' +  layer_name).show().css('z-index', z_index+1);
     JKY.set_focus(field);
     eval('setup_' + layer + '_data();');
}

//        JKY.hide_layer('login')
//        ----------------------------------------------------------------------
JKY.hide_layer = function(layer) {
     var   layer_name = layer + '-layer' ;
     var  shadow_name = layer + '-shadow';
     $('#' +  layer_name).hide();
     $('#' + shadow_name).hide();
}

//        JKY.set_focus('user_name')
//        ----------------------------------------------------------------------
JKY.set_focus = function(name) {
     var  id = $('#' + name);
     if( !id || !id.is(':visible') ) {
          setTimeout("JKY.set_focus('" + name + "')", 100);
     } else {
          id.focus();
          id.select();
     }
}

JKY.disabled_id	= function(id_name)	{$('#' + id_name).addClass	 ('disabled');}
JKY.enabled_id 	= function(id_name)	{$('#' + id_name).removeClass('disabled');}

//        JKY.set_...
//        ----------------------------------------------------------------------
JKY.set_is_zero          = function(name)              {return '<br>' + JKY.t( name ) + ' ' + JKY.t( 'is zero'        );}
JKY.set_is_invalid       = function(name)              {return '<br>' + JKY.t( name ) + ' ' + JKY.t( 'is invalid'     );}
JKY.set_is_required      = function(name)              {return '<br>' + JKY.t( name ) + ' ' + JKY.t( 'is required'    );}
JKY.set_already_taken    = function(name)              {return '<br>' + JKY.t( name ) + ' ' + JKY.t( 'already taken'  );}
JKY.set_not_found        = function(name)              {return '<br>' + JKY.t( name ) + ' ' + JKY.t( 'not found'      );}
JKY.set_size_is_under    = function(name, size )       {return '<br>' + JKY.t( name ) + ' ' + JKY.t( 'size is under'  ) + ' [' + size  + ']';}
JKY.set_size_is_above    = function(name, size )       {return '<br>' + JKY.t( name ) + ' ' + JKY.t( 'size is above'  ) + ' [' + size  + ']';}
JKY.set_value_is_under   = function(name, value)       {return '<br>' + JKY.t( name ) + ' ' + JKY.t( 'value is under' ) + ' [' + value + ']';}
JKY.set_value_is_above   = function(name, value)       {return '<br>' + JKY.t( name ) + ' ' + JKY.t( 'value is above' ) + ' [' + value + ']';}

//   Set Languages -------------------------------------------------------------
JKY.set_languages = function() {
     var  options = $('#en-speaking').html();
     if(  options === '' ) {
          setTimeout('JKY.set_languages()', 100);
     } else {
          $('#en-reading' ).html(options);
          $('#en-writing' ).html(options);
          $('#ma-speaking').html(options);
          $('#ma-reading' ).html(options);
          $('#ma-writing' ).html(options);
          $('#tw-speaking').html(options);
          $('#tw-reading' ).html(options);
          $('#tw-writing' ).html(options);
     }
}

//        email format xxx@xxx.xxx
JKY.is_email = function(email) {
     var  pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
     return pattern.test(email);
}

//        date format mm/dd/yyyy
JKY.is_date = function(date) {
     var  string = JKY.str_replace('%2F', '/', date);
     var  dates  = string.split('/');
     var  mm   = parseInt(dates[0], 10);
     var  dd   = parseInt(dates[1], 10);
     var  yyyy = parseInt(dates[2], 10);
     var  new_date = new Date(yyyy, mm-1, dd);
     if(( new_date.getFullYear() === yyyy ) && ( new_date.getMonth() === mm-1 ) && ( new_date.getDate() === dd ))
          return true;
     else return false;
}

//        JKY.str_replace
//        ----------------------------------------------------------------------
JKY.str_replace = function(search, replace, subject, count) {
//   note: The count parameter must be passed as a string in order to find a global variable in which the result will be given
//   example 1:  JKY.str_replace( ' ', '.', 'Kevin van Zonneveld' );                          //   returns 1: 'Kevin.van.Zonneveld'
//   example 2:  JKY.str_replace([ '{name}', 'l' ], [ 'hello', 'm' ], '{name}, lars' );       //   returns 2: 'hemmo, mars'
     var  i     = 0
       ,  j     = 0
       ,  temp  = ''
       ,  repl  = ''
       ,  sl    = 0
       ,  fl    = 0
       ,  f     = [].concat(search )
       ,  r     = [].concat(replace)
       ,  s     = subject
       ,  ra    = Object.prototype.toString.call(r) === '[object Array]'
       ,  sa    = Object.prototype.toString.call(s) === '[object Array]'
       ;
     s = [].concat(s);
     if(  count ) {
          this.window[count] = 0;
     }

     for( i=0, sl=s.length; i<sl; i++ ) {
          if(  s[i] === '' ) {
               continue;
          }
          for( j=0, fl=f.length; j<fl; j++ ) {
               temp = s[i] + '';
               repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
               s[i] = (temp).split(f[j]).join(repl);
               if(  count && s[i] !== temp ) {
                    this.window[count] += (temp.length - s[i].length) / f[j].length;
               }
          }
     }
     return sa ? s : s[0];
}

//        JKY.set_option('title', 'Mr')
//        ----------------------------------------------------------------------
JKY.set_option = function(name, value) {
     $('#' + name + ' option:selected').removeAttr('selected');
     if(  value ) {
          command = "$('#" + name + " option[ value=\"" + value + "\" ]').attr('selected', 'selected');";
          setTimeout(command, 100);
     }
}

//        JKY.set_options(20, 'All', 10, 20, 50, 100, 200, 500, 1000)
//        ----------------------------------------------------------------------
JKY.set_options = function() {
     options   = '';
     set_value = arguments[0];

     for( var i=1; i<arguments.length; i++ ) {
          value = arguments[i];
          selected = (value === set_value) ? ' selected="selected"' : '';
          options += '<option value="' + value + '"' + selected + '>' + value + '</option>';
     }
     return options;
}

//        JKY.set_radios(20, 'All', 10, 20, 50, 100, 200, 500, 1000)
//        ----------------------------------------------------------------------
JKY.set_radios = function() {
     radios    = '';
     set_id    = arguments[0];
     set_value = arguments[1];

     for( var i=2; i<arguments.length; i++ ) {
          value = arguments[i];
          checked = (value === set_value) ? ' checked="checked"' : '';
          radios += '<input type="radio" id="' + set_id + '" name="' + set_id + '" value="' + value + '" ' + checked + '/>&nbsp;' + value + ' &nbsp; ';
     }
     return radios;
}

//        JKY.set_checks('...', ..., '...')
//        ----------------------------------------------------------------------
JKY.set_checks = function() {
     checks    = '';
     set_id    = arguments[0];

     for( var i=1; i<arguments.length; i++ ) {
          value = arguments[i];
          checks += '<input type="checkbox" id="' + set_id + '" name="' + set_id + '" value="' + value + '" ' + '/>&nbsp;' + value + ' <br>';
     }
     return checks;
}

/**
 * set company name
 */
JKY.set_company_name = function(company_name) {
	JKY.set_html('jky-company-name', company_name);
}

/**
 * set user info
 */
JKY.set_user_info = function(full_name) {
	if (typeof full_name === undefined) {
		JKY.hide('jky-user-logged');
		JKY.show('jky-user-unkown');
	}else{
		JKY.set_html('jky-full-name', full_name);
		JKY.hide('jky-user-unkown')
		JKY.show('jky-user-logged');
	}
}

/**
 * set company logo
 */
JKY.set_company_logo = function(company_logo) {
	JKY.set_html('jky-company-logo', '<img src="../img/' + company_logo + '.png" />');
}

/**
 * set event name
 */
JKY.set_event_name = function(event_name) {
	JKY.set_html('jky-event-name', event_name);
}

/**
 * set buttons menus
 */
JKY.set_buttons_menus = function(menus) {
	var my_html = '';
	for(var i=0; i<menus.length; i++) {
		var my_menu = menus[i];
		my_html += '<a id="' + my_menu.id + '" class="btn btn-large">'
				+  '<i class="icon-' + my_menu.icon + ' icon-white"></i>' + my_menu.label
				+  '</a>'
				;
	}
	JKY.set_html('jky-menus', my_html);
}

/**
 * set buttons control
 */
JKY.set_buttons_control = function(admins, language, languages) {
	var my_html = '';
	if (languages.length > 0) {
		my_html += '<span class="jky-label">Language:</span>';
		my_html += '<select id="jky-control-language">';
		for(var i=0; i<languages.length; i++) {
			var my_language = languages[i];
			var my_selected = (my_language === language) ? ' selected="selected"' : '';
			my_html += '<option value="' + my_language + '"' + my_selected + '>' + my_language + '</option>';
		}
		my_html += '</select>';
	}

	if (admins.length > 0) {
		my_html += '<div class="btn-group">'
				+  '<a class="btn btn-large dropdown-toggle" data-toggle="dropdown" href="#"><i class="icon-tasks icon-white"></i>Admin</a>'
				+  '<ul id="jky-control-admin" class="dropdown-menu">'
				;
		for(var i=0; i<admins.length; i++) {
			var my_admin = admins[i];
			my_html += '<li><a onclick="JKY.display_trace(\'' + my_admin.label + '\')"><i class="icon-' + my_admin.icon + ' icon-white"></i> &nbsp;' + my_admin.label + '</a></li>';
		}
		my_html += '</ul></div>';
	}
	my_html += '<a id="jky-control-tickets" class="btn btn-large"><i class="icon-share icon-white"></i>Tickets</a>';
	JKY.set_html('jky-control', my_html);
}

/**
 * set body header
 */
JKY.set_body_header = function(name, buttons) {
	JKY.set_html('jky-body-name', '<i class="icon-th"></i>' + name);
	var my_html = '';
	for(var i=0; i<buttons.length; i++) {
		var my_button = buttons[i];
		my_html += '<button onclick="JKY.display_trace(\'' + my_button.on_click + '\')" class="btn"><i class="icon-' + my_button.icon + '"></i> ' + my_button.label + '</button>';
	}
	JKY.set_html('jky-body-buttons', my_html);
}

/**
 * set copyright
 */
JKY.set_copyright = function(copyright) {
	JKY.set_html('jky-copyright', copyright);
}

/**
 * set copyright
 */
JKY.set_contact_us = function(contact_us) {
	JKY.set_html('jky-contact-us', contact_us);
}

/**
 * set control set
 */
JKY.set_control_set = function(selected, control_set) {
	JKY.display_trace('set_control_set: ' + control_set);
	var my_html = '';
	var my_data =
		{ method	: 'get_index'
		, table		: 'Controls'
		, order_by	: 'sequence,control_name'
		, select	: control_set
		};
	var my_object = {};
	my_object.data = JSON.stringify(my_data);
	$.ajax(
		{ url		: JKY.AJAX_URL
		, data		: my_object
		, type		: 'post'
		, dataType	: 'json'
		, async		: false
		, success	: function(response) {
				if (response.status === 'ok') {
					my_html = '';
					if (selected === 'All') {
						my_html += '<option value="All" selected="selected">All</option>';
					}
					for(var i=0; i<response.rows.length; i+=1) {
						var my_control_name = response.rows[i]['control_name'];
						var my_selected = (my_control_name === selected) ? ' selected="selected"' : '';
						my_html += '<option value="' + my_control_name + '"' + my_selected + '>' + my_control_name + '</option>';
					}
				}else{
					JKY.display_message(response.message);
				}
			}
		, error		: function(jqXHR, text_status, error_thrown) {
				if (typeof function_error != 'undefined') {
					function_error(jqXHR, text_status, error_thrown);
				}else{
					JKY.hide('jky-loading');
					JKY.display_message('Error from backend server, please re-try later.');
				}
			}
		}
	)
	return my_html;
}

/**
 * process ajax
 *
 * @param	async	(true | false)
 * @param	data	(array)
 * @param	function_success
 * @param	function_error
 */
JKY.ajax = function(async, data, function_success, function_error) {
	var my_object = {};
	my_object.data = JSON.stringify(data);
	$.ajax(
		{ url		: JKY.AJAX_URL
		, data		: my_object
		, type		: 'post'
		, dataType	: 'json'
		, async		: async
		, success	: function(response) {
				if (response.status === 'ok') {
					function_success(response);
				}else{
					JKY.display_message(response.message);
				}
			}
		, error		: function(jqXHR, text_status, error_thrown) {
				if (typeof function_error != 'undefined') {
					function_error(jqXHR, text_status, error_thrown);
				}else{
					JKY.hide('jky-loading');
					JKY.display_message('Error from backend server, please re-try later.');
				}
			}
		}
	);
}
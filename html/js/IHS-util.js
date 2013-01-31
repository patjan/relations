//JC = jky_name_space('JKY.core');


//	set focus on specific id field name
function set_focus(fieldName) {
	var id = $('#' + fieldName);
	if (!id || !id.is(':visible')) {
		setTimeout( function() {set_focus(fieldName);}, 100);
	}else{
		id.focus();
		id.select();
	}
}

//	set specific id file with value
function set_id(fieldName, fieldValue) {
	$('#'+fieldName).html(fieldValue);
}

//	reset specifc id field
function reset_id(fieldName) {
	$('#'+fieldName).html('');
}

//	set specific [message] field with value
function set_message(fieldName, fieldValue) {
	$('#'+fieldName+'-message').html(fieldValue);
}

//	reset specific [message] field
function reset_message(fieldName) {
	$('#'+fieldName+'-message').html('');
}

//	on enter key focus next field
function on_enter_focus_next() {
	setTimeout( function() {
		$(':text').keydown(function(e) {
			if(e.keyCode == 13 && $(this).attr('type') != 'submit') {
				e.preventDefault();
				$(this).nextAll('input:first').focus();
			}
		});
		$(':password').keydown(function(e) {
			if(e.keyCode == 13 && $(this).attr('type') != 'submit') {
				e.preventDefault();
				$(this).nextAll('input:first').focus();
			}
		});
	}, 100);
}

/**
 * display trace on left bottom corner
 * it will be displayed if CX.TRACE = true
 * @param	message
 */
display_trace = function(message){
	if (!JKY.TRACE){		//	this control is set on [setup definition of constants] of [index.js]
		return
	}
	var my_date = new Date();
	var my_msec = (my_date.getMilliseconds() + 1000).toString().substr(1);
	var my_time = my_date.getMinutes() + ':' + my_date.getSeconds() + '.' + my_msec;
    var my_html = my_time + ' ' + message + '<br />' + $('#jky-trace-body').html();

    $('#jky-trace-body').html(my_html);
    $('#jky-trace').css('display', 'block');
}

//  generate single Name Space
//  var JC = jky_name_space('JKY.core');
//  var JKY = JKY || {};                //  create namespace JKY
//  JKY.core = {};                      //  create object core
//  ----------------------------------------------------------------------------
function jky_name_space(string) {
	var parent = window;
	var names  = string.split('.');

	for (var i=0; i<names.length; i++) {
		name = names[i];
		parent[name] = parent[name] || {};
		parent = parent[name];
	}
	return parent;
}

//   Process Error -------------------------------------------------------------
process_ajax_error = function(jq_XHR, type_error, exception){
     $('#jky-loading').hide();
     if(  type_error == 'timeout' )
          display_message('The request timeout, please re-try');
     else display_message('Error type: ' + type_error + ', exception: ' + exception);
};

//        display_message('any message')
//        ----------------------------------------------------------------------
display_message = function(message, refocus){
	if (message === '')
		return;
	if (message.substr(0, 4) === '<br>')
		message = message.substr(4);

    message = jky_t(message);

    saved = $('#jky-message-body').html();
	message = saved + (saved.length === 0 ? '' : '<br>') + message;

	$('#jky-message-body').html(message);
//  $('#jky-message').modal('show');
	$('#jky-message').css('display', 'block');

	var time = Math.round(message.length / 12);
	if (time < 2.0)
		time = 2.0 ;
//  setTimeout("$('#jky-message').modal('hide');$('.modal-backdrop').css('opacity', '0.8');", time * 1000);
//  setTimeout("$('#jky-message').modal('hide');" + extra, time * 1000);
//  setTimeout("$('#jky-message').css('display', 'none');" + extra, time * 1000);
    setTimeout(function() {return JC.clear_message(refocus);}, time * 1000);
};

clear_message = function(refocus){
    $('#jky-message').css('display', 'none');
    $('#jky-message-body').html('');
    if (refocus !== 'undefined') {
        JC.set_focus(refocus);
    }
}
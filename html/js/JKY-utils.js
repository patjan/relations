/**
 * JKY-util.js
 * generic functions for the JKY application
 */

/**
 * initial setup
 */
$(function() {
	$('body').append('<div id="jky-utils"></div>');
	JKY.load_html('jky-utils', 'JKY-utils.html'	);
});

/**
 * define JKY namespace for all application
 */
window.JKY = Em.Application.create({rootElement:'body'});

/**
 * define all constants
 */
JKY.TRACE	= true; 					//	on production, should be set to false, help developement to trace sequence flow
JKY.AJAX_APP	= '../';					//  relative to application directory
//JKY.AJAX_URL	= '../jky_proxy.php?';		//  relative to remote directory
JKY.AJAX_URL	= '../index.php/ajax?';		//  relative to remote directory

JKY.translations= [];
JKY.sort_name	= '';
JKY.sort_seq	=  1;


/**
 * re direct
 */
JKY.reDirect = function(program_name) {
	alert('re direct to ' + program_name);
}

/**
 * run when is template ready
 * wait until the template is ready
 * @param	templateName
 * @param	functionName
 */
JKY.runWhenIsTemplate = function(templateName, functionName) {
	JKY.display_trace('runWhenIsTemplate: ' + templateName);
	if (Em.TEMPLATES[templateName]) {
		functionName();
	}else{
		setTimeout( function() {JKY.runWhenIsTemplate(templateName, functionName);}, 100);
	}
}

/**
 * set translations table
 *
 * @param	language
 * @param	fileName
 * @example JKY.setTranslations('portugues')
 */
JKY.setTranslations = function(language) {
    JKY.translations = language;
}

/**
 * translate
 *
 * @param	text
 * @return	translated text
 * @example JKY.t('Home')
 */
JKY.t = function(text) {
	if (text == '') {
		return '';
	}

	var result = JKY.translations[text];
	if (typeof result == 'undefined') {
		result = '';
		var names = text.split('<br>');
		for(var i=0; i<names.length; i++ ) {
			var name = names[i];
			var translation = JKY.translations[name];
			result += ( i == 0 ) ? '' : '<br>';
			if (typeof translation == 'undefined') {
				result += name;
			}else{
				result += translation;
			}
		}
	}
	return result;
}

/**
 * load html into specific id
 * wait until the id is rendered
 * @param	id_name
 * @param	file_name
 */
JKY.load_html = function(id_name, file_name) {
	JKY.display_trace('load_html: ' + id_name);
	if ($('#' + id_name).length > 0) {
		$('#' + id_name).load('../hb/' + file_name);
		JKY.display_trace('load_html: ' + id_name + ' DONE');
	}else{
		setTimeout(function() {JKY.load_html(id_name, file_name);}, 100);
	}
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
 * replaceIn template into specific id
 * wait until the template is loaded
 * @param	templateName
 * @param	idName
 * @return	(new)View
 */
JKY.replaceIn = function(templateName, idName, viewObject) {
	JKY.display_trace('replaceIn: ' + templateName);
	if (Em.TEMPLATES[templateName] && $('#' + idName)) {
		viewObject.replaceIn('#' + idName);
		JKY.display_trace('replaceIn: ' + templateName + ' DONE');
	}else{
		setTimeout(function() {JKY.replaceIn(templateName, idName, viewObject)}, 100);
	}
}

/**
 * fix flag
 * @param	flagValue
 * @param	trueValue
 * @param	falseValue
 * @return	&nbsp;
 * @return	trueValue
 * @return	falseValue
 */
JKY.fixFlag = function(flagValue, trueValue, falseValue){
	if (flagValue) {
		if (flagValue == 't') {
			return trueValue;
		}else{
			return falseValue;
		}
	}else{
		return '&nbsp;';
	}
}

/**
 * fix break line
 * replace ' ' with '<br />'
 * @param	stringValue
 * @return	&nbsp;
 * @return	stringValue
 */
JKY.fixBr = function(stringValue){
	if (stringValue) {
		if (typeof stringValue == 'string') {
			return stringValue.replace(' ', '<br />');
		}else{
			return stringValue;
		}
	}else{
		return '&nbsp;';
	}
}

/**
 * fix date time
 * replace ' @ ' with '<br />'
 * @param	dateTime	mm/dd/yy @ hh:mm xm
 * @return	&nbsp;
 * @return	dateTime	mm/dd/yy<br />hh:mm xm
 */
JKY.fixDate = function(dateTime){
	if (dateTime) {
		dateTime = dateTime.replace(' @ ', '<br />');
		dateTime = dateTime.replace(' @', '');
		return dateTime;
	}else{
		return '&nbsp;';
	}
}

/**
 * fix name
 * return lastName, firstName
 * @param	trailer		'<br />'
 * @param	firstName
 * @param	lastName
 * @return	&nbsp;
 * @return	fullName
 */
JKY.fixName = function(trailer, firstName, lastName){
	if (firstName && lastName) {
		return trailer + lastName + ', ' + firstName;
	}else{
		return '&nbsp;';
	}
}

/**
 * fix null value
 * replace 'undefined' with '&nbsp;'
 * @param	stringValue
 * @return	&nbsp;
 * @return	stringValue
 */
JKY.fixNull = function(stringValue){
	if (stringValue) {
		return stringValue;
	}else{
		return '&nbsp;';
	}
}

/**
 * fix header positions after tablescroll adjustment
 * to be adjusted based on orderType: 7 to 10 px
 * current default = 10px
 * @param	orderType
 * @param	idName
 */
JKY.fixHeaderPositions = function(orderType, idName) {
	var myWidth = 0;
	switch(orderType) {
		case 'Approve Orders'	: myWidth = 7; break;
		case 'In Process'		: myWidth = 7; break;
		case 'On Hold'			: myWidth = 7; break;
		case 'Fee Changes'		: myWidth = 7; break;
	}
	$('#' + idName).css('width', myWidth + 'px');
}

/**
 * set table width and height
 * adjust height minus offset height, but not less than minimum height
 * @param	tableId
 * @param	width
 * @param	minHeight
 * @param	offHeight
 */
JKY.setTableWidthHeight = function(tableId, width, minHeight, offHeight) {
	/*
	 * jquery 1.7.x the function .height() was working for all 4 browsers (IE,FF,CH,SF)
	 * but on 1.8.x it was working only on IE
	 */
	var myHeight = $(window).height();
	if (!JKY.isBrowser('msie')) {
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
 * set action approve
 */
JKY.setActionApprove = function(paymentIssueFlag, appraisalId) {
	var myHtml = '';

	if (paymentIssueFlag != 't' ) {
		myHtml += '<img class="hand" src="../images/check.png" rel="tooltip" title="to approve" onclick="JKY.approveOrderAction(\'approve\', \'In Process\', \'2\', ' + appraisalId + ')" />';
	}else{
		myHtml += '<img class="opaque" src="../images/check.png" />';
	}

		myHtml += '<img class="hand" src="../images/redx.gif"  rel="tooltip" title="to cancel"  onclick="JKY.approveOrderAction( \'cancel\',   \'Canceled\', \'7\', ' + appraisalId + ')" />';
		myHtml += '<img class="hand" src="../images/error.png" rel="tooltip" title="to hold"    onclick="JKY.approveOrderAction(   \'hold\',    \'On Hold\', \'8\', ' + appraisalId + ')" />';

	return myHtml;
}

/**
 * display message on right bottom corner
 * it will stay be displayed long enought to be read
 * @param	message
 * @param	id_name
 */
JKY.display_message = function(message, id_name) {
	if (message == '') {
		return;
	}
	if (message.substr(0, 4) == '<br>') {
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
		if (typeof(id_name) != 'undefined') {
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
	if (!JKY.TRACE){		//	this control is set on [setup definition of constants] of [index.js]
		return
	}
	var my_date = new Date();
	var my_msec = (my_date.getMilliseconds() + 1000).toString().substr(1);
	var my_time = my_date.getMinutes() + ':' + my_date.getSeconds() + '.' + my_msec;
    var my_html = my_time + ' ' + message + '<br />' + $('#jky-trace-body').html();
	console.log(my_time + ' ' + message);

    $('#jky-trace-body').html(my_html);
    $('#jky-trace').css('display', 'block');
}

/**
 * show specific id name
 * @param	idName
 */
JKY.showId = function(idName){
	$('#' + idName).css('display', 'block');
}

/**
 * hide specific id name
 * @param	idName
 */
JKY.hideId = function(idName){
	$('#' + idName).css('display', 'none');
}

/**
 * show specific class name
 * @param	className
 */
JKY.showClass = function(className){
	$('.' + className).css('display', 'block');
}

/**
 * hide specific class name
 * @param	className
 */
JKY.hideClass = function(className){
	$('.' + className).css('display', 'none');
}

/**
 * show loading image
 */
JKY.showLoading = function(){
	$('#ihs-loading').show();
}

/**
 * hide loading image
 */
JKY.hideLoading = function(){
	$('#ihs-loading').hide();
}

/**
 * scroll to top if the table
 * @param	className
 */
JKY.scrollToTop = function(className){
	$('.' + className).scrollTop(0);
}

/**
 * return true if specific browser is running
 * @param	browserName
 * @return  true | false
 *
 * @example
 *			JKY.isBrowser('msie')
 *			JKY.isBrowser('firefox')
 *			JKY.isBrowser('chrome')
 *			JKY.isBrowser('safari')
 */
JKY.isBrowser = function(browserName){
	var myUserAgent = navigator.userAgent.toLowerCase();
	if (myUserAgent.indexOf(browserName) > -1) {
		return true;
	}else{
		return false;
	}
}

/**
 * return true if scroll bar is at end of table
 * @param	className
 * @return  true | false
 */
JKY.isScrollAtEnd = function(className){
	var myId = $('.' + className)[0];
	var myOffset = myId.scrollHeight - myId.scrollTop - myId.offsetHeight;
	if (myOffset < 0) {
		return true;
	}else{
		return false;
	}
}

//        JKY.util.js
//        ----------------------------------------------------------------------

//        JKY.set_translations('portugues')
//        ----------------------------------------------------------------------
JKY.set_translations = function(array) {
    translations = array;
}

//        JKY.t('Home')
//        ----------------------------------------------------------------------
JKY.t = function(text) {
return text;
     if( text == '' )
         return '';

     var result = translations[text];
     if( typeof result == 'undefined' ) {
         result = '';
         var names = text.split('<br>');
         for( var i=0; i<names.length; i++ ) {
             name = names[i];
             translation = translations[name];
             result += ( i == 0 ) ? '' : '<br>';
             if( typeof translation == 'undefined' ) {
                 result += name;
             } else {
                 result += translation;
             }
         }
     }
    return result;
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
     if(  options == '' ) {
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
     if(( new_date.getFullYear() == yyyy ) && ( new_date.getMonth() == mm-1 ) && ( new_date.getDate() == dd ))
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
          selected = (value == set_value) ? ' selected="selected"' : '';
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
          checked = (value == set_value) ? ' checked="checked"' : '';
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
				if (response.status == 'ok') {
					function_success(response.data);
				}else{
					JKY.display_message(response.message);
				}
			}
		, error		: function(jqXHR, text_status, error_thrown) {
				if (typeof function_error != 'undefined') {
					function_error(jqXHR, text_status, error_thrown);
				}else{
					JKY.hideLoading();
					JKY.display_message('Error from backend server, please re-try later.');
				}
			}
		}
	)
}
/**
 * JKY-util.js
 * generic functions for the JKY application
 */

/**
 * define all constants
 */
JKY.TRACE 	= true; 			//	on production, should be set to false, help developement to trace sequence flow
JKY.AJAX_APP = '../';			//  relative to application directory
JKY.AJAX_URL = '../remote/';		//  relative to remote directory

/**
 * run when is template ready
 * wait until the template is ready
 * @param	templateName
 * @param	functionName
 */
JKY.runWhenIsTemplate = function(templateName, functionName) {
	JKY.displayTrace('JKY.runWhenIsTemplate: ' + templateName);
	if (Em.TEMPLATES[templateName]) {
		functionName();
	}else{
		setTimeout( function() {JKY.runWhenIsTemplate(templateName, functionName);}, 100);
	}
}

/**
 * load html into specific id
 * wait until the id is rendered
 * @param	idName
 * @param	fileName
 */
JKY.loadHtml = function(idName, fileName) {
	JKY.displayTrace('JKY.loadHtml: ' + idName);
	if ($('#' + idName).length > 0) {
		$('#' + idName).load('../hb/' + fileName);
		JKY.displayTrace('JKY.loadHtml: ' + idName + ' DONE');
	}else{
		setTimeout(function() {JKY.loadHtml(idName, fileName);}, 100);
	}
}

/**
 * load handlebar into specific template
 * @param	templateName
 * @param	fileName
 */
JKY.loadHb = function(templateName, fileName) {
	JKY.displayTrace('JKY.loadHb: ' + templateName);
	if ($('#ihs-hb').length > 0) {
		$('#ihs-hb').load('../hb/' + fileName, function(src) {
			Em.TEMPLATES[templateName] = Em.Handlebars.compile(src);
			$('#ihs-hb').html('');
		});
		JKY.displayTrace('JKY.loadHb: ' + templateName + ' DONE');
	}else{
		setTimeout(function() {JKY.loadHb(templateName, fileName);}, 100);
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
	JKY.displayTrace('JKY.replaceIn: ' + templateName);
	if (Em.TEMPLATES[templateName] && $('#' + idName)) {
		viewObject.replaceIn('#' + idName);
		JKY.displayTrace('JKY.replaceIn: ' + templateName + ' DONE');
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
	JKY.displayTrace('JKY.setTableWidthHeight, width: ' + width + ', height: ' + myHeight);
	$('#' + tableId).tableScroll({width :width		});
	$('#' + tableId).tableScroll({height:myHeight	});
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
 * set action
 * to be defined ...
 */
JKY.setAction = function(status){
	return 'A C H';
}

/**
 * display message on right bottom corner
 * it will stay be displayed long enought to be read
 * @param	message
 */
JKY.displayMessage = function(message){
    var myHtml = $('#ihs-message-body').html();
	if (myHtml.length > 0) {
		myHtml += '<br />' + message;
	}else{
		myHtml = message;
	}

    $('#ihs-message-body').html(myHtml);
    $('#ihs-message').css('display', 'block');

    var myTime = myHtml.length / 10;
		 if (myTime <  2)		{myTime =  2;}
    else if (myTime > 30)		{myTime = 30;}

	if (JKY.lastTimeOut){
		clearTimeout(JKY.lastTimeOut);
	}
	JKY.lastTimeOut = setTimeout(function(){
		$('#ihs-message').css('display', 'none');
		$('#ihs-message-body').html('');
	}, myTime * 1000);
}

/**
 * display trace on left bottom corner
 * it will be displayed if JKY.TRACE = true
 * @param	message
 */
JKY.displayTrace = function(message){
	if (!JKY.TRACE){		//	this control is set on [setup definition of constants] of [index.js]
		return
	}
	var myDate = new Date();
	var myMsec = (myDate.getMilliseconds() + 1000).toString().substr(1);
	var myTime = myDate.getMinutes() + ':' + myDate.getSeconds() + '.' + myMsec;
    var myHtml = myTime + ' ' + message + '<br />' + $('#ihs-trace-body').html();
	console.log(myTime + ' ' + message);

//    $('#ihs-trace-body').html(myHtml);
//    $('#ihs-trace').css('display', 'block');
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

//        JKY.display_message('any message')
//        ----------------------------------------------------------------------
JKY.display_message = function(message, refocus) {
     if(  message == '' )
          return;
     if(  message.substr(0, 4) == '<br>' )
          message = message.substr(4);
     var  extra = '';
     if(  typeof(refocus) != 'undefined' )
          extra = 'JKY.set_focus("' + refocus + '");';

     message = $('#jky-message-body').html() + '<br>' + message;

     $('#jky-message-body').html(message);
//   $('#jky-message').modal('show');
     $('#jky-message').css('display', 'block');

     var  time = Math.round(message.length / 15);
     if(  time < 2.0 )
          time = 2.0 ;
//   setTimeout("$('#jky-message').modal('hide');$('.modal-backdrop').css('opacity', '0.8');", time * 1000);
//   setTimeout("$('#jky-message').modal('hide');" + extra, time * 1000);
     setTimeout("$('#jky-message').css('display', 'none');" + extra, time * 1000);
}

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


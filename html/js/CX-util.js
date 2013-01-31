/**
 * CX-util.js
 * generic functions for the CX application
 */

/**
 * define all constants
 */
CX.TRACE 	= true; 			//	on production, should be set to false, help developement to trace sequence flow
CX.AJAX_APP = '../';			//  relative to application directory
CX.AJAX_URL = '../remote/';		//  relative to remote directory

/**
 * run when is template ready
 * wait until the template is ready
 * @param	templateName
 * @param	functionName
 */
CX.runWhenIsTemplate = function(templateName, functionName) {
	CX.displayTrace('CX.runWhenIsTemplate: ' + templateName);
	if (Em.TEMPLATES[templateName]) {
		functionName();
	}else{
		setTimeout( function() {CX.runWhenIsTemplate(templateName, functionName);}, 100);
	}
}

/**
 * load html into specific id
 * wait until the id is rendered
 * @param	idName
 * @param	fileName
 */
CX.loadHtml = function(idName, fileName) {
	CX.displayTrace('CX.loadHtml: ' + idName);
	if ($('#' + idName).length > 0) {
		$('#' + idName).load('../hb/' + fileName);
		CX.displayTrace('CX.loadHtml: ' + idName + ' DONE');
	}else{
		setTimeout(function() {CX.loadHtml(idName, fileName);}, 100);
	}
}

/**
 * load handlebar into specific template
 * @param	templateName
 * @param	fileName
 */
CX.loadHb = function(templateName, fileName) {
	CX.displayTrace('CX.loadHb: ' + templateName);
	if ($('#ihs-hb').length > 0) {
		$('#ihs-hb').load('../hb/' + fileName, function(src) {
			Em.TEMPLATES[templateName] = Em.Handlebars.compile(src);
			$('#ihs-hb').html('');
		});
		CX.displayTrace('CX.loadHb: ' + templateName + ' DONE');
	}else{
		setTimeout(function() {CX.loadHb(templateName, fileName);}, 100);
	}
}

/**
 * replaceIn template into specific id
 * wait until the template is loaded
 * @param	templateName
 * @param	idName
 * @return	(new)View
 */
CX.replaceIn = function(templateName, idName, viewObject) {
	CX.displayTrace('CX.replaceIn: ' + templateName);
	if (Em.TEMPLATES[templateName] && $('#' + idName)) {
		viewObject.replaceIn('#' + idName);
		CX.displayTrace('CX.replaceIn: ' + templateName + ' DONE');
	}else{
		setTimeout(function() {CX.replaceIn(templateName, idName, viewObject)}, 100);
	}
}

/**
 * fix address
 * @param	streetNumber
 * @param	streetName
 * @param	city
 * @param	state
 * @return	address (2 lines)
 */
CX.fixAddress = function(streetNumber, streetName, city, state) {
	return streetNumber + ' ' + streetName + '<br />' + city + ', ' + state;
}

/**
 * fix borrowers
 * @param	borrower1FirstName
 * @param	borrower1LastName
 * @param	borrower2FirstName
 * @param	borrower2LastName
 * @return	borrowers (2 lines)
 */
CX.fixBorrowers = function(borrower1FirstName, borrower1LastName, borrower2FirstName, borrower2LastName) {
	return CX.fixName(      '', borrower1FirstName, borrower1LastName)
		+  CX.fixName('<br />', borrower2FirstName, borrower2LastName)
		;
}

/**
 * fix vendor
 * @param	borrower1FirstName
 * @param	borrower1LastName
 * @param	borrower2FirstName
 * @param	borrower2LastName
 * @return	borrowers (2 lines)
 */
CX.fixVendor = function(amcName, firstName, lastName) {
	var myValue = amcName;
	if (!myValue) {
		myValue = firstName + ' ' + lastName;
	}
	return myValue;
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
CX.fixFlag = function(flagValue, trueValue, falseValue) {
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
CX.fixBr = function(stringValue) {
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
CX.fixDate = function(dateTime) {
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
CX.fixName = function(trailer, firstName, lastName) {
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
CX.fixNull = function(stringValue) {
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
CX.fixHeaderPositions = function(orderType, idName) {
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
CX.setTableWidthHeight = function(tableId, width, minHeight, offHeight) {
	/*
	 * jquery 1.7.x the function .height() was working for all 4 browsers (IE,FF,CH,SF)
	 * but on 1.8.x it was working only on IE
	 */
	var myHeight = $(window).height();
	if (!CX.isBrowser('msie')) {
		myHeight = document.body[ "clientHeight" ];
	}
	myHeight -= offHeight;

	if (myHeight < minHeight) {
		myHeight = minHeight;
	}
	CX.displayTrace('CX.setTableWidthHeight, width: ' + width + ', height: ' + myHeight);
	$('#' + tableId).tableScroll({width :width		});
	$('#' + tableId).tableScroll({height:myHeight	});
}	

/**
 * set action approve
 */
CX.setActionApprove = function(paymentIssueFlag, appraisalId) {
	var myHtml = '';

	if (paymentIssueFlag != 't' ) {
		myHtml += '<img class="hand" src="../images/check.png" rel="tooltip" title="to approve" onclick="CX.approveOrderAction(\'approve\', \'In Process\', \'2\', ' + appraisalId + ')" />';
	}else{
		myHtml += '<img class="opaque" src="../images/check.png" />';
	}

		myHtml += '<img class="hand" src="../images/redx.gif"  rel="tooltip" title="to cancel"  onclick="CX.approveOrderAction( \'cancel\',   \'Canceled\', \'7\', ' + appraisalId + ')" />';
		myHtml += '<img class="hand" src="../images/error.png" rel="tooltip" title="to hold"    onclick="CX.approveOrderAction(   \'hold\',    \'On Hold\', \'8\', ' + appraisalId + ')" />';

	return myHtml;
}

/**
 * set action on-hold
 */
CX.setActionOnHold = function(canRemoveHold, appraisalId) {
	var myHtml = '';

	if (canRemoveHold) {
		myHtml += '<img class="hand" src="../images/check.png" rel="tooltip" title="to release" onclick="CX.holdOrderAction(\'release\', \'In Process\', \'2\', ' + appraisalId + ')" />';
	}else{
		myHtml += '<img class="opaque" src="../images/check.png" />';
	}

		myHtml += '<img class="hand" src="../images/redx.gif"  rel="tooltip" title="to cancel"  onclick="CX.holdOrderAction( \'cancel\',   \'Canceled\', \'7\', ' + appraisalId + ')" />';

	return myHtml;
}

/**
 * set action fee-change
 */
CX.setActionFeeChange = function(canApproveFeeEdits, requestId) {
	var myHtml = '';

	if (canApproveFeeEdits) {
		myHtml += '<img class="hand" src="../images/check.png" rel="tooltip" title="to approve" onclick="CX.feeChangeAction(\'approve\', \'In Process\', \'a\', ' + requestId + ')" />';
	}else{
		myHtml += '<img class="opaque" src="../images/check.png" />';
	}
	if (canApproveFeeEdits) {
		myHtml += '<img class="hand" src="../images/redx.gif"  rel="tooltip" title="to deny"    onclick="CX.feeChangeAction(   \'deny\',   \'Canceled\', \'d\', ' + requestId + ')" />';
	}else{
		myHtml += '<img class="opaque" src="../images/redx.gif" />';
	}
	return myHtml;
}

/**
 * set can-condition
 */
CX.setCanCondition = function(canCondition, appraisalId) {
	var myHtml = '';

	if (canCondition) {
		myHtml += '<img class="hand" src="/tandem/images/edit_s.gif" rel="tooltip" title="add condition" onclick="CX.addCondition(' + appraisalId + ')" />';
	}else{
		myHtml += '&nbsp;';
	}
	return myHtml;
}

/**
 * set can-satisfy-condition
 */
CX.setCanSatisfyCondition = function(canSatisfyCondition, appraisalId) {
	var myHtml = '';

	if (canSatisfyCondition) {
		myHtml += '<a href="/tandem/satisfy-conditions?appraisal_id=' + appraisalId + '"><img class="hand" src="/tandem/images/edit_s.gif" rel="tooltip" title="satisfy condition" /></a>';
	}else{
		myHtml += '&nbsp;';
	}
	return myHtml;
}

/**
 * set can-qc-report
 */
CX.setCanQcReport = function(canViewQCReport, qc_issue_flag, appraisalId) {
	var myHtml = '';

	if (canViewQCReport) {
		if (qc_issue_flag && qc_issue_flag == 't') {
			myHtml += '<a href="/tandem/qc-print-report?appraisal_id=' + appraisalId + '" target="_blank"><img class="hand" src="/tandem/images/qc_report_fail.png" rel="tooltip" title="View Report - Bad" ></a>';
		}else{
			myHtml += '<a href="/tandem/qc-print-report?appraisal_id=' + appraisalId + '" target="_blank"><img class="hand" src="/tandem/images/qc_report_pass.png" rel="tooltip" title="View Report - Good"></a>';
		}
	}else{
		myHtml += '&nbsp;';
	}
	return myHtml;
}

/**
 * set reports
 */
CX.setReports = function(ar_id, ac_id, ai_id, process_payment_flag, appraisalId) {
	var myHtml = '';

	if (ar_id) {
		myHtml += '<a href="/tandem/download-report'			+ '?appraisal_id=' + appraisalId + '" target="_new"><img class="hand" src="/tandem/images/pdf.jpg" rel="tooltip" title="Download Appraisal Report"	/></a>';
	}else{
		myHtml += '<img class="opaque" src="../images/pdf.jpg" />';
	}
	if (ac_id) {
		myHtml += '<a href="/tandem/download-amc-certification' + '?appraisal_id=' + appraisalId + '" target="_new"><img class="hand" src="/tandem/images/pdf.jpg" rel="tooltip" title="Download AMC Certification" /></a>';
	}else{
		myHtml += '<img class="opaque" src="../images/pdf.jpg" />';
	}
	if (ai_id || process_payment_flag == 't') {
		myHtml += '<a href="/tandem/download-invoice'			+ '?appraisal_id=' + appraisalId + '" target="_new"><img class="hand" src="/tandem/images/pdf.jpg" rel="tooltip" title="Download Invoice"			/></a>';
	}else{
		myHtml += '<img class="opaque" src="../images/pdf.jpg" />';
	}
	return myHtml;
}

/**
 * set mail report
 */
CX.setMailReport = function(canFinalApproveAppraisalReport, canSendBorrowerAppraisalReport, mail_status, appraisalId) {
	var myHtml = '';

	if (canFinalApproveAppraisalReport || canSendBorrowerAppraisalReport) {
		var	image = 'usps_off.png';
		if (mail_status == '2') {
			image = 'usps_on.png';
		}
		myHtml += '<img class="hand" src="/tandem/images/' + image + '" rel="tooltip" title="Mail Report" onclick="CX.mailBorrower(' + appraisalId + ')" />';
	}else{
		myHtml += '&nbsp;';
	}
	return myHtml;
}		
			
/**
 * set send report
 */
CX.setSendReport = function(canFinalApproveAppraisalReport, canSendBorrowerAppraisalReport, borrower1_email, borrower2_email, appraisalId) {
	var myHtml = '';

	if (canFinalApproveAppraisalReport || canSendBorrowerAppraisalReport) {
		if (borrower1_email || borrower2_email) {
			myHtml += '<img class="hand" src="/tandem/images/email_go.png" rel="tooltip" title="Email Report" onclick="CX.emailBorrower(' + appraisalId + ')" />';
		}else{
			myHtml += '&nbsp;';
		}
	}else{
		myHtml += '&nbsp;';
	}
	return myHtml;
}		
			
/* display message on right bottom corner
 * it will stay be displayed long enought to be read
 * @param	message
 */
CX.displayMessage = function(message) {
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

	if (CX.lastTimeOut) {
		clearTimeout(CX.lastTimeOut);
	}
	CX.lastTimeOut = setTimeout(function() {
		$('#ihs-message').css('display', 'none');
		$('#ihs-message-body').html('');
	}, myTime * 1000);
}

/**
 * display trace on left bottom corner
 * it will be displayed if CX.TRACE = true
 * @param	message
 */
CX.displayTrace = function(message) {
	if (!CX.TRACE) {	//	this control is set on [setup definition of constants] of [index.js]
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
CX.showId = function(idName) {
	$('#' + idName).css('display', 'block');
}

/**
 * hide specific id name
 * @param	idName
 */
CX.hideId = function(idName) {
	$('#' + idName).css('display', 'none');
}

/**
 * show specific class name
 * @param	className
 */
CX.showClass = function(className) {
	$('.' + className).css('display', 'block');
}

/**
 * hide specific class name
 * @param	className
 */
CX.hideClass = function(className) {
	$('.' + className).css('display', 'none');
}

/**
 * show loading image
 */
CX.showLoading = function() {
	$('#ihs-loading').show();
}

/**
 * hide loading image
 */
CX.hideLoading = function() {
	$('#ihs-loading').hide();
}

/**
 * scroll to top if the table
 * @param	className
 */
CX.scrollToTop = function(className) {
	$('.' + className).scrollTop(0);
}

/**
 * return true if specific browser is running
 * @param	browserName
 * @return  true | false
 *
 * @example 
 *			CX.isBrowser('msie')
 *			CX.isBrowser('firefox')
 *			CX.isBrowser('chrome')
 *			CX.isBrowser('safari')
 */
CX.isBrowser = function(browserName) {
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
CX.isScrollAtEnd = function(className) {
	var myId = $('.' + className)[0];
	var myOffset = myId.scrollHeight - myId.scrollTop - myId.offsetHeight;
	if (myOffset < 0) {
		return true;
	}else{
		return false;
	}
}

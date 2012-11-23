Handlebars.registerHelper('CX-set-header-align', function() {
	var myName  = arguments[1].data.view.content.name ;
/*
	var myAlign = 'center';
	switch(myName) {
		case('address'				) : myAlign='left'	; break;
		case('borrowers'			) : myAlign='left'	; break;
		case('vendor'				) : myAlign='left'	; break;
		case('vendor_name'			) : myAlign='left'	; break;
	}
*/
	return new Handlebars.SafeString('id="' + CX.activeOrderPrefix + '-' + myName + '"');
});

Handlebars.registerHelper('CX-fix-header-label', function() {
	var myLabel = arguments[1].data.view.content.label;
	return new Handlebars.SafeString(myLabel);
});

Handlebars.registerHelper('CX-fix-order-value', function() {
	var myName  = arguments[1].data.view.content.name ;
	var myValue = arguments[1].data.view.content.value;
	var myAlign = 'left';
	switch(myName) {
		case('amount' 				) : myValue = CX.fixBr	(myValue)			; myAlign = 'right'	; break;
		case('appraisal_id'			) : myValue = CX.fixBr	(myValue)			; myAlign = 'center'; break;
		case('dupe_flag'			) : myValue = CX.fixFlag(myValue,'yes','&nbsp;')				; break;
		case('loan_number'			) : myValue = 			 myValue.substr(0,7); myAlign = 'center'; break;
		case('orig_amount' 			) : myValue = CX.fixBr	(myValue)			; myAlign = 'right'	; break;
		case('paid_by_borrower_flag') : myValue = CX.fixFlag(myValue,'Borrower', 'Broker')			; break;
		case('payment_issue_flag'	) : myValue = CX.fixFlag(myValue,'Not Received','Received')		; break;
		case('status_date'			) : myValue = CX.fixDate(myValue)								; break;
		case('status_name'			) : myValue = CX.fixBr	(myValue)			; myAlign = 'center'; break;
		case('target_date'			) : myValue = CX.fixDate(myValue)								; break;
		default						  : myValue = CX.fixNull(myValue)								; break;
	}
	return new Handlebars.SafeString('<td id="' + CX.activeOrderPrefix + '-' + myName + '">' + myValue + '</td>');
});


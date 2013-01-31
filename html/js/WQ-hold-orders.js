/**
 * CX.holdOrdersAction
 */
CX.holdOrderAction = function(actionName, movedInto, statusCode, appraisalId) {
	CX.displayTrace('CX.holdOrderAction');
	CX.ajaxProgram	= 'hold-orders';
	CX.actionName	= actionName	;
	CX.movedInto	= movedInto		;
	CX.statusCode	= statusCode	;
	CX.appraisalId	= appraisalId	;

	$('#ihs-confirm .action-name'	).html(CX.actionName	);
	$('#ihs-confirm .moved-into'	).html(CX.movedInto		);
	$('#ihs-confirm .appraisal-id'	).html(CX.appraisalId	);
	CX.showConfirm();
}

/**
 * CX.feeChangeAction
 */
CX.feeChangeAction = function(actionName, movedInto, statusCode, requestId) {
	CX.displayTrace('CX.feeChangeAction');
	CX.ajaxProgram	= 'fee-changes';
	CX.actionName	= actionName	;
	CX.movedInto	= movedInto		;
	CX.statusCode	= statusCode	;
	CX.requestId	= requestId		;

	$('#ihs-confirm-request .action-name'	).html(CX.actionName	);
	$('#ihs-confirm-request .moved-into'	).html(CX.movedInto		);
	$('#ihs-confirm-request .request-id'	).html(CX.requestId		);
	CX.showConfirmRequest();
}

/**
 * CX.addCondition
 */
CX.addCondition = function(appraisal_id) {	
		var dataObj = {};
		dataObj.appraisal_id = appraisal_id;
		var d  = $('#dialog');
		var dc = $('#dContent');
		
		$('#dialog').dialog({
			modal: true,
			autoOpen: false,
			minWidth: 600,
			minHeight:300,
			width: 650,
			height:450
		});

		$.ajax({
			type: 'POST',
			url: '/tandem/modals/GetAddConditionsScreen/',
			data: dataObj,
			dataType: 'html',
			cache: false,
			success: function(data, textStatus) {
					dc.html(data);
					var status = $('#conditonStatus');
					d.dialog('option', 'buttons', {
						"Ok": function() {
								nc = $('#newCondition0').val();
								if (nc) {
									newConditionDdataObj = {};
									newConditionDdataObj.appraisal_id = dataObj.appraisal_id;
									newConditionDdataObj.condition = nc;
								
									$.ajax({
										type: 'POST',
										url: '/tandem/remote/AddCondition/',
										data: newConditionDdataObj,
										dataType: 'json',
										cache: false,
										success: function(data,textStatus) {
											if (1==data.Status) {
//												var tr = $.create('tr');
//												$.create('td',{attributes:{'class':'condition'},children:nc}).appendTo(tr);
//												$.create('td',{children:data.CONDITION_DATE}).appendTo(tr);
//												$.create('td',{children:data.REQUESTED_BY}).appendTo(tr);
//												tr.appendTo($('#openConditions'));
												var tr  = '<tr>'
														+ '<td class="condition">' + nc + '</td>'
														+ '<td>' + data.CONDITION_DATE + '</td>'
														+ '<td>' + data.REQUESTED_BY + '</td>'
														+ '</tr>'
														;
												$(tr).appendTo('#openConditions');
												$('#newCondition0').val('');
												status.html("Conditions added!");
											} else {
												status.html("We're sorry, but there was problem adding these conditions.");
											}
										},
										complete: function() {
											$('#ajaxSpinner').hide();
										},
										error: function(XMLHttpRequest, textStatus, errorThrown) {
											status.html("We're sorry, but there was problem adding these conditions.");
											d.dialog('option', 'buttons', {
												"Cancel": function() {
												d.dialog('close');
												}
											});
										},
										beforeSend: function() {
											$('#ajaxSpinner').show();
										}
									});
								}
							},
						"Cancel": function() {
								d.dialog('close');
							}
						}
					);
				
			},
			complete: function() {
				$('#ajaxSpinner').hide();
				d.dialog('open');
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				dc.html("We're sorry, but there was a getting the conditions.");
				$('#dialog').dialog('option', 'buttons', {
					"Cancel": function() {
					d.dialog('close');
					}
				});
			},
			beforeSend: function() {
				$('#ajaxSpinner').show();
			}
		})
};

/**
 * CX.emailBorrower
 */
CX.emailBorrower = function(appraisal_id) {
		var dataObj = {};
		dataObj.appraisal_id = appraisal_id;
		d = $('#ebrDialog');
		dc = $('#ebrContent');
		
		$('#ebrDialog').dialog({
			modal: true,
			autoOpen: false,
			minWidth: 640,
			minHeight:300,
			width: 640,
			height:450
		});
	
		$.ajax({
			type: 'POST',
			url: '/tandem/modals/GetEmailBorrowerReportScreen/',
			data: dataObj,
			dataType: 'html',
			cache: true,
			success: function(data, textStatus){
					dc.html(data);
					status = $('#emailBorrowerReportStatus');
					var dataObj2 = {};
					dataObj2.appraisal_id = dataObj.appraisal_id;
					d.dialog('option', 'buttons', {
						"Ok": function() {
								$.ajax({
									
									type: 'POST',
									url: '/tandem/remote/SendBorrowerReport/',
									data: dataObj2,
									dataType: 'json',
									cache: false,
									success: function(data,textStatus){
										d.dialog('option', 'buttons', {'Ok': function(){d.dialog('close')}});
										if(1==data.Status){
											dc.html("Report sent successfully!");
										} else {
											dc.html("We're sorry, but we were unable to send the report.  Please contact customer support for assistance.");
										}
									},
									complete: function(){
										$('#ajaxSpinner').hide();
									},
									error: function(XMLHttpRequest, textStatus, errorThrown){
										dc.html("We're sorry, but we were unable to send the report.  Please contact customer support for assistance.");
										d.dialog('option', 'buttons', {
											"Cancel": function() {
											d.dialog('close');
											}
										});
									},
									beforeSend: function(){
										$('#ajaxSpinner').show();
									}
								});
							},
						"Cancel": function() {
								d.dialog('close');
							}
						}
					);
				
			},
			complete: function(){
				$('#ajaxSpinner').hide();
				d.dialog('open');
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				dc.html("We're sorry, but there was a problem.  Please try again in a few moments.");
				$('#dialog').dialog('option', 'buttons', {
					"Cancel": function() {
					d.dialog('close');
					}
				});
			},
			beforeSend: function(){
				$('#ajaxSpinner').show();
			}
		});
};

/**
 * CX.mailBorrower
 */
CX.mailBorrower = function(appraisal_id) {
		var dataObj = {};
		dataObj.appraisal_id = appraisal_id;
		var cachedID = 'mailBorrowerReportImg'+dataObj.appraisal_id;
		d = $('#mbrDialog');
		dc = $('#mbrDialog');
		
		$('#mbrDialog').dialog({
			modal: true,
			autoOpen: false,
			minWidth: 280,
			minHeight:220,
			width: 350,
			height:220
		});
	
		$.ajax({
			type: 'POST',
			url: '/tandem/modals/GetMailBorrowerReportScreen/',
			data: dataObj,
			dataType: 'html',
			cache: true,
			success: function(data, textStatus){
					dc.html(data);
					status = $('#mailBorrowerReportStatus');
					var dataObj2 = {};
					dataObj2.appraisal_id = dataObj.appraisal_id;
					
					d.dialog('option', 'buttons', {
						"Ok": function() {
							dataObj2.marked_val = $('input:radio[name=markMailedReport]:checked').val();
								$.ajax({
									type: 'POST',
									url: '/tandem/remote/MarkBorrowerReport/',
									data: dataObj2,
									dataType: 'json',
									cache: false,
									success: function(data,textStatus){
										d.dialog('option', 'buttons', {'Ok': function(){d.dialog('close')}});
										if(1==data.Status){
											if('1'==data.MailedStatus){
												$('#'+cachedID).attr('src','/tandem/images/usps_off.png');
												dc.html("Report marked as not mailed.");	
											} else if('2' == data.MailedStatus){
												$('#'+cachedID).attr('src','/tandem/images/usps_on.png');
												dc.html("Report marked as mailed.");
											}
										} else {
											dc.html("We're sorry, but we were unable to save the mailed status.  Please contact customer support for assistance.");
										}
									},
									complete: function(){
										$('#ajaxSpinner').hide();
									},
									error: function(XMLHttpRequest, textStatus, errorThrown){
										dc.html("We're sorry, but we were unable to save the mailed status.  Please contact customer support for assistance.");
										d.dialog('option', 'buttons', {
											"Cancel": function() {
											d.dialog('close');
											}
										});
									},
									beforeSend: function(){
										$('#ajaxSpinner').show();
									}
								});
							},
						"Cancel": function() {
								d.dialog('close');
							}
						}
					);
				
			},
			complete: function(){
				$('#ajaxSpinner').hide();
				d.dialog('open');
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				dc.html("We're sorry, but there was a problem.  Please try again in a few moments.");
				$('#dialog').dialog('option', 'buttons', {
					"Cancel": function() {
					d.dialog('close');
					}
				});
			},
			beforeSend: function(){
				$('#ajaxSpinner').show();
			}
		});
};
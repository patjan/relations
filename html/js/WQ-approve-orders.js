/**
 * CX.approveOrderAction
 */
CX.approveOrderAction = function(actionName, movedInto, statusCode, appraisalId) {
	CX.displayTrace('CX.approveOrderAction');
	CX.ajaxProgram	= 'approve-orders';
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
 * show confirm layer
 */
CX.showConfirm = function() {
	$('#ihs-confirm').modal('show');
}

/**
 * hide confirm layer
 */
CX.hideConfirm = function() {
	$('#ihs-confirm').modal('hide');
}

/**
 * CX.clickConfirm
 */
CX.clickConfirm = function(action) {
	CX.displayTrace('CX.clickConfirm');	
	CX.hideConfirm();
	if (action === 'Yes') {

		CX.showLoading();
		$.ajax({
			url		: CX.AJAX_APP + CX.ajaxProgram + '?appraisal_id=' + CX.appraisalId+ '&status_code=' + CX.statusCode,
			success	: function(response) {
				CX.displayTrace('CX.clickConfirm, ajax, success');
				if (response.Status != 'ok') {
					CX.displayMessage(response.Message);
				}else{

					CX.displayMessage('Appraisal #<b>' + CX.appraisalId + '</b> is moved into [<b>' + CX.movedInto + '</b>] queue.');
					CX.processUpdateReturn(CX.appraisalId);

				}
				CX.hideLoading();
			}
		});
		
	} else {
		CX.displayMessage('Action [<b>' + CX.actionName + '</b>] on the order #<b>' + CX.appraisalId + '</b> was <B>denied</b>.');
	}
}

CX.processUpdateReturn = function(appraisalId) {
	CX.displayTrace('CX.processUpdateReturn');
	CX.deleteOrder(appraisalId);
	CX.processOrdersBody();
	CX.processOrdersFoot();
	CX.loadOrderTypesWithCounter();
}

/**
 * show confirm request layer
 */
CX.showConfirmRequest = function() {
	$('#ihs-confirm-request').modal('show');
}

/**
 * hide confirm request layer
 */
CX.hideConfirmRequest = function() {
	$('#ihs-confirm-request').modal('hide');
}

/**
 * CX.clickConfirmRequest
 */
CX.clickConfirmRequest = function(action) {
	CX.displayTrace('CX.clickConfirmRequest');	
	CX.hideConfirmRequest();
	if (action === 'Yes') {

		CX.showLoading();
		$.ajax({
			url		: CX.AJAX_APP + CX.ajaxProgram + '?request_id=' + CX.requestId+ '&status_code=' + CX.statusCode,
			success	: function(response) {
				CX.displayTrace('CX.clickConfirmRequest, ajax, success');
				if (response.Status != 'ok') {
					CX.displayMessage(response.Message);
				}else{

					CX.displayMessage('Request #<b>' + CX.requestId + '</b> is moved into [<b>' + CX.movedInto + '</b>] queue.');
					CX.processUpdateRequest(CX.requestId);

				}
				CX.hideLoading();
			}
		});
		
	} else {
		CX.displayMessage('Action [<b>' + CX.actionName + '</b>] on the request #<b>' + CX.requestId + '</b> was <B>denied</b>.');
	}
}

CX.processUpdateRequest = function(requestId) {
	CX.displayTrace('CX.processUpdateRequest');
	CX.deleteRequest(requestId);
	CX.processOrdersBody();
	CX.processOrdersFoot();
	CX.loadOrderTypesWithCounter();
}


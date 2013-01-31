/**
 * define CX namespace for all application
 */
window.CX = Em.Application.create({rootElement:'#mainContent'});

CX.ApplicationController= Em.Controller.extend();
CX.WqMenuController		= Em.Controller.extend();
CX.WqHeadController 	= Em.Controller.extend();
CX.WqBodyController 	= Em.Controller.extend();
CX.WqFootController 	= Em.Controller.extend();

CX.ApplicationView	= Em.View.extend({templateName:'template-main'});
CX.WqMenuView 		= Em.View.extend({templateName:'template-menu'});
CX.WqHeadView 		= Em.View.extend({templateName:'template-head'});
CX.WqBodyView 		= Em.View.extend({templateName:'template-body'});
CX.WqFootView 		= Em.View.extend({templateName:'template-foot'});

//	set trigger for load more orders
//	this is setup outside of router
//	to avoid the url change to [.../#/moreOrders]
CX.WqFootView = Em.View.extend({
	templateName:'template-foot',
	loadMoreOrders: function() {
		CX.displayTrace('CX.WqFootView, loadMoreOrders');
		CX.loadMoreOrders();
	}
});

CX.Router = Em.Router.extend({
	enableLogging: true,
	root: Em.Route.extend({
		loadNewType		: Em.Route.transitionTo('newType'),

		index: Em.Route.extend({
			route		: '/',
			connectOutlets	: function(router, context) {
				CX.displayTrace('CX.Router.index');
				CX.loadOrderTypesWithCounter();
			}
		}),

		newType: Em.Route.extend({
			route			: '/newType/:name',
			deserialize		: function(router, context) {
				return (context.name)
			},
			serialize		: function(router, context) {
				return {name: context}
			},
			connectOutlets	: function(router, orderType) {
				CX.displayTrace('CX.Router.newType, orderType: ' + orderType);
				CX.loadNewOrderType(orderType);
			}
		})
	})
});

/**
 * main function
 */
$(function() {
	$.ajaxSetup({
		dataType: 'json',
		error	: function(jqXHR, textStatus, errorThrown) {
			CX.hideLoading();
			CX.displayMessage('Error from backend server, please re-try later.');
		}
	});

	CX.displayTrace('$(function() {})');
	$('body').append('<div id="ihs-util"></div>');
//	$('body').append('<div id="ihs-hb"  ></div>');
	CX.loadHtml('ihs-util'   , 'CX-util.html'	);
//	CX.loadHtml('mainContent', 'WorkQueue.html'	);
//	CX.loadHb('template-main', 'work-queue.html');
//	CX.loadHb('template-menu', 'wq-menu.html'	);
//	CX.loadHb('template-head', 'wq-header.html'	);
//	CX.loadHb('template-body', 'wq-body.html'	);
//	CX.loadHb('template-foot', 'wq-footer.html'	);
	CX.workQueueStart();
});

/**
 * CX.workQueueStart
 * wait until the template is compiled by handlebars
 *
 * initiate Ember Router and set bindings
 */
CX.workQueueStart = function() {
	CX.displayTrace('CX.workQueueStart');
//	CX.initialize();		//	not needed after 1.0.0-pre2
	CX.router.get('applicationController').connectOutlet('outlet-menu', 'wqMenu');
	CX.router.get('applicationController').connectOutlet('outlet-head', 'wqHead');
	CX.router.get('applicationController').connectOutlet('outlet-body', 'wqBody');
	CX.router.get('applicationController').connectOutlet('outlet-foot', 'wqFoot');
	CX.bindingOnScroll();	//	table scroll  can be bond only once
	CX.bindingOnResize();	//	window resize can be bond only once
	CX.loadUserRoles();
};

/**
 * binding on scroll
 * wait until any order is loaded, to binding on scroll
 *
 * !!! important !!!
 * table scroll can be bond only once per load 
 */
CX.bindingOnScroll = function() {
	if (CX.orders.length > 0) {
		$('.tablescroll_wrapper').scroll(function() {
			if (CX.isScrollAtEnd('tablescroll_wrapper')) {
				CX.loadMoreOrders();
			}
		});
	} else {
		setTimeout(function() {CX.bindingOnScroll();}, 100);
	}
}

/**
 * binding on resize
 * not to bind on IE < 9, it will cause infinite loops
 * wait until any order is loaded, to binding on scroll
 *
 * !!! important !!!
 * window resize can be bond only once per load 
 */
CX.bindingOnResize = function() {
	if (CX.isBrowser('msie') && $.browser.version < 9) {
		return;
	}
	if (CX.orders.length > 0) {
		$(window).bind('resize', function() {
			CX.setTableWidthHeight('wq-table', 850, 390, 350);
		});
	} else {
		setTimeout(function() {CX.bindingOnResize();}, 100);
	}
}

/**
 * load user roles
 */
CX.loadUserRoles = function() {
	CX.displayTrace('CX.loadUserRoles');
	$.ajax({
		url		: CX.AJAX_URL + 'GetUserRoles',
		success	: function(response) {
			CX.displayTrace('CX.loadUserRoles, ajax, success');
			if (response.Status != 'ok') {
				CX.displayMessage(response.Error.Message);
			} else {
				CX.saveUserRoles(response.Data);
			}
		}
	});
}

/**
 * load order types with counter
 */
CX.loadOrderTypesWithCounter = function() {
	CX.displayTrace('CX.loadOrderTypesWithCounter');
	CX.showLoading();
	$.ajax({
		url		: CX.AJAX_URL + 'GetOrderTypesWithCounter',
		success	: function(response) {
			CX.displayTrace('CX.loadOrderTypesWithCounter, ajax, success');
			if (response.Status != 'ok') {
				CX.displayMessage(response.Error.Message);
			} else {
				CX.saveOrderTypes(response.Data);
				var myOrderTypes = [];
				for (var i=0; i<CX.orderTypes.length; i+=1) {  
					var myOrderType = [];
					myOrderType['name'	] = CX.orderTypes[i]['Order Type' ];
					myOrderType['count'	] = CX.orderTypes[i]['Order Count'];

					if (CX.activeOrderType === '' && myOrderType['count'] > 0) {
//						first load of specific type with orders
						CX.loadSpecificType(myOrderType['name']);
//						need to adjust table width on header
						CX.delayFirstDisplay();
					}
					myOrderType['class'] = 'enable';
					if (CX.activeOrderType === myOrderType['name']) {
						myOrderType['class'] = 'active';
					}
					myOrderTypes.push(myOrderType);
				}
				CX.router.get('applicationController').connectOutlet('wqMenu', myOrderTypes);
			}
			CX.hideLoading();
		}
	});
}

/**
 * delay First Display to avoid screen flick of first empty table
 */
CX.delayFirstDisplay = function() {
	CX.displayTrace('CX.delayFirstDisplay');
	if ($('#empty-table').length === 0) {
		CX.showId('wq-data');
		CX.showClass('tablescroll');
		CX.setTableWidthHeight('wq-table', 866, 390, 350);
		CX.setTableWidthHeight('wq-table', 850, 390, 350);
	}else{
		setTimeout(function() {CX.delayFirstDisplay();}, 100);
	}
}

/**
 * load new order type
 */
CX.loadNewOrderType = function(orderType) {
	CX.displayTrace('CX.loadNewOrderType, orderType: ' + orderType);
	CX.loadOrderTypesWithCounter();
	CX.loadSpecificType(orderType);
}

/**
 * load specific order type
 */
CX.loadSpecificType = function(orderType) {
	CX.displayTrace('CX.loadSpecificType, orderType: ' + orderType);
	CX.activeOrderType = orderType;
	CX.showLoading();
	$.ajax({
		url		: CX.AJAX_URL + 'GetOrdersByType?order_type=' + CX.activeOrderType,
		success	: function(response) {
			CX.displayTrace('CX.loadSpecificType, ajax, success');
			if (response.Status != 'ok') {
				CX.displayMessage(response.Error.Message);
			} else {
				CX.saveHeader(response.Data.Header);
				CX.saveOrders(response.Data.Orders, CX.activeOrderType);
				CX.processOrdersHead();
				CX.processOrdersBody();
				CX.processOrdersFoot();
				CX.fixHeaderPositions(CX.activeOrderType, 'th-scroll-bar');
				CX.scrollToTop('tablescroll_wrapper');
				CX.setTableWidthHeight('wq-table', 866, 390, 350);
				CX.setTableWidthHeight('wq-table', 850, 390, 350);
				CX.delayFirstDisplay();
			}
			CX.hideLoading();
		}
	});
}

/**
 * load more orders
 */
CX.loadMoreOrders = function() {
	CX.displayTrace('CX.loadMoreOrders');

//	this check is to avoid request after all orders been loaded
	if (CX.activeOrderCount <= CX.orders.length) {
		return;
	}

//	this check is to avoid more than one request per time
	if (CX.loadedOffset >= CX.orders.length) {
		return;
	}

	CX.loadedOffset = CX.orders.length;
	CX.showLoading();
	$.ajax({
		url		: CX.AJAX_URL + 'GetOrdersByType?order_type=' + CX.activeOrderType + '&offset=' + CX.loadedOffset,
		success	: function(response) {
			CX.displayTrace('CX.loadMoreOrders, ajax, success');
			if (response.Status != 'ok') {
				CX.displayMessage(response.Error.Message);
			} else {
				CX.appendOrders(response.Data.Orders);
				CX.processOrdersBody();
				CX.processOrdersFoot();
//				only needed on IE < 9, because not bond on window resize
				if (CX.isBrowser('msie') && $.browser.version < 9) {
					CX.setTableWidthHeight('wq-table', 850, 390, 350);
				}
			}
			CX.hideLoading();
		}
	});
}
	
/**
 * process orders head
 */
CX.processOrdersHead = function() {
	CX.displayTrace('CX.processOrdersHead');
	CX.router.get('applicationController').connectOutlet('wqHead', CX.header);
}

/**
 * process orders body
 *
 * IE < 9, Ember has a bug after the first page rendered
 * that added extra slash after tags <tr/> and <td/>,
 * which breaks the table body view.
 */
/*
CX.processOrdersBody = function() {
	CX.displayTrace('CX.processOrdersBody');
	var myRows = [];
	for(var i=0; i<CX.orders.length; i+=1) {
		var myOrder = CX.orders[i];
		var myCols = [];
		for(var j=0; j<CX.header.length; j+=1) {
			var myName  = CX.header[j]['name'];
			var myValue = myOrder[myName];
//			populate following fields in function of others fields
			switch(myName) {
				case('action_approve'		) : myValue = CX.setActionApprove	(myOrder['payment_issue_flag'], myOrder['appraisal_id'])																			; break;
				case('action_on_hold'		) : myValue = CX.setActionOnHold	(CX.userRoles['CanRemoveHold'], myOrder['appraisal_id'])																			; break;
				case('address'				) : myValue = CX.fixAddress			(myOrder['street_number'], myOrder['street_name'], myOrder['city'], myOrder['state'])												; break;
				case('borrowers'			) : myValue = CX.fixBorrowers		(myOrder['borrower1_first_name'], myOrder['borrower1_last_name'], myOrder['borrower2_first_name'], myOrder['borrower2_last_name'])	; break;
				case('vendor'				) : myValue = CX.fixVendor			(myOrder['amc_name'], myOrder['first_name'], myOrder['last_name'])																	; break;
			}
			myCols.push({'name':myName, 'value':myValue});
		}
		myRows.push(myCols);
	}
	CX.router.get('applicationController').connectOutlet('wqBody', myRows);
}
*/
/**
 * process orders body
 *
 * overwrite Ember view (wq-body.html) rendering 
 * by generating tags <tr> and <td> 
 */
CX.processOrdersBody = function() {
	CX.displayTrace('CX.processOrdersBody');
	var myHtml = '';
	if (CX.orders.length === 0) {
		myHtml = '<tr><td>No order found</td></tr>';
	}
	for (var i=0; i<CX.orders.length; i+=1) {
		var myOrder = CX.orders[i];
		myHtml += '<tr>';
		for (var j=0; j<CX.header.length; j+=1) {
			var myName  = CX.header[j]['name' ];
			var myValue = myOrder[myName];
			var myAlign = 'left';
			switch(myName) {
				case('action_approve'		) : myValue = CX.setActionApprove	(myOrder['payment_issue_flag']		, myOrder['appraisal_id'])																		; break;
				case('action_on_hold'		) : myValue = CX.setActionOnHold	(CX.userRoles['CanRemoveHold']		, myOrder['appraisal_id'])																		; break;
				case('action_fee_change'	) : myValue = CX.setActionFeeChange	(CX.userRoles['CanApproveFeeEdits']	, myOrder['product_fee_change_request_id'])														; break;
				case('address'				) : myValue = CX.fixAddress			(myOrder['street_number'], myOrder['street_name'], myOrder['city'], myOrder['state'])												; break;
				case('borrowers'			) : myValue = CX.fixBorrowers		(myOrder['borrower1_first_name'], myOrder['borrower1_last_name'], myOrder['borrower2_first_name'], myOrder['borrower2_last_name'])	; break;
				case('can_condition'		) : myValue = CX.setCanCondition	(CX.userRoles['CanCondition']		, myOrder['appraisal_id'])																		; break;
				case('mail_report'			) : myValue = CX.setMailReport		(CX.userRoles['CanFinalApproveAppraisalReport'], CX.userRoles['CanSendBorrowerAppraisalReport'], myOrder['mail_status'], myOrder['appraisal_id'])			; break;
				case('qc_report'			) : myValue = CX.setCanQcReport		(CX.userRoles['CanViewQCReport'], myOrder['qc_issue_flag'], myOrder['appraisal_id'])												; break;
				case('reports'				) : myValue = CX.setReports(myOrder['ar_id'], myOrder['ac_id'], myOrder['ai_id'], myOrder['process_payment_flag'], myOrder['appraisal_id'])								; break;
				case('satisfy_conditions'	) : myValue = CX.setCanSatisfyCondition(CX.userRoles['CanSatisfyCondition'], myOrder['appraisal_id'])																	; break;
				case('send_report'			) : myValue = CX.setSendReport		(CX.userRoles['CanFinalApproveAppraisalReport'], CX.userRoles['CanSendBorrowerAppraisalReport'], myOrder['borrower1_email'], myOrder['borrower2_email'], myOrder['appraisal_id'])			; break;
				case('vendor'				) : myValue = CX.fixVendor			(myOrder['amc_name'], myOrder['first_name'], myOrder['last_name'])																	; break;

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
			myHtml += '<td id="' + CX.activeOrderPrefix + '-' + myName + '">' + myValue + '</td>';
		}
		myHtml += '</tr>';
	}
	$('#table-body').html(myHtml);
}

/**
 * process orders foot
 */
CX.processOrdersFoot = function() {
	CX.displayTrace('CX.processOrdersFoot');
	var myFooters = [];
	myFooters.push(
		{'order-type'		: CX.activeOrderType
		, 'loaded-count'	: CX.orders.length
		, 'total-count'		: CX.activeOrderCount
		, 'has-more-orders'	: CX.activeOrderCount > CX.orders.length
		, 'id'				: CX.orders.length
		});
	CX.router.get('applicationController').connectOutlet('wqFoot', myFooters);
}

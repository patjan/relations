CX.userRoles 	= [];			//	saved all user roles
CX.orderTypes 	= [];			//	saved all order types with counter
CX.header 		= [];			//	saved all header of specific order type
CX.orders 		= [];			//	saved all orders of specific order type (loaded)

CX.activeOrderType  	= '';	//	last active order type	
CX.activeOrderPrefix	= '';	//	prefix of order type used on css id: ap ip cm cn oh ir mp ai fc co 
CX.activeOrderCount 	=  0;	//	last active order count (total orders)
CX.loadedOffset 		=  0;	//	last loaded offset

/**
 * save into array all order types with counters
 * $param	orderTypes (array)
 */
CX.saveUserRoles = function(userRoles) {
	CX.userRoles = userRoles;
}

/**
 * save into array all order types with counters
 * $param	orderTypes (array)
 */
CX.saveOrderTypes = function(orderTypes) {
	CX.orderTypes = orderTypes;
}

/**
 * save into array all headers of specific order type
 * $param	header (array)
 */
CX.saveHeader = function(header) {
	CX.header = header;
}

/**
 * save into array all orders of specific order type
 * $param	orders (array)
 * $param	orderType
 */
CX.saveOrders = function(orders, orderType) {
	CX.orders = orders;
	CX.loadedOffset = 0;
	CX.activeOrderType = orderType;
	
	switch(CX.activeOrderType) {
		case('Approve Orders'		)	: CX.activeOrderPrefix = 'ao'; break;
		case('In Process'			)	: CX.activeOrderPrefix = 'ip'; break;
		case('Completed'			)	: CX.activeOrderPrefix = 'cm'; break;
		case('Canceled'				)	: CX.activeOrderPrefix = 'cn'; break;
		case('On Hold'				)	: CX.activeOrderPrefix = 'oh'; break;
		case('In Review'			)	: CX.activeOrderPrefix = 'ir'; break;
		case('Conditions'			)	: CX.activeOrderPrefix = 'cd'; break;
		case('Missing Payment'		)	: CX.activeOrderPrefix = 'mp'; break;
		case('Assignment Issuies'	)	: CX.activeOrderPrefix = 'ai'; break;
		case('Fee Changes'			)	: CX.activeOrderPrefix = 'fc'; break;
	}

	for(var i=0; i<CX.orderTypes.length; i+=1) {  
		if (CX.orderTypes[i]['Order Type'] === orderType) {
			CX.activeOrderCount = CX.orderTypes[i]['Order Count'];
			break;
		}
	}
}

/**
 * append to bottom of array new orders of specific order type
 * $param	orders (array)
 */
CX.appendOrders = function(orders) {
	for(var i=0; i<orders.length; i+=1) {  
		CX.orders.push(orders[i]);
	}
}

/**
 * delete specific(appraisalId) order from array CX.orders
 * and decrement CX.activeOrderCount
 * $param	appraisailId
 */
CX.deleteOrder = function(appraisalId) {
	for(var i=0; i<CX.orders.length; i+=1) {
		if (CX.orders[i]['appraisal_id'] === appraisalId) {
			CX.orders.splice(i, 1);
			CX.activeOrderCount -= 1;
			break;
		}
	}
}

/**
 * delete specific(requestId) request from array CX.orders
 * and decrement CX.activeOrderCount
 * $param	requestId
 */
CX.deleteRequest = function(requestId) {
	for(var i=0; i<CX.orders.length; i+=1) {
		if (CX.orders[i]['product_fee_change_request_id'] === requestId) {
			CX.orders.splice(i, 1);
			CX.activeOrderCount -= 1;
			break;
		}
	}
}

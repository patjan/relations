JKY.orderTypes 	= [];			//	saved all order types with counter
JKY.header 		= [];			//	saved all header of specific order type
JKY.orders 		= [];			//	saved all orders of specific order type (loaded)

JKY.activeOrderType  	= '';	//	last active order type	
JKY.activeOrderCount 	=  0;	//	last active order count (total orders)
JKY.loadedOffset 		=  0;	//	last loaded offset


/**
 * save into array all order types with counters
 * $param	orderTypes (array)
 */
JKY.saveOrderTypes = function(orderTypes){
	JKY.orderTypes = orderTypes;
}

/**
 * save into array all headers of specific order type
 * $param	header (array)
 */
JKY.saveHeader = function(header){
	JKY.header = header;
}

/**
 * save into array all orders of specific order type
 * $param	orders (array)
 * $param	orderType
 */
JKY.saveOrders = function(orders, orderType){
	JKY.orders = orders;
	JKY.loadedOffset = 0;
	JKY.activeOrderType = orderType;

	for(var i=0; i<JKY.orderTypes.length; i+=1){  
		if (JKY.orderTypes[i]['Order Type'] == orderType){
			JKY.activeOrderCount = JKY.orderTypes[i]['Order Count'];
			break;
		}
	}
}

/**
 * append to bottom of array new orders of specific order type
 * $param	orders (array)
 */
JKY.appendOrders = function(orders){
	for(var i=0; i<orders.length; i+=1){  
		JKY.orders.push(orders[i]);
	}
}

/**
 * delete specific(appraisalId) order from array JKY.orders
 * and decrement JKY.activeOrderCount
 * $param	appraisailId
 */
JKY.deleteOrder = function(appraisalId){
	for(var i=0; i<JKY.orders.length; i+=1){
		if (JKY.orders[i]['appraisal_id'] == appraisalId){
			JKY.orders.splice(i, 1);
			JKY.activeOrderCount -= 1;
			break;
		}
	}
}

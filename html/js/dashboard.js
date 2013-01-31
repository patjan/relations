/**
 *	JKY.dashboard_start
 *
 * 	start dashboard process
 *  initiated from login.js
 */
JKY.dashboard_start = function(){
	display_trace('JKY.dashboard_start');	
	//	if server session is gone, then redirect to Login Page
	if (JKY.is_session_gone()){
		JKY.router.transitionTo('login');
		return;
	}else{
		JKY.dashboard_setup();
	}
}

/**
 *	JKY.dashboard_setup
 *
 * 	setup dashboard page
 *  initiated from JKY.dashboard_start
 */
JKY.dashboard_setup = function(){
	display_trace('JKY.dashboard_setup');	
	if (Em.TEMPLATES["dashboard"]){
		JKY.dashboard_get_data();
	}else{
		setTimeout(function(){JKY.dashboard_setup()}, 100);
	}
}	

/**
 *	JKY.dashboard_get_data
 *
 * 	get data from server
 */
JKY.dashboard_get_data = function(){
	display_trace('JKY.dashboard_get_data');	
	$.ajax({
		url: JKY.AJAX_URL + "dashboard",
		async: true, 

		//	process error condition from server
		error: function(x, t, m){
			alert("error, message: " + m);
		}, // callback error

		//	process success condition from server
		success: function(json){
			var status 	= json["status"	];
			var message = json["message"];
			var data	= json["data"	];
			
			if (status != "ok"){
				alert("error, message: " + message);
			}else{
				JKY.display_news_cta			(data["module_news_cta"			]);
				JKY.display_open_pipeline	(data["module_open_pipelines"	]);
				JKY.display_recent_activity	(data["module_recent_activity"	]);
				JKY.display_recent_notes		(data["module_recent_notes"		]);
				JKY.display_due_today		(data["module_due_today"		]);
			}
		} // callback success
	}); // ajax
}
		
/**
 *	JKY.display_news_cta
 *
 * 	display news cta
 */
JKY.display_news_cta = function(data){
	display_trace('JKY.display_news_cta');
	var data  = data["data" ];
	var html  = data[0][0];

	$("#news-container").html(html);
}

/**
 *	JKY.display_open_pipeline
 *
 * 	display open pipeline from server
 */
JKY.display_open_pipeline = function(data){
	display_trace('JKY.display_open_pipeline');
	var total = data["total"];
	var data  = data["data" ];

	var counts = [];
	counts.push(data["Partial"			]);
	counts.push(data["Request Entered"	]);
	counts.push(data["Request Approved"	]);
	counts.push(data["Vendor Accepted"	]);
	counts.push(data["Inspected"		]);
	counts.push(data["Conditioned Order"]);
	counts.push(data["Order Assigned"	]);
	counts.push(data["Scheduled"		]);
	counts.push(data["On Hold"			]);

	var ticks  = 
		[ "<br>Partial"
		, "Request<br>Entered"
		, "Request<br>Approved"
		, "Vendor<br>Accepted"
		, "<br>Inspected"
		, "Conditioned<br>Order"
		, "Order<br>Assigned"
		, "Scheduled"
		, "<br>On Hold"
		];
	$.jqplot.config.enablePlugins = true;
	$.jqplot("open-pipeline", [counts], {
		// Only animate if we're not using excanvas (not in IE 7 or IE 8)..
		animate: !$.jqplot.use_excanvas,
		seriesDefaults:{
			renderer:$.jqplot.BarRenderer,
			pointLabels: { show: true }
		},
		axes: {
			xaxis: {
				renderer: $.jqplot.CategoryAxisRenderer,
				ticks: ticks
			}
		},
		highlighter: { show: false }
	});
/*
	$("#open-pipeline").bind("jqplotDataClick", 
		function (ev, seriesIndex, pointIndex, data) {
			$("#info1").html("series: "+seriesIndex+", point: "+pointIndex+", data: "+data);
		}
	);
*/
}

/**
 *	JKY.display_recent_activity
 *
 * 	display recent activity from server
 */
JKY.display_recent_activity = function(data){
	display_trace('JKY.display_recent_activity');
	var data  = data["data" ];
	var html  = "";
	var row;

	html +=	"<tr>"
		 + "<th width=10%>ID#</th>"
		 + "<th width=20%>Borrower</th>"
		 + "<th width=35%>Status</th>"
		 + "<th width=35%>Status Date</th>"
		 + "</tr>"
		 ;
	for(var i=0; i<data.length; i++){
		row = data[i];
		html += "<tr >"
			 + "<td class='center'>" 	+ row["ID"			] + "</td>"
			 + "<td>" 					+ row["Borrower"	] + "</td>"
			 + "<td>" 					+ row["Status"		] + "</td>"
			 + "<td>" 					+ row["Note Date"	] + "</td>"
			 + "</tr>"
			 ;
	}
	$("#recent-activity").html(html);
}

/**
 *	JKY.display_recent_notes
 *
 * 	display recent notes from server
 */
JKY.display_recent_notes = function(data){
	display_trace('JKY.display_recent_notes');
	var data  = data["data" ];
	var html  = "";
	var row;

	html +=	"<tr>"
		 + "<th width=10%>ID#</th>"
		 + "<th width=20%>Loan#</th>"
		 + "<th width=35%>Note</th>"
		 + "<th width=35%>Note Date</th>"
		 + "</tr>"
		 ;
	for(var i=0; i<data.length; i++){
		row = data[i];
		html += "<tr>"
			 + "<td class='center'>" 	+ row["ID"			] + "</td>"
			 + "<td>" 					+ row["Loan Number"	] + "</td>"
			 + "<td>" 					+ row["Note"		] + "</td>"
			 + "<td>" 					+ row["Note Date"	] + "</td>"
			 + "</tr>"
			 ;
	}
	$("#recent-notes").html(html);
}

/**
 *	JKY.display_due_today
 *
 * 	display due today from server
 */
JKY.display_due_today = function(data){
	display_trace('JKY.display_due_today');
	var data  = data["data" ];
	var html  = "";
	var row;

	html +=	"<tr>"
		 + "<th width=10%>ID#</th>"
		 + "<th width=15%>Vendor</th>"
		 + "<th width=15%>Loan#</th>"
		 + "<th width=25%>Borrower</th>"
		 + "<th width=35%>Taget Date</th>"
		 + "</tr>"
		 ;
	for(var i=0; i<data.length; i++){
		row = data[i];
		html += "<tr>"
			 + "<td class='center'>" 	+ row["ID"			] + "</td>"
			 + "<td>" 					+ row["Vendor"		] + "</td>"
			 + "<td>" 					+ row["Loan Number"	] + "</td>"
			 + "<td>" 					+ row["Borrower"	] + "</td>"
			 + "<td>" 					+ row["Target Date"	] + "</td>"
			 + "</tr>"
			 ;
	}
	$("#due-today").html(html);
}
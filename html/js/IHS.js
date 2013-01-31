User = Ember.Object.extend({
	first_name	: "",
	last_name	: "",
	user_role	: "",
	start_page	: "",
	session_id	: "",
});
/**
 *	define CX namespace for all application
 */
window.CX = Ember.Application.create();

//	setup definition
CX.AJAX_URL = "http://dev-unittest.inhouseusa.com/middleware/json/";

// 	define the top level layout as main
CX.main = Em.View.create({
	templateName: "main"
});

// 	small LayoutState extension to toggle the navigation css
CX.NavState = Em.LayoutState.extend({
	navSelector	: ".navbar .nav",
	enter		: function(stateManager, transition) {
		this._super(stateManager, transition);
		var $nav = $(this.get("navSelector"));
		$nav.children().removeClass("active");
		var selector = this.get("selector") || ("." + this.get("path"));
		$nav.find(selector).addClass("active");
	}
});
/*
CX.SubNavState = CX.NavState.extend({
	navSelector: ".subnav .nav"
})
*/
// 	define the top level routes and their corresponding views (inline)
CX.routeManager = Em.RouteManager.create({
	rootView: CX.main,

    login	: CX.NavState.create({
        selector	: ".login",
        route		:  "login",
        viewClass	: Em.View.extend({templateName: "login"})
    }),

    logout	: CX.NavState.create({
        selector	: ".logout",
        route		:  "login",
        viewClass	: Em.View.extend({templateName: "login"})
    }),

    dashboard		: CX.NavState.create({
        selector	: ".dashboard",
        route		:  "dashboard",
        viewClass	: Em.View.extend({templateName: "dashboard"})
    }),

});

CX.index_start = function() {
	if (Em.TEMPLATES["main"]) {
		CX.main.appendTo("body");
		CX.routeManager.start();
		CX.login_start();
	}else {
		setTimeout(function() {CX.index_start()}, 100);
	}
};
/**
 *	CX.login_start
 *
 * 	start login process
 *  initiated from index.js
 */
CX.login_start = function() {
//alert("login-start");
	if (Em.TEMPLATES["login"]) {
		CX.routeManager.set("location", "login");
		CX.login_setup();
	}else{
		setTimeout(function() {CX.login_start()}, 100);
	}
}

/**
 *	CX.login_setup
 *
 * 	setup login form
 *  initiated from CX.login_start
 */
CX.login_setup = function() {
//alert("login-setup");
	if ($("#user-name")) {
		$(".login-form").validate({
			success: function(label) {
				label
					.text("OK!").addClass("valid")
					.closest(".control-group").addClass("success");
			},

			//	to avoid to submit request to server and re-load new page
			submitHandler: function(form) {
//alert("submitHandler");
				return false;
			}				
		});
		$("#user-name").focus();
	}else{
		setTimeout(function() {CX.login_setup();}, 100);
	}
}

/**
 *	CX.login_submit
 *
 *	process login submit validation
 *	and display the start-page controlled from server
 */
CX.login_submit = function() {
//alert("CX.login_submit");
	//	clean up previous message
	$("#user-name").focus();
	reset_message("log-in");

	//	onclick, check if missing info
	var clientId = "msi";

//	IE8 - Object doesn't support property or method [trim] 
//	var userName = $("#user-name").val().trim();
//	var password = $("#password" ).val().trim();
	var userName = $("#user-name").val();
	var password = $("#password" ).val();
	if (userName == "" || password == "" ) {
		set_message("log_in", "Missing required field(s).");
		return false;
	}
	
	//	ready to start backend processs
	var data = {client_id:clientId, user_name:userName, password:$.md5(password)};
	$.ajax({
		url: CX.AJAX_URL + "users/login",
		async: false, 
		dataType: "json", 
		data: data,

		//	process error condition from server
		error: function(x, t, m) {
			set_message("log-in", "Error from backend server, please re-try later.");
		}, // callback error

		//	process success condition from server
		//	and save user's info from server
		success: function(json) {
			var status 	= json["status"	];
			var message = json["message"];
			var data	= json["data"	];
			
			if (status != "ok") {
				set_message("log-in", "User Name or Password are invalid.");
			} else {
				user = User.create();
				user.set("first_name", data["first_name"]);
				user.set("last_name" , data["last_name" ]);
				user.set("user_role" , data["user_role" ]);
				user.set("start_page", data["start_page"]);

				//	insert welcome info with User's first name
				$("#header-info").html("<span id='user-info'>Welcome " + user.get("first_name") + "</span>");

				//	enable all anchor from Menu
				$(".dashboard 	a").removeAttr("class").attr("href", "#").attr("onclick", "CX.dashboard_start()");;
				$(".view-orders	a").removeAttr("class").attr("href", "#view-orders"	);
				$(".admin 		a").removeAttr("class").attr("href", "#admin"		);
				$(".my-profile 	a").removeAttr("class").attr("href", "#my-profile"	);
				$(".search 		a").removeAttr("class").attr("href", "#search"		);
				$(".logout 		a").removeAttr("class").attr("href", "#").attr("onclick", "CX.logout_start()");

				if (data["start_page"] == "dashboard") {
					CX.dashboard_start();
				}
			} // else
		} // callback success
	}); // ajax
};

CX.is_session_gone = function() {
	var result;
	$.ajax({
		url: CX.AJAX_URL + "users/check_session",
		async: false, 

		//	process error condition from server
		error: function(x, t, m) {
			alert("error, message: " + m);
		}, // callback error

		//	process success condition from server
		success: function(json) {
			var status 	= json["status"	];

			if (status != "ok") {
				result = true;
			}else{
				result = false;
			}
		} // callback success
	}); // ajax
	return result;
};
/**
 *	CX.logout_start
 *
 * 	start logout process
 *  initiated from index.js submenu [Log Out]
 */
CX.logout_start = function() {
//alert("logout_start");
	$.ajax({
		url: CX.AJAX_URL + "users/logout",
		async: false, 

		//	process error condition from server
		error: function(x, t, m) {
			alert("error, message: " + m);
		}, // callback error

		//	process success condition from server
		//	and reset user's info from server
		success: function(json) {
			user = User.create();
			user.set("first_name", "");
			user.set("last_name" , "");
			user.set("user_role" , "");
			user.set("start_page", "");

			//	delete welcome info with User's first name
			$("#header-info").html("");

			//	disable all anchor from Menu
//			$(".dashboard 	a").removeAttr("href").removeAttr("onclick").attr("class", "disabled");
			$(".view-orders	a").removeAttr("href").attr("class", "disabled");
			$(".admin 		a").removeAttr("href").attr("class", "disabled");
			$(".my-profile 	a").removeAttr("href").attr("class", "disabled");
			$(".search 		a").removeAttr("href").attr("class", "disabled");
			$(".logout 		a").removeAttr("href").removeAttr("onclick").attr("class", "disabled");

			//	display login page
			CX.login_start();
		} // callback success
	}); // ajax
}
/**
 *	CX.dashboard_start
 *
 * 	start dashboard process
 *  initiated from login.js
 */
CX.dashboard_start = function() {
//alert("dashboard_start");
	//	if server session is gone, then goto Login Page
	if (CX.is_session_gone()) {
		CX.login_start();
		return;
	}else{
		CX.dashboard_setup();
	}
}

/**
 *	CX.dashboard_setup
 *
 * 	setup dashboard page
 *  initiated from CX.dashboard_start
 */
CX.dashboard_setup = function() {
//alert("CX.dashboard_setup");
	if (Em.TEMPLATES["dashboard"]) {
		CX.routeManager.set("location", "dashboard");
		CX.dashboard_get_data();
	}else{
		setTimeout(function() {CX.dashboard_setup()}, 100);
	}
}	

/**
 *	CX.dashboard_get_data
 *
 * 	get data from server
 */
CX.dashboard_get_data = function() {
	$.ajax({
		url: CX.AJAX_URL + "dashboard",
		async: true, 

		//	process error condition from server
		error: function(x, t, m) {
			alert("error, message: " + m);
		}, // callback error

		//	process success condition from server
		success: function(json) {
			var status 	= json["status"	];
			var message = json["message"];
			var data	= json["data"	];
			
			if (status != "ok") {
				alert("error, message: " + message);
			}else{
				CX.display_open_pipeline	(data["module_open_pipelines"	]);
				CX.display_recent_activities(data["module_recent_activity"	]);
				CX.display_recent_notes		(data["module_recent_notes"		]);
				CX.display_due_today		(data["module_due_today"		]);
			}
		} // callback success
	}); // ajax
}
		
/**
 *	CX.display_open_pipeline
 *
 * 	display open pipeline from server
 */
CX.display_open_pipeline = function(data) {
//alert("CX.display_open_pipeline");
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
 *	CX.display_recent_activity
 *
 * 	display recent activity from server
 */
CX.display_recent_activities = function(data) {
//alert("CX.display_recent_activities");
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
	for( var i=0; i<data.length; i++) {
		row = data[i];
		html += "<tr >"
			 + "<td class='center'>" 	+ row["ID"			] + "</td>"
			 + "<td>" 					+ row["Borrower"	] + "</td>"
			 + "<td>" 					+ row["Status"		] + "</td>"
			 + "<td>" 					+ row["Note Date"	] + "</td>"
			 + "</tr>"
			 ;
	}
	
	$("#recent-activities").html(html);
}

/**
 *	CX.display_recent_notes
 *
 * 	display recent notes from server
 */
CX.display_recent_notes = function(data) {
//alert("CX.display_recent_notes");
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
	for( var i=0; i<data.length; i++) {
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
 *	CX.display_due_today
 *
 * 	display due today from server
 */
CX.display_due_today = function(data) {
//alert("CX.display_due_today");
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
	for( var i=0; i<data.length; i++) {
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
/**
 *	define JC namespace for all application
 */
JKY = Em.Application.create();

//	define all constants
JKY.TRACE		= true; 	//	help developement to trace sequence flow
JKY.AJAX_URL	= '../index.php/ajax';

JKY.ApplicationController = Em.Controller.extend();

//	define all views
JKY.ApplicationView = Em.View.extend({templateName: 'application'	});
JKY.LoginView 		= Em.View.extend({templateName: 'login'			});
JKY.DashboardView	= Em.View.extend({templateName: 'dashboard'		});
JKY.ControlsView	= Em.View.extend({templateName: 'controls'		});

/**
 *	JKY.index_start
 *
 * 	start application process
 *  initiated from index.html
 */
JKY.index_start = function(){
	display_trace('JKY.index_start');	//	it will never able to display, because the template is not rendered yet.
	if (Em.TEMPLATES['application']){
		$.ajaxSetup({async:true, cache:true, type:'post', dataType:'json', url:JKY.AJAX_URL, error: process_ajax_error});
		JKY.initialize();
	}else{
		setTimeout(function(){JKY.index_start()}, 100);
	}
};

//	define all routers
JKY.Router = Em.Router.extend({
	enableLogging: true,
	root: Em.Route.extend({
		index: Em.Route.extend({
			route: '/',
			redirectsTo: 'login'
		}),
		controls: Em.Route.extend({
			route: '/controls',
			connectOutlets: function(router){
				display_trace('JKY.Router.controls');
				router.get('applicationController').connectOutlet('controls');
				JKY.controls_start();
			}	
		}),
		login: Em.Route.extend({
			route: '/login',
			connectOutlets: function(router){
				display_trace('JKY.Router.login');
				router.get('applicationController').connectOutlet('login');
				JKY.login_start();
			}	
		}),
		dashboard: Em.Route.extend({
			route: '/dashboard',
			connectOutlets: function(router){
				display_trace('JKY.Router.dashboard');
				router.get('applicationController').connectOutlet('dashboard');
				JKY.dashboard_start();
			}	
		}),
		view_orders: Em.Route.extend({
			route: '/view-orders',
			connectOutlets: function(router){
				display_trace('JKY.Router.view_orders');
				router.get('applicationController').connectOutlet('dashboard');
				JKY.dashboard_start();
			}	
		}),
		admin: Em.Route.extend({
			route: '/admin',
			connectOutlets: function(router){
				display_trace('JKY.Router.admin');
				router.get('applicationController').connectOutlet('dashboard');
				JKY.dashboard_start();
			}	
		}),
		my_profile: Em.Route.extend({
			route: '/my-profile',
			connectOutlets: function(router){
				display_trace('JKY.Router.my_profile');
				router.get('applicationController').connectOutlet('dashboard');
				JKY.dashboard_start();
			}	
		}),
		contact_us: Em.Route.extend({
			route: '/contact-us',
			connectOutlets: function(router){
				display_trace('JKY.Router.contact_us');
				JKY.logout_start();
			}	
		}),
		logout: Em.Route.extend({
			route: '/logout',
			connectOutlets: function(router){
				display_trace('JKY.Router.logout');
				JKY.logout_start();
			}	
		})
	})
});


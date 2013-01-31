//  JKY.core ------------------------------------------------------------------
var JC = jky_name_space('JKY.core');

//  to be overwrited for each program
JC.table            ;       //  DB table name
JC.order_by         ;       //  first field name to be ordered by
JC.order_seq        ;       //  first field name to be sequenced by ( ASC, DESC )
JC.select_name      ;       //  first field name to be selected
JC.focus_name       ;       //  first field name to be focused
JC.display_limit    ;       //  limit rows to be displayed
JC.specific         ;       //  select Users table by specific company_id

//  internal control
JC.n                ;       //  current row index
JC.row_id           ;       //  current row id
JC.row              ;       //  current row record
JC.rows             ;       //  current rows displayed
JC.sort_id          ;       //  current sort id
JC.sort_seq         ;       //  current sort seq (ASC, DESC)
JC.sort_name        ;       //  current sort name (field)

//  populated by server session
JC.today_date       = '';
JC.language         = '';
JC.control_company  = '';
JC.company_id       = '';
JC.company_name     = '';
JC.event_id         = '';
JC.event_name       = '';
JC.user_time        = '';
JC.user_id          = '';
JC.full_name        = '';
JC.permissions      = '';
JC.action           = '';
JC.user_key         = '';

JC.skip_add_new     =  false;
JC.skip_display     =  false;
JC.ajax_url         = 'jky_proxy.php';
JC.server_name      =  location.protocol + '//' + location.hostname + '/';
JC.active_layer     = '#jky-layer';         //  can be: #jky-layer | #jky-user | #jky-service

//  ----------------------------------------------------------------------------
JC.select_setup     = function()            {};
JC.display_row      = function(row)         { return ''; };
JC.set_new          = function()            {};
JC.return_set       = function()            { return ''; };

//   actively verify if valid (on change, instead of Save)
//   if too slow, it will inhibit Save button
JC.change           = function() {
//alert('JC.change: ' + this.id);
     var  field_name = this.id;
     var  error = jky_verify(field_name);
     if(  error != '' )
          JC.display_message(error, field_name);
};

//   Process Session -----------------------------------------------------------
JC.request_session = function() {
     var  data = {command:'get_session'};
     $.ajax({async:false, data:data, success:JC.save_session});
};

JC.save_session = function(data, text_status, jq_XHR) {
    if(  data['today_date'        ])        JC.today_date      =        data['today_date'         ];
	if	(data['language'		])			JC.language			= data['language'		];
    if(  data['control_company'   ])        JC.control_company =        data['control_company'    ];
    if(  data['company_id'        ])        JC.company_id      =        data['company_id'         ];
    if(  data['company_name'      ])        JC.company_name    =        data['company_name'       ];
    if(  data['event_id'          ])        JC.event_id        =        data['event_id'           ];
    if(  data['event_name'        ])        JC.event_name      =        data['event_name'         ];
    if(  data['user_time'         ])        JC.user_time       =        data['user_time'          ];
    if(  data['user_id'           ])        JC.user_id         =        data['user_id'            ];
    if(  data['full_name'         ])        JC.full_name       =        data['full_name'          ];
    if(  data['permissions'       ])        JC.permissions     =   eval(data['permissions'        ]);

     if(  data['action'] ) {
          JC.action     = data['action'   ];
          JC.user_key   = data['user_key' ];
     } else {
          JC.action     = '';
          JC.user_key   = '';
     }
};

//   Set Header Info -----------------------------------------------------------
JC.set_header_info = function() {
     var  header_user = '';
     if(  JC.full_name == '' )
          header_user = jky_t('Welcome') + ', ' + jky_t('please') + ' &nbsp;<a onclick="JC.display_signup();">' + jky_t('Sign Up') + '</a>&nbsp; ' + jky_t('or') + ' &nbsp;<a onclick="JC.display_login();">' + jky_t('Log In') + '</a>';
     else header_user = jky_t('Hello') + ' <span>' + JC.full_name + '</span>, ' + jky_t('want to view') + ' &nbsp;<a onclick="JC.update_profile();">' + jky_t('Your Profile') + '</a>&nbsp; ' + jky_t('or') + ' &nbsp;<a onclick="JC.request_logout();">' + jky_t('Log Out') + '</a>';

     $('#jky_header_company' ).html(JC.company_name);
     $('#jky_header_user'    ).html(header_user    );
     $('#jky_event_name'     ).html(JC.event_name  );
};

//   Set Header Menu -----------------------------------------------------------
JC.set_header_menu = function() {
     var  menus = ''
          + '<ul>'
          + JC.get_anchor_code('home' , 'Home'       ,       'home.php')
          ;
     var  action = JC.get_permissions_action('My Info');
     if(  action != '' && action != 'Denied' )
          menus += ''
                + JC.get_anchor_code('user' , 'My Info'    ,    'myinfo2.php')
//              + JC.get_anchor_code(''     , 'My Service' ,  'myservice.php')
//              + JC.get_anchor_code(''     , 'Categories' , 'categories.php')
          ;
     menus += '</ul>';

     $('#jky-header-menus' ).html(menus);
     $('#jky-header-menus' ).tabs({selected:null});

     var  admin = '';
     var  action = JC.get_permissions_action('Admin');
     if(  action != '' && action != 'Denied' ) {
          admin = ''
               + '<li><a class=btn style="line-height:19px;" href="#" onmouseover="mopen(\'jky_admin\')" onmouseout="mclosetime()"><span><i class="icon-wrench icon-white"></i> Admin</span></a>'
               + '     <ul id="jky_admin" onmouseover="mcancelclosetime()"   onmouseout="mclosetime()">'
               /*
                + '<div class="btn-group">'
                + '<a class="btn btn-large dropdown-toggle" data-toggle="dropdown" href="#">'
                + 'Admin'
                + '<span class="caret"></span>'
                + '</a>'
                + '<ul class="dropdown-menu">'
                */
               + JC.get_anchor_code('plus-sign'  , 'Summary'         ,       'summary.php')
               + JC.get_anchor_code('pencil'     , 'Receives'        ,      'receives.php')
               + JC.get_anchor_code('time'       , 'Events'          ,        'events.php')
               + JC.get_anchor_code('th-list'    , 'Groups'          ,        'groups.php')
               + JC.get_anchor_code('plus'       , 'Services'        ,      'services.php')
               + JC.get_anchor_code('user'       , 'Users'           ,         'users.php')
//             + JC.get_anchor_code('th'         , 'Summary'         ,       'summary.php')
               + JC.get_anchor_code('film'       , 'Templates'       ,     'templates.php')
               + JC.get_anchor_code('font'       , 'Translations'    ,  'translations.php')
               + JC.get_anchor_code('move'       , 'Settings'        ,      'settings.php')
          ;

          var  action = JC.get_permissions_action('Controls');
          if(  action != '' && action != 'Denied' ) {
               admin += ''
                    + JC.get_anchor_code('off'   , 'Controls'   ,      'controls.php')
                    + JC.get_anchor_code('road'  , 'Permissions',   'permissions.php')
                    + JC.get_anchor_code('signal', 'Companies'  ,     'companies.php')
                    + JC.get_anchor_code('user'  , 'Clients'    ,       'clients.php')
               ;
          }
          admin += ''
                + '     </ul>'
//               + '</div>'
                + '</li>'
          ;
     }
     var  control = ''
          + '<ul>'
          + '<span style="float:left; height:32px; padding-top:4px; font-size:90%; font-weight:normal; color:black;">' + jky_t('Language') + ': <select id="jky_header_language"></select></span>'
          + admin
          ;

     if(  action != '' && action != 'Denied' ) {
          control += ''
//               + JC.get_anchor_code(''         , 'Progress'   ,     'progress.html')
//               + JC.get_anchor_code(''         , 'My Group'   ,      'mygroup.html')
          ;
     }

     var  action = JC.get_permissions_action('Tickets');
     if(  action != '' && action != 'Denied' )
          control += ''
               + JC.get_anchor_code('barcode'    , 'Tickets'    ,       'tickets.php')
          ;

     control += '</ul>';
     $('#jky-header-control' ).html(control);
     $('#jky-header-control' ).tabs({selected:null});
     $('#jky-header-language').load(JC.ajax_url, {command:'get_soptions', setting_set:'Languages', select:JC.language});
     $('#jky-header-language').change(JC.change_language);

};

JC.get_anchor_code = function(icon, tab, url) {
     var  action = JC.get_permissions_action(tab);
     if(  action == '' || action == 'Denied' )
          return '<li><a href="#" ><span>' + jky_t(tab) + '</span></a></li>';
     else return '<li><a class="btn btn-large" href="#" onclick="JC.redirect(\'' + url + '\')"><i class="icon-' + icon + ' icon-white"></i> ' + jky_t(tab) + '</a></li>';
};

//  ----------------------------------------------------------------------------
JC.change_language = function() {
    JC.language = $('#jky-header-language').val();
    var data = {command:'set_language', language:JC.language};
    $.ajax({data:data}).success(function(data) {
    });
};

JC.get_permissions_action = function(user_resource) {
     if(  JC.permissions != '' )
          for( var  n=0; n<JC.permissions.length; n++ )
               if(  JC.permissions[n]['user_resource'] == user_resource )
                    return JC.permissions[n]['user_action'];
     if(  JC.permissions != '' )
          for( var  n=0; n<JC.permissions.length; n++ )
               if(  JC.permissions[n]['user_resource'] =='All' )
                    return JC.permissions[n]['user_action'];
     return '';
};


JC.redirect = function(url) {
     window.location = url;
};

//   -------- Process Contact Us -----------------------------------------------
JC.process_contact_us = function() {
     $('#jky-dynamic').load('jky_contact_us.html', function() {
          var  data = {command:'get_contact'};
          $.ajax({data:data}).success(function(data) {
               var  row = data['row'];
               $('#jky-contact-logo'    ).attr('src', '/img/' + row['company_logo']);
               $('#jky-contact-line1'   ).html(row['street']);
               $('#jky-contact-line2'   ).html(row['city' ] + ', ' + row['state'] + ' ' + row['zip']);
               $('#jky-contact-phone'   ).html(row['phone']);
               $('#jky-contact-business').html(row['business_email']);
               $('#jky-contact-support' ).html(row['support_email']);
               $('#jky-dynamic').modal('show');
          });
     });
};

//   Process Confirm -------------------------------------------------------------
JC.process_confirm = function(user_key) {
     var  data = {command:'confirm', user_key:user_key};
     $.ajax({data:data}).success(function(data) {
          if(  data['status'] != 'ok' ) {
               JC.display_message(data['message']);
               return;
          }
          JC.display_reset();
     });
};

//   Process Reset -------------------------------------------------------------
JC.process_reset = function(user_key) {
     var  data = {command:'set_user_id', user_key:user_key};
     $.ajax({data:data}).success(function(data) {
          if(  data['status'] != 'ok' ) {
               JC.display_message(data['message']);
               return;
          }
          JC.display_reset();
     });
};

JC.display_reset = function() {
     $('#jky-dynamic').load('jky_reset.html', function() {
          $('#jky-dynamic').modal('show');
          JC.set_focus('reset-new-password');
     });
};

JC.reset_password = function() {
     var  new_password = $('#reset-new-password').val();
     var  cnf_password = $('#reset-cnf-password').val();

     var  error = '';
     if(  new_password == '' || cnf_password == '' )
          error += '<br>' + jky_t('All password fields are required');
     if(  new_password != cnf_password )
          error += '<br>' + jky_t('Confirm Password does not match New Password');

     if(  error == '' ) {
          var  encrypted = $.md5(new_password);
          var  data = {command:'reset', encrypted:encrypted};
          $.ajax({data:data}).success(function(data) {
               $('#jky-dynamic').modal('hide');
               JC.display_message(data['message']);
//             window.location = 'companies.html';
               window.location = data['re_direct'];
          })
     } else {
          JC.display_message(error, 'reset_new_password');
     }
};

//   -------- Process Signup ---------------------------------------------------
JC.display_signup = function() {
     $('#jky-dynamic').load('jky_sign_up.html', function() {
          $('#jky-dynamic').modal('show');
          JC.set_focus('signup-user-name');
     });
};

JC.request_signup = function() {
     var  user_name      = jky_get_value('signup_user_name'     );
     var  email_address  = jky_get_value('signup_email_address' );
//   var  company_name   = jky_get_value('signup_company_name'  );
//   var  phone_number   = jky_get_value('signup_phone_number'  );
//   var  newsletter     = $('#signup-newsletter').is(':checked') ? 'Y' : 'N';

     var  error = '';
     if(  user_name      == '' ) {
          error += jky_set_is_required('User Name');
     } else {
          var  data = {command:'get_user_id', user_name:user_name};
          $.ajax({async:false, data:data}).success(function(data) {
               found_id = data['id'];
               if(  found_id )
                    error += jky_set_already_taken('User Name');
          });
     }

    if (email_address == '') {
        error += jky_set_is_required('Email Address');
    } else {
        if (!jky_is_email(email_address)) {
           error += jky_set_is_invalid('Email Address: ' + email_address);
        }
    }
     /*
      if(  company_name   == '' ) {
      error += jky_set_is_required('Company Name');
      } else
      if(  company_name.length > 60 ) {
      error += jky_set_size_is_above('Company Name', 60);
      } else {
      var  data = {command:'get_company_id', company_name:company_name};
      $.ajax({async:false, data:data}).success(function(data) {
      found_id = data['id'];
      if(  found_id )
      error += jky_set_already_taken('Company Name');
      });
      }

      if(  phone_number  == '' )
      error += jky_set_is_required('Phone Number');
      */
     if(  error == '' ) {
//        var  data = {command:'sign_up', user_name:user_name, email_address:email_address, company_name:company_name, phone_number:phone_number, newsletter:newsletter};
          var  data = {command:'sign_up', user_name:user_name, email_address:email_address};
          $.ajax({data:data, success:JC.process_signup});
     } else {
          JC.display_message(error, 'signup_user_name');
     }
};

JC.process_signup = function(data, text_status, jq_XHR) {
     if(  data['status'] == 'ok' ) {
          $('#jky-dynamic').modal('hide');
          message =     ' Your new account has been created.'
               + '<br>'
               + '<br> An email is being send out and this new'
               + '<br> account will remain pending for 24 hours.'
               + '<br>'
               + '<br> Access your email account, click on [<b>access'
               + '<br> link</b>] to confirm your email, it will log you in'
               + '<br> and open access to the system.'
               + '<br>'
               + '<br> Please, note that some spam filters may block'
               + '<br> this email, so be sure to enable the filter'
               + '<br> to let this message through.'
          ;
          JC.display_message(message);
     } else {
          JC.display_message(data['message'], 'signup_user_name');
     }
};

//   -------- Process Login ----------------------------------------------------
JC.display_login = function() {
     $('#jky-dynamic').load('jky_log_in.html', function() {
          $('#jky-dynamic').modal('show');
          JC.set_focus('login-user-name');
     });
};

JC.request_login = function() {
     var  user_name      = $('#login-user-name'  ).val();
     var  password       = $('#login-password'   ).val();
     var  remember_me    = $('#login-remember-me').is(':checked') ? 'Y' : 'N';

     var  error = '';
     if(  user_name == '' )
          error += jky_set_is_required('User Name' );
     if(  password   == '' )
          error += jky_set_is_required('Password'  );

     if(  error == '' ) {
//        var  encrypted = $.md5(password);
          var  encrypted = $.md5(JC.user_time + $.md5(password));
          var  data = {command:'log_in', user_name:user_name, encrypted:encrypted, remember_me:remember_me};
          $.ajax({data:data, success:JC.process_login});
     } else {
          JC.display_message(error, 'login_user_name');
     }
};

JC.process_login = function(data, text_status, jq_XHR) {
     if(  data['status'] != 'ok' ) {
          JC.display_message(data['message'], 'login_user_name');
          return;
     }
     $('#jky-dynamic').modal('hide');
//   window.location = 'companies.html';
     window.location = data['re_direct'];
};

//   -------- Process Help -----------------------------------------------------
JC.display_help = function() {
     $('#jky-dynamic').load('jky_help.html', function() {
          $('#jky-dynamic').modal('show');
          JC.set_focus('help-help-name');
     });
};

JC.request_help = function() {
     var  help_name  = $('#help-help-name').val();

     var  error = '';
     if(  help_name == '' )
          error += jky_set_is_required('User Name or Email Address');

     if( error == '') {
          var  data = {command:'log_help', help_name:help_name};
          $.ajax({data:data, success:JC.process_help});
     } else {
          JC.display_message(error, 'help_help_name');
     }
};

JC.process_help = function(data, text_status, jq_XHR) {
     if(  data['status'] != 'ok' ) {
          JC.display_message(data['message'], 'help_help_name');
          return;
     }
     $('#jky-dynamic').load('jky_sent.html', function() {
          $('#jky-sent-email').html(data['user_email']);
          $('#jky-dynamic').modal('show');
     });
};

//   ------- Process Profile ---------------------------------------------------
JC.update_profile = function() {
     $('#jky-dynamic').load('jky_profile.html', function() {
          $('#jky-dynamic').modal('show');
          var  data = {command:'get-profile'};
          $.ajax({async:false, data:data}).success(function(data) {
               var  row = data['row'];
               $('#profile-user-name'      ).val(row['user_name' ]);
               $('#profile-first-name'     ).val(row['first_name']);
               $('#profile-last-name'      ).val(row['last_name' ]);
               $('#profile-email_address'  ).val(row['user_email']);
               $('#profile-phone'          ).val(row['phone'     ]);
               $('#profile-mobile'         ).val(row['mobile'    ]);
               JC.set_focus('profile-user-name');
          });
     });
};

JC.request_profile = function() {
     var  user_name      = jky_get_value('profile_user_name'    );
     var  first_name     = jky_get_value('profile_first_name'   );
     var  last_name      = jky_get_value('profile_last_name'    );
     var  email_address  = jky_get_value('profile_email_address');
     var  phone          = jky_get_value('profile_phone'        );
     var  mobile         = jky_get_value('profile_mobile'       );
     var  cur_password   = jky_get_value('profile_cur_password' );
     var  new_password   = jky_get_value('profile_new_password' );
     var  cnf_password   = jky_get_value('profile_cnf_password' );

     var  error = '';
     if(  user_name == '' ) {
          error += jky_set_is_required('User Name');
     } else {
          var  data = {command:'get_user_id', user_name:user_name};
          $.ajax({async:false, data:data}).success(function(data) {
               found_id = data['id'];
               if(  found_id && found_id != JC.user_id )
                    error += jky_set_already_taken('User Name');
          });
     }

     if(  first_name == '' )
          error += jky_set_is_required('First Name');

     if(  last_name == '' )
          error += jky_set_is_required('Last Name');

     if( !jky_is_email(decodeURIComponent(email_address)) )
          error += jky_set_is_invalid('Email Address');

     if(  cur_password != '' || new_password != '' || cur_password != '' ) {
          if(  cur_password == '' || new_password == '' || cnf_password == '' )
               error += '<br>' + jky_t('All password fields are required');
          if(  new_password != cnf_password )
               error += '<br>' + jky_t('Confirm Password does not match New Password');
     }

     if(  error == '' ) {
          JC.full_name = first_name + ' ' + last_name;
          var  data = {command:'profile', user_name:user_name, first_name:first_name, last_name:last_name, email_address:email_address, phone:phone, mobile:mobile, cur_password:$.md5(cur_password), new_password:$.md5(new_password)};
          $.ajax({data:data, success:JC.process_profile});
     } else {
          JC.display_message(error, 'profile_first_name');
     }
};

JC.process_profile = function(data, text_status, jq_XHR) {
     if(  data['status'] != 'ok' ) {
          JC.display_message(data['message'], 'profile_first_name');
          return;
     }
     JC.display_message(data['message']);
     $('#jky-dynamic').modal('hide');
//     $('#jky-full-name').html(JC.full_name);
};

//   -------- Process Logout ---------------------------------------------------
JC.request_logout = function() {
     var  data = {command:'log_out'};
     $.ajax({data:data}).success(function(data) {
          if(  data['status'] != 'ok' ) {
               JC.display_message(data['message']);
               return;
          }
          window.location = 'home.php';
     });
};

//   Process Update Password ---------------------------------------------------
JC.update_password = function() {
     $('#jky-dynamic').load('jky_reset.html', function() {
          $('#jky-dynamic').modal('show');
          JC.set_focus('reset-new-password');
     });
};

JC.request_reset = function() {
     var  new_password   = jky_get_value('profile_new_password' );
     var  cnf_password   = jky_get_value('profile_cnf_password' );

     var  error = '';
     if(  new_password != '' || cur_password != '' ) {
          if(  new_password == '' || cnf_password == '' )
               error += '<br>' + jky_t('All password fields are required');
          if(  new_password != cnf_password )
               error += '<br>' + jky_t('Confirm Password does not match New Password');
     }

     if(  error == '' ) {
          var  data = {command:'reset', new_password:$.md5(new_password)};
          $.ajax({data:data, success:JC.process_password});
     } else {
          JC.display_message(error, 'reset_new_password');
     }
};

JC.process_password = function(data, text_status, jq_XHR) {
     if(  data['status'] != 'ok' ) {
          JC.display_message(data['message'], 'reset_new_password');
          return;
     }
     $('#jky-dynamic').modal('hide');
     JC.display_message(data['message']);
};

//   Display all Clients of specific Company -----------------------------------
JC.display_clients = function(company_id) {
     JC.skip_display = true;
     var  data  = {command:'set_company_id', company_id:company_id};
     $.ajax({async:false, data:data}).success(function(data) {
          JC.redirect('clients.php');
     });
};

//   Display all Groups of specific Event --------------------------------------
JC.display_groups = function(event_id) {
     JC.skip_display = true;
     var  data  = {command:'set_event_id', event_id:event_id};
     $.ajax({async:false, data:data}).success(function(data) {
          JC.redirect('groups.php');
     });
};

//   Display all Helpers of specific Group -------------------------------------
JC.display_helpers = function(group_id) {
     JC.skip_display = true;
     var  data  = {command:'set_group_id', group_id:group_id};
     $.ajax({async:false, data:data}).success(function(data) {
          JC.redirect('helpers.php');
     });
};

//   Display all Rows ----------------------------------------------------------
JC.display_rows = function() {
     var  html = '';
     var  last = JC.rows.length - 1;
     for( var  n=0; n<=last; n++ ) {
          var  row = JC.rows[n];
          html += '<tr onclick="JC.request_record(' + n + ', ' + row['id'] + ');">';
          html += JC.display_row(row, n, last);
          html += '</tr>';
     }
     $('#jky-counter').val(JC.rows.length);
     $('#jky-content-index').html(html);
     JC.set_focus('jky-filter');
     JC.post_display(JC.rows.length);
};

JC.post_display = function(counter) {
}

//   Process Filter on Enter ---------------------------------------------------
JC.request_filter = function(event) {
     alert('JC.request_filter');
     if(  event.keyCode == 13 )
          JC.request_index();
};

//   Publish -------------------------------------------------------------------
JC.request_publish = function() {
     var  data = {command:'publish', table:JC.table};
     $.ajax({data:data}).success(function(data) {
          JC.display_message(data['message']);
     });
};

//   Request Export ------------------------------------------------------------
//function  JC.request_export(specific) {
JC.request_export = function() {
//alert('JC.request_export');
//     if(  typeof specific != 'string' )
//          specific = '';
     if(  typeof JC.specific == 'undefined' )
          specific = '';
     else specific = JC.specific;

     var  filter = encodeURIComponent($('#jky-filter').val());

     var  selected = $('#jky-select').val();
//     if( !selected )
//          selected = JC.select_name;
//    selected = encodeURIComponent(selected);
    if (selected) {
        JC.select_name = selected;
    }

     var  display = $('#jky-display').val();
//     if( !display )
//          display = JC.display_limit;
    if (display) {
        JC.display_limit = display;
    }

     var  order_by = JC.sort_name;
     if(  JC.sort_seq < 0 )
          order_by += ' DESC';

     html = '<form id="jky_export_form" action="jky_export.php" method="post">'
          + '<input type="hidden" name="table"    value="' + JC.table           + '" />'
          + '<input type="hidden" name="filter"   value="' + filter             + '" />'
          + '<input type="hidden" name="select"   value="' + JC.select_name     + '" />'
          + '<input type="hidden" name="display"  value="' + JC.display_limit   + '" />'
          + '<input type="hidden" name="order_by" value="' + order_by           + '" />'
          + '<input type="hidden" name="specific" value="' + specific           + '" />'
          + '</form>'
          ;
     $('#jky-export-html').html(html);
     $('#jky-export-form').submit();
};

//  Request Master ------------------------------------------------------------
JC.request_master = function() {
//alert('JC.request_master');
    var specific = JC.specific;
    var filter = encodeURIComponent($('#jky-filter').val());

    var  selected = $('#jky-select').val();
    if (selected) {
        JC.select_name = selected;
    }

    var  display = $('#jky-display').val();
    if (display) {
        JC.display_limit = display;
    }

    var  order_by = JC.sort_name;
    if(  JC.sort_seq < 0 )
        order_by += ' DESC';

    html = '<form id="jky_export_form" action="jky_master.php" method="post">'
        + '<input type="hidden" name="table"    value="' + JC.table           + '" />'
        + '<input type="hidden" name="filter"   value="' + filter             + '" />'
        + '<input type="hidden" name="select"   value="' + JC.select_name     + '" />'
        + '<input type="hidden" name="display"  value="' + JC.display_limit   + '" />'
        + '<input type="hidden" name="order_by" value="' + order_by           + '" />'
        + '<input type="hidden" name="specific" value="' + specific           + '" />'
        + '</form>'
    ;
    $('#jky-export-html').html(html);
    $('#jky-export-form').submit();
};

//   Process Index -------------------------------------------------------------
//function  JC.request_index(specific) {
JC.request_index = function() {
     JC.skip_add_new = true;
     $('#jky-loading').show();

//     if(  typeof specific != 'string' )
//          specific = '';
     if(  typeof JC.specific == 'undefined' )
          specific = '';
     else specific = JC.specific;

     var  filter = encodeURIComponent($('#jky-filter').val());

     var  selected = $('#jky-select').val();
//     if( !selected )
//          selected = JC.select_name;
//    selected = encodeURIComponent(selected);
    if (selected) {
        JC.select_name = selected;
    }

     var  display = $('#jky-display').val();
//     if( !display )
//          display = JC.display_limit;
    if (display) {
        JC.display_limit = display;
    }

     var  order_by = JC.sort_name;
     if(  JC.sort_seq < 0 )
          order_by += ' DESC';

//   var  data = {command:'get_index', table:JC.table, filter:filter, select:selected, display:display, order_by:JC.order_by, specific:specific};
     var  data = {command:'get_index', table:JC.table, filter:filter, select:JC.select_name, display:JC.display_limit, order_by:order_by, specific:specific};
     $.ajax({data:data, success:JC.display_index});
};

JC.display_index = function(data, text_status, jq_XHR) {
     JC.skip_add_new = false;
     $('#jky-loading').hide();

     if(  data['status'] != 'ok' ) {
          JC.display_message(data['message']);
          return;
     }

     $.each(data, function(name, value) {
          if(  name == 'rows' ) {
               JC.rows = value;
              JC.sort_by();
              JC.display_rows();
//               JC.ajax();             ??????????????????
          }
     })
};

//   Display Add New -----------------------------------------------------------
JC.display_add_new = function() {
     if(  JC.skip_add_new )
          return;

     JC.row_id = null;
     JC.set_new();

     html = "<a class='close' data-dismiss='modal'>x</a>"
          + "<h3>" + jky_t('Add New') + "</h3>"
          + "<div class='clear'></div>"
          ;
     $(JC.active_layer + ' .modal-header').html(html);

     html = "<a class='btn btn-info' href='#' onclick='JC.request_insert()'>" + jky_t('Save'  ) + "</a>"
          + "<a class='btn'          href='#' data-dismiss='modal'         >" + jky_t('Cancel') + "</a>"
        ;
     $(JC.active_layer + ' .modal-footer').html(html);

     $(JC.active_layer).modal('show');
     JC.set_focus(JC.focus_name);
};

//   Display previous record ---------------------------------------------------
JC.display_previous = function() {
     if(  JC.n > 0 ) {
          JC.n--;
          JC.request_record( JC.n, JC.rows[JC.n]['id']);
     }
     JC.set_focus(JC.focus_name);
};

//   Display next record -------------------------------------------------------
JC.display_next = function() {
     if(  JC.n < JC.rows.length-1 ) {
          JC.n++;
          JC.request_record(JC.n, JC.rows[JC.n]['id']);
     }
     JC.set_focus(JC.focus_name);
};

//   Request One Record --------------------------------------------------------
JC.request_record = function  (n, id) {
     if(  JC.skip_display ) {
          JC.skip_display = false;
          return;
     }
     JC.n = n;
     var  data = {command:'get_row', table:JC.table, where:JC.table + '.id=' + id};
     $.ajax({data:data, success:JC.display_layer});
};

//   Display the Layer ---------------------------------------------------------
JC.display_layer = function(data, text_status, jq_XHR) {
     JC.display_record(data);
     JC.display_extra(JC.row);
     $(JC.active_layer + ' .modal-header').html(JC.return_header());
     $(JC.active_layer + ' .modal-footer').html(JC.return_footer());
     $(JC.active_layer).modal('show');
     JC.set_focus(JC.focus_name);
};

//   Display the Record --------------------------------------------------------
JC.display_record = function(data) {
     if(  data['status'] != 'ok' ) {
          JC.display_message(data['message']);
          return;
     }

     JC.row = data['row'];
     $.each(data, function(name, value) {
          if(  name == 'row' ) {
               $.each(value, function(col_name, col_value) {
                    if(  col_name == 'id' )
                         JC.row_id = col_value;

                    input_id = $('#' + col_name);
                    if(  input_id.length > 0 ) {
                         input_type = input_id.attr('type');
                         if(  typeof input_type == 'undefined' ) {
                              input_type = input_id.get(0).tagName;
                         }
                         switch(input_type) {
                              case('text'    )  : input_id.val(col_value);
                                   break;
                              case('SELECT'  )  : $('#' + col_name + ' option:selected').removeAttr('selected');
                                   if(  col_value ) {
                                        command = "$('#" + col_name + " option[value=\"" + col_value + "\"]').attr('selected', 'selected');";
                                        setTimeout(command, 100);
                                   }
                                   break;
                              case('radio'   )  : $('input[name=' + col_name + ']:checked').removeAttr('checked');
                                   if(  col_value ) {
                                        command = "$('input:radio[name=\"" + col_name + "\"][value=\"" + col_value + "\"]').click();";
                                        setTimeout(command, 100);
                                   }
                                   break;
                              case('checkbox')  : $('input[name=' + col_name + ']:checked').removeAttr('checked');
                                   if(  col_value ) {
                                        command = "$('input:checkbox[name=\"" + col_name + "\"][value=\"" + col_value + "\"]').click();";
                                        setTimeout(command, 100);
                                   }
                                   break;
                              case('TEXTAREA')  : input_id.val(col_value);
                                   break;
                         }
                    }
               })
          }
     })
};

JC.return_header = function() {
     html = "<a class='close' data-dismiss='modal'>x</a>"
          + "<a class='btn btn-info' onclick='JC.display_next    ()'>" + jky_t('Next'    ) + "</a>"
          + "<a class='btn btn-info' onclick='JC.display_previous()'>" + jky_t('Previous') + "</a>"
          + "<div id='jky_position'>"  + (JC.n+1) + " of " + JC.rows.length + "</div>"
          + "<h3>" + jky_t('Update') + "</h3>"
          + "<div class='clear'></div>"
     ;
     return html;
};

JC.return_footer = function() {
     html = "<a class='btn btn-info' href='#' onclick='JC.request_update  ()'>" + jky_t('Save'    ) + "</a>"
          + "<a class='btn btn-info'          onclick='JC.confirm_delete  ()'>" + jky_t('Delete'  ) + "</a>"
          + "<a class='btn btn-info'          onclick='JC.request_comments()'>" + jky_t('Comments') + "</a>"
          + "<a class='btn'          href='#' data-dismiss='modal'           >" + jky_t('Close'   ) + "</a>"
     ;
     return html;
};

JC.display_extra    = function(row)    {};
JC.preview_template = function()       {};

//   Process Insert ------------------------------------------------------------
JC.request_insert = function() {
     var  set  = JC.return_set();
//alert('JC.request_insert, set: ' + set);
     if(  set != '' ) {
          set += JC.prep_insert();
          var  data = {command:'insert', table:JC.table, set:set};
          $.ajax({data:data, success:JC.process_insert});
     }
};

JC.process_insert = function(data, text_status, jq_XHR) {
     if(  data['status'] != 'ok' ) {
          JC.display_message(data['message']);
          return;
     }
     $(JC.active_layer).modal('hide');
     JC.display_message(data['message']);
     JC.row_id = data['id'];

     if(  JC.rows ) {
          JC.insert_row(JC.row_id);
     }
     JC.post_insert(JC.row_id);
};

JC.prep_insert = function(row_id) {
     return '';
};

JC.post_insert = function(row_id) {
};

//   Add New Row Service -------------------------------------------------------
JC.insert_service = function() {
     var  set  = 'user_id=' + JC.row_id + ', event_id=' + JC.event_id;
     var  xdata = {command:'insert', table:'Services', set:set};
     $.ajax({ async: false
          ,    data: xdata
          , success: function(data, text_status, jq_XHR) {
               if(  data['status'] != 'ok' ) {
                    return data;
               }
               var  id = data['id'];
               var  xdata = {command:'get_row', table:'Services', where:'Services.id=' + id};
               $.ajax({async: false
                    ,    data: xdata
                    , success: function(data, text_status, jq_XHR) {JC.row = data['row'];}
               });
          }
     });
};

//   Process Update ------------------------------------------------------------
JC.request_update = function() {
     var  set  = JC.return_set();
//alert('JC.request_update, set: ' + set);
     if(  set != '' ) {
          set += JC.prep_update();
          var  data = {command:'update', table:JC.table, set:set, where:'id=' + JC.row_id};
          $.ajax({data:data, success:JC.process_update});
     }
};

JC.process_update = function(data, text_status, jq_XHR) {
     if(  data['status'] != 'ok' ) {
          JC.display_message(data['message']);
          return;
     }
//   $(JC.active_layer).modal('hide');
     JC.display_message(data['message']);

     if(  JC.rows ) {
          JC.delete_row(JC.row_id);
          JC.insert_row(JC.row_id);
     }
     JC.post_update(JC.row_id);
};

JC.prep_update = function(row_id) {
     return '';
};

JC.post_update = function(row_id) {
};

//   Insert a Row into Array ---------------------------------------------------
JC.insert_row = function(id) {
     var  data = {command:'get_row', table:JC.table, where:JC.table + '.id=' + id};
     $.ajax({data:data, success:JC.process_get_row});
};

//   Process Get Row into Array ------------------------------------------------
JC.process_get_row = function(data, text_status, jq_XHR) {
     if(  data['status'] != 'ok' ) {
          JC.display_message(data['message']);
          return;
     }
     JC.row = data['row'];
     JC.rows.push(JC.row);
     JC.sort_by();
     JC.display_rows();
};

//   Process Delete ------------------------------------------------------------
JC.confirm_delete = function() {
     $('#jky-delete').css('display', 'block');
};

JC.request_delete = function() {
     var  data = {command:'delete', table:JC.table, where:'id=' + JC.row_id};
     $.ajax({data:data, success:JC.process_delete});
};

JC.process_delete = function(data, text_status, jq_XHR) {
     if(  data['status'] != 'ok' ) {
          JC.display_message(data['message']);
          return;
     }
     JC.display_message(data['message']);
     $(JC.active_layer).modal('hide');
     $('#jky-delete').css('display', 'none');
     JC.delete_row (JC.row_id);
     JC.post_delete(JC.row_id);
     JC.display_rows();
};

JC.delete_row = function(row_id) {
     for( var  n=0; n<JC.rows.length; n++ ) {
          if(  JC.rows[n]['id'] == row_id ) {
               JC.rows.splice(n, 1);
               return;
          }
     }
};

JC.post_delete = function(row_id) {
};

//   Process Error -------------------------------------------------------------
JC.process_error = function(jq_XHR, type_error, exception) {
     $('#jky-loading').hide();
     if(  type_error == 'timeout' )
          JC.display_message('The request timeout, please re-try');
     else JC.display_message('Error type: ' + type_error + ', exception: ' + exception);
};

//   Process Comments ----------------------------------------------------------
JC.request_comments = function() {
     $('#jky-loading').show();
     var  data = {command:'get_comments', table:JC.table, id:JC.row_id};
     $.ajax({data:data, success:JC.display_comments});
};

JC.display_comments = function(data) {
     $('#jky-loading').hide();

     if(  data['status'] != 'ok' ) {
          JC.display_message(data['message']);
          return;
     }

     var  rows = data['rows'];
     var  html = '';
     for( var  n=0; n<rows.length; n++ ) {
          var  row = rows[n];
          var  created_at = row['created_at'].substr(5, 11);           //   get only mm-dd hh:mm
          html += '<div class="posted">Posted by <b>' + row['created_name'] + '</b> at <b>' + created_at + '</b></div>';
          html += '<br>' + row['comment'].replace(/\n/g, '<br>');
          html += '<br>';
     }

     html += '<br>';
     html += '<textarea id="comment" style="width:360px;"></textarea>';

     $('#jky-comments-body').html(html);
     $('#jky-comments').css('display', 'block');
};

JC.insert_comment = function() {
     var  comment = jky_get_value('comment');
     if(  comment != '' ) {
          var  data = {command:'add_comment', table:JC.table, id:JC.row_id, comment:comment};
          $.ajax({data:data}).success(function(data) {});
     }

     $('#jky-comments').css('display', 'none');
};

//   Process Sort Column Names -------------------------------------------------
JC.sort_by = function(name) {
     if(  typeof(name) != 'undefined' ) {
          if(  JC.sort_name == name )
               JC.sort_seq   = JC.sort_seq * -1;
          else JC.sort_name  = name;
     }

     if(  JC.sort_id )
          JC.sort_id.removeClass();
//   JC.sort_id = $('a[onclick=\'JC.sort_by("' + JC.sort_name + '")\']');
     JC.sort_id = $('a[onclick*="\"' + JC.sort_name + '\""]');
     JC.sort_id.addClass('sorted_' + (JC.sort_seq > 0 ? 'asc' : 'desc'));

     JC.rows.sort(function(a, b) {
          var  value_a = a[JC.sort_name];
          var  value_b = b[JC.sort_name];

          if(  isNaN(value_a) || isNaN(value_b) ) {
               if( !value_a )      value_a = '';
               if( !value_b )      value_b = '';
               if(  value_a < value_b ) return JC.sort_seq * -1;
               if(  value_a > value_b ) return JC.sort_seq *  1;
          } else {
               difference = value_a - value_b;
               if(  difference < 0 )    return JC.sort_seq * -1;
               if(  difference > 0 )    return JC.sort_seq *  1;
          }

          var  value_a = a['id'];
          var  value_b = b['id'];
          if(  value_a < value_b )      return JC.sort_seq * -1;
          if(  value_a > value_b )      return JC.sort_seq *  1;
          return 0;
     });
    JC.display_rows();
};

//   Utility -------------------------------------------------------------------

var closetimer = 0;
var ddmenuitem = 0;

//   open hidden layer
function mopen(id) {
     //   cancel close timer
     mcancelclosetime();

     //   close old layer
     if(  ddmenuitem )
          ddmenuitem.style.visibility = 'hidden';

     //   get new layer and show it
     ddmenuitem = document.getElementById(id);
     ddmenuitem.style.visibility = 'visible';
};

//   close showed layer
function mclose() {
     if(  ddmenuitem )
          ddmenuitem.style.visibility = 'hidden';
};

//   go close timer
function mclosetime() {
     closetimer = window.setTimeout('mclose()', 250);
};

//   cancel close timer
function mcancelclosetime() {
     if(  closetimer ) {
          window.clearTimeout(closetimer);
          closetimer = null;
     }
};

//   close layer when click-out
document.onclick = mclose;

//   sets active tab and inactive tabs for head_menu
//JC.set_navigation('menu', 'home', 'index');
//JC.set_sub_nav('home', 'index');

//   ---------------------------------------------------------------------------

var  INDEX          = '/';              //  var  INDEX = '/index.php/';
var  IMAGES         = 'img/layout/';
var  SERVER_NAME    =  document.location.protocol + '//' + document.location.host + '/';

var  is_IE          = (navigator.appName == 'Microsoft Internet Explorer');
var  is_FF          = (navigator.userAgent.indexOf('Firefox/') > -1);
var  is_CSS1        = (document.compatMode == 'CSS1Compat');

JC.event_cache = function() {
     var  listEvents = [];

     return {
          listEvents : listEvents
          , add        : function(node, sEventName, fHandler) {listEvents.push(arguments);}
          , flush      : function() {
               var  i, item;
               for( i=listEvents.length-1; i>=0; i-- ) {
                    item = listEvents[i];
                    if(  item[0].removeEventListener )      {item[0].removeEventListener(item[1], item[2], item[3]);};
                    if(  item[1].substring(0, 2) != 'on' )  {item[1] = 'on' + item[1];};
                    if(  item[0].detachEvent )              {item[0].detachEvent(item[1], item[2]);};
                    item[0][item[1]] = null;
               };
          }
     };
}();

JC.add_event = function(obj, type, fn) {
     if(  obj.addEventListener ) {
          obj.addEventListener(type, fn, false);
          JC.event_cache.add(obj, type, fn);
     } else
     if(  obj.attachEvent ) {
          obj['e' + type + fn] = fn;
          obj[type + fn] = function() {obj['e' + type + fn] (window.event);}
          obj.attachEvent('on' + type, obj[type + fn]);
          JC.event_cache.add(obj, type, fn);
     } else {
          obj['on' + type] = obj['e' + type + fn];
     }
};

JC.get_top = function(width, height) {
     var  position_top  = 0;
     var  position_left = 0;
     var  set_width     = 0;
     var  set_height    = 0;

     if(  typeof(window.innerWidth) == 'number' )           {set_width = window.innerWidth                    ; set_height = window.innerHeight                   ;}
     else if(  is_CSS1 )                                    {set_width = document.documentElement.clientWidth ; set_height = document.documentElement.clientHeight;}
     else                                                   {set_width = document.body.clientWidth            ; set_height = document.body.clientHeight           ;}

     if(  is_CSS1 )                                         {cur_width = document.documentElement.scrollWidth ; cur_height = document.documentElement.scrollHeight;}
     else                                                   {cur_width = document.body.scrollWidth            ; cur_height = document.body.scrollHeight           ;}

     if( !is_IE ) {          //   adjust width & height because of scroll bar for non-IE
          if(( set_width  - cur_width ) < 0 )       set_height -= 17;
          if(( set_height - cur_height) < 0 )       set_width  -= 17;
     }

     if(  set_height < height )      set_height = height;

     position_top = (set_height / 2) - (height / 2);
     return position_top;
};

JC.get_left = function(width, height) {
     var  position_top  = 0;
     var  position_left = 0;
     var  set_width     = 0;
     var  set_height    = 0;

     if(  typeof(window.innerWidth) == 'number' )           {set_width = window.innerWidth                    ; set_height = window.innerHeight                   ;}
     else if(  is_CSS1 )                                    {set_width = document.documentElement.clientWidth ; set_height = document.documentElement.clientHeight;}
     else                                                   {set_width = document.body.clientWidth            ; set_height = document.body.clientHeight           ;}

     if(  is_CSS1 )                                         {cur_width = document.documentElement.scrollWidth ; cur_height = document.documentElement.scrollHeight;}
     else                                                   {cur_width = document.body.scrollWidth            ; cur_height = document.body.scrollHeight           ;}

     if( !is_IE ) {          //   adjust width & height because of scroll bar for non-IE
          if(( set_width  - cur_width ) < 0 )       set_height -= 17;
          if(( set_height - cur_height) < 0 )       set_width  -= 17;
     }

     if(  set_width < width )        set_width = width;

     position_left = (set_width / 2) - (width / 2)
     return position_left;
};

JC.get_page_size = function() {
     var  x_scroll, y_scroll;

     if(  window.innerHeight && window.scrollMaxY ) {
          x_scroll = document.body.scrollWidth;
          y_scroll = window.innerHeight + window.scrollMaxY;
     } else
     if(  document.body.scrollHeight > document.body.offsetHeight ) {      // all but Explorer Mac
          x_scroll = document.body.scrollWidth ;
          y_scroll = document.body.scrollHeight;
     } else {      //   Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
          x_scroll = document.body.offsetWidth ;
          y_scroll = document.body.offsetHeight;
     }

     var  window_width, window_height;
     if(  self.innerHeight ) {    // all except Explorer
          window_width  = self.innerWidth ;
          window_height = self.innerHeight;
     } else
     if(  document.documentElement && document.documentElement.clientHeight ) {     // Explorer 6 Strict Mode
          window_width  = document.documentElement.clientWidth ;
          window_height = document.documentElement.clientHeight;
     } else
     if(  document.body ) {  // other Explorers
          window_width  = document.body.clientWidth ;
          window_height = document.body.clientHeight;
     }

//   for small pages with total height less then height of the viewport
     var  page_height;
     if(  y_scroll < window_height )
          page_height = window_height;
     else page_height = y_scroll;

//   for small pages with total width less then width of the viewport
     var  page_width;
     if(  x_scroll < window_width )
          page_width = window_width;
     else page_width = x_scroll;

     array_page_size = new Array(page_width, page_height, window_width, window_height);
     return array_page_size;
};

//   returns the necessary width of the overlay based on the window
JC.get_overlay_width = function() {
     var  array_page_size = JC.get_page_size();
     var  width  = array_page_size[2];

     if( !is_IE && array_page_size[3] < array_page_size[1] )
          width  -= 17;

     return width;
};

//   returns the necessary height of the overlay based on the window
JC.get_overlay_height = function() {
     var  array_page_size = JC.get_page_size();
     var  height = array_page_size[3];

     if( !is_IE && array_page_size[2] < array_page_size[0] )
          height -= 17;

     return height;
};

// set_focus('user-name')
// -----------------------------------------------------------------------------
JC.set_focus = function(name) {
    var  id = $('#' + name);
    if( !id || !id.is(':visible') ) {
        setTimeout("JC.set_focus('" + name + "')", 100);
    } else {
        id.focus();
        id.select();
    }
};

//        JC.display_message('any message')
//        ----------------------------------------------------------------------
JC.Xdisplay_message = function(message, refocus) {
	if (message === '')
		return;
	if (message.substr(0, 4) === '<br>')
		message = message.substr(4);

    message = jky_t(message);

    saved = $('#jky-message-body').html();
	message = saved + (saved.length === 0 ? '' : '<br>') + message;

	$('#jky-message-body').html(message);
//  $('#jky-message').modal('show');
	$('#jky-message').css('display', 'block');

	var time = Math.round(message.length / 12);
	if (time < 2.0)
		time = 2.0 ;
//  setTimeout("$('#jky-message').modal('hide');$('.modal-backdrop').css('opacity', '0.8');", time * 1000);
//  setTimeout("$('#jky-message').modal('hide');" + extra, time * 1000);
//  setTimeout("$('#jky-message').css('display', 'none');" + extra, time * 1000);
    setTimeout(function() {return JC.clear_message(refocus);}, time * 1000);
};

JC.clear_message = function(refocus) {
    $('#jky-message').css('display', 'none');
    $('#jky-message_body').html('');
    if (refocus !== 'undefined') {
        JC.set_focus(refocus);
    }
}

//   Set Languages -------------------------------------------------------------
JC.set_languages = function() {
     var  options = $('#en-speaking').html();
     if(  options == '' ) {
          setTimeout('JC.set_languages()', 100);
     } else {
          $('#en-reading' ).html(options);
          $('#en-writing' ).html(options);
          $('#ma-speaking').html(options);
          $('#ma-reading' ).html(options);
          $('#ma-writing' ).html(options);
          $('#tw-speaking').html(options);
          $('#tw-reading' ).html(options);
          $('#tw-writing' ).html(options);
     }
};

//        JC.set_option('title', 'Mr')
//        ----------------------------------------------------------------------
JC.set_option = function(name, value) {
     $('#' + name + ' option:selected').removeAttr('selected');
     if(  value ) {
          command = "$('#" + name + " option[ value=\"" + value + "\" ]').attr('selected', 'selected');";
          setTimeout(command, 100);
     }
};

//        jky_show_layer('login', 'user_name', 200)
//        ----------------------------------------------------------------------
JC.show_layer = function(layer, field, z_index) {
    var   layer_name = layer + '-layer' ;
    var  shadow_name = layer + '-shadow';
    var  jky_shadow = document.getElementById(shadow_name);
    if( !jky_shadow ) {
        jky_shadow = document.createElement('div');
        jky_shadow.setAttribute('id', shadow_name);
        jky_shadow.setAttribute('class', 'shadow');
        document.body.appendChild(jky_shadow);
    }

    $('#' + shadow_name).show().css('z-index', z_index  );
    $('#' +  layer_name).show().css('z-index', z_index+1);
    jky_set_focus(field);
    eval('setup_' + layer + '_data();');
};

//        JC.hide_layer('login')
//        ----------------------------------------------------------------------
JC.hide_layer = function(layer) {
    var   layer_name = layer + '-layer' ;
    var  shadow_name = layer + '-shadow';
    $('#' +  layer_name).hide();
    $('#' + shadow_name).hide();
};

$(function() {
    if (typeof JC.order_seq != 'undefined')     JC.sort_seq = JC.order_seq == 'ASC' ? 1 : -1;
    if (typeof JC.order_by  != 'undefined')     JC.sort_name= JC.order_by;
/*
//  apache  async=true
//  nginx   async=false     ==> async=true is nor working
    $.ajaxSetup ({async:true , cache:true, type:'post', dataType:'json', url:JC.ajax_url, error: JC.process_error});
//  $.ajaxSetup ({async:false, cache:true, type:'post', dataType:'json', url:JC.ajax_url, error: JC.process_error});

    JC.request_session();
    if (JC.action == 'confirm'  )       {JC.process_confirm(JC.user_key); JC.request_session();}
    if (JC.action == 'reset'    )       {JC.process_reset  (JC.user_key); JC.request_session();}
    JC.set_header_info();
    JC.set_header_menu();

    $('#jky-publish').button().click(JC.request_publish);
    $('#jky-export' ).button().click(JC.request_export );
    $('#jky-add-new').button().click(JC.display_add_new);

    $('#jky-loading').show();
    JC.select_setup();
    $('#jky-loading').hide();

//  $('#jky-filter' ).keyup (JC.request_filter);        //  it will double the request
    $('#jky-filter' ).change(JC.request_index );
    $('#jky-select' ).change(JC.request_index );
    $('#jky-display').change(JC.request_index );
*/
});

//        jky_util.js
//        ----------------------------------------------------------------------

//        jky_set_translations('portugues')
//        ----------------------------------------------------------------------
function  jky_set_translations(array) {
    translations = array;
}

//        jky_t('Home')
//        ----------------------------------------------------------------------
function  jky_t(text) {
return text;
     if( text == '' )
         return '';

     var result = translations[text];
     if( typeof result == 'undefined' ) {
         result = '';
         var names = text.split('<br>');
         for( var i=0; i<names.length; i++ ) {
             name = names[i];
             translation = translations[name];
             result += ( i == 0 ) ? '' : '<br>';
             if( typeof translation == 'undefined' ) {
                 result += name;
             } else {
                 result += translation;
             }
         }
     }
    return result;
}

//        jky_show_layer('login', 'user_name', 200)
//        ----------------------------------------------------------------------
function  jky_show_layer(layer, field, z_index) {
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
}

//        jky_hide_layer('login')
//        ----------------------------------------------------------------------
function  jky_hide_layer(layer) {
     var   layer_name = layer + '-layer' ;
     var  shadow_name = layer + '-shadow';
     $('#' +  layer_name).hide();
     $('#' + shadow_name).hide();
}

//        jky_set_focus('user_name')
//        ----------------------------------------------------------------------
function  jky_set_focus(name) {
     var  id = $('#' + name);
     if( !id || !id.is(':visible') ) {
          setTimeout("jky_set_focus('" + name + "')", 100);
     } else {
          id.focus();
          id.select();
     }
}

//        Xjky_display_message('any message')
//        ----------------------------------------------------------------------
function  Xjky_display_message(message, refocus) {
     if(  message == '' )
          return;
     if(  message.substr(0, 4) == '<br>' )
          message = message.substr(4);
     var  extra = '';
     if(  typeof(refocus) != 'undefined' )
          extra = 'jky_set_focus("' + refocus + '");';

     message = $('#jky-message-body').html() + '<br>' + message;

     $('#jky-message-body').html(message);
//   $('#jky-message').modal('show');
     $('#jky-message').css('display', 'block');

     var  time = Math.round(message.length / 15);
     if(  time < 2.0 )
          time = 2.0 ;
//   setTimeout("$('#jky-message').modal('hide');$('.modal-backdrop').css('opacity', '0.8');", time * 1000);
//   setTimeout("$('#jky-message').modal('hide');" + extra, time * 1000);
     setTimeout("$('#jky-message').css('display', 'none');" + extra, time * 1000);
}

//        jky_set_...
//        ----------------------------------------------------------------------
function  jky_set_is_zero          (name)              {return '<br>' + jky_t( name ) + ' ' + jky_t( 'is zero'        );}
function  jky_set_is_invalid       (name)              {return '<br>' + jky_t( name ) + ' ' + jky_t( 'is invalid'     );}
function  jky_set_is_required      (name)              {return '<br>' + jky_t( name ) + ' ' + jky_t( 'is required'    );}
function  jky_set_already_taken    (name)              {return '<br>' + jky_t( name ) + ' ' + jky_t( 'already taken'  );}
function  jky_set_not_found        (name)              {return '<br>' + jky_t( name ) + ' ' + jky_t( 'not found'      );}
function  jky_set_size_is_under    (name, size )       {return '<br>' + jky_t( name ) + ' ' + jky_t( 'size is under'  ) + ' [' + size  + ']';}
function  jky_set_size_is_above    (name, size )       {return '<br>' + jky_t( name ) + ' ' + jky_t( 'size is above'  ) + ' [' + size  + ']';}
function  jky_set_value_is_under   (name, value)       {return '<br>' + jky_t( name ) + ' ' + jky_t( 'value is under' ) + ' [' + value + ']';}
function  jky_set_value_is_above   (name, value)       {return '<br>' + jky_t( name ) + ' ' + jky_t( 'value is above' ) + ' [' + value + ']';}

//   Set Languages -------------------------------------------------------------
function  jky_set_languages() {
     var  options = $('#en-speaking').html();
     if(  options == '' ) {
          setTimeout('jky_set_languages()', 100);
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
}

//        email format xxx@xxx.xxx
function  jky_is_email(email) {
     var  pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
     return pattern.test(email);
}

//        date format mm/dd/yyyy
function  jky_is_date(date) {
     var  string = jky_str_replace('%2F', '/', date);
     var  dates  = string.split('/');
     var  mm   = parseInt(dates[0], 10);
     var  dd   = parseInt(dates[1], 10);
     var  yyyy = parseInt(dates[2], 10);
     var  new_date = new Date(yyyy, mm-1, dd);
     if(( new_date.getFullYear() == yyyy ) && ( new_date.getMonth() == mm-1 ) && ( new_date.getDate() == dd ))
          return true;
     else return false;
}
          
//        jky_str_replace
//        ----------------------------------------------------------------------
function  jky_str_replace(search, replace, subject, count) {
//   note: The count parameter must be passed as a string in order to find a global variable in which the result will be given
//   example 1:  jky_str_replace( ' ', '.', 'Kevin van Zonneveld' );                          //   returns 1: 'Kevin.van.Zonneveld'
//   example 2:  jky_str_replace([ '{name}', 'l' ], [ 'hello', 'm' ], '{name}, lars' );       //   returns 2: 'hemmo, mars'
     var  i     = 0
       ,  j     = 0
       ,  temp  = ''
       ,  repl  = ''
       ,  sl    = 0
       ,  fl    = 0
       ,  f     = [].concat(search )
       ,  r     = [].concat(replace)
       ,  s     = subject
       ,  ra    = Object.prototype.toString.call(r) === '[object Array]'
       ,  sa    = Object.prototype.toString.call(s) === '[object Array]'
       ;
     s = [].concat(s);
     if(  count ) {
          this.window[count] = 0;
     }

     for( i=0, sl=s.length; i<sl; i++ ) {
          if(  s[i] === '' ) {
               continue;
          }
          for( j=0, fl=f.length; j<fl; j++ ) {
               temp = s[i] + '';
               repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
               s[i] = (temp).split(f[j]).join(repl);
               if(  count && s[i] !== temp ) {
                    this.window[count] += (temp.length - s[i].length) / f[j].length;
               }
          }
     }
     return sa ? s : s[0];
}

//        jky_set_option('title', 'Mr')
//        ----------------------------------------------------------------------
function  jky_set_option(name, value) {
     $('#' + name + ' option:selected').removeAttr('selected');
     if(  value ) {
          command = "$('#" + name + " option[ value=\"" + value + "\" ]').attr('selected', 'selected');";
          setTimeout(command, 100);
     }
}

//        jky_set_options(20, 'All', 10, 20, 50, 100, 200, 500, 1000)
//        ----------------------------------------------------------------------
function  jky_set_options() {
     options   = '';
     set_value = arguments[0];

     for( var i=1; i<arguments.length; i++ ) {
          value = arguments[i];
          selected = (value == set_value) ? ' selected="selected"' : '';
          options += '<option value="' + value + '"' + selected + '>' + value + '</option>';
     }
     return options;
}

//        jky_set_radios(20, 'All', 10, 20, 50, 100, 200, 500, 1000)
//        ----------------------------------------------------------------------
function  jky_set_radios() {
     radios    = '';
     set_id    = arguments[0];
     set_value = arguments[1];

     for( var i=2; i<arguments.length; i++ ) {
          value = arguments[i];
          checked = (value == set_value) ? ' checked="checked"' : '';
          radios += '<input type="radio" id="' + set_id + '" name="' + set_id + '" value="' + value + '" ' + checked + '/>&nbsp;' + value + ' &nbsp; ';
     }
     return radios;
}

//        jky_set_checks('...', ..., '...')
//        ----------------------------------------------------------------------
function  jky_set_checks() {
     checks    = '';
     set_id    = arguments[0];

     for( var i=1; i<arguments.length; i++ ) {
          value = arguments[i];
          checks += '<input type="checkbox" id="' + set_id + '" name="' + set_id + '" value="' + value + '" ' + '/>&nbsp;' + value + ' <br>';
     }
     return checks;
}

//        ----------------------------------------------------------------------
function  jky_get_value(name) {
//alert('jky_get_value, name: ' + name);
     if( !$('#' + name).val())
          return '';
//     else return encodeURIComponent($('#' + name).val().trim());
     else return $('#' + name).val().trim();
}

//        ----------------------------------------------------------------------
function  jky_get_text(name) {
//alert('jky_get_text, name: ' + name);
    if(!$('#' + name).val())
        return '""';

    value = jky_htmlEntities($('#' + name).val().trim());
//    value = $('#' + name).val().trim();
    return '"' + value + '"';
}

//        ----------------------------------------------------------------------
//  special code to avoid javascript injection, intercept: & < > "
function jky_htmlEntities(str) {
    return String(str)
        .replace(/&/g, "*#"      )
        .replace(/</g, "*#lt;"   )
        .replace(/>/g, "*#gt;"   )
        .replace(/"/g, "*#quot;" )
        ;
}

//        ----------------------------------------------------------------------
//  special code to revert javascript injection, intercept: & < > "
function jky_htmlRevert(str) {
	return String(str)
		.replace(/&/g     , "&" )
		.replace(/&lt;/g  , "<" )
		.replace(/&gt;/g  , ">" )
		.replace(/&quot;/g, "/" )
		;
}

//        ----------------------------------------------------------------------
function  jky_get_yyyymmdd(name) {
     var  date = $('#' + name).val().trim();
//alert('date: ' + date);
     if(  date == '' )
          return 'null';
          
     var  dates = date.split('/');
     var  mm   = parseInt(dates[0], 10);
     var  dd   = parseInt(dates[1], 10);
     var  yyyy = parseInt(dates[2], 10);
     return '"' + yyyy + '/' + mm + '/' + dd + '"';
}

//        ----------------------------------------------------------------------
function  jky_get_ymd_hms(name) {
    var  datetime = $('#' + name).val().trim();
//alert('date: ' + date);
    if(  date == '' )
        return 'null';

    var names = datetime.split(' ');
    var date = names[0];
    var time = names[1];

    var  dates = date.split('/');
    var  mm   = parseInt(dates[0], 10);
    var  dd   = parseInt(dates[1], 10);
    var  yyyy = parseInt(dates[2], 10);

    var times = time.split(':');
    var hour  = parseInt(times[0], 10);
    var min   = parseInt(times[1], 10);

    return '"' + yyyy + '/' + mm + '/' + dd + ' ' + hour + ':' + min + ':00"';
}

//        ----------------------------------------------------------------------
function  jky_get_checked(name) {
     var  value = $('input[name=' + name + ']:checked').val();

//if(  name == 'boot_camp' )
//     alert('value: ' + value);

     if(  typeof value == 'undefined' )
          return 'null';
     else return '"' + value + '"';
}

//        ----------------------------------------------------------------------
function jky_get_file_type(full_name) {
     var  names  = full_name.split('.');
     var  length = names.length;
     if(  length > 1 )
          return names[length-1];
     else return '';
}

//        ----------------------------------------------------------------------
function  jky_get_date() {
     var  my_today = new Date();
     var  my_year  = my_today.getFullYear();
     var  my_month = my_today.getMonth() + 1;     if(  my_month < 10 )     my_month = '0' + my_month;
     var  my_day   = my_today.getDate ();         if(  my_day   < 10 )     my_day   = '0' + my_day  ;
     return my_month + '/' + my_day + '/' + my_year;
}

//        ----------------------------------------------------------------------
function  jky_fix_date(date) {
//alert('jky_fix_date: ' + date);
     if(  date == null )
          return '';
     else return date.substr(5, 2) + '/' + date.substr(8, 2) + '/' + date.substr(0, 4);
}

function  jky_mdy_hm(datetime) {
    if (datetime == null ) {
        return '';
    } else {
        return datetime.substr(5, 2) + '/' + datetime.substr(8, 2) + '/' + datetime.substr(0, 4) + ' ' + datetime.substr(11, 5);
    }
}

//  generate single Name Space
//  var JC = jky_name_space('JKY.core');
//  var JKY = JKY || {};                //  create namespace JKY
//  JKY.core = {};                      //  create object core
//  ----------------------------------------------------------------------------
function jky_name_space(string) {
	var parent = window;
	var names  = string.split('.');

	for (var i=0; i<names.length; i++) {
		name = names[i];
		parent[name] = parent[name] || {};
		parent = parent[name];
	}
	return parent;
}

//        ----------------------------------------------------------------------
function  jky_verify(field_name) {
	var  error = '';
	var  value = jky_get_value(field_name);

	if(  field_name == 'birth_date' ) {
		if(  value == '' )
			error += jky_set_is_required('Birth Date');
		else
		if( !jky_is_date( value ))
			error += jky_set_is_invalid ('Birth Date');
	}

	if(  field_name == 'category' ) {
		if(  value == '' ) {
			error += jky_set_is_required('Category');
		} else {
			var  where = '     Categories.company_id  = '  + JC.control_company
				+ ' AND Categories.parent_id   = "' + $('#parent_id').val() + '"'
				+ ' AND Categories.category    = "' + value + '"'
				;
			var  data  = {command:'get_id', table:JC.table, where:where};
			$.ajax({async:false, data:data}).success(function(data) {
				found_id = data['id'];
				if(  found_id && found_id != JC.row_id )
					error += jky_set_already_taken('Category');
			});
		}
	}

	if(  field_name == 'company_name' ) {
		if(  value == '' ) {
			error += jky_set_is_required('Company Name');
		} else {
			var  where = 'Companies.company_name = "'  + value + '"';
			var  data  = {command:'get_id', table:'Companies', where:where};
			$.ajax({async:false, data:data}).success(function(data) {
				found_id = data['id'];
				if(  found_id && found_id != JC.row_id )
					error += jky_set_already_taken('Company Name');
			});
		}
	}
	/*
	 if(  field_name == 'contact_name' ) {
	 if(  value == '' ) {
	 error += jky_set_is_required('Contact Name');
	 } else {
	 var  data = {command:'get_contact_id', contact_name:value};
	 $.ajax({async:false, data:data}).success(function(data) {
	 JC.contact_id = data['id'];
	 });
	 }
	 }
	 */
	if(  field_name == 'contact_email' ) {
		if(  value != '' && !jky_is_email(decodeURIComponent(value)))
			error += jky_set_is_invalid('Contact Email');
	}

	if(  field_name == 'control_name' ) {
		if(  value == '' ) {
			error += jky_set_is_required('Control Name');
		} else {
			var  where = 'Controls.company_id   = '  + JC.control_company
				+ ' AND Controls.control_set  = "' + $('#control_set').val() + '"'
				+ ' AND Controls.control_name = "' + value + '"'
				;
			var  data  = {command:'get_id', table:JC.table, where:where};
			$.ajax({async:false, data:data}).success(function(data) {
				found_id = data['id'];
				if(  found_id && found_id != JC.row_id )
					error += jky_set_already_taken('Control Name');
			});
		}
	}

	if(  field_name == 'email_address' ) {
		if(  value != '' && !jky_is_email(decodeURIComponent(value)))
			error += jky_set_is_invalid('Email Address');
	}

	if(  field_name == 'en_us' ) {
		if(  value == '' )
			error += jky_set_is_required('English ');
		else
		if(  value.length > 99 ) {
			error += jky_set_size_is_above('English ', 99);
		} else {
			var  where = ' Translations.locale = "en_us"'
				+ ' AND Translations.sentence = "' + value + '"'
				;
			var  data  = {command:'get_id', table:JC.table, where:where};
			$.ajax({async:false, data:data}).success(function(data) {
				found_id = data['id'];
				if(  found_id && found_id != JC.row_id )
					error += jky_set_already_taken('English ');
			});
		}
	}

	if(  field_name == 'event_name' ) {
		if(  value == '' )
			error += jky_set_is_required('Event Name');
		else
		if(  value.length > 60 ) {
			error += jky_set_size_is_above('Event Name', 60);
		} else {
			var  where = '     Events.company_id    =  ' + JC.control_company
				+ ' AND Events.event_name    = "' + value + '"'
				;
			var  data  = {command:'get_id', table:JC.table, where:where};
			$.ajax({async:false, data:data}).success(function(data) {
				found_id = data['id'];
				if(  found_id && found_id != JC.row_id )
					error += jky_set_already_taken('Event Name');
			});
		}
	}

	if(  field_name == 'first_name' ) {
		if(  value == '' )
			error += jky_set_is_required('First Name');
		else
		if(  value.length > 40 )
			error += jky_set_size_is_above('First Name', 40);
	}

	if(  field_name == 'group_name' ) {
		if(  value == '' )
			error += jky_set_is_required('Group Name');
		else
		if(  value.length > 60 ) {
			error += jky_set_size_is_above('Group Name', 60);
		} else {
			var  where = '     Groups.event_id      = '  + JC.event_id
				+ ' AND Groups.group_name    = "' + value + '"'
				;
			var  data  = {command:'get_id', table:JC.table, where:where};
			$.ajax({async:false, data:data}).success(function(data) {
				found_id = data['id'];
				if(  found_id && found_id != JC.row_id )
					error += jky_set_already_taken('Group Name');
			});
		}
	}

	if(  field_name == 'last_name' ) {
		if(  value == '' )
			error += jky_set_is_required('Last Name');
		else
		if(  value.length > 40 )
			error += jky_set_size_is_above('Last Name', 40);
	}

	if(  field_name == 'next_number' ) {
		if(  value == '' )
			error += jky_set_is_required('Next Number');
		else
		if(  isNaN( value ))
			error += jky_set_is_invalid ('Next Number');
	}

	if(  field_name == 'pastor_email' ) {
		if(  value != '' && !jky_is_email(decodeURIComponent(value)))
			error += jky_set_is_invalid('Pastor Email');
	}

	if(  field_name == 'sequence' ) {
		if(  value == '' )
			error += jky_set_is_required('Sequence');
		else
		if(  isNaN( value ))
			error += jky_set_is_invalid ('Sequence');
	}

	if(  field_name == 'setting_name' ) {
		if(  value == '' ) {
			error += jky_set_is_required('Setting Name');
		} else {
			var  where = 'Settings.company_id   = '  + JC.control_company
				+ ' AND Settings.setting_set  = "' + $('#setting_set').val() + '"'
				+ ' AND Settings.setting_name = "' + value + '"'
				;
			var  data  = {command:'get_id', table:JC.table, where:where};
			$.ajax({async:false, data:data}).success(function(data) {
				found_id = data['id'];
				if(  found_id && found_id != JC.row_id )
					error += jky_set_already_taken('Setting Name');
			});
		}
	}

	if(  field_name == 'start_date' ) {
		if(  value == '' )
			error += jky_set_is_required('Start Date');
		else
		if( !jky_is_date( value ))
			error += jky_set_is_invalid ('Start Date');
	}

	if(  field_name == 'template_name' ) {
		if(  value == '' ) {
			error += jky_set_is_required('Template Name');
		} else {
			var  data  = {command:'get_id', table:JC.table, where:'template_name="' + value + '"'};
			$.ajax({async:false, data:data}).success(function(data) {
				found_id = data['id'];
				if(  found_id && found_id != JC.row_id )
					error += jky_set_already_taken('Template Name');
			});
		}
	}

	if(  field_name == 'user_email' ) {
		if(  value != '' && !jky_is_email(decodeURIComponent(value)))
			error += jky_set_is_invalid('Email Address');
	}

	switch(field_name) {
		case('description'       ) :  if(  value == ''                   )    error += jky_set_is_required(        'Description'); break;

		case('cut_off_date'      ) :  if(  value == ''                   )    error += jky_set_is_required(       'Cut Off Date'); break;
		case('end_date'          ) :  if(  value == ''                   )    error += jky_set_is_required(           'End Date'); break;

		case('template_body'     ) :  if(  value == ''                   )    error += jky_set_is_required(      'Template Body'); break;
		case('template_subject'  ) :  if(  value == ''                   )    error += jky_set_is_required(   'Template Subject'); break;

		case('us_fee_week1'      ) :  if(  value == '' || isNaN(value)   )    error += jky_set_is_invalid (      'US Fee Week 1'); break;
		case('us_fee_week2'      ) :  if(  value == '' || isNaN(value)   )    error += jky_set_is_invalid (      'US Fee Week 2'); break;
		case('us_fee_week3'      ) :  if(  value == '' || isNaN(value)   )    error += jky_set_is_invalid (      'US Fee Week 3'); break;

		case('tw_fee_week1'      ) :  if(  value == '' || isNaN(value)   )    error += jky_set_is_invalid (  'Taiwan Fee Week 1'); break;
		case('tw_fee_week2'      ) :  if(  value == '' || isNaN(value)   )    error += jky_set_is_invalid (  'Taiwan Fee Week 2'); break;
		case('tw_fee_week3'      ) :  if(  value == '' || isNaN(value)   )    error += jky_set_is_invalid (  'Taiwan Fee Week 3'); break;

		case('phone_number'      ) :  if(  value == ''                   )    error += jky_set_is_required(       'Phone Number'); break;
		case('street'            ) :  if(  value == ''                   )    error += jky_set_is_required(             'Street'); break;
		case('city'              ) :  if(  value == ''                   )    error += jky_set_is_required(               'City'); break;
		case('zip'               ) :  if(  value == ''                   )    error += jky_set_is_required(                'Zip'); break;
//        case('state'             ) :  if(  value == ''                   )    error += jky_set_is_required(              'State'); break;
		case('country'           ) :  if(  value == ''                   )    error += jky_set_is_required(            'Country'); break;

		case('arrival_flight'    ) :  if(  value == ''                   )    error += jky_set_is_required(    'Arrival Flight#'); break;
		case('arrival_time'      ) :  if(  value == ''                   )    error += jky_set_is_required(  'Arrival Date&Time'); break;
		case( 'depart_flight'    ) :  if(  value == ''                   )    error += jky_set_is_required(     'Depart Flight#'); break;
		case( 'depart_time'      ) :  if(  value == ''                   )    error += jky_set_is_required(   'Depart Date&Time'); break;

		case('school_year'       ) :  if(  value == ''                   )    error += jky_set_is_required(        'School Year'); break;
		case('school_name'       ) :  if(  value == ''                   )    error += jky_set_is_required(        'School Name'); break;

		case('contact_name'      ) :  if(  value == ''                   )    error += jky_set_is_required(       'Contact Name'); break;
		case('contact_phone'     ) :  if(  value == ''                   )    error += jky_set_is_required(      'Contact Phone'); break;
		case('contact_email'     ) :  if(  value == ''                   )    error += jky_set_is_required(      'Contact Email'); break;
		case('relationship'      ) :  if(  value == ''                   )    error += jky_set_is_required(       'Relationship'); break;

		case('pastor_name'       ) :  if(  value == ''                   )    error += jky_set_is_required(        'Pastor Name'); break;
		case('pastor_phone'      ) :  if(  value == ''                   )    error += jky_set_is_required(       'Pastor Phone'); break;
		case('pastor_email'      ) :  if(  value == ''                   )    error += jky_set_is_required(       'Pastor Email'); break;
		case('church_name'       ) :  if(  value == ''                   )    error += jky_set_is_required(        'Church Name'); break;

		case('total_targeted'    ) :  if(  value == '' || isNaN(value)   )    error += jky_set_is_invalid (     'Total Targeted'); break;
		case('total_applied'     ) :  if(  value == '' || isNaN(value)   )    error += jky_set_is_invalid (      'Total Applied'); break;
		case('total_approved'    ) :  if(  value == '' || isNaN(value)   )    error += jky_set_is_invalid (     'Total Approved'); break;
		case('total_arrived'     ) :  if(  value == '' || isNaN(value)   )    error += jky_set_is_invalid (      'Total Arrived'); break;
		case('total_departed'    ) :  if(  value == '' || isNaN(value)   )    error += jky_set_is_invalid (     'Total Departed'); break;

		case('helper_number'     ) :  if(  value == '' || isNaN(value)   )    error += jky_set_is_invalid (      'Helper Number'); break;
		case('helper_age'        ) :  if(  value == '' || isNaN(value)   )    error += jky_set_is_invalid (         'Helper Age'); break;
	}

	return error;
}

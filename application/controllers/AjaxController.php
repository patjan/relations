<?
/**
 *   Process all [Ajax] functions
 *   This controller will be used to interface client to mysql using Ajax
 *   @author: Pat Jan
 *
 *   status = 'ok'
 *   status = 'error'
 *
 *   message = 'table name [X...x] is undefined'
 *   message = 'method name [ X...x ] is undefined'
 *   message = 'error on server'             (only for no support)
 *   message = 'error on mysql: x...x'       (only for support)
 *   message = 'duplicate id'
 *
 */
class     AjaxController
extends   JKY_Controller {

public function init() {
    $this->_helper->layout()->disableLayout();
    $this->_helper->viewRenderer->setNoRender();

//	set_session('user_level', MINIMUM_TO_BROWSE  );
	set_session('user_level', MINIMUM_TO_SUPPORT );
	set_session('user_role' , 'support'  );
	set_session('full_name' , 'Pat Jan'  );
	set_session('user_id'	, 1000000001 );

	if (!is_session('control_company'	))		set_session('control_company'	, COMPANY_ID);
	if (!is_session('user_time'			))		set_session('user_time'			, date( 'Y-m-d H:i:s'));
	if (!is_session('user_role'			))		set_session('user_role'			, 'visitor');
	if (!is_session('event_id'			)) {
//		set_session('event_id'	, $this->get_last_id('Events', 'status="active"'));
//		set_session('event_name', get_table_value('Events', 'event_name', get_session('event_id')));
	}
	if (!is_session('permissions'		))		set_permissions(get_session('user_role'));

}

public function indexAction() {
	try {
		$request	= Zend_Controller_Front::getInstance()->getRequest();
		$controller	= $request->getControllerName();
		$action		= $request->getActionName();
		logger($controller);

		$data = json_decode(get_request('data'), true);
//		$method = get_request('method');
		$method = $data['method'];
		switch ($method) {
			case 'set_language'		: $this->set_language	(); return;
			case 'get_language'		: $this->get_language	(); return;
			case 'set_session'		: $this->set_session	(); return;
			case 'get_session'		: $this->get_session	(); return;
			case 'get_groups'		: $this->get_groups		(); return;
			case 'get_users'		: $this->get_users		(); return;
			case 'get_options'		: $this->get_options	(); return;
			case 'get_soptions'		: $this->get_soptions	(); return;
			case 'get_categories'	: $this->get_categories	(); return;
			case 'get_profile'		: $this->get_profile	(); return;
			case 'get_contact'		: $this->get_contact	(); return;
			case 'get_contact_id'	: $this->get_contact_id	(); return;
			case 'get_user_id'		: $this->get_user_id	(); return;
			case 'set_company_id'	: $this->set_company_id	(); return;
			case 'get_company_id'	: $this->get_company_id	(); return;
			case 'set_user_id'		: $this->set_user_id	(); return;
			case 'set_event_id'		: $this->set_event_id	(); return;
			case 'set_group_id'		: $this->set_group_id	(); return;

//			case 'get_user_screen'	: $this->get_user_screen(); return;
//			case 'get_header'		: $this->get_header		(); return;
//			case 'get_menus'		: $this->get_menus		(); return;

			case 'check_session'	: $this->check_session	(); return;
			case 'log_in'			: $this->log_in			($data); return;
			case 'log_out'			: $this->log_out		(); return;
			case 'log_help'			: $this->log_help		(); return;
			case 'profile'			: $this->profile		(); return;
			case 'sign_up'			: $this->sign_up		(); return;
			case 'confirm'			: $this->confirm		(); return;
			case 'reset'			: $this->reset			(); return;

			case 'send_email'		: $this->send_email		(); return;
			case 'send_receipt'		: $this->send_receipt	(); return;
		}

		$table = get_request('table');
		$user_action = get_user_action($table);
		if ($user_action == '') {
			$user_action = get_user_action('All');
		}

	set_session('user_action', $user_action);

	//	for undefined resource or denied user_action
	if ($user_action == '' or $user_action == 'Denied') {
		$this->echo_error('resource [' . $table . '] is denied with action: ' . $user_action);
		return;
	}

	if ($user_action != 'All') {
		switch ($method) {
/*
			case 'get_names'	: $required = 'View Insert Update Delete Export'; break;
			case 'get_id'		: $required = 'View Insert Update Delete Export'; break;
			case 'get_count'	: $required = 'View Insert Update Delete Export'; break;
			case 'get_value'	: $required = 'View Insert Update Delete Export'; break;
			case 'get_row'		: $required = 'View Insert Update Delete Export'; break;
			case 'get_rows'		: $required = 'View Insert Update Delete Export'; break;

			case 'get_index'	: $required = 'View Insert Update Delete Export'; break;
			case 'get_comments'	: $required = 'View Insert Update Delete Export'; break;
			case 'add_comment'	: $required = 'View Insert Update Delete Export'; break;
*/
			case 'get_names'	: $required = 'View'	; break;
			case 'get_id'		: $required = 'View'	; break;
			case 'get_count'	: $required = 'View'	; break;
			case 'get_value'	: $required = 'View'	; break;
			case 'get_row'		: $required = 'View'	; break;
			case 'get_rows'		: $required = 'View'	; break;

			case 'get_index'	: $required = 'View'	; break;
			case 'get_comments'	: $required = 'View'	; break;
			case 'add_comment'	: $required = 'View'	; break;    //  ???? Update

			case 'get_columns'	: $required = 'Export'	; break;

			case 'insert'		: $required = 'Insert'	; break;
			case 'update'		: $required = 'Update'	; break;
			case 'delete'		: $required = 'Delete'	; break;
			case 'combine'		: $required = 'Combine'	; break;
			case 'publish'		: $required = 'Publish'	; break;
			case 'export'		: $required = 'Export'	; break;

			default				: $this->echo_error('method name [' . $method . '] is undefined'); return;
		}

	       //   for undefined user_action
//               if(  strpos($required, $user_action) === false ) {
	       if ($required != 'View' and strpos($user_action, $required) === false ) {
		   $this->echo_error('method name [' . $method . '] is denied, action: ' . $user_action . ', required: ' . $required);
		   return;
	       }
	  }

	switch( $method ) {
	    case 'get_names'    : $this->get_names      (); break;
	    case 'get_id'       : $this->get_id         (); break;
	    case 'get_count'    : $this->get_count      (); break;
	    case 'get_value'    : $this->get_value      (); break;
	    case 'get_row'      : $this->get_row        (); break;
	    case 'get_rows'     : $this->get_rows       (); break;
	    case 'get_index'    : $this->get_index      ($data); break;
	    case 'get_comments' : $this->get_comments   (); break;
	    case 'add_comment'  : $this->add_comment    (); break;
	    case 'get_columns'  : $this->get_columns    (); break;
	    case 'insert'       : $this->insert         (); break;
	    case 'update'       : $this->update         (); break;
	    case 'delete'       : $this->delete         (); break;
	    case 'combine'      : $this->combine        (); break;
	    case 'publish'      : $this->publish        (); break;
	    case 'export'       : $this->get_index      (); break;
	    case 'refresh'      : $this->refresh        (); break;

	    case 'set_amount'   : $this->set_amount     (); break;
	    case 'reset_amount' : $this->reset_amount   (); break;

	    default             : $this->echo_error( 'method name [' . $method . '] is undefined' ); return;
	}

//        process insert duplicate
//        process limit number of rows

	  return;

     } catch( Exception $exp ){
//          if(  get_session( 'user_level' ) == MINIMUM_TO_SUPPORT )
	       $this->echo_error( '' . $exp );
//          else $this->echo_error( 'error on server' );
     }
}

/*
 *   get security
 *   if
 *
 *   return where
 */
     private function get_security($table, $where) {
	  if(  get_session('user_action') == 'All' ) {
	       return $where;
	  }

	  switch( $table ) {
	       case 'Persons'      : return       'Persons.id=' . get_session('user_id');
	       case 'Services'     : return 'Services.user_id=' . get_session('user_id') . ' AND Services.event_id=' . get_session('event_id');
	       default             : return $where;
	  }
     }

/*
 *   $.ajax({ method: get_names, table: x...x, field: x...x, key: x...x });
 *
 *   return: [ x...x, ..., x...x ]
 */
private function get_names() {
     $table = get_request( 'table' );
     $field = get_request( 'field' );
     $key   = get_request( 'key'   );
     $data  = '';

     if(  $key != '' ) {
	  $sql = 'SELECT '    . $field . ' AS value'
	       . '  FROM '    . $table
	       . ' WHERE '    . $field . ' LIKE "%' . $key . '%"'
	       . ' ORDER BY ' . $field
	       . ' LIMIT 0, 10'
	       ;
	  $db   = Zend_Registry::get( 'db' );
	  $rows = $db->fetchAll( $sql );

	  $prepen = '';
	  foreach( $rows as $row ) {
	       $data  .= $prepen . '"' . $row[ 'value' ] . '"';
	       $prepen = ', ';
	  }
     }
     echo '[' . $data . ']';
}

/*
 *   $.ajax({ method: get_user_screen, name: x...x });
 *
 *   return: [ x...x, ..., x...x ]
 */
private function get_user_screen() {
     $name  = get_request( 'name'  );

     $sql = 'SELECT value'
	  . '  FROM Controls'
	  . ' WHERE control_set  = "User Screens"'
	  . '   AND control_name = "' . $name . '"'
	  ;
//$this->log_sql( null, 'get_user_screen', $sql );
     $db  = Zend_Registry::get( 'db' );
     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'page'     ] = $db->fetchOne( $sql );
     echo json_encode( $return );
}

/*
 *   $.ajax({ method: get_id, table: x...x, where: x...x });
 *
 *   status: ok
 *       id: 9...9 (false)
 */
private function get_id() {
     $table = get_request('table');
     $where = $this->get_security($table, get_request('where'));

     if(  $where == '' ) {
	  $this->echo_error( 'missing [where] statement' );
	  return;
     }

     $sql = 'SELECT id'
	  . '  FROM ' . $table
	  . ' WHERE ' . $where
	  ;
//$this->log_sql( $table, 'get_id', $sql );
     $db  = Zend_Registry::get( 'db' );
     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'id'       ] = $db->fetchOne( $sql );
     echo json_encode( $return );
}

/*
 *   $.ajax({ method: get_count, table: x...x [, where: x...x] });
 *
 *   status: ok
 *    count: 9...9
 */
private function get_count() {
     $table = get_request('table');
     $where = $this->get_security($table, get_request('where'));

     if(  $where != '' ) {
	  $where = ' WHERE ' . $where;
     }

     $sql = 'SELECT COUNT(*) AS count'
	  . '  FROM ' . $table
	  . $where
	  ;

     $db  = Zend_Registry::get( 'db' );
     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'count'    ] = $db->fetchOne( $sql );
     echo json_encode( $return );
}

/*
 *   $.ajax({ method: get_value, table: x...x, field:x...x, where: x...x });
 *
 *   status: ok
 *    value: x...x (false)
 */
private function get_value() {
     $table = get_request( 'table' );
     $field = get_request( 'field' );
     $where = $this->get_security($table, get_request('where'));

     if(  $field == '' ) {
	  $this->echo_error( 'missing [field] statement' );
	  return;
     }

     if(  $where == '' ) {
	  $this->echo_error( 'missing [where] statement' );
	  return;
     }

     $sql = 'SELECT ' . $field
	  . '  FROM ' . $table
	  . ' WHERE ' . $where
	  ;
     $db  = Zend_Registry::get( 'db' );
     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'value'    ] = $db->fetchOne( $sql );
     echo json_encode( $return );
}

/*
 *   $.ajax({ method: get_row, table: x...x, where: x...x });
 *
 *   status: ok
 *      row: { x...x: y...y, ... } (false)
 */
private function get_row() {
     $table = get_request('table');
     $where = $this->get_security($table, get_request('where'));

     if(  $where == '' ) {
	  $this->echo_error( 'missing [where] statement' );
	  return;
     }

     $sql = 'SELECT ' . $table . '.*' . $this->set_new_fields( $table )
	  . '  FROM ' . $table        . $this->set_left_joins( $table )
	  . ' WHERE ' . $where
	  ;
//$this->log_sql( $table, 'get_row', $sql );
     $db  = Zend_Registry::get( 'db' );
     $row = $db->fetchRow( $sql );

if(  $table == 'Categories' ) {
     $sql = 'SELECT COUNT(*) FROM Categories WHERE parent_id = ' . $row[ 'id' ];
     $row[ 'children' ] = $db->fetchOne( $sql );
}

     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'row'      ] = $row;
     echo json_encode( $return );
}

/*
 *   $.ajax({ method: get_rows, table: x...x [, where: x...x] [, order_by: x...x] });
 *
 *   status: ok
 *     rows: [{ x...x: y...y, ... } (false)
 *           ,{ x...x: y...y, ... }
 *           ,{ x...x: y...y, ... }
 *           ]
 */
private function get_rows() {
     $table = get_request('table');
     $where = $this->get_security($table, get_request('where'));
     $order_by = get_request('order_by');

     if(  $where    != '' )        $where    = ' WHERE '    . $where   ;
     if(  $order_by != '' )        $order_by = ' ORDER BY ' . $order_by;

     $sql = 'SELECT ' . $table . '.*' . $this->set_new_fields( $table )
	  . '  FROM ' . $table        . $this->set_left_joins( $table )
	  . $where
	  . $order_by
	  ;
$this->log_sql( $table, 'get_rows', $sql );
     $db  = Zend_Registry::get( 'db' );
     $rows = $db->fetchAll( $sql );

if(  $table == 'Categories' ) {
     $n = 0;
     foreach( $rows as $row ) {
	  $sql = 'SELECT COUNT(*) FROM Categories WHERE parent_id = ' . $row[ 'id' ];
	  $rows[ $n ][ 'children' ] = $db->fetchOne( $sql );
	  $n++;
     }
}

     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'rows'     ] = $rows;
     echo json_encode( $return );
}

/*
 *   $.ajax({ method: get_index, table: x...x, filter: x...x, select: x...x, display: x...x, order_by: x...x, specific: x...x });
 *
 *   status: ok
 *     rows: [{ x...x: y...y, ... } (false)
 *           ,{ x...x: y...y, ... }
 *           ,{ x...x: y...y, ... }
 *           ]
 */
private function get_index($data) {
//     if(  get_session('user_action') != 'All' ) {
//          return;
//     }

	$table    = get_data($data, 'table'		);
	$filter   = get_data($data, 'filter'	);
	$select   = get_data($data, 'select'	);
	$display  = get_data($data, 'display'	);
	$order_by = get_data($data, 'order_by'	);
	$specific = get_data($data, 'specific'	);

	$where = '';

	if ($specific != '' )
		$where .= $this->set_specific( $table, $specific );

	if ($select != 'All' )
		$where .= $this->set_select( $table, $select );

	if ($filter != '' ) {
		$filters = explode( ' and ', $filter );
		foreach( $filters as $filter )
			$where .= $this->set_where( $table, $filter );
	}

	if (is_numeric( $display ))
		$limit = ' LIMIT ' . $display;
	else $limit = '';

	if ($where    != '' )        $where    = ' WHERE 1 '  . $where   ;
	if ($order_by != '' )        $order_by = ' ORDER BY ' . $order_by;

	$sql = 'SELECT ' . $table . '.*' . $this->set_new_fields( $table )
		 . '  FROM ' . $table        . $this->set_left_joins( $table )
		 . $where
		 . $order_by
		 . $limit
		 ;
$this->log_sql( $table, 'get_index', $sql );
     $db   = Zend_Registry::get( 'db' );
     $rows = $db->fetchAll( $sql );

if(  $table == 'Categories' ) {
     $n = 0;
     foreach( $rows as $row ) {
	  $sql = 'SELECT COUNT(*) FROM Categories WHERE parent_id = ' . $row[ 'id' ];
	  $rows[ $n ][ 'children' ] = $db->fetchOne( $sql );
	  $n++;
     }
}

     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'rows'     ] = $rows;
     $this->echo_json( $return );
}

private function set_specific( $table, $specific ) {
    $return = '';
    if ($table == 'Groups'          && $specific == 'event_id'      )       $return .= ' AND   Groups.event_id   = ' . get_session(   'event_id' );
    if ($table == 'Services'        && $specific == 'event_id'      )       $return .= ' AND Services.event_id   = ' . get_session(   'event_id' );
    if ($table == 'Services'        && $specific == 'fee_amount'    )       $return .= ' AND Services.fee_amount > 0';
    if ($table == 'Translations'    && $specific == 'locale'        )       $return .= ' AND Translations.locale = "en_us"';
    if ($table == 'Persons'         && $specific == 'organ_id'      )       $return .= ' AND    Persons.organ_id = ' . get_session( 'organ_id' );
//    if(  $specific ==  'parent_id' )  $return .= ' AND Categories.parent_id = ' . get_session(  'parent_id' );

     return $return;
}

private function set_select( $table, $select ) {
//     if(  $select == '*' or $select == 'All' )         return '';
     if(  $select == 'All' )         return '';

     $return = '';
     if(  $table == 'Categories'   )    $return = ' AND         Parent.category      = "' . $select . '"';
     if(  $table == 'Controls'     )    $return = ' AND       Controls.control_set   = "' . $select . '"';
     if(  $table == 'Companies'    )    $return = ' AND      Companies.status        = "' . $select . '"';
     if(  $table == 'Events'       )    $return = ' AND         Events.status        = "' . $select . '"';
     if(  $table == 'Groups'       )    $return = ' AND         Groups.status        = "' . $select . '"';
     if(  $table == 'Permissions'  )    $return = ' AND    Permissions.user_resource = "' . $select . '"';
     if(  $table == 'Services'     )    $return = ' AND         Groups.id            = "' . $select . '"';
     if(  $table == 'Settings'     )    $return = ' AND       Settings.setting_set   = "' . $select . '"';
     if(  $table == 'Summary'      )    $return = ' AND        Summary.group_by      = "' . $select . '"';
     if(  $table == 'Templates'    )    $return = ' AND      Templates.template_type = "' . $select . '"';
     if(  $table == 'Tickets'      )    $return = ' AND        Tickets.status        = "' . $select . '"';
     if(  $table == 'Translations' )    $return = ' AND   Translations.status        = "' . $select . '"';
     if(  $table == 'Persons'      )    $return = ' AND        Persons.user_role     = "' . $select . '"';

     return $return;
}

private function set_new_fields( $table ) {
     $return = '';
     if(  $table == 'Categories'   )    $return = ',    Parent.category         AS   parent_name';
     if(  $table == 'Companies'    )    $return = ',   Contact.full_name        AS  contact_name';
     if(  $table == 'Services'     )    $return = ',   Persons.full_name        AS     full_name'
						. ',   Persons.first_name       AS    first_name'
						. ',   Persons.last_name        AS     last_name'
						. ',   Persons.user_email       AS    user_email'
						. ',   Persons.avatar           AS        avatar'
						. ',    Groups.group_name       AS    group_name';
     if(  $table == 'Templates'    )    $return = ',   Created.full_name        AS  created_name';
     if(  $table == 'Tickets'      )    $return = ',    Opened.full_name        AS   opened_name'
						. ',    Closed.full_name        AS   closed_name'
						. ',  Assigned.full_name        AS assigned_name';
     if(  $table == 'Persons'      )    $return = ',   Support.full_name        AS  support_name'
						. ', Companies.company_name     AS  company_name';

//   special code to append fields from Persons to Services table
     if(  get_request( 'method' ) == 'export' ) {
	  if(  $table   == 'Services' ) {
	       $sql  = 'SHOW COLUMNS FROM Persons WHERE Field != "id" AND Field != "created_by" AND Field != "created_at" AND Field != "updated_by" AND Field != "updated_at" AND Field != "status" AND Field != "completed"';
	       $db   = Zend_Registry::get( 'db' );
	       $cols = $db->fetchAll( $sql );
	       foreach( $cols as $col ) {
		    $return .= ', Persons.' . $col[ 'Field' ] . ' AS ' . $col[ 'Field' ];
	       }
	  }
     }

     return $return;
}

private function set_left_joins( $table ) {
     $return = '';
     if(  $table == 'Categories'   )    $return = '  LEFT JOIN  Categories AS Parent      ON    Parent.id = Categories.parent_id';
     if(  $table == 'Companies'    )    $return = '  LEFT JOIN     Persons AS Contact     ON   Contact.id =  Companies.contact_id';
     if(  $table == 'Services'     )    $return = '  LEFT JOIN     Persons                ON   Persons.id =   Services.user_id'
						. '  LEFT JOIN      Groups                ON    Groups.id =   Services.group_id';
     if(  $table == 'Templates'    )    $return = '  LEFT JOIN     Persons AS Created     ON   Created.id =  Templates.created_by';
     if(  $table == 'Tickets'      )    $return = '  LEFT JOIN     Persons AS Opened      ON    Opened.id =    Tickets.opened_by'
						. '  LEFT JOIN     Persons AS Closed      ON    Closed.id =    Tickets.closed_by'
						. '  LEFT JOIN     Persons AS Assigned    ON  Assigned.id =    Tickets.assigned_to';
     if(  $table == 'Persons'        )    $return = '  LEFT JOIN     Persons AS Support     ON   Support.id =    Persons.support_id'
						. '  LEFT JOIN   Companies                ON Companies.id =    Persons.company_id';
     return $return;
}

private function set_where( $table, $filter ) {
     $filter = strtolower( $filter );
     $filter = trim( $filter );
     if(  $filter == '' )
	  return '';

     $names = explode( '=', $filter, 2 );
     if(  count( $names ) == 2 ) {
	  $name  =        trim( $names[ 0 ]);
	  $value = '"%' . trim( $names[ 1 ]) . '%"';

	  if(  $table == 'Categories' ) {
	       if(  $name == 'sequence'
	       or   $name == 'category' )
		    if(  $value == '"%null%"' )
			 return ' AND Categories.' . $name . ' IS NULL ';
		    else return ' AND Categories.' . $name . ' LIKE ' . $value;
	       else
	       if(  $name == 'parent_name' )
		    if(  $value == '"%null%"' )
			 return ' AND Categories.parent_id  IS NULL';
		    else return ' AND     Parent.category   LIKE ' . $value;
	  }

	  if(  $table == 'Companies' ) {
	       if(  $name == 'company_name'
	       or   $name == 'company_number'
	       or   $name == 'phone'
	       or   $name == 'fax'
	       or   $name == 'street'
	       or   $name == 'city'
	       or   $name == 'state'
	       or   $name == 'zip'
	       or   $name == 'country' )
		    if(  $value == '"%null%"' )
			 return ' AND Companies.' . $name . ' IS NULL ';
		    else return ' AND Companies.' . $name . ' LIKE ' . $value;
	       else
	       if(  $name == 'contact_name' )
		    if(  $value == '"%null%"' )
			 return ' AND Companies.contact_id  IS NULL';
		    else return ' AND   Contact.full_name   LIKE ' . $value;
	  }

	  if(  $table == 'Controls' ) {
	       if(  $name == 'control_set'
	       or   $name == 'sequence'
	       or   $name == 'control_name'
	       or   $name == 'control_value' )
		    if(  $value == '"%null%"' )
			 return ' AND Controls.' . $name . ' IS NULL ';
		    else return ' AND Controls.' . $name . ' LIKE ' . $value;
	  }

	  if(  $table == 'Events' ) {
	       if(  $name == 'event_name'
	       or   $name == 'location'
	       or   $name == 'cut_off_date'
	       or   $name == 'start_date'
	       or   $name == 'end_date'
	       or   $name == 'last_number'
	       or   $name == 'us_fee_week1'
	       or   $name == 'us_fee_week2'
	       or   $name == 'us_fee_week3'
	       or   $name == 'tw_fee_week1'
	       or   $name == 'tw_fee_week2'
	       or   $name == 'tw_fee_week3'
	       or   $name == 'status' )
		    if(  $value == '"%null%"' )
			 return ' AND Events.' . $name . ' IS NULL ';
		    else return ' AND Events.' . $name . ' LIKE ' . $value;
	  }

	  if(  $table == 'Groups' ) {
	       if(  $name == 'group_name'
	       or   $name == 'group_type'
	       or   $name == 'total_targeted'
	       or   $name == 'total_applied'
	       or   $name == 'total_approved'
	       or   $name == 'total_arrived'
	       or   $name == 'total_departed'
	       or   $name == 'status' )
		    if(  $value == '"%null%"' )
			 return ' AND Groups.' . $name . ' IS NULL ';
		    else return ' AND Groups.' . $name . ' LIKE ' . $value;
	  }

	  if(  $table == 'Permissions' ) {
	       if(  $name == 'user_role'
	       or   $name == 'user_resource'
	       or   $name == 'user_action'
	       or   $name == 'status' )
		    if(  $value == '"%null%"' )
			 return ' AND Permissions.' . $name . ' IS NULL ';
		    else return ' AND Permissions.' . $name . ' LIKE ' . $value;
	  }

	 if(  $table == 'Receives' ) {
	     if(  $name == 'receive_on'
		 or   $name == 'receive_amount'
		 or   $name == 'set_amount'
		 or   $name == 'document'
		 or   $name == 'full_name'
		 or   $name == 'email'
		 or   $name == 'street'
		 or   $name == 'zip'
		 or   $name == 'city'
		 or   $name == 'state'
		 or   $name == 'country' )
		 if(  $value == '"%null%"' )
		      return ' AND Receives.' . $name . ' IS NULL ';
		 else return ' AND Receives.' . $name . ' LIKE ' . $value;
	 }

	  if(  $table == 'Services' ) {
	       if(  $name == 'helper_number'
	       or   $name == 'helper_age'
	       or   $name == 'tshirt_size'
/*
	       or   $name == 'school_year'
	       or   $name == 'school_name'
*/
	       or   $name == 'boot_camp'
	       or   $name == 'week_1'
	       or   $name == 'week_2'
	       or   $name == 'week_3'
	       or   $name == 'debriefing'
/*
	       or   $name == 'schedule1'
	       or   $name == 'schedule2'
	       or   $name == 'schedule3'
	       or   $name == 'm_speaking'
	       or   $name == 'm_reading'
	       or   $name == 'm_writing'
	       or   $name == 't_speaking'
	       or   $name == 't_reading'
	       or   $name == 't_writing'
	       or   $name == 'all_gifts'
	       or   $name == 'other_gifts'
	       or   $name == 'medications'
	       or   $name == 'arrival_flight'
	       or   $name == 'arrival_time'
	       or   $name == 'arrival_pickup'
	       or   $name == 'depart_flight'
	       or   $name == 'depart_time'
	       or   $name == 'depart_pickup'
*/
	       or   $name == 'receive_id'
	       or   $name == 'fee_amount'
	       or   $name == 'status' )
		    if(  $value == '"%null%"' )
			 return ' AND Services.' . $name . ' IS NULL ';
		    else return ' AND Services.' . $name . ' LIKE ' . $value;
	       else
	       if(  $name == 'first_name' )
		    if(  $value == '"%null%"' )
			 return ' AND Services.user_id     IS NULL';
		    else return ' AND  Persons.first_name  LIKE ' . $value;
	       else
	       if(  $name == 'last_name' )
		   if(  $value == '"%null%"' )
			return ' AND Services.user_id     IS NULL';
		   else return ' AND  Persons.last_name   LIKE ' . $value;
	       else
	       if(  $name == 'group_name' )
		    if(  $value == '"%null%"' )
			 return ' AND Services.group_id    IS NULL';
		    else return ' AND   Groups.group_name  LIKE ' . $value;
	  }

	  if(  $table == 'Settings' ) {
	       if(  $name == 'setting_set'
		    or   $name == 'sequence'
		    or   $name == 'setting_name'
		    or   $name == 'setting_value' )
		    if(  $value == '"%null%"' )
			 return ' AND Settings.' . $name . ' IS NULL ';
		    else return ' AND Settings.' . $name . ' LIKE ' . $value;
	  }

	 if(  $table == 'Summary' ) {
	     if(  $name == 'group_key'
		 or   $name == 'week_1'
		 or   $name == 'week_2'
		 or   $name == 'week_3' )
		 if(  $value == '"%null%"' )
		     return ' AND Summary.' . $name . ' IS NULL ';
		 else return ' AND Summary.' . $name . ' LIKE ' . $value;
	 }

	  if(  $table == 'Templates' ) {
	       if(  $name == 'created_at'
	       or   $name == 'template_name'
	       or   $name == 'template_type'
	       or   $name == 'template_subject'
	       or   $name == 'template_body'
	       or   $name == 'template_sql'
	       or   $name == 'description'
	       or   $name == 'status' )
		    if(  $value == '"%null%"' )
			 return ' AND Templates.' . $name . ' IS NULL ';
		    else return ' AND Templates.' . $name . ' LIKE ' . $value;
	       else
	       if(  $name == 'created_by' )
		    if(  $value == '"%null%"' )
			 return ' AND Templates.created_by  IS NULL';
		    else return ' AND   Created.full_name   LIKE ' . $value;
	  }

	  if(  $table == 'Tickets' ) {
	       if(  $name == 'opened_at'
	       or   $name == 'priority'
	       or   $name == 'description'
	       or   $name == 'resolution'
	       or   $name == 'status' )
		    if(  $value == '"%null%"' )
			 return ' AND Tickets.' . $name . ' IS NULL ';
		    else return ' AND Tickets.' . $name . ' LIKE ' . $value;
	       else
	       if(  $name == 'opened_by' )
		    if(  $value == '"%null%"' )
			 return ' AND  Tickets.opened_by    IS NULL';
		    else return ' AND   Opened.full_name    LIKE ' . $value;
	  }

	  if( $table == 'Translations' ) {
	       if( $name == 'sentence'
	       or  $name == 'status' )
		    if(  $value == '"%null%"' )
			 return ' AND Translations.' . $name . ' IS NULL ';
		    else return ' AND Translations.' . $name . ' LIKE ' . $value;
	  }

	  if(  $table == 'Persons' ) {
	       if(  $name == 'user_title'
	       or   $name == 'full_name'
	       or   $name == 'official_name'
	       or   $name == 'special_name'
	       or   $name == 'user_email'
	       or   $name == 'gender'
	       or   $name == 'birth_date'
	       or   $name == 'mobile'
	       or   $name == 'phone'
	       or   $name == 'street'
	       or   $name == 'city'
	       or   $name == 'state'
	       or   $name == 'zip'
	       or   $name == 'country'
	       or   $name == 'contact_name'
	       or   $name == 'church_name'
	       or   $name == 'pastor_name' )
		    if(  $value == '"%null%"' )
			 return ' AND Persons.' . $name . ' IS NULL ';
		    else return ' AND Persons.' . $name . ' LIKE ' . $value;
	       else
	       if(  $name == 'company_name' )
		    if(  $value == '"%null%"' )
			 return ' AND   Persons.company_id   IS NULL';
		    else return ' AND Companies.company_name LIKE ' . $value;
	       else
	       if(  $name == 'support_name' )
		    if(  $value == '"%null%"' )
			 return ' AND   Persons.support_id  IS NULL';
		    else return ' AND   Support.full_name   LIKE ' . $value;
	  }
     }

     $filter = '"%' . $filter . '%"';

     if(  $table == 'Categories' ) {
	  $return = '   Categories.sequence            LIKE ' . $filter
	       . ' OR   Categories.category            LIKE ' . $filter
	       . ' OR       Parent.category            LIKE ' . $filter
	       ;
     }

     if(  $table == 'Companies' ) {
	  $return = '   Companies.company_name         LIKE ' . $filter
	       . ' OR   Companies.company_number       LIKE ' . $filter
	       . ' OR   Companies.phone                LIKE ' . $filter
	       . ' OR   Companies.fax                  LIKE ' . $filter
	       . ' OR   Companies.street               LIKE ' . $filter
	       . ' OR   Companies.city                 LIKE ' . $filter
	       . ' OR   Companies.state                LIKE ' . $filter
	       . ' OR   Companies.zip                  LIKE ' . $filter
	       . ' OR   Companies.country              LIKE ' . $filter
	       . ' OR     Contact.full_name            LIKE ' . $filter
	       ;
     }

     if(  $table == 'Controls' ) {
	  $return = '    Controls.sequence             LIKE ' . $filter
	      . ' OR     Controls.control_name         LIKE ' . $filter
	      . ' OR     Controls.control_value        LIKE ' . $filter
	      ;
     }

     if(  $table == 'Events' ) {
	  $return = '    Events.event_name             LIKE ' . $filter
	      . ' OR     Events.location               LIKE ' . $filter
	      ;
     }

     if(  $table == 'Groups' ) {
	  $return = '    Groups.group_name             LIKE ' . $filter
	      . ' OR     Groups.group_type             LIKE ' . $filter
	      ;
     }

     if(  $table == 'Permissions' ) {
	  $return = ' Permissions.user_role            LIKE ' . $filter
	       . ' OR Permissions.user_resource        LIKE ' . $filter
	       . ' OR Permissions.user_action          LIKE ' . $filter
	       ;
     }

    if(  $table == 'Receives' ) {
	$return = ' Receives.receive_on            LIKE ' . $filter
	    . ' OR Receives.receive_amount        LIKE ' . $filter
	    . ' OR Receives.full_name          LIKE ' . $filter
	;
    }

     if(  $table == 'Services' ) {
	  $return = '  Persons.full_name               LIKE ' . $filter
	       . ' OR Services.helper_number           LIKE ' . $filter
	       . ' OR Services.helper_age              LIKE ' . $filter
	       . ' OR Services.tshirt_size             LIKE ' . $filter
	       . ' OR Services.boot_camp               LIKE ' . $filter
	       . ' OR Services.week_1                  LIKE ' . $filter
	       . ' OR Services.week_2                  LIKE ' . $filter
	       . ' OR Services.week_3                  LIKE ' . $filter
	       . ' OR Services.debriefing              LIKE ' . $filter
	       . ' OR Services.receive_id              LIKE ' . $filter
	       . ' OR Services.fee_amount              LIKE ' . $filter
	       ;
     }

     if(  $table == 'Settings' ) {
	  $return = '    Settings.sequence             LIKE ' . $filter
	       . ' OR    Settings.setting_name         LIKE ' . $filter
	       . ' OR    Settings.setting_value        LIKE ' . $filter
	  ;
     }

    if(  $table == 'Summary' ) {
	$return = '    Summary.group_key            LIKE ' . $filter
	    . ' OR     Summary.week_1               LIKE ' . $filter
	    . ' OR     Summary.week_2               LIKE ' . $filter
	    . ' OR     Summary.week_3               LIKE ' . $filter
	;
    }

     if(  $table == 'Templates' ) {
	  $return = '   Templates.created_at           LIKE ' . $filter
	       . ' or   Templates.template_name        LIKE ' . $filter
	       . ' or   Templates.template_type        LIKE ' . $filter
	       . ' or   Templates.template_subject     LIKE ' . $filter
	       . ' or   Templates.template_body        LIKE ' . $filter
	       . ' or   Templates.template_sql         LIKE ' . $filter
	       . ' or   Templates.description          LIKE ' . $filter
	       ;
     }

     if(  $table == 'Tickets' ) {
	  $return = '     Tickets.opened_at            LIKE ' . $filter
	       . ' OR     Tickets.priority             LIKE ' . $filter
	       . ' OR     Tickets.description          LIKE ' . $filter
	       . ' OR     Tickets.resolution           LIKE ' . $filter
	       . ' OR      Opened.full_name            LIKE ' . $filter
	       ;
     }

     if(  $table == 'Translations' ) {
	  $return = '     Translations.created_at      LIKE ' . $filter
	       . ' OR     Translations.updated_at      LIKE ' . $filter
	       . ' OR     Translations.sentence        LIKE ' . $filter
	  ;
     }

     if(  $table == 'Persons' ) {
	  $return = '     Persons.user_title           LIKE ' . $filter
	       . ' OR     Persons.full_name            LIKE ' . $filter
	       . ' OR     Persons.official_name        LIKE ' . $filter
	       . ' OR     Persons.special_name         LIKE ' . $filter
	       . ' OR     Persons.user_email           LIKE ' . $filter
	       . ' OR     Persons.gender               LIKE ' . $filter
	       . ' OR     Persons.birth_date           LIKE ' . $filter
	       . ' OR     Persons.mobile               LIKE ' . $filter
	       . ' OR     Persons.phone                LIKE ' . $filter
	       . ' OR     Persons.street               LIKE ' . $filter
	       . ' OR     Persons.city                 LIKE ' . $filter
	       . ' OR     Persons.state                LIKE ' . $filter
	       . ' OR     Persons.zip                  LIKE ' . $filter
	       . ' OR     Persons.country              LIKE ' . $filter
	       . ' OR     Persons.contact_name         LIKE ' . $filter
	       . ' OR     Persons.church_name          LIKE ' . $filter
	       . ' OR     Persons.pastor_name          LIKE ' . $filter
	       . ' OR   Companies.company_name         LIKE ' . $filter
	       . ' OR     Support.full_name            LIKE ' . $filter
	       ;
     }

     return ' AND (' . $return . ')';
}

/*
 *   $.ajax({ method: get_comments, table: x...x, id: 9...9 });
 *
 *   status: ok
 *     rows: [{ x...x: y...y, ... } (false)
 *           ,{ x...x: y...y, ... }
 *           ,{ x...x: y...y, ... }
 *           ]
 */
private function get_comments() {
     $table    = get_request( 'table'        );
     $id       = get_request( 'id'           );

     $user_id    = get_session( 'user_id'    );
     $user_role  = get_session( 'user_role'  );
     if(  strpos( $user_role, 'staff'  )
     or   strpos( $user_role, 'admin'  )
     or   strpos( $user_role, 'support'))
	  $staff = 'true' ;
     else $staff = 'false';

     $sql = 'SELECT *'
	  . '  FROM Comments'
	  . ' WHERE parent_name = "' . $table . '"'
	  . '   AND parent_id   =  ' . $id
	  . '   AND ( status IS NULL'
	  . '    OR ( status = "private" AND created_by = ' . $user_id . ' )'
	  . '    OR ( status = "staff"   AND ' . $staff . ' ) )'
	  . ' ORDER BY created_at'
	  ;
//$this->log_sql( $table, 'get_comments', $sql );
     $db  = Zend_Registry::get( 'db' );
     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'rows'     ] = $db->fetchAll( $sql );
     echo json_encode( $return );
}

/*
 *   $.ajax({ method: add_comment, table: x...x, id: 9...9, comment: x...x });
 *
 *   status: ok
 *     rows: [{ x...x: y...y, ... } (false)
 *           ,{ x...x: y...y, ... }
 *           ,{ x...x: y...y, ... }
 *           ]
 */
private function add_comment() {
     $table    = get_request( 'table'        );
     $id       = get_request( 'id'           );
     $comment  = get_request( 'comment'      );

     $sql = 'INSERT INTO Comments'
	  . '   SET created_by  =  ' . get_session( 'user_id' )
	  . '     , created_at  =  NOW()'
	  . '     , created_name= "' . get_session( 'full_name' ) . '"'
	  . '     , parent_name = "' . $table . '"'
	  . '     , parent_id   =  ' . $id
	  . '     , comment     = "' . $comment . '"'
	  ;
//$this->log_sql( $table, 'add_comment', $sql );
     $db  = Zend_Registry::get( 'db' );
     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'id'       ] = $db->query( $sql );
     echo json_encode( $return );
}

/*
 *   $.ajax({ method: get_columns, table: x...x });
 *
 */
private function get_columns() {
     if (get_session('user_action') != 'All') {
	 return;
     }

     $table = get_request( 'table' );
     $extra = array();
     $col   = array();

     if(  $table == 'Categories'   )    { $col[ 'Field'  ] =   'parent_name' ; $col[ 'Type' ] = 'varchar(255)'  ; $extra[] = $col;
					  $col[ 'Field'  ] =      'children' ; $col[ 'Type' ] = 'int(11)'       ; $extra[] = $col; }
     if(  $table == 'Companies'    )    { $col[ 'Field'  ] =  'contact_name' ; $col[ 'Type' ] = 'varchar(255)'  ; $extra[] = $col; }
     if(  $table == 'Services'     )    { $col[ 'Field'  ] =     'full_name' ; $col[ 'Type' ] = 'varchar(255)'  ; $extra[] = $col;
					  $col[ 'Field'  ] =        'avatar' ; $col[ 'Type' ] = 'varchar(255)'  ; $extra[] = $col;
					  $col[ 'Field'  ] =    'group_name' ; $col[ 'Type' ] = 'varchar(255)'  ; $extra[] = $col; }
     if(  $table == 'Templates'    )    { $col[ 'Field'  ] =  'created_name' ; $col[ 'Type' ] = 'varchar(255)'  ; $extra[] = $col; }
     if(  $table == 'Tickets'      )    { $col[ 'Field'  ] =   'opened_name' ; $col[ 'Type' ] = 'varchar(255)'  ; $extra[] = $col;
					  $col[ 'Field'  ] =   'closed_name' ; $col[ 'Type' ] = 'varchar(255)'  ; $extra[] = $col;
					  $col[ 'Field'  ] = 'assigned_name' ; $col[ 'Type' ] = 'varchar(255)'  ; $extra[] = $col; }
//   if(  $table == 'Persons'      )    { $col[ 'Field'  ] =  'support_name' ; $col[ 'Type' ] = 'varchar(255)'  ; $extra[] = $col;
//                                        $col[ 'Field'  ] =  'company_name' ; $col[ 'Type' ] = 'varchar(255)'  ; $extra[] = $col; }

     $sql  = 'SHOW COLUMNS FROM ' . $table;
     $db   = Zend_Registry::get( 'db' );
     $cols = $db->fetchAll( $sql );

     $return = array();
     $return[ 'status'   ] = 'ok';

//   special code to append fields from Persons to Services table
     if(  $table == 'Services' ) {
	  $sql  = 'SHOW COLUMNS FROM Persons WHERE Field != "id" AND Field != "created_by" AND Field != "created_at" AND Field != "updated_by" AND Field != "updated_at" AND Field != "status" AND Field != "completed"';
	  $db   = Zend_Registry::get( 'db' );
	  $users= $db->fetchAll( $sql );
	  $return[ 'columns'  ] = array_merge( $extra, $cols, $users );
     } else {
	  $return[ 'columns'  ] = array_merge( $extra, $cols );
     }

     echo json_encode( $return );
}

/*
 *   $.ajax({ method: insert, table: x...x, set: x...x });
 *
 *   status: ok
 * inserted: 9...9
 */
private function insert() {
     $table    = get_request( 'table'   );
     $set      = get_request( 'set'     );
     $db       = Zend_Registry::get( 'db' );

     if(  $set == '' ) {
	  $this->echo_error( 'missing [set] statement' );
	  return;
     }

     $set .= ', created_by='  . get_session( 'user_id' );
     $set .= ', created_at="' . get_time() . '"';

     if(  $table == 'Categories' ) {
	  $set .= ',     company_id= ' . get_session( 'company_id' );
     }

     if(  $table == 'Companies' ) {
	  $set .= ',      parent_id= ' . get_session( 'control_company', COMPANY_ID );
	  $set .= ', company_number= ' . $this->getUniqueNumber( $table, 'company_number' );
     }

     if(  $table == 'Services' ) {
	  $sets  = explode( ',', $set );
	  $names = explode( '=', $sets[ 0 ]); $user_id  = $names[ 1 ];
	  $names = explode( '=', $sets[ 1 ]); $event_id = $names[ 1 ];

	  $sql = 'SELECT next_number FROM Events WHERE id = ' . $event_id;
	  $helper_number = $db->fetchOne( $sql );
	  $sql = 'UPDATE Events SET next_number = next_number + 1 WHERE id = ' . $event_id;
	  $db->query( $sql );
	  $set .= ', helper_number= ' . $helper_number;

	  $sql = 'SELECT birth_date FROM Persons  WHERE id = ' .  $user_id;
	  $birth_date = $db->fetchOne( $sql );
	  $sql = 'SELECT start_date FROM Events WHERE id = ' . $event_id;
	  $start_date = $db->fetchOne( $sql );
	  if(  $birth_date ) {
	       $diff = abs( strtotime( $start_date ) - strtotime( $birth_date ));
	       $set .= ', helper_age= ' . floor( $diff / ( 365.25*60*60*24 ));
	  }
     }

//     if(  $table == 'Templates' ) {
//          $set .= ',     company_id= ' . get_session( 'control_company', COMPANY_ID );
//     }

     if(  $table == 'Tickets' ) {
	  $set .= ',     company_id= ' . get_session( 'control_company', COMPANY_ID );
	  $set .= ',      opened_by= ' . get_session( 'user_id' );
	  $set .= ',      opened_at="' . get_time() . '"';
     }

     if(  $table == 'Persons' ) {
	  $set .= ',     company_id= ' . get_session( 'company_id', COMPANY_ID );
	  $set .= ',             id= ' . $this->insert_user_jky();
	  $set .= ',    user_number= ' . $this->getUniqueNumber( $table, 'user_number' );
     }

     $sql = 'INSERT ' . $table
	  . '   SET ' . str_replace("*#", "&", $set)
	  ;
//$this->log_sql( $table, 'insert', $sql );
     $db->query( $sql );
     $id = $db->lastInsertId();
     $this->log_sql( $table, $id, $sql );

    $new = db_get_row($table, 'id = ' . $id);
    $this->history_log('insert', $table, $id, $new, null);

     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'message'  ] = 'new record added';
     $return[ 'id'       ] = $id;
     echo json_encode( $return );
}

private function insert_user_jky() {
     $sql = 'INSERT JKY_Users'
	  . '   SET password = "' . MD5( date( 'Y-m-d H:i:s' )) . '"'
	  . '     , user_key = "' . MD5( date( 'Y-m-d H:i:s' )) . '"'
	  ;
     $db  = Zend_Registry::get( 'db' );
     $db->query( $sql );
     return $db->lastInsertId();
}

/*
 *   $.ajax({ method: update, table: x...x, set: x...x, where: x...x });
 *
 *   status: ok
 *  updated: 9...9
 */
private function update() {
    $table = get_request('table');
    $set   = get_request('set'  );
    $where = $this->get_security($table, get_request('where'));

    if ($set == '') {
	$this->echo_error('missing [set] statement');
	return;
    }

    if ($where == '') {
	$this->echo_error('missing [where] statement');
	return;
    }

    $id = $this->get_only_id();
    if (!$id) {
	$this->echo_error('record not found');
	return;
    }

    $old = db_get_row($table, 'id = ' . $id);

    $set .= ', updated_by='  . get_session('user_id');
    $set .= ', updated_at="' . get_time() . '"';
    $sql = 'UPDATE ' . $table
	 . '   SET ' . str_replace("*#", "&", $set)
	 . ' WHERE id = ' . $id
	 ;
    $this->log_sql($table, $id, $sql);
    $db = Zend_Registry::get('db');
    $db->query($sql);

    $new = db_get_row($table, 'id = ' . $id);
    $this->history_log('update', $table, $id, $new, $old);

    $return = array();
    $return['status'    ] = 'ok';
    $return['message'   ] = 'record updated';
    $return['id'        ] = $id;
    echo json_encode($return);
}

private function update_user_jky( $id, $set ) {
     $sql = 'UPDATE JKY_Users'
	  . '   SET ' . str_replace("*#", "&", $set)
	  . ' WHERE id = ' . $id
	  ;
     $db  = Zend_Registry::get( 'db' );
     $db->query( $sql );
}

/*
 *   $.ajax({ method: delete, table: x...x, set: x...x });
 *
 *   status: ok
 *  deleted: 9...9
 */
private function delete() {
    $table = get_request('table');
    $where = $this->get_security($table, get_request('where'));

    if ($where == '') {
	$this->echo_error('missing [where] statement');
	return;
    }

    $return = array();
    $return['status'] = 'ok';

    $id = $this->get_only_id();
    if ($id) {
	if ($table == 'Persons') {
	    $this->delete_user_jky($id);
	}

	$new = db_get_row($table, 'id = ' . $id);
	$this->history_log('delete', $table, $id, $new, null);

	$sql= 'DELETE'
	    . '  FROM ' . $table
	    . ' WHERE id = ' . $id
	    ;
	$this->log_sql($table, $id, $sql);
	$db  = Zend_Registry::get('db');
	$db->query($sql);
	$return['message'] = 'record deleted';
    } else {
	$return['message'] = 'record already deleted';
    }
    echo json_encode($return);
}

private function delete_user_jky( $id ) {
     $sql = 'DELETE'
	  . '  FROM JKY_Users'
	  . ' WHERE id = ' . $id
	  ;
     $db  = Zend_Registry::get( 'db' );
     $db->query( $sql );
}

/*
 *   $.ajax({ method: combine, table: x...x , source: x...x, target: x...x });
 *
 *   status: ok
 *      row: { x...x: y...y, ... } (false)
 */
     private function combine() {
	  function replace( $s, &$t, $name, $empty ) {
	       if(( $t[ $name ] == null  or $t[ $name ] == $empty )
	       and( $s[ $name ] != null and $s[ $name ] != $empty ))
		    return ', ' . $name . '="' . $s[ $name ] . '"';
	       else return '';
	  }

	  if (get_session('user_action') != 'All') {
	      return;
	  }

	  $table    = get_request( 'table'  );
	  $source   = get_request( 'source' );
	  $target   = get_request( 'target' );

	  $db = Zend_Registry::get( 'db' );
	  $s = $db->fetchRow( 'SELECT * FROM Persons WHERE id = ' . $source );
	  $t = $db->fetchRow( 'SELECT * FROM Persons WHERE id = ' . $target );

	  $error = '';
	  if( !$s )      { $error = '<br>source record ' . $source . ' not found'; }
	  if( !$t )      { $error = '<br>target record ' . $target . ' not found'; }

	  if(  $error != '' ) {
	       $this->echo_error( $error );
	       return;
	  }

	  $set  = '';
	  $set .= replace( $s, $t, 'user_title'   , '' );
	  $set .= replace( $s, $t, 'official_name', '' );
	  $set .= replace( $s, $t, 'special_name' , '' );
	  $set .= replace( $s, $t, 'user_email'   , '' );
	  $set .= replace( $s, $t, 'gender'       , '' );
	  $set .= replace( $s, $t, 'birth_date'   , '' );
	  $set .= replace( $s, $t, 'user_tags'    , '' );
	  $set .= replace( $s, $t, 'mobile'       , '' );
	  $set .= replace( $s, $t, 'phone'        , '' );
	  $set .= replace( $s, $t, 'street'       , '' );
	  $set .= replace( $s, $t, 'zip'          , '' );
	  $set .= replace( $s, $t, 'city'         , '' );
	  $set .= replace( $s, $t, 'state'        , '' );
	  $set .= replace( $s, $t, 'country'      , '' );
	  $set .= replace( $s, $t, 'medications'  , '' );
	  $set .= replace( $s, $t, 'all_gifts'    , '' );
	  $set .= replace( $s, $t, 'other_gifts'  , '' );

	  if(  $set != '' ) {
	       $sql = 'UPDATE Persons'
		    . '   SET ' . substr( $set, 2 )
		    . ' WHERE id = ' . $target
		    ;
	       $this->log_sql( $table, $target, $sql );
	       $db->query( $sql );
	  }

	  $db->query( 'UPDATE Categories     SET   created_by = ' . $target . ' WHERE  created_by = ' . $source );
	  $db->query( 'UPDATE Categories     SET   updated_by = ' . $target . ' WHERE  updated_by = ' . $source );

	  $db->query( 'UPDATE Comments       SET   created_by = ' . $target . ' WHERE  created_by = ' . $source );
	  $db->query( 'UPDATE Comments       SET   updated_by = ' . $target . ' WHERE  updated_by = ' . $source );
	  $db->query( 'UPDATE Comments       SET    parent_id = ' . $target . ' WHERE   parent_id = ' . $source . ' AND parent_name = "Persons"' );

	  $db->query( 'UPDATE Companies      SET   created_by = ' . $target . ' WHERE  created_by = ' . $source );
	  $db->query( 'UPDATE Companies      SET   updated_by = ' . $target . ' WHERE  updated_by = ' . $source );
	  $db->query( 'UPDATE Companies      SET    member_id = ' . $target . ' WHERE   member_id = ' . $source );
	  $db->query( 'UPDATE Companies      SET     owner_id = ' . $target . ' WHERE    owner_id = ' . $source );
	  $db->query( 'UPDATE Companies      SET   contact_id = ' . $target . ' WHERE  contact_id = ' . $source );
	  $db->query( 'UPDATE Companies      SET   support_id = ' . $target . ' WHERE  support_id = ' . $source );

	  $db->query( 'UPDATE Controls       SET   created_by = ' . $target . ' WHERE  created_by = ' . $source );
	  $db->query( 'UPDATE Controls       SET   updated_by = ' . $target . ' WHERE  updated_by = ' . $source );

	  $db->query( 'UPDATE Events         SET   created_by = ' . $target . ' WHERE  created_by = ' . $source );
	  $db->query( 'UPDATE Events         SET   updated_by = ' . $target . ' WHERE  updated_by = ' . $source );

	  $db->query( 'UPDATE Groups         SET   created_by = ' . $target . ' WHERE  created_by = ' . $source );
	  $db->query( 'UPDATE Groups         SET   updated_by = ' . $target . ' WHERE  updated_by = ' . $source );
	  $db->query( 'UPDATE Groups         SET    leader_id = ' . $target . ' WHERE   leader_id = ' . $source );

	  $db->query( 'UPDATE Permissions    SET   created_by = ' . $target . ' WHERE  created_by = ' . $source );
	  $db->query( 'UPDATE Permissions    SET   updated_by = ' . $target . ' WHERE  updated_by = ' . $source );

	  $db->query( 'UPDATE Services       SET   created_by = ' . $target . ' WHERE  created_by = ' . $source );
	  $db->query( 'UPDATE Services       SET   updated_by = ' . $target . ' WHERE  updated_by = ' . $source );
	  $db->query( 'UPDATE Services       SET      user_id = ' . $target . ' WHERE     user_id = ' . $source );      //   duplicates same event_id
	  $db->query( 'UPDATE Services       SET  assigned_by = ' . $target . ' WHERE assigned_by = ' . $source );

	  $db->query( 'UPDATE Settings       SET   created_by = ' . $target . ' WHERE  created_by = ' . $source );
	  $db->query( 'UPDATE Settings       SET   updated_by = ' . $target . ' WHERE  updated_by = ' . $source );

	  $db->query( 'UPDATE Templates      SET   created_by = ' . $target . ' WHERE  created_by = ' . $source );
	  $db->query( 'UPDATE Templates      SET   updated_by = ' . $target . ' WHERE  updated_by = ' . $source );

	  $db->query( 'UPDATE Tickets        SET   created_by = ' . $target . ' WHERE  created_by = ' . $source );
	  $db->query( 'UPDATE Tickets        SET   updated_by = ' . $target . ' WHERE  updated_by = ' . $source );
	  $db->query( 'UPDATE Tickets        SET    opened_by = ' . $target . ' WHERE   opened_by = ' . $source );
	  $db->query( 'UPDATE Tickets        SET  assigned_to = ' . $target . ' WHERE assigned_to = ' . $source );
	  $db->query( 'UPDATE Tickets        SET    closed_by = ' . $target . ' WHERE   closed_by = ' . $source );

	  $db->query( 'UPDATE Persons          SET   created_by = ' . $target . ' WHERE  created_by = ' . $source );
	  $db->query( 'UPDATE Persons          SET   updated_by = ' . $target . ' WHERE  updated_by = ' . $source );
	  $db->query( 'UPDATE Persons          SET   support_id = ' . $target . ' WHERE  support_id = ' . $source );

	  $db->query( 'UPDATE User_metas     SET    parent_id = ' . $target . ' WHERE   parent_id = ' . $source );

	  $db->query( 'DELETE FROM Persons                                        WHERE          id = ' . $source );
	  $db->query( 'DELETE FROM JKY_Users                                    WHERE          id = ' . $source );

	  $return = array();
	  $return[ 'status'   ] = 'ok';
	  $return[ 'message'  ] = 'record combined';
	  $return[ 'source'   ] = $source;
	  $return[ 'target'   ] = $target;
	  echo json_encode( $return );
     }

/*
 *   $.ajax({ method: publish, table: x...x [, control_set: x...x] });
 *
 *   status: ok
 *     rows: [{ x...x: y...y, ... } (false)
 *           ,{ x...x: y...y, ... }
 *           ,{ x...x: y...y, ... }
 *           ]
 */
     private function publish() {
	  function write_categories( $db, $out_file, $level, $parent_id ) {
	       $newline = NL;
	       for( $i=0; $i<$level; $i++ )
		    $newline .= TAB;

	       $sql = 'SELECT *'
		    . '  FROM Categories'
		    . ' WHERE status = "active"'
		    . '   AND parent_id = ' . $parent_id
		    . ' ORDER BY sequence'
	       ;
	       $rows     = $db->fetchAll( $sql );
	       $counter  = count( $rows );

	       if(  $counter > 0 ) {
		    fwrite( $out_file, $newline . '<ul>' );
		    foreach( $rows as $row ) {
			 $url = 'category.php?id=';
			 fwrite( $out_file, $newline . '<li><a href="' . $url . $row[ 'id' ] . '">' . $row[ 'category' ] . '</a>' );
			 $level++;
			 $counter += write_categories( $db, $out_file, $level, $row[ 'id' ]);
			 $level--;
			 fwrite( $out_file, '</li>' );
		    }
		    fwrite( $out_file, $newline . '</ul>' );
	       }
	       fwrite( $out_file, NL );
	       return $counter;
	  }

	  function write_currencies( $db, $out_file, $default ) {
	       $sql = 'SELECT *'
		    . '  FROM Controls'
		    . ' WHERE status = "active"'
		    . '   AND control_set = "Currencies"'
		    . '   AND control_name != "' .  $default . '"'
		    . ' ORDER BY sequence'
	       ;
	       $rows     = $db->fetchAll( $sql );
	       $counter  = count( $rows );

	       fwrite( $out_file, "<a href='/#nogo' class='three outer' rel='nofollow' title='Currencies'><font style='font-weight:bold; font-size:12px; color:#000'>Currencies: " . $default . "</font></a>" );
	       fwrite( $out_file, NL . "<div class='tab_right'>" );
	       foreach( $rows as $row ) {
		    $control_name  = $row[ 'control_name'  ];
		    $control_value = $row[ 'control_value' ];
		    fwrite( $out_file, NL . TAB . "<p><a class='tab_" . $control_name . "' href='/?currency=" . $control_name . "' rel='nofollow'>" . $control_value . "</a></p>" );
	       }
	       fwrite( $out_file, NL . "</div>" );
	       fwrite( $out_file, NL );
	       return $counter;
	  }

	 function write_translations_js($db, $out_file, $locale) {
	     $sql = 'SELECT Translations.sentence AS source'
		  . '     ,      Targets.sentence AS target'
		  . '  FROM Translations'
		  . '  LEFT JOIN Translations AS Targets'
		  . '    ON Targets.parent_id = Translations.id'
		  . '   AND Targets.locale = "' . $locale . '"'
		  . ' WHERE Translations.status = "active"'
		  . '   AND Translations.locale = "en_us"'
		  . ' ORDER BY source'
		  ;
	     $rows    = $db->fetchAll($sql);
	     $counter = count($rows);

	     if( $counter > 0 ) {
		 fwrite( $out_file, 'var translations = ' );
		 $first = '{';
		 foreach( $rows as $row ) {
		     fwrite($out_file, NL . $first . ' "' . $row['source'] . '":"' . $row['target'] . '"');
		     $first = ',';
		 }
		 fwrite( $out_file, NL . '};' );
	     }
	     return $counter;
	 }
/*
	  function write_translations_csv($db, $out_file, $locale) {
	       $sql = 'SELECT Translations.sentence AS source'
		    . '     ,      Targets.sentence AS target'
		    . '  FROM Translations'
		    . '  LEFT JOIN Translations AS Targets'
		    . '    ON Targets.parent_id = Translations.id'
		    . '   AND Targets.locale = "' . $locale . '"'
		    . ' WHERE Translations.status = "active"'
		    . '   AND Translations.locale = "en_us"'
		    . ' ORDER BY source'
	       ;
	       $rows    = $db->fetchAll($sql);
	       $counter = count($rows);

	       if( $counter > 0 ) {
		    fwrite( $out_file, '# csv ' . $locale );
		    foreach( $rows as $row ) {
			 fwrite($out_file, NL . $row['source'] . ';' . $row['target']);
		    }
	       }
	       return $counter;
	  }
*/
	  function write_translations_php($db, $out_file, $locale) {
	       $sql = 'SELECT Translations.sentence AS source'
		    . '     ,      Targets.sentence AS target'
		    . '  FROM Translations'
		    . '  LEFT JOIN Translations AS Targets'
		    . '    ON Targets.parent_id = Translations.id'
		    . '   AND Targets.locale = "' . $locale . '"'
		    . ' WHERE Translations.status = "active"'
		    . '   AND Translations.locale = "en_us"'
		    . ' ORDER BY source'
	       ;
	       $rows    = $db->fetchAll($sql);
	       $counter = count($rows);

	       if( $counter > 0 ) {
		    fwrite( $out_file, '<?' );
		    fwrite( $out_file, NL . '//   language ' . $locale );
		    fwrite( $out_file, NL . '$translations = array');
		    $first = '(';
		    foreach( $rows as $row ) {
			 fwrite($out_file, NL . $first . ' "' . $row['source'] . '"=>"' . $row['target'] . '"');
			 $first = ',';
		    }
		    fwrite( $out_file, NL . ');' );
		    fwrite( $out_file, NL . '?>' );
	       }
	       return $counter;
	  }

	 if (get_session('user_action') != 'All') {
	    return;
	 }

	  $table         = get_request( 'table' );
	  $control_set   = get_request( 'control_set' );
	  $db            = Zend_Registry::get( 'db' );
	  $counter       = 0;

	  if(  $table == 'Categories' ) {
	       $out_name = 'jky_all_categories.html';
	       $out_file = fopen( $out_name, 'w' ) or die( 'cannot open ' . $out_name );
	       $counter  = write_categories( $db, $out_file, 0, 1000000000 );
	       fclose( $out_file );
	  }

	  if(  $table == 'Controls' ) {
	       if(  $control_set = 'Currencies' ) {
		    $out_name = 'jky_currencies.html';
		    $out_file = fopen( $out_name, 'w' ) or die( 'cannot open ' . $out_name );
		    $counter  = write_currencies( $db, $out_file, 'USD' );
		    fclose( $out_file );
	       }
	  }

	 if( $table == 'Translations' ) {
	     $sql = 'SELECT setting_name'
		  . '  FROM Settings'
		  . ' WHERE status = "active"'
		  . '   AND setting_set = "Languages"'
		  . ' ORDER BY sequence'
		  ;
	     $rows = $db->fetchAll($sql);

	     foreach( $rows as $row ) {
		 $locale = $row['setting_name'];
		 $out_name = 'js/translations/' . $locale . '.js';
		 $out_file = fopen($out_name, 'w') or die('cannot open ' . $out_name);
		 $counter  = write_translations_js($db, $out_file, $locale);
		 fclose($out_file);
	     }
/*
	      foreach( $rows as $row ) {
		   $locale = $row['setting_name'];
		   $out_name = '../languages/' . $locale . '.csv';
		   $out_file = fopen($out_name, 'w') or die('cannot open ' . $out_name);
		   $counter  = write_translations_csv($db, $out_file, $locale);
		   fclose($out_file);
	      }
*/
	      foreach( $rows as $row ) {
		   $locale = $row['setting_name'];
		   $out_name = '../application/' . $locale . '.php';
		   $out_file = fopen($out_name, 'w') or die('cannot open ' . $out_name);
		   $counter  = write_translations_php($db, $out_file, $locale);
		   fclose($out_file);
	      }
	 }

//          system( '( php ' . APPLICATION . 'GenerateHtml.php & ) > /dev/null' );
//          exec( 'php ' . APPLICATION . 'GenerateHtml.php' );

	  $return = array();
	  $return[ 'status'   ] = 'ok';
	  $return[ 'message'  ] = $counter . ' records published';
	  echo json_encode( $return );
     }

//   ---------------------------------------------------------------------------
private function echo_json( $return ) {
//   echo get_request( 'callback' ) . '( ' . json_encode( $return ) . ' );';
     echo json_encode( $return );
}

/*
 *   $.ajax({method:set_language, language:language});
 *
 *   http://jky/jky_proxy.php?method=set_language&language=pt_br
 *
 *   status: ok
 */
private function set_language() {
    if ( is_request('language')) {
	set_session('language', get_request('language'));
    }

     $return = array();
     $return[ 'status'   ] = 'ok';
     $this->echo_json( $return );
}

/*
 *   $.ajax({ method: get_language });
 *
 *       status: ok
 *     language: xx_yy
 */
    private function get_language() {
	$return = array();
	$return[ 'status'        ] = 'ok';
	$return[ 'language'      ] = get_session('language');
	$this->echo_json( $return );
    }

/*
 *   $.ajax({ method: set_session });
 *
 *   http://jky/jky_proxy.php?method=set_session&action=confirm&user_key=6e5fa4d9c48ca921c0a2ce1e64c9ae6f
 *   http://jky/jky_proxy.php?method=set_session&action=reset&user_key=6e5fa4d9c48ca921c0a2ce1e64c9ae6f
 *
 *   status: ok
 */
    private function set_session() {
	if(  is_request( 'action'          ))   set_session( 'action'         , get_request( 'action'       ));
	if(  is_request( 'user_key'        ))   set_session( 'user_key'       , get_request( 'user_key'     ));

	$return = array();
	$return[ 'status'   ] = 'ok';
	$this->echo_json( $return );
    }

/*
 *   $.ajax({ method: get_session });
 *
 *       status: ok
 *   today_date: yyyy-mm-dd
 */
private function get_session() {
	$data = array();
	$data['today_date'] = date('Y-m-d');

	if (is_session('action'			))   $data['action'			] = fetch_session( 'action'		);
	if (is_session('user_key'		))   $data['user_key'		] = fetch_session( 'user_key'	);

	if (is_session('language'		))   $data['language'		] =   get_session('language'	);
	if (is_session('control_company'))   $data['control_company'] =   get_session('control_company', COMPANY_ID);
	if (is_session('company_name'	))   $data['company_name'	] =   get_session('company_name');
	if (is_session('company_logo'	))   $data['company_logo'	] =   get_session('company_logo');
	if (is_session('event_id'		))   $data['event_id'		] =   get_session('event_id'	);
	if (is_session('event_name'		))   $data['event_name'		] =   get_session('event_name'	);
	if (is_session('user_name'		))   $data['user_name'		] =   get_session('user_name'	);
	if (is_session('user_time'		))   $data['user_time'		] =   get_session('user_time'	);
	if (is_session('user_id'		))   $data['user_id'		] =   get_session('user_id'		);
	if (is_session('full_name'		))   $data['full_name'		] =   get_session('full_name'	);
	if (is_session('permissions'	))   $data['permissions'	] =   get_session('permissions'	);

	$data['company_name'] = 'JKY Software Corp.';
	$data['company_logo'] = 'relations';
	$data['event_name'	] = 'Event 2013';
	$data['copyright'	] = '© 2013 JKY Software Corp';
	$data['contact_us'	] = 'Contact Us';
	$data['language'	] = 'Taiwanese';
	$data['languages'	] = array('English', 'Chinese', 'Taiwanese', 'Portugues');

	$obj = array();
	$obj['status'	] = 'ok';
	$obj['data'		] = $data;
	$this->echo_json($obj);
}

/*
 *   $.ajax({ method: get_profile );
 *
 *   status: ok
 *      row: Persons
 */
private function get_profile() {
     if( !is_session( 'user_id' )) {
	  $this->echo_error( 'user_id is undefined' );
	  return;
     }

     $sql = 'SELECT *'
	  . '  FROM Persons'
	  . ' WHERE id = ' . get_session( 'user_id' )
	  ;
     $db  = Zend_Registry::get( 'db' );
     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'row'      ] = $db->fetchRow( $sql );
     echo json_encode( $return );
}

/*
 *   $.ajax({ method: get_contact );
 *
 *   status: ok
 *      row: Persons
 */
private function get_contact() {
     if( !is_session( 'control_company' )) {
	  $this->echo_error( 'control_company is undefined' );
	  return;
     }

     $sql = 'SELECT Companies.*'
	  . '     , Contact.user_email AS business_email'
	  . '     , Support.user_email AS  support_email'
	  . '  FROM Companies'
	  . '  LEFT JOIN Persons AS Contact On Contact.id = Companies.contact_id'
	  . '  LEFT JOIN Persons AS Support On Support.id = Companies.support_id'
	  . ' WHERE Companies.id = ' . get_session( 'control_company', COMPANY_ID )
	  ;
     $db  = Zend_Registry::get( 'db' );
     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'row'      ] = $db->fetchRow( $sql );
     echo json_encode( $return );
}

/*
 *   $.ajax({ method: get_contact_id, contact_name: x...x );
 *
 *   status: ok
 *       id: 9...9
 */
private function get_contact_id() {
     $contact_name = get_request( 'contact_name' );

     $sql = 'SELECT id'
	  . '  FROM Persons'
	  . ' WHERE full_name = "' . $contact_name . '"'
	  ;
     $db  = Zend_Registry::get( 'db' );
     $id  = $db->fetchOne( $sql );

     if( !$id ) {
	  $sql = 'INSERT INTO Persons'
	       . '   SET          id= ' . $this->insert_user_jky()
	       . '     , user_number= ' . $this->getUniqueNumber( 'Persons', 'user_number' )
	       . '     ,   full_name="' . $contact_name . '"'
	       . '     ,   user_name="' . $contact_name . '"'
	       ;
	  $db  = Zend_Registry::get( 'db' );
	  $db->query( $sql );
	  $id = $db->lastInsertId();
     }

     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'id'       ] = $id;
     echo json_encode( $return );
}

/*
 *   $.ajax({ method: get_user_id, full_name: x...x | user_name: x...x );
 *
 *   status: ok     | error
 *       id: 9...9  | null
 */
private function get_user_id() {
     $where = '';
     if(  is_request( 'full_name' ))        $where = 'full_name = "' . get_request( 'full_name' ) . '"';
     if(  is_request( 'user_name' ))        $where = 'user_name = "' . get_request( 'user_name' ) . '"';

     $return = array();
     if(  $where != '' ) {
	  $sql = 'SELECT id'
	       . '  FROM Persons'
	       . ' WHERE ' . $where
	       ;
	  $db  = Zend_Registry::get( 'db' );
	  $return[ 'status'   ] = 'ok';
	  $return[ 'id'       ] = $db->fetchOne( $sql );
     } else {
	  $return[ 'status'   ] = 'error';
	  $return[ 'id'       ] = null;
     }
     echo json_encode( $return );
}

/*
 *   $.ajax({ method: set_user_id, user_key: x...x });
 *
 *     status: ok / error
 *    message: x...x
 */

     private function set_user_id() {
	  $error = '';
	  $user_id = db_get_id( 'JKY_Users', 'user_key = "' . get_request( 'user_key' ) . '"' );

	  if(  $user_id )
	       $this->set_user_session( $user_id );
	  else $error .= BR . 'User Account already expired'  ;

	  $return[ 'status'   ] = $error == '' ? 'ok' : 'error';
	  $return[ 'message'  ] = $error;
	  $this->echo_json( $return );
     }

/*
 *   $.ajax({ method: get_company_id, company_name: x...x );
 *
 *   status: ok
 *       id: 9...9
 */
private function get_company_id() {
     $sql = 'SELECT id'
	  . '  FROM Companies'
	  . ' WHERE company_name = "' . get_request( 'company_name' ) . '"'
	  ;
//$this->log_sql( null, 'get_company_id', $sql );
     $db  = Zend_Registry::get( 'db' );
     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'id'       ] = $db->fetchOne( $sql );
     echo json_encode( $return );
}

/*
 *   $.ajax({ method: set_company_id, company_id: 9...9 );
 *
 *   status: ok
 *       id: 9...9
 */
private function set_company_id() {
     $company = db_get_row( 'Companies', 'id = ' . get_request( 'company_id' ));
     set_session( 'company_id'     , $company[ 'id'              ]);
     set_session( 'company_name'   , $company[ 'company_name'    ]);
//     set_session( 'control_company', $company[ 'parent_id'       ]);
     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'name'     ] = $company[ 'company_name' ];
     echo json_encode( $return );
}

/*
 *   $.ajax({ method: set_event_id, event_id: 9...9 );
 *
 *   status: ok
 *       id: 9...9
 */
private function set_event_id() {
     $event = db_get_row( 'Events', 'id = ' . get_request( 'event_id' ));
     set_session( 'event_id'       , $event[ 'id'           ]);
     set_session( 'event_name'     , $event[ 'event_name'   ]);
//     set_session( 'company_id'     , $event[ 'company_id'   ]);
     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'name'     ] = $event[ 'event_name' ];
     echo json_encode( $return );
}

/*
 *   $.ajax({ method: set_group_id, group_id: 9...9 );
 *
 *   status: ok
 *       id: 9...9
 */
private function set_group_id() {
     $group = db_get_row( 'Groups', 'id = ' . get_request( 'group_id' ));
     set_session( 'group_id'       , $group[ 'id'           ]);
     set_session( 'group_name'     , $group[ 'group_name'   ]);
//     set_session( 'event_id'       , $group[ 'event_id'     ]);
     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'name'     ] = $group[ 'group_name' ];
     echo json_encode( $return );
}

/*
 *   $.ajax({ method: get_groups, where:..x, select: x...x, initial: x...x });
 *
 *   return: <options value="x...x" selected="selected">x...x</options>
 *           ...
 */
     private function get_groups() {
	  $where         = get_request( 'where'  );
	  $select        = get_request( 'select' );
	  $initial       = get_request( 'initial');

	  $sql = 'SELECT Groups.id, Groups.group_name'
//          . '  FROM Persons, Services, Groups'
//          . ' WHERE Persons.id = Services.user_id'
//          . '   AND Services.group_id = Groups.id'
//          . '   AND ' . $where
	       . '  FROM Groups'
	       . ' WHERE ' . $where
	       . ' ORDER BY Groups.group_name'
	  ;
	  if(  $initial == '' )
//        $return = '';
	       $return = '<option value="">' . $initial . '</option>';
//   else $return = '<option value="*">' . $initial . '</option>';
	  else $return = '<option value="All">' . $initial . '</option>';

	  if(  $sql != '' ) {
	       $this->log_sql( null, 'get_groups', $sql );
	       $db  = Zend_Registry::get( 'db' );
	       $rows = $db->fetchAll( $sql );

	       foreach( $rows as $row ) {
		    $selected = $row[ 'id' ] == $select ? ' selected="selected"' : '';
		    $return .= '<option value="' . $row[ 'id' ] . '"' . $selected . '>' . $row[ 'group_name' ] . '</options>';
	       }
	  }
	  echo $return;
     }

/*
 *   $.ajax({ method: get_users, where:..x, select: x...x, initial: x...x });
 *
 *   return: <options value="x...x" selected="selected">x...x</options>
 *           ...
 */
private function get_users() {
     $where         = get_request( 'where'  );
     $select        = get_request( 'select' );
     $initial       = get_request( 'initial');

     $sql = 'SELECT Persons.id, Persons.full_name'
//          . '  FROM Persons, Services, Groups'
//          . ' WHERE Persons.id = Services.user_id'
//          . '   AND Services.group_id = Groups.id'
//          . '   AND ' . $where
	  . '  FROM Persons'
	  . ' WHERE ' . $where
	  . ' ORDER BY Persons.full_name'
	  ;
     if(  $initial == '' )
//        $return = '';
	  $return = '<option value="">' . $initial . '</option>';
//   else $return = '<option value="*">' . $initial . '</option>';
     else $return = '<option value="All">' . $initial . '</option>';

     if(  $sql != '' ) {
$this->log_sql( null, 'get_users', $sql );
	  $db  = Zend_Registry::get( 'db' );
	  $rows = $db->fetchAll( $sql );

	  foreach( $rows as $row ) {
	       $selected = $row[ 'id' ] == $select ? ' selected="selected"' : '';
	       $return .= '<option value="' . $row[ 'id' ] . '"' . $selected . '>' . $row[ 'full_name' ] . '</options>';
	  }
     }
     echo $return;
}

/*
 *   $.ajax({ method: get_options, control_set: x...x, select: x...x, initial: x...x });
 *
 *   return: <options value="x...x" selected="selected">x...x</options>
 *           ...
 */
private function get_options() {
     $control_set   = get_request( 'control_set'  );
     $select        = get_request( 'select' );
     $initial       = get_request( 'initial');

     $sql = '';
     $sql = 'SELECT * '
	  . '  FROM Controls'
	  . ' WHERE control_set = "' . $control_set . '"'
	  . ' ORDER BY sequence, control_name'
	  ;
     if(  $initial == '' )
	  $return = '';
//   else $return = '<option value="*">' . $initial . '</option>';
     else $return = '<option value="All">' . $initial . '</option>';

     if(  $sql != '' ) {
	  $db  = Zend_Registry::get( 'db' );
	  $rows = $db->fetchAll( $sql );

	  foreach( $rows as $row ) {
	       if(  $row[ 'control_value' ] == '' || $control_set == 'User Roles' )
		    $row[ 'control_value' ] = $row[ 'control_name' ];
	       $selected = $row[ 'control_name' ] == $select ? ' selected="selected"' : '';
	       $return .= '<option value="' . $row[ 'control_name' ] . '"' . $selected . '>' . $row[ 'control_value' ] . '</options>';
	  }
     }
     echo $return;
}

/*
 *   $.ajax({ method: get_soptions, setting_set: x...x, select: x...x, initial: x...x });
 *
 *   return: <options value="x...x" selected="selected">x...x</options>
 *           ...
 */
     private function get_soptions() {
	  $setting_set   = get_request( 'setting_set'  );
	  $select        = get_request( 'select' );
	  $initial       = get_request( 'initial');

	  $sql = '';
	  $sql = 'SELECT * '
	       . '  FROM Settings'
	       . ' WHERE setting_set = "' . $setting_set . '"'
	       . ' ORDER BY sequence, setting_name'
	  ;
	  if(  $initial == '' )
	       $return = '';
//   else $return = '<option value="*">' . $initial . '</option>';
	  else $return = '<option value="All">' . $initial . '</option>';

	  if(  $sql != '' ) {
	       $db  = Zend_Registry::get( 'db' );
	       $rows = $db->fetchAll( $sql );

	       foreach( $rows as $row ) {
		    if(  $row[ 'setting_value' ] == '' || $setting_set == 'User Roles' )
			 $row[ 'setting_value' ] = $row[ 'setting_name' ];
		    $selected = $row[ 'setting_name' ] == $select ? ' selected="selected"' : '';
		    $return .= '<option value="' . $row[ 'setting_name' ] . '"' . $selected . '>' . $row[ 'setting_value' ] . '</options>';
	       }
	  }
	  echo $return;
     }

/*
 *   $.ajax({ method: get_categories, parent_id: 9...9, select: x...x, initial: x...x });
 *
 *   return: <options value="x...x" selected="selected">x...x</options>
 *           ...
 */
     private function get_categories() {
	  $parent_id     = get_request( 'parent_id' );
	  $select        = get_request( 'select' );
	  $initial       = get_request( 'initial');

	  $sql = 'SELECT Categories.*'
	       . '  FROM Categories'
	       . '  LEFT JOIN Categories AS Parent ON Parent.id = Categories.parent_id'
	       . ' WHERE Categories.parent_id = ' . $parent_id
	       . ' ORDER BY sequence, category'
	  ;
	  //$this->log_sql( null, 'get_categories', $sql );
	  if(  $initial == '' )
	       $return = '';
	  else $return = '<option value="All">' . $initial . '</option>';

	  if(  $sql != '' ) {
	       $db  = Zend_Registry::get( 'db' );
	       $rows = $db->fetchAll( $sql );

	       foreach( $rows as $row ) {
		    $selected = $row[ 'category' ] == $select ? ' selected="selected"' : '';
		    $return .= '<option value="' . $row[ 'id' ] . '"' . $selected . '>' . $row[ 'category' ] . '</options>';
	       }
	  }
	  echo $return;
     }

/*
 *   $.ajax({ method: get_header });
 *
 *   return: <options value="x...x" selected="selected">x...x</options>
 *           ...
 */
private function get_header() {
     $full_name = get_session( 'full_name' );
     if(  $full_name == '' )
	  $header_id = 'Welcome, please &nbsp;<a onclick="display_signup();">Sign Up</a>&nbsp; or &nbsp;<a onclick="display_login();">Log In</a>';
     else $header_id = 'Hello ' . $full_name . ', want to view &nbsp;<a onclick="display_profile();">Your Profile</a>&nbsp; or &nbsp;<a onclick="request_logout();">Log Out</a>';

     $return = ''
	   . '<div class="margin">'
	   . '<span id="header_company">' . get_session( 'company_name' ) . '</span>'
	   . '<span id="header_id">' . $header_id .'</span>'
	   . '</div>'
	   ;
     echo $return;
}

/*
 *   $.ajax({ method: get_menus });
 *
 *   return: <options value="x...x" selected="selected">x...x</options>
 *           ...
 */
private function get_menus() {
     $html = ''
	   . '   <div class="margin">'
	   . '       <a href="/bridge/return"><img id="header_logo" src="/images/logo.png" /></a>'
	   . '       <div class="clear"></div>'

	   . '       <div id="header_menu" class="tabs">'
	   . '            <ul>'
	   . '                 <li class="' . $this->get_tab_class( 'Home'       ) . '"><a href="/home"            ><span>Home         </span></a></li>'
	   . '                 <li class="' . $this->get_tab_class( 'Videos'     ) . '"><a href="/videos"          ><span>Videos       </span></a></li>'
	   . '                 <li class="' . $this->get_tab_class( 'Reports'    ) . '"><a href="/reports"         ><span>Reports      </span></a></li>'
	   . '                 <li class="' . $this->get_tab_class( 'Features'   ) . '"><a href="/features"        ><span>Features     </span></a></li>'
	   . '            </ul>'
	   . '       </div id="header_menu">'

	   . '       <div id="header_control" class="tabs">'
	   . '            <ul>'
	   . '                 <li class="' . $this->get_tab_class( 'MyAccount'  ) . '"><a href="/myaccount"       ><span>My Account   </span></a></li>'
	   . '                 <li class="' . $this->get_tab_class( 'Tickets'    ) . '"><a href="/Tickets.html"    ><span>Tickets      </span></a></li>'
	   . '                 <li class="' . $this->get_tab_class( 'Admin'      ) . '">'
	   . '                      <a href="#"    onmouseover="mopen(\'admin\')"   onmouseout="mclosetime()"><span>Admin</span></a>'
	   . '                      <ul id="admin" onmouseover="mcancelclosetime()" onmouseout="mclosetime()">'
	   . '                           <li><a href="/companies/settings"  ><span>Settings     </span></a></li>'
	   . '                           <li><a href="/companies.html"      ><span>Companies    </span></a></li>'
	   . '                           <li><a href="/invoices"            ><span>Invoices     </span></a></li>'
	   . '                           <li><a href="/production"          ><span>Production   </span></a></li>'
	   . '                           <li><a href="/repository"          ><span>Repository   </span></a></li>'
	   . '                           <li><a href="/persons.html"        ><span>Persons        </span></a></li>'
	   . '                           <li><a href="/tcounters"           ><span>Talents      </span></a></li>'
	   . '                           <li><a href="/counters"            ><span>Summary      </span></a></li>'
	   . '                           <li><a href="/templates"           ><span>Templates    </span></a></li>'
	   . '                           <li><a href="/controls.html"       ><span>Controls     </span></a></li>'
	   . '                           <li><a href="/permissions.html"    ><span>Permissions  </span></a></li>'
	   . '                      </ul>'
	   . '                 </li>'
	   . '            </ul>'
	   . '       </div id="header_control">'

	   . '       <div class="clear"></div>'
	   . '  </div>'
	   ;
     echo $html;
}

private function get_tab_class( $tab ) {
    $user_action = get_user_action( $tab );
    if ($user_action == '') {
	$user_action = get_user_action( 'All' );
    }

    //   for undefined resource or denied user_action
    if ($user_action == '' or $user_action == 'Denied') {
	return 'tab_denied'  ;
    } else {
	return 'tab_inactive';
    }
}

private function set_user_session( $user_id ) {
	$user = db_get_row('JKY_Users', 'id = ' . $user_id);
	set_session('user_id'           , $user['id'                    ]);
	set_session('user_name'         , $user['user_name'             ]);
	set_session('user_type'         , $user['user_type'             ]);
	set_session('user_role'         , $user['user_role'             ]);

	$person = db_get_row('Persons', 'id = ' . $user_id);
	set_session('first_name'        , $person['first_name'  ]);
	set_session('last_name'         , $person['last_name'   ]);
	set_session('full_name'         , $person['full_name'   ]);
	set_session('start_page'        , 'home');
/*
	$organ = db_get_row('Organizations', 'status = "active" AND id = ' . $person['organ_id']);
	set_session('organ_id'          , $organ['id'                   ]);
	set_session('organ_name'        , $organ['organ_name'   ]);
	set_session('organ_parent'      , $organ['parent_id'    ]);
*/
	set_permissions($user['user_role']);
}

private function get_user_data() {
	$control = db_get_row('Controls', 'status = "active" AND control_set ="User Roles" AND control_name= "' . get_session('user_role') . '"') ;
	$data = array();
	$data['first_name'	] = get_session('first_name');
	$data['last_name'	] = get_session('last_name' );
	$data['full_name'	] = get_session('full_name'	);
	$data['user_role'	] = get_session('user_role' );
	$data['start_page'	] = $control['control_value'];
	return $data;
}

//   ---------------------------------------------------------------------------

/*
 *   $.ajax({ method: check_session });
 *
 *   status: ok
 *  message: x...x
 *     data: x...x
 */
private function check_session($data) {
	$error = '';
	if (!is_session('user_id')) {
		$error = 'Session is gone';
	}

	$return = array();
	if (is_empty($error)) {
		$return['status' ] = 'ok';
		$return['data'   ] = $this->get_user_data();
	}else{
		$return['status' ] = 'error';
		$return['message'] = $error;
	}
	$this->echo_json($return);
}

/*
 *   $.ajax({ method: confirm, user_key: x...x });
 *
 *     status: ok / error
 *    message: x...x
 */

private function confirm($data) {
	$error = '';
	$user_id = db_get_id('JKY_Users', 'user_key = "' . $data['user_key'] . '"');

	if (!$user_id) {
		$error .= BR . 'User Account already expired';
	}else{
		if (is_empty(meta_get_id('User', $user_id, 'unconfirmed_email'))) {
			$error .= BR . 'Email Address already confirmed';
		}
	}

	$return = array();
	if (is_empty($error)) {
		meta_delete('User', $user_id, 'unconfirmed_email');
		$this->set_user_session($user_id);
		$return['status' ] = 'ok';
		$return['message'] = 'Email Address confirmed';
	}else{
		$return['status' ] = 'error';
		$return['message'] = $error;
	}
	$this->echo_json($return);
}

/*
 *   $.ajax({ method: reset, encrypted: x...x });
 *
 *   status: ok
 *  message: password reseted
 */
private function reset($data) {
	$user_id   = get_session('user_id');
	$encrypted = $data['encrypted'];

	if ($encrypted != '') {
		$sql = 'UPDATE JKY_Users'
			 . '   SET password = "' . $encrypted . '"'
			 . ' WHERE id = ' . $user_id
			 ;
		$db  = Zend_Registry::get( 'db' );
		$db->query($sql);
		$this->log_sql('reset', $user_id, $sql);
	}

	$return = array();
	$return['status' ] = 'ok';
	$return['message'] = 'New Password reseted';

	$control = db_get_row( 'Controls', 'status = "active" AND control_set ="User Role" AND control_name= "' . get_session( 'user_role' ) . '"' );
	$return['re_direct'] = $control['control_value'];
	$this->echo_json($return);
}

/*
 *   $.ajax({ method: log_in, user_name: x...x, encrypted: x...x, remember_me: Y/N });
 *
 *  status: ok
 * message: x...x
 *    data: first_name	: x...x
 *			last_name	: x...x
 *			user_role	: x...x
 *			start_page	: x...x
 */
private function log_in($data) {
	$user_name  = $data['user_name'];
	$encrypted  = $data['encrypted'];

	$error = '';
	$user_id = db_get_id('JKY_Users', 'status = "active" AND user_name = "' . $user_name . '"');
	if (!$user_id) {
		$error .= set_is_invalid('User Name');
	}

	if (is_empty($error)) {
//		$password = MD5(get_session('user_time') . $this->get_password($user_id));
//		$password = $this->get_password($user_id);
		$user = db_get_row('JKY_Users', 'id = ' . $user_id);
		if ($user['password'] != $encrypted) {
			$error .= set_is_invalid('Password');
		}
	}

	$return = array();
	if (is_empty($error)) {
		$this->set_user_session($user_id);
		$return['status' ] = 'ok';
		$return['data'   ] = $this->get_user_data();
	}else{
		$return['status' ] = 'error';
		$return['message'] = $error;
	}
	$this->echo_json($return);
}

private function get_password($id) {
	$sql= 'SELECT password'
		. '  FROM JKY_Users'
		. ' WHERE id = ' . $id
		;
	$db = Zend_Registry::get('db');
//$this->log_sql(null, 'get_password', $sql);
	return $db->fetchOne($sql);
}

/*
 *   $.ajax({ method: log_out });
 *
 *   status: ok
 *  message: x...x
 */
private function log_out() {
//   setcookie( 'remember_me'  , '', time() - 86400, '/' );
//   setcookie( 'authorization', '', time() - 86400, '/' );

     $error = '';
     $session = new Zend_Session_Namespace();
     foreach( $session as $name => $value ) {
//          if(  $name != 'control_company' )
	       unset_session( $name );
     }
#    $this->_redirect( INDEX . 'index' );                   //   in linux, it generates = http://xxx/jky_index.php/jky_index.php/index
//   $this->_redirect( INDEX . 'jky_index.php/index' );

     $return = array();
     $return[ 'status'   ] = $error == '' ? 'ok' : 'error';
     $return[ 'message'  ] = $error;
     echo json_encode( $return );
}

/*
 *   $.ajax({ method: log_help, help_name: x...x });
 *
 *       status: ok
 *   user_email: x...x
 */
private function log_help() {
     $help_name  = get_request( 'help_name'  );

     $error = '';
     $users = db_get_rows( 'Persons', 'status = "active" AND( user_name = "' . $help_name . '" OR user_email = "' . $help_name . '" )' );
     if(  count( $users ) == 0 )        $error .= set_not_found( 'User Name or Email Address' );

     $return = array();
     if(  is_empty( $error )) {
//        email for all users
	  foreach( $users as $user ) {
	       $return = email_by_event( $user[ 'id' ], 'Remind Me', 'Email From System' );
	       if( !isset( $return[ 'user_email' ]))
		    $return[ 'user_email' ] = $user[ 'user_email' ];
	  }
     }

     $return[ 'status'   ] = $error == '' ? 'ok' : 'error';
     $return[ 'message'  ] = $error;
     echo json_encode( $return );
}

/*
 *   $.ajax({ method: profile, user_name: x...x, first_name: x...x, last_name: x...x, email_address: x...x, phone: x...x, mobile: x...x, cur_password: x...x, new_password: x...x });
 *
 *   status: ok
 *  message: x...x
 */
private function profile() {
     $id  = get_session( 'user_id' );
     $user_name      = get_request( 'user_name'    );
     $first_name     = get_request( 'first_name'   );
     $last_name      = get_request( 'last_name'    );
     $email_address  = get_request( 'email_address');
     $phone          = get_request( 'phone'        );
     $mobile         = get_request( 'mobile'       );
     $cur_password   = get_request( 'cur_password' );
     $new_password   = get_request( 'new_password' );
     $full_name      = $first_name . ' ' . $last_name;

     $set = '  user_name      = "' . $user_name        . '"'
	  . ', first_name     = "' . $first_name       . '"'
	  . ', last_name      = "' . $last_name        . '"'
	  . ', full_name      = "' . $full_name        . '"'
	  . ', user_email     = "' . $email_address    . '"'
	  . ', phone          = "' . $phone            . '"'
	  . ', mobile         = "' . $mobile           . '"'
	  ;
     $sql = 'UPDATE Persons'
	  . '   SET ' . $set
	  . ' WHERE id = ' . $id
	  ;
     $db  = Zend_Registry::get( 'db' );
     $db->query( $sql );
     $this->log_sql( 'profile', $id, $sql );

     set_session( 'full_name', $full_name );

     $error = '';
     if(  $new_password != MD5( '' )) {
	  $sql = 'SELECT password'
	       . '  FROM JKY_Users'
	       . ' WHERE id = ' . $id
	       ;
	  $password = $db->fetchOne( $sql );

	  if(  $password != $cur_password ) {
	       $error .= 'Current Password is invalid';
	  } else {
	       $sql = 'UPDATE JKY_Users'
		    . '   SET password = "' . $new_password . '"'
		    . ' WHERE id = ' . $id
		    ;
	       $db->query( $sql );
	       $this->log_sql( 'profile', $id, $sql );
	  }
     }

     $return = array();
     if(  $error == '' ) {
	  $return[ 'status'   ] = 'ok';
	  $return[ 'message'  ] = 'profile updated';
     } else {
	  $return[ 'status'   ] = 'error';
	  $return[ 'message'  ] = $error;
     }
     $this->echo_json( $return );
}

/*
 *   $.ajax({ method: sign_up, user_name: x...x, email_address: x...x[, company_name: x...x][, phone_number: x...x][, newsletter: [yes/no]] });
 *
 *   status: ok
 *  message: x...x
 */
private function sign_up() {
     $db  = Zend_Registry::get( 'db' );

     $user_name     = get_request( 'user_name'         );
     $email_address = get_request( 'email_address'     );
     $company_name  = get_request( 'company_name'      );
     $phone         = get_request( 'phone_number'      );
     $newsletter    = get_request( 'newsletter'        );

     if(  is_empty( $company_name )) {
	  $company_id = COMPANY_ID;
     } else {
	  $set = '  created_at     = "' . date( 'Y-m-d H:i:s' ) . '"'
	       . ', parent_id      =  ' . get_session( 'control_company', COMPANY_ID )
	       . ', company_name   = "' . $company_name     . '"'
	       . ', start_date     = "' . date( 'Y-m-d' )   . '"'
	       . ', company_number =  ' . $this->getUniqueNumber( 'Companies', 'company_number' )
	       ;
	  $sql = 'INSERT Companies'
	       . '   SET ' . $set
	       ;
//$this->log_sql( null, 'sign_up', $sql );
	  $db->query( $sql );
	  $company_id = $db->lastInsertId();
	  $this->log_sql( 'sign_up', $company_id, $sql );
     }

     $user_id = $this->insert_user_jky();

     $set = '  id             =  ' . $user_id
	  . ', created_at     = "' . date( 'Y-m-d H:i:s' ) . '"'
	  . ', company_id     =  ' . $company_id
	  . ', newsletter     = "' . $newsletter       . '"'
	  . ', user_number    =  ' . $this->getUniqueNumber( 'Persons', 'user_number' )
	  . ', user_role      = "' . 'member'          . '"'
	  . ', full_name      = "' . $user_name        . '"'
	  . ', first_name     = "' . $user_name        . '"'
	  . ', user_email     = "' . $email_address    . '"'
	  . ', user_name      = "' . $user_name        . '"'
	  . ', phone          = "' . $phone            . '"'
	  ;
     $sql = 'INSERT Persons'
	  . '   SET ' . $set
	  ;
//$this->log_sql( null, 'sign_up', $sql );
     $db->query( $sql );
     meta_replace( 'User', $user_id, 'unconfirmed_email', $email_address );

     $this->log_sql( 'sign_up', $user_id, $sql );

     $set = '  contact_id     =  ' . $user_id;
     $sql = 'UPDATE Companies'
	  . '   SET ' . $set
	  . ' WHERE id = ' . $company_id
	  . '   AND contact_id IS NULL'
	  ;
//$this->log_sql( null, 'sign_up', $sql );
     $db->query( $sql );
     $this->log_sql( 'sign_up', $company_id, $sql );

     email_by_event( $user_id, 'Confirm Email', 'Email From System' );

     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'message'  ] = 'new account created';
     $this->echo_json( $return );
}

/*
 *   $.ajax({ method: send_email, user_id: 9...9, template_name: x...x });
 *
 *   status: ok
 *  message: x...x
 */
private function send_email() {
     $user_id       = get_request( 'user_id'           );
     $template_name = get_request( 'template_name'     );
     $email_from    = 'Email From System';

     $user     = db_get_row( 'Persons'  , 'id = ' . $user_id );
     $user_jky = db_get_row( 'JKY_Users', 'id = ' . $user_id );
     $to_name  = $user[ 'full_name'     ];
     $to_email = $user[ 'user_email'    ];
     $cc_name  = '';
     $cc_email = '';

     $template = db_get_row( 'Templates', 'template_name = "' . $template_name . '"' );
     $subject  = revert_entities($template[ 'template_subject'   ]);
     $body     = revert_entities($template[ 'template_body'      ]);

     $names    = explode( ';', get_control_value( 'System Keys', $email_from ));
     $from_name     = $names[ 0 ];
     $from_email    = $names[ 1 ];

     $search   = array();
     $replace  = array();
     $search[] = '+'               ; $replace[] = ' ';
     $search[] = '{SERVER_NAME}'   ; $replace[] = SERVER_NAME;
     $search[] = '{SUPPORT_NAME}'  ; $replace[] = $from_name;
     $search[] = '{USER_EMAIL}'    ; $replace[] = $user     [ 'user_email' ];
     $search[] = '{USER_NAME}'     ; $replace[] = $user     [ 'full_name'  ];
     $search[] = '{USER_KEY}'      ; $replace[] = $user_jky [ 'user_key'   ];

     $subject  = str_replace( $search, $replace, $subject   );
     $body     = str_replace( $search, $replace, $body      );

     email_now( $from_email, $from_name, $to_email, $to_name, $cc_email, $cc_name, $subject, $body );

     $return = array();
     $return[ 'status'   ] = 'ok';
     $return[ 'message'  ] = 'Email sent out, the template: ' . $template_name;
     $this->echo_json( $return );
}

/*
 *   $.ajax({ method: send_receipt, receive_id: 9...9, template_name: x...x });
 *
 *   status: ok
 *  message: x...x
 */
    private function send_receipt() {
	$receive_id    = get_request( 'receive_id'        );
	$template_name = get_request( 'template_name'     );
	$email_from    = 'Email From System';

	$receive  = db_get_row ('Receives', 'id = ' . $receive_id);
	$services = db_get_rows('Services', 'receive_id = ' . $receive_id);

	$helper_names = '';
	foreach ($services as $service) {
	    $user = db_get_row('Persons', 'id = ' . $service['user_id']);
	    $helper_names .= '<br>' . $user['full_name'];
	}

	$to_name  = $receive['full_name'];
	$to_email = $receive['email'    ];
	$cc_name  = '';
	$cc_email = '';

	$template = db_get_row( 'Templates', 'template_name = "' . $template_name . '"' );
	$subject  = revert_entities($template[ 'template_subject'   ]);
	$body     = revert_entities($template[ 'template_body'      ]);

	$names    = explode( ';', get_control_value( 'System Keys', $email_from ));
	$from_name     = $names[ 0 ];
	$from_email    = $names[ 1 ];

	$search   = array();
	$replace  = array();
	$search[] = '+'                 ; $replace[] = ' ';
	$search[] = '{SERVER_NAME}'     ; $replace[] = SERVER_NAME;
	$search[] = '{FULL_NAME}'       ; $replace[] = $receive['full_name'     ];
	$search[] = '{STREET}'          ; $replace[] = $receive['street'        ];
	$search[] = '{CITY}'            ; $replace[] = $receive['city'          ];
	$search[] = '{ZIP}'             ; $replace[] = $receive['zip'           ];
	$search[] = '{STATE}'           ; $replace[] = $receive['state'         ];
	$search[] = '{RECEIVE_ON}'      ; $replace[] = format_date($receive['receive_on']);
	$search[] = '{RECEIVE_AMOUNT}'  ; $replace[] = $receive['receive_amount'];
	$search[] = '{EVENT_NAME}'      ; $replace[] = get_session('event_name');
	$search[] = '{HELPER_NAMES}'    ; $replace[] = $helper_names;

	$subject  = str_replace( $search, $replace, $subject   );
	$body     = str_replace( $search, $replace, $body      );

	email_now( $from_email, $from_name, $to_email, $to_name, $cc_email, $cc_name, $subject, $body );

	$return = array();
	$return[ 'status'   ] = 'ok';
	$return[ 'message'  ] = 'Email sent out, the template: ' . $template_name;
	$this->echo_json( $return );
    }

//   ---------------------------------------------------------------------------

private function get_last_id( $table, $where='1' ) {
     $sql = 'SELECT id'
	  . '  FROM ' . $table
	  . ' WHERE ' . $where
	  . ' ORDER BY created_at DESC'
	  . ' LIMIT 0, 1'
	  ;
     $db  = Zend_Registry::get( 'db' );
     return $db->fetchOne( $sql );
}

private function get_only_id() {
     $sql = 'SELECT id'
	  . '  FROM ' . get_request( 'table' )
	  . ' WHERE ' . get_request( 'where' )
	  ;
     $db  = Zend_Registry::get( 'db' );
     return $db->fetchOne( $sql );
}

private function log_sql( $table, $id, $sql ) {
     $date = date( 'Y-m-d' );
     $time = date( 'H:i:s' );

     $logFile = fopen( SERVER_BASE . 'logsql/' . $date . '.txt', 'a' ) or die( 'cannot open logsql file' );
     fwrite( $logFile, get_now() . ' table ' . $table . ' id ' . $id . ' ' . $sql . NL );
     fclose( $logFile );
}

    private function history_log($method, $table, $id, $new, $old) {
	$history = '';
	$first   = '';
	foreach($new as $key=>$value) {
	    if ($method == 'update') {
		if ($key != 'updated_at' and $new[$key] != $old[$key]) {
		    $history .= $first . $key . ':' . $old[$key] . '=>'. $value;
		    $first = ', ';
		}
	    } else {
		$history .= $first . $key . ':' . $value;
		$first = ', ';
	    }
	}

	if (empty($history)) {
	    return;
	}
	$sql= 'INSERT History'
	    . '   SET created_by    = "' . get_session('user_id') . '"'
	    . '     , created_at    =  ' . 'NOW()'
	    . '     , parent_name   = "' . $table . '"'
	    . '     , parent_id     =  ' . $id
	    . '     , method       = "' . $method . '"'
	    . '     , history       = "' . $history . '"'
	;
//        $this->log_sql('History', null, $sql);
	$db  = Zend_Registry::get( 'db' );
	$db->query( $sql );
    }

private function getUniqueNumber( $table, $field ) {
     while ( true ) {
	  $number = mt_rand( 1000000000, 1999999999 );
	  $sql = 'SELECT id'
	       . '  FROM ' . $table
	       . ' WHERE ' . $field . ' = ' . $number
	       ;
	  $db  = Zend_Registry::get( 'db' );
	  $result = $db->fetchOne( $sql );
	  if( !$result )
	       return $number;
     }
}

private function echo_error( $message ) {
     $return = array();
     $return[ 'status'  ] = 'error';
     $return[ 'message' ] = $message;
     echo json_encode( $return );
}

/*
 *   $.ajax({ method:'set_amount', table:'Admin', receive_id:receive_id, service_id:service_id, fee_amount:fee_amount};
 *
 *   status: ok
 *  message: record updated
 */
    private function set_amount() {
	$table      = get_request('table'     );
	$receive_id = get_request('receive_id');
	$service_id = get_request('service_id');
	$fee_amount = get_request('fee_amount');

	if(  $receive_id == ''
	or   $service_id == ''
	or   $fee_amount == '' ) {
	    $this->echo_error( 'missing input fields' );
	    return;
	}

	$updated = '  updated_by='  . get_session( 'user_id' )
		 . ', updated_at="' . get_time() . '"'
		 ;

	$sql = 'UPDATE Receives'
	     . '   SET ' . $updated
	     . '     , set_amount = set_amount + ' . $fee_amount
	     . ' WHERE id = ' . $receive_id
	     ;
	$this->log_sql( $table, 'update', $sql );
	$db  = Zend_Registry::get( 'db' );
	$db->query( $sql );

	if ($fee_amount < 0) {
	    $receive_id = 'null';
	}
	$sql = 'UPDATE Services'
	     . '   SET ' . $updated
	     . '     , receive_id = ' . $receive_id
	     . '     , receive_amount = receive_amount + ' . $fee_amount
	     . ' WHERE id = ' . $service_id
	     ;
	$this->log_sql( $table, 'update', $sql );
	$db  = Zend_Registry::get( 'db' );
	$db->query( $sql );

	$return = array();
	$return[ 'status'   ] = 'ok';
	$return[ 'message'  ] = 'record updated';
	echo json_encode( $return );
    }

/*
 *   $.ajax({ method:'reset_amount', table:'Admin', receive_id:receive_id, service_id:service_id, fee_amount:fee_amount};
 *
 *   status: ok
 *  message: record updated
 */
    private function reset_amount() {
	$table      = get_request('table'     );
	$receive_id = get_request('receive_id');
	$service_id = get_request('service_id');
	$fee_amount = get_request('fee_amount');

	if(  $receive_id == ''
	or   $service_id == ''
	or   $fee_amount == '' ) {
	    $this->echo_error( 'missing input fields' );
	    return;
	}

	$updated = '  updated_by='  . get_session( 'user_id' )
		 . ', updated_at="' . get_time() . '"'
		 ;

	$sql = 'UPDATE Receives'
	     . '   SET ' . $updated
	     . '     , set_amount = set_amount - ' . $fee_amount
	     . ' WHERE id = ' . $receive_id
	     ;
	$this->log_sql( $table, 'update', $sql );
	$db  = Zend_Registry::get( 'db' );
	$db->query( $sql );

	if ($fee_amount < 0) {
	    $receive_id = 'null';
	}
	$sql = 'UPDATE Services'
	    . '   SET ' . $updated
	    . '     , receive_id = ' . $receive_id
	    . '     , receive_amount = receive_amount - ' . $fee_amount
	    . ' WHERE id = ' . $service_id
	;
	$this->log_sql( $table, 'update', $sql );
	$db  = Zend_Registry::get( 'db' );
	$db->query( $sql );

	$return = array();
	$return[ 'status'   ] = 'ok';
	$return[ 'message'  ] = 'record updated';
	echo json_encode( $return );
    }

/*
 *   $.ajax({ method: refresh, table: x...x });
 *
 *   status: ok
 */
    private function refresh() {
/*
	if (get_session('user_action') != 'All') {
	    return;
	}

	$table         = get_request( 'table' );
	$db            = Zend_Registry::get( 'db' );

	if( $table == 'Summary' ) {
	    $fileName = '../sql/Summary.sql';
	    $inpFile  = fopen( $fileName, 'r' );
	    $sql      = fread( $inpFile, filesize( $fileName ));
	    fclose( $inpFile );

	    $db->query($sql);
	}
*/
	$this->init_counters();

	$sql = 'SELECT Services.*'
	     . '     , Persons.gender, Persons.all_gifts, Persons.church_name'
	     . '  FROM Services'
	     . '  LEFT JOIN Persons ON Persons.id = Services.user_id'
	     . ' WHERE Services.event_id = ' . get_session('event_id')
	     ;
	$db   = Zend_Registry::get( 'db' );
	$rows = $db->fetchAll( $sql );
	foreach( $rows as $row ) {
	    $weeks = 0;
	    if ($row['week_1']=='yes')  {$weeks += 1;}
	    if ($row['week_2']=='yes')  {$weeks += 1;}
	    if ($row['week_3']=='yes')  {$weeks += 1;}

	    $week_1 = ($weeks == 1) ? 1 : 0;
	    $week_2 = ($weeks == 2) ? 1 : 0;
	    $week_3 = ($weeks == 3) ? 1 : 0;

	    $gender = $row['gender'];
	    if ($gender == '') {
		$gender = 'unknown';
	    }
	    $this->add_counter('Tshirt Size'        , $gender       . ' + ' . $row['tshirt_size'], $week_1, $week_2, $week_3);

	    $week_1 = ($row['week_1']=='yes') ? 1 : 0;
	    $week_2 = ($row['week_2']=='yes') ? 1 : 0;
	    $week_3 = ($row['week_3']=='yes') ? 1 : 0;

	    $this->add_counter('Language English'   , 'Speaking '   . ' + ' . $row['en_speaking'], $week_1, $week_2, $week_3);
	    $this->add_counter('Language English'   , 'Reading '    . ' + ' . $row['en_reading' ], $week_1, $week_2, $week_3);
	    $this->add_counter('Language English'   , 'Writing '    . ' + ' . $row['en_writing' ], $week_1, $week_2, $week_3);
	    $this->add_counter('Language Mandarim'  , 'Speaking '   . ' + ' . $row['ma_speaking'], $week_1, $week_2, $week_3);
	    $this->add_counter('Language Mandarim'  , 'Reading '    . ' + ' . $row['ma_reading' ], $week_1, $week_2, $week_3);
	    $this->add_counter('Language Mandarim'  , 'Writing '    . ' + ' . $row['ma_writing' ], $week_1, $week_2, $week_3);
	    $this->add_counter('Language Taiwanese' , 'Speaking '   . ' + ' . $row['tw_speaking'], $week_1, $week_2, $week_3);
	    $this->add_counter('Language Taiwanese' , 'Reading '    . ' + ' . $row['tw_reading' ], $week_1, $week_2, $week_3);
	    $this->add_counter('Language Taiwanese' , 'Writing '    . ' + ' . $row['tw_writing' ], $week_1, $week_2, $week_3);

	    $age = $row['helper_age'];
		 if( $age > 20 and $age < 31)    $age = '21 - 30';
	    else if( $age > 30 and $age < 41)    $age = '31 - 40';
	    else if( $age > 40 and $age < 51)    $age = '41 - 50';
	    else if( $age > 50 and $age < 61)    $age = '51 - 60';
	    else if( $age > 60              )    $age = '61 +'   ;
	    $this->add_counter('Count by Age'           , $age          , $week_1, $week_2, $week_3);

	    $school_year = $row['school_year'];
	    if ($school_year == '') {
		$school_year = 'unknown';
	    }
	    $this->add_counter('Count by School Year'   , $school_year  , $week_1, $week_2, $week_3);

	    $names = explode(' ', $row['all_gifts']);
	    foreach($names as $name) {
		if ($name != '') {
		    $this->add_counter('Count by Gift'  , $name         , $week_1, $week_2, $week_3);
		}
	    }

	    $church_name = $row['church_name'];
	    if ($church_name == '' or $church_name == 'null') {
		$church_name = 'unknown';
	    }
	    $this->add_counter('Count by Church'        , $church_name  , $week_1, $week_2, $week_3);

	    $completed = $row['completed'];
	    $this->add_counter('Percentage Completed'   , $completed    , $week_1, $week_2, $week_3);
	}

	$sql = NL . 'TRUNCATE TABLE Summary;'
	     . NL . 'INSERT INTO `Summary` (`id`, `group_by`, `group_key`, `week_1`, `week_2`, `week_3`) VALUES '
	     ;
	$first = ' ';
	$counters = $this->get_counters();
	foreach($counters as $group_by=>$counter_by) {
	    foreach($counter_by as $group_key=>$counter_key) {
		$sql .= NL . $first . '(NULL, "' . $group_by . '", "' . $group_key . '", ' . $counter_key[0] . ', ' . $counter_key[1] . ', ' . $counter_key[2] . ')';
		$first = ',';
	    }
	}
	$sql .= "\n;";
	$db->query($sql);

	$return = array();
	$return[ 'status'   ] = 'ok';
	echo json_encode( $return );
    }

}
?>
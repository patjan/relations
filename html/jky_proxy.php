<?
/*
 *   JKY Proxy
 *
 *   http://.../jky_proxy.php?command=get_session
 *
 */
require_once 'jky_constant.php';

class jky_proxy {
     var  $DOMAIN;
     var  $POSTURL;
     var  $POSTVARS = '';
     var  $PURL     = array();
     var  $RESPONSE = array();
     var  $CONTENT;

     public function __construct() {
          define( 'HOST', $_SERVER[ 'SERVER_NAME' ] . $_SERVER[ 'PHP_SELF' ]);
     }

     public function close() {
          unlink( session_id() );
          session_destroy();
          header( 'Location: /' );
     }

     public function query( $U, $POST, $GET, $FILES, $COOKIE='' ) {
          function log_proxy( $message ) {
               $date = date( 'Y-m-d' );
               $time = date( 'H:i:s' );
               $logFile = fopen( '../proxy//' . $date . '.txt', 'a' ) or die( 'cannot open proxy file' );
               fwrite( $logFile, $time . ' ' . $message . "\n" );
               fclose( $logFile );
          }

log_proxy( '' );
//log_proxy( '      IP: ' . $_SERVER['REMOTE_ADDR']);
//log_proxy( '       U: ' . $U         );
//log_proxy( '    POST: ' . var_export( $POST , true ));
//log_proxy( '     GET: ' , $GET       );
//log_proxy( '   FILES: ' . var_export( $FILES, true ));
//log_proxy( '  COOKIE: ' . $COOKIE    );

          if(  count( $POST )) {
               foreach( $POST as $key => $value ) {
                    if(  $key != 'u' && $key != 'c' )
                         $value  = str_replace( '\\"', '"', $value );           //   (PJ 2011-06-11 ) needed on Linux
                         $this->POSTVARS .= $key . "=" . $value . "&";
               }
               if( $this->POSTVARS )     $posted = 1;
          }

          if(  count( $FILES )) {
               $filed = 1;
               foreach( $FILES as $key => $value ) {
                    $this->POSTVARS .= $key . "=@" . $value[ 'tmp_name' ] . "&";
               }
          } else {
               $filed = 0;
          }

          $this->POSTVARS = $this->POSTVARS ? substr( $this->POSTVARS, 0, -1 ) : '';

          $U = urldecode( $U );
          if(  !preg_match( '~[.]+~'                , $U ))   $U = base64_decode( $U );
          if(  !preg_match( '~^(http|ftp|https)~'   , $U ))   $U = 'http://' . $U;
          $this->POSTURL = $U;

          foreach( $GET as $key =>$value ) {
               if(  $key != 'u' && $key != 'c' )  
                    $this->POSTURL .= '&' . $key . '=' . $value;
          }

          $this->PURL   = parse_url( $U );
          $this->DOMAIN = $this->PURL[ 'host' ] . $this->PURL[ 'path' ];
          if(  preg_match( '~.~', $this->PURL[ 'path' ]))
               $this->DOMAIN = preg_replace( '~/[^\/]*$~', '', $this->DOMAIN );

          define( 'PHOST'  , $this->PURL[ 'host' ]);
          define( 'DOMAIN' , $this->DOMAIN );

log_proxy( ' POSTURL: ' . $this->POSTURL     );
log_proxy( 'POSTVARS: ' . $this->POSTVARS    );
//log_proxy( '    PURL: ' . var_export( $this->PURL , true ));
//log_proxy( '   PHOST: ' . var_export( $this->PHOST, true ));
//log_proxy( '  DOMAIN: ' . $this->DOMAIN      );
//log_proxy( '   AGENT: ' . $_SERVER[ 'user-agent' ] );
//log_proxy( ' SESSION: ' . 'ses_' . session_id() );

          $ch = curl_init( $this->POSTURL );

          if(  $posted )      curl_setopt( $ch, CURLOPT_POST          , 0 );
                              curl_setopt( $ch, CURLOPT_VERBOSE       , 0 );
//                              curl_setopt( $ch, CURLOPT_USERAGENT     , $_SERVER[ 'User-Agent' ]);
          if(  $posted )      curl_setopt( $ch, CURLOPT_POSTFIELDS    , $this->POSTVARS );
          if(  $filed  )      curl_setopt( $ch, CURLOPT_UPLOAD        , 1 );
//                              curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1 );
                              curl_setopt( $ch, CURLOPT_BINARYTRANSFER, 1 );
                              curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, 0 );
                              curl_setopt( $ch, CURLOPT_SSL_VERIFYHOST, 0 );
                              curl_setopt( $ch, CURLOPT_REFERER       , "http://" . $this->DOMAIN );
                              curl_setopt( $ch, CURLOPT_CONNECTTIMEOUT, 0 );
                              curl_setopt( $ch, CURLOPT_AUTOREFERER   , 0 );
                              curl_setopt( $ch, CURLOPT_COOKIEJAR     , 'ses_' . session_id() );
                              curl_setopt( $ch, CURLOPT_COOKIEFILE    , 'ses_' . session_id() );

          if(  strlen( $COOKIE ) > 0 )
                              curl_setopt( $ch, CURLOPT_COOKIE        , $COOKIE );

                              curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );
                              curl_setopt( $ch, CURLOPT_FAILONERROR   , 1 );

          $this->CONTENT  = curl_exec   ( $ch );
          $this->RESPONSE = curl_getinfo( $ch );

log_proxy( ' CONTENT: ' . $this->CONTENT  );
//log_proxy( 'RESPONSE: ' . var_export( $this->RESPONSE, true ));

          curl_close( $ch );
     }

     public function getPage() {
               if(  preg_match( '~html~'        , $this->RESPONSE[ 'content_type' ]))   { $this->get_html        (); $this->get_css();  }
          else if(  preg_match( '~image~'       , $this->RESPONSE[ 'content_type' ]))   { $this->get_image       (); }
          else if(  preg_match( '~javascript~'  , $this->RESPONSE[ 'content_type' ]))   { $this->get_javascript  (); }
          else if(  preg_match( '~css~'         , $this->RESPONSE[ 'content_type' ]))   { $this->get_css         (); }
          else                                                                  { $this->get_file        (); }

          header( "Content-Type: " . $this->RESPONSE[ 'content_type' ]);
          if(  preg_match( '~image/([a-z]+)~'  , $this->RESPONSE[ 'content_type' ], $type )) {
               $newImg = imagecreatefromstring( $this->CONTENT );
               if(  $type[ 1 ] = "jpeg" )    imagejpeg ( $newImg, '', 100 );
               if(  $type[ 1 ] = "png"  )    imagegif  ( $newImg, '', 100 );
               if(  $type[ 1 ] = "gif"  )    imagepng  ( $newImg, '', 100 );
          } else {
               echo $this->CONTENT;
          }
     }

     public function get_file() {
     }

     public function get_image() {
     }

     public function get_javascript() {
          $patern = array( '~/([\"]+)([^\"\s]*)([\"]+)/i~', '~/([\']+)([^\'\s]*)([\']+)/i~' );
          function replace_js( $m ) {
               $d = '';
               if(  preg_match( '~^\/~', $m[ 2 ] )) {
                    $d  = 'http://' . PHOST;
                    $ok = 1;
               } else {
                    if( !preg_match( '~^(htt|ftp)~', $m[ 2 ]) && preg_match( '~/~', $m[ 2 ])) {
                         $d  = 'http://' . DOMAIN . '/';
                         $ok = 1;
                    }
               }

               if(  $ok ) {
                    return $m[ 1 ] . 'http://' . HOST . '?u=' . base64_encode( $d . $m[ 2 ]) . $m[ 1 ];
               } else {
                    return $m[ 1 ] . $m[ 2 ] . $m[ 1 ];
               }
          }
          $this->CONTENT = preg_replace_callback( $patern,"replace_js",$this->CONTENT );
     }

     public function get_css() {
          $patern=array( '~/url\([\s]*[\'\"\`]?([^\)\s\'\"\`]+)[\'\"\`]?[\s]*\)/i~' );
          function replace_css( $m ) {
               $d = '';
               if(  preg_match( '~^\/~', $m[ 1 ] )) {
                    $d  = 'http://' . PHOST;
                    $ok = 1;
               } else {
                    if( !preg_match( '~^(htt|ftp)~', $m[ 1 ] )) {
                         $d  = 'http://' . DOMAIN . '/';
                         $ok = 1;
                    } else {
                         $ok=1;
                    }
               }

               if( $ok ) {
                   return 'url( http://' . HOST . '?u=' . base64_encode( $d . $m[ 1 ]) . ')';
               }


          }
          $this->CONTENT = preg_replace_callback( $patern, "replace_css", $this->CONTENT );
     }

     public function get_html() {
          $patern=array( '/[\s]+(src|href|url|location|background|action)[\s]*=[\s]*([\'\"\`])?[\s]*([^\'\"\`\s>]+)([\'\"\`>])?/i', '/([\"]+)(\/[^\"\s]*)([\"]+)/i', '/([\']+)(\/[^\'\s]*)([\']+)/i' );
          function replace_html( $m ) {
               $d = '';
               if(  $m[ 1 ] == '"' || $m[ 1 ] == "'" ) {
                    if(  preg_match( '~^\/~', $m[ 2 ] )) {
                         $d  = 'http://' . PHOST;
                         $ok = 1;
                    } else {
                         if( !preg_match( '~^(htt|ftp)~', $m[ 2 ]) && preg_match( '~/~', $m[ 2 ] )) {
                              $d  = 'http://' . DOMAIN . '/';
                              $ok = 1;
                         }
                    }
                    if( $ok ) {
                         return $m[ 1 ] . 'http://' . HOST . '?u=' . base64_encode( $d . $m[ 2 ]) . $m[ 1 ];
                    } else {
                         return $m[ 1 ] . $m[ 2 ] . $m[ 1 ];
                    }

               } else {
                    if(  $m[ 4 ] == '>' )
                         $e = ">";
                    if(  preg_match( '~^\/~', $m[ 3 ])) {
                         $d = 'http://' . PHOST;
                    } else {
                         if( !preg_match( '~^(htt|ftp)~', $m[ 3 ] ))
                              $d = 'http://' . DOMAIN . '/';
                    }
                    if( !preg_match( '~^java~', $m[ 3 ] )) {
                         return ' ' . $m[ 1 ] . '="http://' . HOST . '?u=' . base64_encode( $d. $m[ 3 ]) . '"' . $e;
                    } else {
                         return ' ' . $m[ 1 ] . '="' . $m[ 3 ] . '"';
                    }
               }
          }
//          this code is replacing src= href= with current doman
//          $this->CONTENT = preg_replace_callback( $patern, 'replace_html', $this->CONTENT );
     }
} 

session_start();

$U = SERVER_NAME . 'index.php/ajax?';
$COOKIE = '';
    
$program = new jky_proxy();
$program->query( $U, $_POST, $_GET, $_FILES, $COOKIE );
$program->getPage();
?>
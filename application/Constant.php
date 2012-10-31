<?
//   define constants

define( 'SITE_NAME'           , 'Advent'                    );
define( 'HEADER_TEXT'         , ''                          );
define( 'TIME_ZONE'           , 'pst: '                     );
define( 'PER_PAGE'            , '15'                        );
define( 'LANGUAGE'            , 'en'                        );

define( 'ANNOUNCEMENT'        , ''                          );
define( 'TITLE'               , 'Example'                   );
define( 'DESCRIPTION'         , 'Example'                   );
define( 'KEYWORDS'            , 'Example'                   );
define( 'COPYRIGHT'           , 'Copyright &#169; 2011 JKY Software Corp.&nbsp; All rights reserved.' );
define( 'REGISTERED'          , '' );

define( 'VERSION'             , '5.01.01'                   );
define( 'UPDATED'             , '06-15-2010'                );
define( 'ENVIRONMENT'         , 'development'               );        //   development / test / production

define( 'PRE_LOGIN'           , 'user/login'                );
define( 'POS_LOGIN_INTERNAL'  , 'home'                      );
define( 'POS_LOGIN_EXTERNAL'  , 'home'                      );

define( 'MODEL'               , 'Model_'                    );        //   ZF 1.10 must be Model_
define( 'INDEX'               , '/'                         );        //   windows must be '/'
define( 'APP_PATH'            ,  dirname( __FILE__ )        );
define( 'COMPANY_ID'          , '1000000001'                );
define( 'WEB_SITE'            , 'http://im4/'               );
define( 'DOMAIN_NAME'         , 'pat'                       );
define( 'SERVER_NAME'         , 'http://relations/'         );
define( 'SERVER_BASE'         , '../'         );
define( 'APPLICATION'         , '../application/');
define( 'LIBRARY'             , '/../library/'              );
define( 'DELIVERY_BASE'       , 'C:/htdocs/relations/'      );
define( 'START_ASSET'         , 'start/'     );
define( 'END_ASSET'           , 'end/'       );
define( 'IMAGES'              , 'images/layout/'            );
define( 'PHOTOS'              , 'photos/'                   );
define( 'THUMBS'              , 'thumbs/'                   );
define( 'FTP_FLV'             , DELIVERY_BASE . 'flv/'      );
define( 'FTP_SWF'             , DELIVERY_BASE . 'swf/'      );
define( 'UPLOADS'             , DELIVERY_BASE . 'html/uploads/'  );
define( 'EMAIL_FROM'          , 'noreply@advent.com'        );
define( 'LANGUAGES'           , 'languages/'                );
define( 'EXTERNAL_URL'        , 'http://wp-zinc/'           );

define( 'CLOUD_USER'          , 'cecil'                               );
define( 'CLOUD_KEY'           , '57192664c837cae125f177eeea41eb1b'    );
define( 'CLOUD_DIR'           , 'flv_test'                            );

define( 'FTP_SERVER'          , 'ftp.example.com'           );
define( 'FTP_USER'            , 'ftp_user'                  );
define( 'FTP_PASS'            , 'ftp_pass'                  );
define( 'FTP_PATH'            , 'http://example.com/ftp/'   );

define( 'TRUST_CUSTID'        , '848620'                    );
define( 'TRUST_PASSWORD'      , 'commerce6'                 );
define( 'TRUST_VAULT_PASSWORD', 'commerce7'                 );

define( 'DB_HOST'             , 'internal-db.s122232.gridserver.com'                  );
define( 'DB_USER'             , 'db122232_pat_jan'          );
define( 'DB_PASS'             , 'Brazil18781'               );
define( 'DB_NAME'             , 'db122232_advent'           );

define( 'DATE_FORMAT'         , 'mm-dd-yyyy'                );
define( 'DECIMAL_POINT'       , '.'                         );

define( 'QUOTE'               , ''      );
define( 'BR'                  , "<br>"  );
define( 'NL'                  , "\r\n"  );
define( 'TAB'                 , "\t"    );
define( 'SEPARATOR'           , "\r\n"  );

define( 'MINIMUM_TO_BROWSE'   , '0'     );
define( 'MINIMUM_TO_EDIT'     , '1'     );
define( 'MINIMUM_TO_PRODUCE'  , '3'     );
define( 'MINIMUM_TO_MANAGE'   , '4'     );
define( 'MINIMUM_TO_UPDATE'   , '5'     );
define( 'MINIMUM_TO_ACCOUNT'  , '6'     );
define( 'MINIMUM_TO_ADMIN'    , '8'     );
define( 'MINIMUM_TO_SUPPORT'  , '9'     );

define( 'HAS_UNIVERSAL'       , FALSE   );        //   the system automatically assign [Univeral] tag to new users or new companies
define( 'HAS_SIGN_UP'         , TRUE    );        //   the system has [Sign Up] function for new users
define( 'HAS_SECOND'          , FALSE   );        //   the system has [second] support for clients
define( 'HAS_LANGUAGE'        , FALSE   );        //   the system has different [language] to be selected
define( 'HAS_FOREIGN'         , FALSE   );        //   the system has [foreign] language name or address
define( 'HAS_CERTIFIED'       , FALSE   );        //   the system has [certified] type of users
define( 'HAS_NFE_DL'          , FALSE   );        //   this is unique only for DL
define( 'HAS_NFE_TM'          , FALSE   );        //   this is unique only for TM

define( 'HAS_COMMENTS'        , TRUE    );
define( 'HAS_COMPANIES'       , TRUE    );
define( 'HAS_EVENTS'          , FALSE   );
define( 'HAS_GROUPS'          , FALSE   );
define( 'HAS_LETTERS'         , FALSE   );
define( 'HAS_PAYMENTS'        , FALSE   );
define( 'HAS_PROJECTS'        , FALSE   );
define( 'HAS_QUOTES'          , FALSE   );
define( 'HAS_SALES'           , FALSE   );
define( 'HAS_TAGS'            , FALSE   );
define( 'HAS_VIDEOS'          , TRUE    );        //   this is unique only for IN
?>
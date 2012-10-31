DROP   TABLE IF     EXISTS Emails;
CREATE TABLE IF NOT EXISTS Emails
( id                BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT
, letter_id         BIGINT UNSIGNED     NULL
, sent_from         BIGINT UNSIGNED     NULL
, sent_to           BIGINT UNSIGNED     NULL
, sent_at           DATETIME            NULL
, replied_at        DATETIME            NULL
, confirm           VARCHAR(255)        NULL                # unique md5
, to_name           VARCHAR(255)        NULL
, to_email          VARCHAR(255)        NULL
, cc_name           VARCHAR(255)        NULL
, cc_email          VARCHAR(255)        NULL
, controller        VARCHAR(32)         NULL
, action            VARCHAR(32)         NULL
, message           VARCHAR(255)        NULL                # error message
, subject           VARCHAR(255)        NULL
, body              TEXT                NULL

, PRIMARY KEY  	( id )
, KEY sent_to  	( sent_to )
, KEY confirm	( confirm )
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000000001
;

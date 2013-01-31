DROP   TABLE IF     EXISTS Comments;
CREATE TABLE IF NOT EXISTS Comments
( id                BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT
, created_by        BIGINT UNSIGNED     NULL
, created_at        DATETIME            NULL
, updated_by        BIGINT UNSIGNED     NULL
, updated_at        DATETIME            NULL
, status            VARCHAR(32)         NULL                # private staff

, parent_name       VARCHAR(32)         NULL
, parent_id         BIGINT UNSIGNED     NULL

, created_name      VARCHAR(255)        NULL                # ???
, created_email     VARCHAR(255)        NULL                # ???
, comment           TEXT                NULL

, PRIMARY KEY  		( id )
, KEY parent_id		( parent_name, parent_id )
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000000001
;


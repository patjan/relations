DROP   TABLE IF     EXISTS Templates;
CREATE TABLE IF NOT EXISTS Templates
( id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT
, created_by        BIGINT UNSIGNED     NULL
, created_at        DATETIME            NULL
, updated_by        BIGINT UNSIGNED     NULL
, updated_at        DATETIME            NULL
, status            VARCHAR(32)         NULL      DEFAULT 'active'

, organ_id        	BIGINT UNSIGNED     NULL
, template_name     VARCHAR(255)        NULL

, template_type     VARCHAR(32)         NULL                          # by event / by time / mass email
, template_subject  VARCHAR(255)        NULL
, template_body     TEXT                NULL
, template_sql      TEXT                NULL
, description       TEXT                NULL

, PRIMARY KEY  		( id )
, KEY organ_id		( organ_id )
, KEY template_name	( template_name )
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001
;

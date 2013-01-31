DROP   TABLE IF     EXISTS Tickets;
CREATE TABLE IF NOT EXISTS Tickets
( id                BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT
, created_by        BIGINT UNSIGNED     NULL
, created_at        DATETIME            NULL
, updated_by        BIGINT UNSIGNED     NULL
, updated_at        DATETIME            NULL
, status            VARCHAR(32)         NULL      DEFAULT 'active'

, organ_id        	BIGINT UNSIGNED     NULL                          # default = COMPANY_ID
, opened_by         BIGINT UNSIGNED     NULL
, opened_at         DATETIME            NULL
, assigned_to       BIGINT UNSIGNED     NULL
, assigned_at       DATETIME            NULL
, closed_by         BIGINT UNSIGNED     NULL
, closed_at         DATETIME            NULL
, priority          VARCHAR(32)         NULL      DEFAULT 'normal'
, description       TEXT                NULL
, resolution        TEXT                NULL

, PRIMARY KEY  		( id )
, KEY organ_id		( organ_id )
, KEY opened_at		( priority, opened_at )
, KEY assigned_at	( assigned_to, priority, assigned_at )
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000000001
;

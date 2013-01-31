DROP   TABLE IF     EXISTS Families;
CREATE TABLE IF NOT EXISTS Families
( id                BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT
, created_by        BIGINT UNSIGNED     NULL
, created_at        DATETIME            NULL
, updated_by        BIGINT UNSIGNED     NULL
, updated_at        DATETIME            NULL
, status            VARCHAR(32)         NULL      DEFAULT 'active'

, address_id        BIGINT UNSIGNED     NULL                        # point to Addresses table (id)

, family_name      	VARCHAR(255)        NULL

, PRIMARY KEY  		( id )
, KEY address_id    ( address_id    )
, KEY family_name  	( family_name   )
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001
;

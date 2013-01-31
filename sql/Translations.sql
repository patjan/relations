DROP   TABLE IF     EXISTS Translations;
CREATE TABLE IF NOT EXISTS Translations
( id                BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT
, created_by        BIGINT UNSIGNED     NULL
, created_at        DATETIME            NULL
, updated_by        BIGINT UNSIGNED     NULL
, updated_at        DATETIME            NULL
, status            VARCHAR(32)         NULL      DEFAULT 'active'

, parent_id         BIGINT UNSIGNED     NULL      # if locale = English US, then = id
, locale            VARCHAR(32)
, sentence          VARCHAR(255)

, PRIMARY KEY  		( id )
, KEY parent_id	   	( parent_id )
, KEY locale   		( locale    )
, KEY sentence 		( sentence  )
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001
;
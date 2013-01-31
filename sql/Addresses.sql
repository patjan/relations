DROP   TABLE IF     EXISTS Addresses;
CREATE TABLE IF NOT EXISTS Addresses
( id                BIGINT UNSIGNED     NOT NULL    AUTO_INCREMENT
, created_by        BIGINT UNSIGNED     NULL
, created_at        DATETIME            NULL
, updated_by        BIGINT UNSIGNED     NULL
, updated_at        DATETIME            NULL
, status            VARCHAR(32)         NULL        DEFAULT 'active'

, street_number     INT                 NULL
, street_name       VARCHAR(255)        NULL
, zip               VARCHAR(255)        NULL
, city              VARCHAR(255)        NULL
, state             VARCHAR(255)        NULL
, country           VARCHAR(255)        NULL

, PRIMARY KEY       ( id )
, KEY street_number ( street_number )
, KEY street_name   ( street_name   )
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001
;


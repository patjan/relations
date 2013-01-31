DROP   TABLE IF     EXISTS Controls;
CREATE TABLE IF NOT EXISTS Controls
( id                BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT
, created_by        BIGINT UNSIGNED     NULL
, created_at        DATETIME            NULL
, updated_by        BIGINT UNSIGNED     NULL
, updated_at        DATETIME            NULL
, status            VARCHAR(32)         NULL      DEFAULT 'active'

, organ_id          BIGINT UNSIGNED     NULL                          # points to Organizations  table (id)
, control_set       VARCHAR(32)         NULL      DEFAULT 'Root'
, control_seq       INT                 NULL      DEFAULT  0
, control_name      VARCHAR(255)        NULL
, control_value     MEDIUMTEXT          NULL

, PRIMARY KEY  		( id )
, KEY organ_id      ( organ_id   )
, KEY control_seq	( control_set, control_seq )
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001
;

INSERT INTO    Controls       SET status = 'active'    , company_id = 1000000001, control_set = 'Root'             , sequence = 130    , name = 'Template Types'     , value = '';
INSERT INTO    Controls       SET status = 'active'    , company_id = 1000000001, control_set = 'Template Types'   , sequence =   0    , name = 'by time'            , value = '';
INSERT INTO    Controls       SET status = 'active'    , company_id = 1000000001, control_set = 'Template Types'   , sequence =   0    , name = 'by event'           , value = '';
INSERT INTO    Controls       SET status = 'active'    , company_id = 1000000001, control_set = 'Template Types'   , sequence =   0    , name = 'mass email'         , value = '';

UPDATE         Controls       SET company_id = 1000000001;

UPDATE         Controls       SET sequence = 50                       WHERE       control_set = 'States'         AND sequence =   0;      
INSERT INTO    Controls       SET status = 'active'    , company_id = 1000000001, control_set = 'States'           , sequence =   0    , name = '&nbsp;'             , value = '';

UPDATE         Controls       SET sequence = 50                       WHERE       control_set = 'Countries'      AND sequence =   0;      
INSERT INTO    Controls       SET status = 'active'    , company_id = 1000000001, control_set = 'Countries'        , sequence =   0    , name = '&nbsp;'             , value = '';

ALTER TABLE    Controls       CHANGE     name     control_name   VARCHAR(255)  NULL;
ALTER TABLE    Controls       CHANGE     value    control_value  MEDIUMTEXT    NULL;

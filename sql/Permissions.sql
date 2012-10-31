DROP   TABLE IF     EXISTS Permissions;
CREATE TABLE IF NOT EXISTS Permissions
( id                BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT
, created_by        BIGINT UNSIGNED     NULL
, created_at        DATETIME            NULL
, updated_by        BIGINT UNSIGNED     NULL
, updated_at        DATETIME            NULL
, status            VARCHAR(32)         NULL      DEFAULT 'active'

, user_role         VARCHAR(32)         NULL                          # Visitor Guest Member Manager Staff Sales Account Admin Support ( parent )
, user_resource     VARCHAR(32)         NULL                          # All Actions Comments Companies Controls Problems Users
, user_action       VARCHAR(32)         NULL                          # All Denied View Insert Update Delete / Login Logout Profile


, PRIMARY KEY  ( id )
, KEY user_role     ( user_role )
, KEY user_resource ( user_resource )
, KEY user_action   ( user_action )
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001
;

INSERT INTO Permissions SET user_role = 'Support', user_resource = 'All', user_action = 'All';

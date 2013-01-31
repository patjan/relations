DROP   TABLE IF     EXISTS JKY_Users;
CREATE TABLE IF NOT EXISTS JKY_Users
( id                BIGINT UNSIGNED     NOT NULL    AUTO_INCREMENT
, created_by        BIGINT UNSIGNED     NULL
, created_at        DATETIME            NULL
, updated_by        BIGINT UNSIGNED     NULL
, updated_at        DATETIME            NULL
, status            VARCHAR(32)         NULL        DEFAULT 'active'

, person_id         BIGINT UNSIGNED     NULL                            # points to Persons        table (id)

, start_date        DATE                NULL
, end_date          DATE                NULL
, user_name         VARCHAR(255)        NULL                            # login name, unique
, user_type         VARCHAR(32)         NULL        DEFAULT 'member'    # support, admin, account, leader, member
, user_role         VARCHAR(32)         NULL        DEFAULT 'visitor'   # visitor, guest, member, teacher, captain, leader, account, admin, support
, user_key          VARCHAR(255)        NULL                            # unique    md5
, password          VARCHAR(255)        NULL                            # encrypted md5

, PRIMARY KEY  ( id )
, KEY person   ( person_id  )
, KEY user     ( user_name  )
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001
;
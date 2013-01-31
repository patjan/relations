DROP   TABLE IF     EXISTS Members;
CREATE TABLE IF NOT EXISTS Members
( id                BIGINT UNSIGNED     NOT NULL    AUTO_INCREMENT
, created_by        BIGINT UNSIGNED     NULL
, created_at        DATETIME            NULL
, updated_by        BIGINT UNSIGNED     NULL
, updated_at        DATETIME            NULL
, status            VARCHAR(32)         NULL        DEFAULT 'active'

, organ_id          BIGINT UNSIGNED     NULL                            # point to Organizations table (id)
, person_id         BIGINT UNSIGNED     NULL                            # point to Persons       table (id)

, start_date        DATE                NULL
, end_date          DATE                NULL

, member_type       VARCHAR(32)         NULL                            # visitor, member, employee, ...
, member_tags       VARCHAR(255)        NULL
, extra_info        TEXT                NULL                            # json format

, PRIMARY KEY       ( id )
, KEY organ_id      ( organ_id      )
, KEY person_id     ( person_id     )
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001
;


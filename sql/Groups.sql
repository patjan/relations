DROP   TABLE IF     EXISTS Groups;
CREATE TABLE IF NOT EXISTS Groups
( id                BIGINT UNSIGNED     NOT NULL    AUTO_INCREMENT
, created_by        BIGINT UNSIGNED     NULL
, created_at        DATETIME            NULL
, updated_by        BIGINT UNSIGNED     NULL
, updated_at        DATETIME            NULL
, status            VARCHAR(32)         NULL        DEFAULT 'active'

, organ_id          BIGINT UNSIGNED     NULL                            # point to Organizations table (id)
, leader_id         BIGINT UNSIGNED     NULL                            # point to Persons       table (id)
, trainner_id       BIGINT UNSIGNED     NULL                            # point to Persons       table (id) leader in trainning

, start_date        DATE                NULL
, end_date          DATE                NULL

, group_type        VARCHAR(32)         NULL                            # cell, ...
, group_name        VARCHAR(255)        NULL                            # unique per Organization
, group_tags        VARCHAR(255)        NULL
, extra_info        TEXT                NULL                            # json format

, PRIMARY KEY       ( id )
, KEY organ_id      ( organ_id      )
, KEY leader_id     ( leader_id     )
, KEY trainner_id   ( trainner_id   )
, KEY group_name    ( group_name    )
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001
;


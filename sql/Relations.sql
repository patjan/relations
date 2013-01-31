DROP   TABLE IF     EXISTS Relations;
CREATE TABLE IF NOT EXISTS Relations
( id                BIGINT UNSIGNED     NOT NULL    AUTO_INCREMENT
, created_by        BIGINT UNSIGNED     NULL
, created_at        DATETIME            NULL
, updated_by        BIGINT UNSIGNED     NULL
, updated_at        DATETIME            NULL
, status            VARCHAR(32)         NULL        DEFAULT 'active'

, person_id         BIGINT UNSIGNED     NULL                            # point to Persons table (id)
, relation_id       BIGINT UNSIGNED     NULL                            # point to Persons table (id)

, start_date        DATE                NULL
, end_date          DATE                NULL
, relationship      VARCHAR(32)         NULL                            # father, mother, step-father, step-mother, guardian

, PRIMARY KEY       ( id )
, KEY person_id     ( person_id     )
, KEY relation_id   ( relation_id   )
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001
;


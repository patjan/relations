DROP   TABLE IF     EXISTS Persons;
CREATE TABLE IF NOT EXISTS Persons
( id                BIGINT UNSIGNED     NOT NULL    AUTO_INCREMENT
, created_by        BIGINT UNSIGNED     NULL
, created_at        DATETIME            NULL
, updated_by        BIGINT UNSIGNED     NULL
, updated_at        DATETIME            NULL
, status            VARCHAR(32)         NULL        DEFAULT 'active'

, family_id         BIGINT UNSIGNED     NULL                        # point to Families table (id)
, address_id        BIGINT UNSIGNED     NULL                        # point to Addresses table (id)

, person_number     BIGINT              NULL        DEFAULT  0      # unique 10 digits
, first_name        VARCHAR(255)        NULL                        # only first name
, last_name         VARCHAR(255)        NULL                        # only last name
, full_name         VARCHAR(255)        NULL                        # = first name + last name
, official_name     VARCHAR(255)        NULL        DEFAULT ''
, special_name      VARCHAR(255)        NULL        DEFAULT ''      # chinese name, ...
, person_email      VARCHAR(255)        NULL        DEFAULT ''
, gender            CHAR(6)             NULL        DEFAULT 'male'  # male / female
, birth_date        DATE                NULL
, mobile_number     VARCHAR(255)        NULL        DEFAULT ''
, work_number       VARCHAR(255)        NULL        DEFAULT ''
, language          VARCHAR(255)        NULL        DEFAULT 'en_us' # en_us, pt_br, zh_tw, zh_ch
, avatar            VARCHAR(255)        NULL        DEFAULT ''
, person_tags       VARCHAR(255)        NULL
, extra_info        TEXT                NULL                        # json format

, PRIMARY KEY       ( id )
, KEY family_id     ( family_id     )
, KEY address_id    ( address_id    )
, KEY person_number ( person_number )
, KEY first_name    ( first_name    )
, KEY last_name     ( last_name     )
, KEY person_email  ( person_email  )
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001
;


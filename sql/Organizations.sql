DROP   TABLE IF     EXISTS Organizations;
CREATE TABLE IF NOT EXISTS Organizations
( id                BIGINT UNSIGNED     NOT NULL    AUTO_INCREMENT
, created_by        BIGINT UNSIGNED     NULL
, created_at        DATETIME            NULL
, updated_by        BIGINT UNSIGNED     NULL
, updated_at        DATETIME            NULL
, status            VARCHAR(32)         NULL        DEFAULT 'active'

, parent_id         BIGINT UNSIGNED     NULL                            # point to Organizations(id)
, support_id        BIGINT UNSIGNED     NULL                            # point to Users        (id)
, contact_id        BIGINT UNSIGNED     NULL                            # point to Persons      (id)
, address_id        BIGINT UNSIGNED     NULL                            # point to Addresses    (id)

, organ_number      BIGINT              NULL                            # unique 10 digits
, start_date        DATE                NULL
, end_date          DATE                NULL
, organ_type        VARCHAR(32)         NULL        DEFAULT 'church'    # church, company, domain
, organ_abbr        VARCHAR(32)         NULL                            # unique per parent
, organ_name        VARCHAR(255)        NULL                            # unique per parent
, web_site          VARCHAR(255)        NULL
, phone_number      VARCHAR(255)        NULL
, fax_number        VARCHAR(255)        NULL
, time_zone         VARCHAR(255)        NULL
, avatar            VARCHAR(255)        NULL
, organ_tags        VARCHAR(255)        NULL
, extra_info        TEXT                NULL                            # json format

, PRIMARY KEY       ( id )
, KEY parent_id     ( parent_id     )
, KEY address_id    ( address_id    )
, KEY organ_number  ( organ_number  )
, KEY organ_abbr    ( organ_abbr    )
, KEY organ_name    ( organ_name    )
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000000001
;

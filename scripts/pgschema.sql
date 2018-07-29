
CREATE TABLE item_type
(
 item_type_id BIGSERIAL PRIMARY KEY,
 name         VARCHAR(100) NOT NULL ,
 description  TEXT
);

CREATE TABLE player
(
 player_id  BIGSERIAL PRIMARY KEY,
 username VARCHAR(18) NOT NULL ,
 email    VARCHAR(100)
);

CREATE TABLE trade
(
 trade_id  BIGSERIAL PRIMARY KEY,
 target_id BIGINT NOT NULL REFERENCES player (player_id),
 status   VARCHAR(15)  NOT NULL 
);

CREATE TABLE item
(
 item_id      BIGSERIAL PRIMARY KEY,
 item_type_id BIGINT NOT NULL REFERENCES item_type (item_type_id),
 name         VARCHAR(100) NOT NULL ,
 created      TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
 modified     TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
 description  TEXT 
);

CREATE TABLE player_item
(
 player_item_id BIGSERIAL PRIMARY KEY ,
 item_id      BIGINT NOT NULL REFERENCES item (item_id),
 player_id    BIGINT NOT NULL REFERENCES player (player_id),
 item_count   INTEGER NOT NULL ,
 created      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 modified     TIMESTAMP  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE offer
(
 offer_id     BIGSERIAL  PRIMARY KEY,
 trade_id     BIGINT NOT NULL REFERENCES trade (trade_id),
 player_item_id BIGINT NOT NULL REFERENCES player_item (player_item_id),
 item_count   INT NOT NULL
);


INSERT INTO player(username) VALUES ('blair');
INSERT INTO player(username) VALUES ('matt');

INSERT INTO item_type(name) VALUES ('fish');

-- ID from above
INSERT INTO item(item_type_id, name) VALUES (2, 'blowfish');
INSERT INTO item(item_type_id, name) VALUES (2, 'catfish');

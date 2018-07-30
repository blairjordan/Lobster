
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
 source_id  BIGINT NOT NULL REFERENCES player (player_id),  
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
 item_id BIGINT NOT NULL REFERENCES item (item_id),
 item_count   INT NOT NULL
);

INSERT INTO player(username) VALUES ('blair');
INSERT INTO player(username) VALUES ('matt');

INSERT INTO item_type(name) VALUES ('fish');

-- ID from above
INSERT INTO item(item_type_id, name) VALUES (1, 'mullet');
INSERT INTO item(item_type_id, name) VALUES (1, 'catfish');

INSERT INTO trade(source_id, target_id, status) VALUES (1, 2, 'O');

/*

select
	p1.username as source,
    p2.username as target,
    t.status,
    o.item_count,
    i.name
from
    trade t,
    offer o, 
    item i, 
    player p1,
    player p2
    WHERE p1.player_id = t.source_id
    AND p2.player_id = t.target_id
    AND t.trade_id = o.trade_id
    AND o.item_id = i.item_id;
*/

DROP TABLE IF EXISTS offer_item CASCADE;
DROP TABLE IF EXISTS player_item CASCADE;
DROP TABLE IF EXISTS offer CASCADE;
DROP TABLE IF EXISTS player CASCADE;
DROP TABLE IF EXISTS item CASCADE;
DROP TABLE IF EXISTS item_type CASCADE;

CREATE TABLE item_type
(
  item_type_id  BIGSERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL ,
  description   TEXT
);

CREATE TABLE player
(
  player_id   BIGSERIAL PRIMARY KEY,
  username    VARCHAR(20) NOT NULL ,
  email       VARCHAR(100),
  x FLOAT,
  y FLOAT,
  z FLOAT
);

CREATE TABLE item
(
  item_id       BIGSERIAL PRIMARY KEY,
  item_type_id  BIGINT NOT NULL REFERENCES item_type (item_type_id),
  name          VARCHAR(100) NOT NULL ,
  created       TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
  modified      TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
  description   TEXT 
);

CREATE TABLE player_item
(
  player_item_id BIGSERIAL PRIMARY KEY ,
  item_id        BIGINT NOT NULL REFERENCES item (item_id),
  player_id      BIGINT NOT NULL REFERENCES player (player_id),
  item_count     INTEGER NOT NULL ,
  created        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified       TIMESTAMP  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE offer
(
  offer_id        BIGSERIAL PRIMARY KEY,
  source_id       BIGINT NOT NULL REFERENCES player (player_id),  
  target_id       BIGINT NOT NULL REFERENCES player (player_id),
  target_status   VARCHAR(15)  NOT NULL 
);

CREATE TABLE offer_item
(
  offer_item_id BIGSERIAL  PRIMARY KEY,
  offer_id      BIGINT NOT NULL REFERENCES offer (offer_id),
  item_id       BIGINT NOT NULL REFERENCES item (item_id),
  item_count    INT NOT NULL
);

-- Insert test data
INSERT INTO player(username) VALUES ('blair');
INSERT INTO player(username) VALUES ('matt');

INSERT INTO item_type(name) VALUES ('fish');

INSERT INTO item(item_type_id, name) VALUES (1, 'mullet');
INSERT INTO item(item_type_id, name) VALUES (1, 'catfish');

INSERT INTO offer(source_id, target_id, target_status) VALUES (1, 2, 'O');
INSERT INTO offer(source_id, target_id, target_status) VALUES (2, 1, 'O');

INSERT INTO offer_item(offer_id, item_id, item_count) VALUES (1,1,20);
INSERT INTO offer_item(offer_id, item_id, item_count) VALUES (1,2,5);
INSERT INTO offer_item(offer_id, item_id, item_count) VALUES (2,2,10);

CREATE VIEW v_offers AS
SELECT
	p1.username as source,
    p2.username as target,
    o.target_status,
    oi.item_count,
    i.name
FROM
    offer o,
    offer_item oi, 
    item i, 
    player p1,
    player p2
    WHERE p1.player_id = o.source_id
    AND p2.player_id = o.target_id
    AND o.offer_id = oi.offer_id
    AND oi.item_id = i.item_id;

CREATE OR REPLACE FUNCTION update_modified_column()   
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified = now();
    RETURN NEW;   
END;
$$ language 'plpgsql';

CREATE TRIGGER update_item_modtime BEFORE UPDATE ON item FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_player_item_modtime BEFORE UPDATE ON player_item FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

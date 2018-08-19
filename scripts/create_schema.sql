
DROP TABLE IF EXISTS offer_item CASCADE;
DROP TABLE IF EXISTS player_item CASCADE;
DROP TABLE IF EXISTS offer CASCADE;
DROP TABLE IF EXISTS player CASCADE;
DROP TABLE IF EXISTS item CASCADE;
DROP TABLE IF EXISTS item_type CASCADE;
DROP TABLE IF EXISTS tile CASCADE;

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
  z FLOAT,
  created        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified       TIMESTAMP  DEFAULT CURRENT_TIMESTAMP
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

CREATE TABLE tile
(
  tile_id BIGSERIAL  PRIMARY KEY,
  x FLOAT,
  y FLOAT,
  created        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified       TIMESTAMP  DEFAULT CURRENT_TIMESTAMP
);

CREATE VIEW v_offers AS
SELECT
	p1.username as source,
    p2.username as target,
    o.target_status,
    oi.item_count,
    i.item_id,
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

CREATE TRIGGER update_player_modtime BEFORE UPDATE ON player FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_player_item_modtime BEFORE UPDATE ON player_item FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_tile_modtime BEFORE UPDATE ON tile FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- TODO: Finish

CREATE OR REPLACE FUNCTION add_offer_item(
	p_source_player_name player.username%TYPE, 
	p_target_player_name player.username%TYPE, 
	p_item_id item.item_id%TYPE, 
	p_item_count player_item.item_count%TYPE) 
RETURNS VARCHAR AS $$
DECLARE
  v_status VARCHAR := 'PENDING';
  v_item_count NUMERIC;
BEGIN
	-- Return the qty of this item in player's inventory
	SELECT COALESCE(SUM(pi.item_count), 0)
	INTO v_item_count
	FROM player_item pi, player p
	WHERE item_id = p_item_id
	AND p.player_id = pi.player_id
	AND p.username = p_source_player_name;

	-- TODO: Set the offer to OPEN for both parties, i.e., reset the state of the trade since the trade has changed
	-- TODO: If item exists in the trade, replace it
	
	IF v_item_count > p_item_count THEN
		INSERT INTO offer_item(offer_id, item_id, item_count)
		SELECT o.offer_id, p_item_id, p_item_count 
		FROM offer o, player p1, player p2
		WHERE o.source_id = p1.player_id 
		AND o.target_id = p2.player_id 
		AND p1.username = p_source_player_name 
		AND p2.username = p_target_player_name;
		
		v_status := 'ADDED';
	ELSE
		v_status := 'FAILED';
	END IF;
	
	RETURN v_status;
END;
$$ LANGUAGE plpgsql;

							
-- TEST: add_offer_item('blair','matt',1,99);

-- Confirm the transaction
/* 
UPDATE player_item pi
SET item_count = pi.item_count - p_item_count
FROM player p
WHERE pi.item_id = p_item_id
AND p.player_id = pi.player_id
AND p.username = p_source_player_name;

-- If the count == 0, remove it.

-- Add to other player's inventory
*/
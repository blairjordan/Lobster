DROP TABLE IF EXISTS offer_item CASCADE;
DROP TABLE IF EXISTS player_item CASCADE;
DROP TABLE IF EXISTS offer CASCADE;
DROP TABLE IF EXISTS player CASCADE;
DROP TABLE IF EXISTS item CASCADE;
DROP TABLE IF EXISTS item_type CASCADE;
DROP TABLE IF EXISTS tile CASCADE;

DROP VIEW IF EXISTS v_offers;

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

CREATE OR REPLACE VIEW v_offers AS
SELECT o.source_id,
		o.offer_id,
    p1.username AS source,
    o.target_id,
    p2.username AS target,
    o.target_status,
    sum(oi.item_count) AS item_count,
    i.item_id,
    i.name
  FROM offer o,
    offer_item oi,
    item i,
    player p1,
    player p2
  WHERE p1.player_id = o.source_id AND p2.player_id = o.target_id AND o.offer_id = oi.offer_id AND oi.item_id = i.item_id
  GROUP BY o.offer_id, o.source_id, o.target_id, p1.username, p2.username, o.target_status, i.item_id, i.name;

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

CREATE OR REPLACE FUNCTION add_offer_item(
	p_source_player_name player.username%TYPE, 
	p_target_player_name player.username%TYPE, 
	p_item_id item.item_id%TYPE, 
	p_item_count player_item.item_count%TYPE) 
RETURNS VARCHAR AS $$
DECLARE
  v_status VARCHAR := 'PENDING';
  v_inventory_count NUMERIC;
  v_offer_count NUMERIC;
BEGIN
	IF p_item_count < 0 THEN
		v_status := 'ZERO_SPECIFIED';
	ELSE
		-- Return the qty of this item in player's inventory
		SELECT COALESCE(SUM(pi.item_count), 0)
		INTO v_inventory_count
		FROM player_item pi, player p
		WHERE item_id = p_item_id
		AND p.player_id = pi.player_id
		AND p.username = p_source_player_name;

		IF v_inventory_count > p_item_count THEN
			-- The number of these items already being offered
			SELECT SUM(item_count)
			INTO v_offer_count
			FROM offer o, offer_item oi, player p1, player p2
			WHERE o.offer_id = oi.offer_id
			AND o.source_id = p1.player_id
			AND oi.item_id = p_item_id
			AND p1.username = p_source_player_name
			AND p2.username = p_target_player_name;

			IF (v_offer_count + p_item_count) > v_inventory_count THEN
				v_status := 'INSUFFICIENT_INVENTORY';
			ELSE
				INSERT INTO offer_item(offer_id, item_id, item_count)
				SELECT o.offer_id, p_item_id, p_item_count 
				FROM offer o, player p1, player p2
				WHERE o.source_id = p1.player_id 
				AND o.target_id = p2.player_id
				AND p1.username = p_source_player_name
				AND p2.username = p_target_player_name;

				-- Update offers to Open status
				UPDATE offer o1
				SET target_status = 'O'
				WHERE EXISTS
					(SELECT offer_id 
					FROM offer o2, player p1, player p2
					WHERE ((o2.source_id = p1.player_id AND o2.target_id = p2.player_id)
						OR (o2.target_id = p1.player_id AND o2.source_id = p2.player_id))
					AND p1.username = p_source_player_name
					AND p2.username = p_target_player_name
					AND o2.offer_id = o1.offer_id);

				v_status := 'ADDED';
			END IF;
		ELSE
			v_status := 'INSUFFICIENT_INVENTORY';
		END IF;
	END IF; -- End ZERO_SPECIFIED check
	RETURN v_status;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_offer(
	p_source_player_name player.username%TYPE, 
	p_target_player_name player.username%TYPE, 
	p_status offer.target_status%TYPE) 
RETURNS VARCHAR AS $$
DECLARE
  v_status VARCHAR := 'PENDING';
  v_accepted_count NUMERIC;
BEGIN
	-- Confirm the transaction
	UPDATE offer o 
  SET target_status = p_status 
  FROM player p1, player p2 
  WHERE o.source_id = p1.player_id AND o.target_id = p2.player_id
  AND p1.username = p_source_player_name
  AND p2.username = p_target_player_name;
    
  v_status := 'STATUS_UPDATED';

	SELECT COUNT(*)
	INTO v_accepted_count
	FROM offer o, player p1, player p2
	WHERE ((o.source_id = p1.player_id AND o.target_id = p2.player_id)
		OR (o.target_id = p1.player_id AND o.source_id = p2.player_id))
	AND p1.username = p_source_player_name
	AND p2.username = p_target_player_name
	AND target_status = 'A';
			
	-- If both sides accepted
	IF v_accepted_count = 2 THEN
    
		-- Update existing items in target inventories
		UPDATE player_item pi
		SET item_count = pi.item_count + o.item_count
		FROM v_offers o
		WHERE ((source = p_source_player_name AND target = p_target_player_name)
				OR (source = p_target_player_name AND target = p_source_player_name))
		AND pi.player_id = o.target_id
		AND pi.item_id = o.item_id;
					
		-- Insert new items to target inventories
		-- Don't include items that have already been updated
		INSERT INTO player_item (item_id, player_id, item_count)
		SELECT o.item_id, o.target_id, o.item_count
		FROM v_offers o
		WHERE ((source = p_source_player_name AND target = p_target_player_name)
				OR (source = p_target_player_name AND target = p_source_player_name))
				AND NOT EXISTS 
				(SELECT 1 FROM player_item
				WHERE player_id = o.target_id
				AND item_id = o.item_id);
		
		-- TODO: Deduct items from source inventories
		UPDATE player_item pi
		SET item_count = pi.item_count - o.item_count
		FROM v_offers o
			WHERE ((source = p_source_player_name AND target = p_target_player_name)
			OR (source = p_target_player_name AND target = p_source_player_name))
		AND pi.player_id = o.source_id
		AND pi.item_id = o.item_id;
				
		-- Remove zero count items from inventories
		DELETE FROM player_item pi
		WHERE player_item_id 
		IN
		(SELECT player_item_id 
		FROM v_offers o
				WHERE ((source = p_source_player_name AND target = p_target_player_name)
				OR (source = p_target_player_name AND target = p_source_player_name))
		AND pi.player_id = o.source_id
		AND pi.item_id = o.item_id)
		AND item_count = 0;
				
		-- TODO: Write transaction to ledger

		-- Remove offer items 
        DELETE
        FROM offer_item
        WHERE offer_id
        IN
        (SELECT offer_id FROM v_offers
        WHERE ((source = p_source_player_name AND target = p_target_player_name)
        OR (source = p_target_player_name AND target = p_source_player_name))
        );
        
        -- Remove offers
        DELETE
        FROM offer
        WHERE offer_id
        IN
        (SELECT offer_id FROM v_offers
        WHERE ((source = p_source_player_name AND target = p_target_player_name)
        OR (source = p_target_player_name AND target = p_source_player_name))
        );

	END IF;
	RETURN v_status;
END;
$$ LANGUAGE plpgsql;

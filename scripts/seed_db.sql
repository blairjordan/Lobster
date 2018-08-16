INSERT INTO player(username) VALUES ('blair');
INSERT INTO player(username) VALUES ('matt');

INSERT INTO item_type(name) VALUES ('fish');
INSERT INTO item_type(name) VALUES ('consumable');
INSERT INTO item_type(name) VALUES ('misc');

INSERT INTO item(item_type_id, name) VALUES (1, 'mullet');
INSERT INTO item(item_type_id, name) VALUES (1, 'catfish');
INSERT INTO item(item_type_id, name) VALUES (2, 'wheel of cheese');
INSERT INTO item(item_type_id, name) VALUES (3, 'old boot');

INSERT INTO offer(source_id, target_id, target_status) VALUES (1, 2, 'O');
INSERT INTO offer(source_id, target_id, target_status) VALUES (2, 1, 'O');

INSERT INTO offer_item(offer_id, item_id, item_count) VALUES (1,1,20);
INSERT INTO offer_item(offer_id, item_id, item_count) VALUES (1,3,5);
INSERT INTO offer_item(offer_id, item_id, item_count) VALUES (2,4,10);

INSERT INTO tile(x,y) VALUES (0,1);
INSERT INTO tile(x,y) VALUES (1,-1);
INSERT INTO tile(x,y) VALUES (1,2);
INSERT INTO tile(x,y) VALUES (0,-1);
INSERT INTO tile(x,y) VALUES (-2,0);

INSERT INTO player_item(player_id, item_id, item_count) VALUES (1,1,3);
INSERT INTO player_item(player_id, item_id, item_count) VALUES (1,2,5);
INSERT INTO player_item(player_id, item_id, item_count) VALUES (2,3,6);
INSERT INTO player_item(player_id, item_id, item_count) VALUES (2,4,10);

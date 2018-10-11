import express from 'express';
import itemController from '../controllers/items.controller';

const router = express.Router();

router.get('/all', function (req, res) {
  itemController.getAll(req, res);
});

router.get('/types', function (req, res) {
  itemController.getTypes(req, res);
});

router.post('/find', function (req, res) {
  itemController.getPlayerItems(req, res);
});

router.get('/random', function (req, res) {
  itemController.getRandomItem(req, res);
});

router.post('/add', function (req, res) {
  itemController.addItem(req, res);
});

router.post('/add_player_item', function (req, res) {
  itemController.addPlayerItem(req, res);
});

router.delete('/delete_player_item', function (req, res) {
  itemController.deletePlayerItem(req, res);
});

router.put('/update', function (req, res) {
  itemController.updateItem(req, res);
});

router.delete('/remove', function (req, res) {
  itemController.deleteItem(req, res);
});

export default router;
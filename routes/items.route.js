import express from 'express';
import itemController from '../controllers/items.controller';

const router = express.Router();

router.get('/all', function (req, res) {
  itemController.getAll(req, res);
});

router.post('/add', function (req, res) {
  itemController.addItem(req, res);
});

router.put('/update', function (req, res) {
  itemController.updateItem(req, res);
});

router.delete('/remove', function (req, res) {
  itemController.deleteItem(req, res);
});

export default router;
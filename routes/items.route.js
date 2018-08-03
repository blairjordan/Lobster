import express from 'express';
import itemController from '../controllers/items.controller';

const router = express.Router();

router.get('/all', function (req, res) {
  itemController.getAll(req, res);
});

export default router;
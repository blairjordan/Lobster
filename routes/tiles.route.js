
import express from 'express';
import tileController from '../controllers/tiles.controller';

const router = express.Router();

router.get('/', function (req, res) {
  res.render('tiles');
});

router.get('/all', (req, res) => {
  tileController.getAll(req, res);
});

router.get('/seed', (req, res) => {
  tileController.seed(req, res);
});

router.post('/stitch', function (req, res) {
  tileController.stitch(req, res);
});

router.post('/split', function (req, res) {
  tileController.split(req, res);
});

export default router;
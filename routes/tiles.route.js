
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

router.post('/stitch', (req, res) => {
  tileController.stitch(req, res);
});

router.post('/split', (req, res) => {
  tileController.split(req, res);
});

router.get('/fill', (req, res) => {
  tileController.fill(req, res);
});

router.post('/upload', (req, res) => {
  tileController.upload(req, res);
});

export default router;
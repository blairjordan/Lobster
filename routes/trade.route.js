
import express from 'express';
import tradeController from '../controllers/trade.controller';

const router = express.Router();

router.get('/', function (req, res) {
  res.render('trade');
});

router.get('/offers', function (req, res) {
  tradeController.getOffers(req, res);
});

export default router;
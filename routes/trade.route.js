
import express from 'express';
import tradeController from '../controllers/trade.controller';

const router = express.Router();

router.get('/', function (req, res) {
  res.render('trade');
});

router.post('/add_offer', function(req, res) {
  tradeController.addOffer(req, res);
});

router.post('/remove_offer', function(req, res) {
  tradeController.removeOffer(req, res);
});

router.post('/find', function (req, res) {
  tradeController.findOffers(req, res);
});

router.post('/update', function(req, res) {
  tradeController.setOfferStatus(req, res);
});

router.post('/add_item', function(req, res) {
  tradeController.addItem(req, res);
});

router.get('/offers', function (req, res) {
  tradeController.getOffers(req, res);
});

export default router;
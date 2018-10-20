import express from 'express';
import playerController from '../controllers/players.controller';
const router = express.Router();

router.get('/all', (req, res) => {
  playerController.getAll(req, res);
});

router.post('/add', (req, res) => {
  playerController.addPlayer(req, res);
});

router.post('/find', (req, res) => {
  playerController.getPlayersByPosition(req, res);
});

router.delete('/remove', (req, res) => {
  playerController.deletePlayer(req, res);
});

router.put('/update', (req, res) => {
  playerController.updatePlayer(req, res);
});

export default router;

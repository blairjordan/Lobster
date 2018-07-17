import express from "express";
import playerController from "../controllers/players.controller";
const router = express.Router();

router.get('/all', (req, res) => {
  playerController.getAll(req, res);
});

router.post('/find', (req, res) => {
  playerController.findPlayers(req, res);
});

router.post('/add', (req, res) => {
  playerController.addPlayer(req, res);
});

router.delete('/remove', (req, res) => {
  playerController.removePlayer(req, res);
});

router.patch('/update_player', (req, res) => {
  playerController.updatePlayer(req, res);
});

router.patch('/set_game', (req, res) => {
  playerController.setGame(req, res);
});

export default router;
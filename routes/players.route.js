import express from "express";
import playerController from "../controllers/players.controller";
const router = express.Router();

router.get('/all', (req, res) => {
  playerController.getAll(req, res);
});

router.post('/add', (req, res) => {
  playerController.addPlayer(req, res);
});

router.delete('/delete', (req, res) => {
  playerController.deletePlayer(req, res);
});

/*
router.post('/update_player', (req, res) => {
  playerController.updatePlayer(req, res);
});
*/

export default router;
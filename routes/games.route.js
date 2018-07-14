import express from "express";
import gameController from "../controllers/games.controller";
const router = express.Router();

router.get('/all', (req, res) => {
    gameController.getAll(req, res);
});

router.post('/add', (req, res) => {
    gameController.addGame(req, res);
});

router.delete('/delete', (req, res) => {
    gameController.deleteGame(req, res);
});

router.post('/add_player', (req, res) => {
    gameController.addPlayer(req, res);
});

router.delete('/remove_player', (req, res) => {
    gameController.removePlayer(req, res);
});

router.post('/update_player', (req, res) => {
    gameController.updatePlayer(req, res);
});

export default router;
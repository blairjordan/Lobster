import mongoose from 'mongoose';
import Game from '../models/games.model';

const PlayerSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true, index: true},
  x: { type: Number }, 
  y: { type: Number }, 
  z: { type: Number },
  game: {
    type: mongoose.Schema.ObjectId, 
    ref: 'game'
  }
}, {
  timestamps: true,
  collection : 'player'
});

let Player = mongoose.model('player', PlayerSchema);

Player.getAll = cb => {
  Player.find({}, cb);
};

Player.addPlayer = (playerToAdd, cb) => {
  playerToAdd.save(cb);
};

Player.removePlayer = (name, cb) => {
  Player.findOneAndRemove({ name }, cb);
};

Player.updatePlayer = (player, cb) => {
  const { name, x, y, z } = player;
  Player.findOneAndUpdate({ name }, 
  { $set: { x, y, z } },
  cb);
};

Player.setGame = (name, gameId, cb) => {
  Player.findOneAndUpdate({ name }, 
    { $set: { game: gameId } },
    { new: true },
    cb);
};

export default Player;
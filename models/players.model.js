import mongoose from 'mongoose';
import GamesModel from '../models/games.model';

const PlayerSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true, index: true},
  last_updated: { type: Date, default: Date.now },
  x: { type: Number }, 
  y: { type: Number }, 
  z: { type: Number },
  game: {
    type: mongoose.Schema.ObjectId, 
    ref: 'game'
  }
}, {collection : 'player'});

let Player = mongoose.model('player', PlayerSchema);

Player.getAll = () => {
  return Player.find({});
};

Player.addPlayer = playerToAdd => {
  return playerToAdd.save();
};

Player.removePlayer = name => {
  return Player.remove({ name });
};

export default Player;
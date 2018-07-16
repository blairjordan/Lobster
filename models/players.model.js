import mongoose from 'mongoose';

const PlayerSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true, index: true}
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
import mongoose from 'mongoose';

const PlayerSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true, index: true}
}, {collection : 'player'});

let PlayersModel = mongoose.model('player', PlayerSchema);

PlayersModel.getAll = () => {
  return PlayersModel.find({});
};

PlayersModel.addPlayer= playerToAdd => {
  return playerToAdd.save();
};

PlayersModel.removePlayer = name => {
  return PlayersModel.remove({ name });
};

export default PlayersModel;
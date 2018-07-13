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

PlayersModel.findPlayer = name => {
  PlayersModel.find(
    {name},
    function(err, model) {
        if (err) throw err;
        return model;
    }
  );
};

PlayersModel.removePlayer = name => {
  return PlayersModel.remove({ name });
};

export default PlayersModel;
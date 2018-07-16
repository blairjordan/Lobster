import mongoose from 'mongoose';

const GameSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true, index: true}
}, {collection : 'game'});

let GamesModel = mongoose.model('game', GameSchema);

GamesModel.getAll = () => {
    return GamesModel.find({});
};

GamesModel.addGame = gameToAdd => {
    return gameToAdd.save();
};

GamesModel.removeGame = name => {
    return GamesModel.remove({ name });
};

export default GamesModel;
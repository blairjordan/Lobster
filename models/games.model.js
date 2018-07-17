import mongoose from 'mongoose';

const GameSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true, index: true}
}, {
    timestamps: true,
    collection : 'game'
});

let Game = mongoose.model('game', GameSchema);

Game.getAll = cb => {
    Game.find({}, cb);
};

Game.addGame = (gameToAdd, cb) => {
    gameToAdd.save(cb);
};

Game.removeGame = (gameToRemove, cb) => {
    Game.findOneAndRemove(gameToRemove, cb);
};

export default Game;
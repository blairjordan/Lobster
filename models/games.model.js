import mongoose from 'mongoose';
import PlayersModel from '../models/players.model';

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
/*
GamesModel.addPlayer = (gameName, playerName) => {
    return PlayersModel.findOne({name: playerName}, function(err,player) {
        if (!player) err = `player not found: ${playername}`;
        if (err) throw err;
        return GamesModel.findOneAndUpdate({name:gameName}, 
            { $push: { 'players':  player } },
            {  
                projection: { players: { '$elemMatch': { _id: player._id} } },
                returnNewDocument: true
            },
            (err, game) => {
                if (err) throw err;
                return game;
            });
    });
};
*/
/*
GamesModel.getPlayerDetails = (playerName, callback) => {
    PlayersModel.findOne({name: playerName}, callback);
};
*/

GamesModel.updateGame = (gameName, player, callback) => {
    const { _id, x, y, z } = player;
    GamesModel.findOneAndUpdate({ name: gameName, 'players._id': player._id }, 
    { $set: { 'players.$' : { _id, x, y, z } } },
    {  
        projection: { players: { '$elemMatch': { _id: player._id} } },
        returnNewDocument: true
    }, callback);
};

/*
GamesModel.deletePlayer = (gameName, playerName) => {
    return PlayersModel.findOne({name: playerName}, (err,player) => {
        if (!player) err = `player not found: ${playerName}`;
        if (err) throw err;
        return GamesModel.findOneAndRemove({ name: gameName, 'players._id': player._id }, 
        (err, game) => {
            if (err) throw err;
            return game;
        });
    });
};
*/

export default GamesModel;
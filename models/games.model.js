import mongoose from 'mongoose';
import PlayersModel from '../models/players.model';

const GameSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true, index: true},
    players: [
        {
            player: {
                type: mongoose.Schema.ObjectId, 
                ref: 'player'
            },
            last_updated: { type: Date, default: Date.now },
            x: { type: Number, required: true }, 
            y: { type: Number, required: true }, 
            z: { type: Number, required: true }
        }
    ]
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

GamesModel.addPlayer = (gameName, playerName) => {
    PlayersModel.findOne({name: playerName}, function(err,player) {
        if (!player) throw err;
        if (err) throw err;
        GamesModel.findOneAndUpdate({name:gameName}, 
            { $push: {'players':  player } },
            {  
                projection: { players: { '$elemMatch': { _id: player._id} } },
                returnNewDocument: true
            },
            (err, game) => {
                if (err) throw err;
                return game;
            }
        );
    });
};

GamesModel.updatePlayer = (gameName, playerName, x, y, z) => {
    PlayersModel.findOne({name: playerName}, (err,player) => {
        if (!player) throw err;
        if (err) throw err;
        GamesModel.findOneAndUpdate({name:gameName, 'players._id': player._id }, 
        { $set: { 'players.$' : { _id: player._id, x, y, z } } },
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

export default GamesModel;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  // Define your schema fields here
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;

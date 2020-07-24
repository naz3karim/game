const Mongoose = require("mongoose")
const gameSchema = new Mongoose.Schema({
  gameid: {
    type: String,
    required: true
},
user: {type: Mongoose.Schema.Types.ObjectId, ref:"User"},
  gameboard: {
    type: [[Number]],
    default: [
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [2, 0, 2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0]
    ]
  },
  pieces: {
    type: [{allowtomove:Boolean,king: Boolean, position: [Number],player: Number,id:Number,removed:  Boolean}],
  },
  playerTurn: {
    type: Number,
    default:1
  },
  jumpexist:{type: Boolean,default: false},
  continuousjump: {type: Boolean, default: false},
  score: {
      type: {player1: {type:Number,default:0}, player2: {type:  Number,default:0}}
  },
  lastMove: {
      type: Date,
      default: Date.now()
  }
})
const Game = Mongoose.model("Game", gameSchema)
module.exports = Game
var express = require('express');
var router = express.Router();
const Game = require('../models/games')
const User = require('../models/users')
const uniqid = require("uniqid")
const passport  = require("passport")
const jwt = require("jsonwebtoken")
/* GET users listing. */
router.get('/',passport.authenticate('bearer', { session: false }), async (req,res,next) =>{
    let username = await jwt.decode(req.headers.authorization.split(" ")[1]).username
    let   user = await User.findOne({username:username})
    let userId = user._id
    let games = await Game.find({user: userId})
    return res.json(games)
})
router.post('/new',passport.authenticate('bearer', { session: false }), async (req,res,next) =>{
    let username = await jwt.decode(req.headers.authorization.split(" ")[1]).username
    let   user = await User.findOne({username:username})
    let userId = user._id
    let pieces = req.body.pieces
    let score = req.body.score
    let gameid = await Game.create({gameid:uniqid(),user:userId,pieces: JSON.parse(pieces),score:JSON.parse(score)})
    return res.json({gameid:gameid.gameid})
})
router.post('/save',passport.authenticate('bearer', { session: false }), async  function(req, res, next) {
    console.log(req.body)
    let gameid = req.body.gameid
    let gameboard = req.body.gameboard
    let pieces = req.body.pieces
    let playerTurn = req.body.playerTurn
    let jumpexist = req.body.jumpexist
    let continuousjump = req.body.continuousjump
    let score = req.body.score
    let filter = {gameid:gameid}
    let update = {pieces: JSON.parse(pieces), playerTurn: playerTurn,jumpexist: jumpexist,continuousjump:  continuousjump,score:JSON.parse(score),gameboard:JSON.parse(gameboard)}
    let game = await Game.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true // Make this update into an upsert
      });
    return res.json(game);
});
router.get('/load/:id',passport.authenticate('bearer', { session: false }), async (req,res,next)=>{
    let gameid = req.params.id;
    let  game = await Game.findOne(
            { gameid:gameid }
        )
    return res.json({result:game})
})
router.get('/delete/:id',  passport.authenticate('bearer', { session: false }), async(req, res,next)=> {
    let gameid = req.params.id;
    return Game.deleteOne({gameid:gameid})
})

module.exports = router;

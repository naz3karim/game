# Checkers

## Prerequistis:
* Download and intall [Node](https://nodejs.org/), and `npm`
* After completed install node, install nodemon globaly `npm install -g nodemon`

## Running
* After downloading the code
* Go to project folder `cd src/`
* Run `npm install`
* To understand about database check out this [video](https://www.youtube.com/watch?v=KKyag6t98g8) and the implementation is same here in this project.
* Connect mongodb. Go to [Atlas](https://account.mongodb.com/account/login). Create Account.
* Copy `.env-example` as `.env` file  and you need to fill your details there link dbusername,password and database name in the `DB=mongodb://admin:<password>@cluster0-shard-00-00.ul74s.mongodb.net:27017,cluster0-shard-00-01.ul74s.mongodb.net:27017,cluster0-shard-00-02.ul74s.mongodb.net:27017/<dbname>?ssl=true&replicaSet=atlas-vzzy1c-shard-0&authSource=admin&retryWrites=true&w=majority`
* Add email and password for contact us to work in `.env` (See .env-example)
* Run `DEBUG=src* npm start`. Install nodemon if error occures (`npm install -g nodemon`)
* Go to [http://localhost:3000](http://localhost:3000)

## Using It
Play by selecting your piece and clicking on the tile you want to move to. Click [here](http://www.itsyourturn.com/t_helptopic2030.html) to learn how to play checkers. Jumping when available is enforced.

## Code
The code supports all the features of checkers including kingship and double/triple/quadruple jumping. The Board object controls the board and therefore the game. The pieces and tiles instances are used in the game for checking whether a piece can be moved, moving a piece, deleting a piece, checking whether tile is in range, and much more. The script is fully commented and original.
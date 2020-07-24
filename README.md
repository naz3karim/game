# ayonpal-game
# Checkers
## Running
* Clone this Repo.
* Run `npm install`
* Connect mongodb. Go to [Atlas](https://account.mongodb.com/account/login). Create Account. Add database login info in `.env` file. !
* Add email and password for contact us and mongodb uri to work in `.env` 

    > DB=mongodb+srv://USERNAME:PASSWORD@cluster0-f5vnp.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority

    > ENV=development

    > GMAIL_USER=USER_EMAIL

    > GMAIL_PASS=USER_PASS

    > DEV_TEAM=DEV_TEAM_EMAIL

* Run `DEBUG=src* npm start`. Install nodemon if error occures (`npm install -g nodemon`)
* Go to [http://localhost:3000](http://localhost:3000)
## Using It
Play by selecting your piece and clicking on the tile you want to move to. Click [here](http://www.itsyourturn.com/t_helptopic2030.html) to learn how to play checkers. Jumping when available is enforced.

## Code
The code supports all the features of checkers including kingship and double/triple/quadruple jumping. The Board object controls the board and therefore the game. The pieces and tiles instances are used in the game for checking whether a piece can be moved, moving a piece, deleting a piece, checking whether tile is in range, and much more. The script is fully commented and original.

## ToDo

* [x] Add login/Register
* [x] Store Game states after each move
* [x] Show stored game states to resume
* [x] Options To remove  saved games
* [x] Add winners to database
* [x] Add about us
* [x] Add Contact Us
* [x] Add Rules of the game
* [x] Add History Of the Game
* [x] Add link to Google Search
* [x] Other static links
* [ ] Update About page with real image, names and link
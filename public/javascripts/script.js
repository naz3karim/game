window.onload = function () {
    //The initial setup
    var gameBoard = [
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [2, 0, 2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0]
    ];
    //arrays to store the instances
    var pieces = [];
    var tiles = [];
    var score = {
      player1: 0,
      player2: 0
    }
    var gameId = -1
    var playerTurn = 1
    var jumpexist = false
    var continuousjump = false
    var oldpieces  = []
    //distance formula
    var dist = function (x1, y1, x2, y2) {
      return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    }
    //Piece object - there are 24 instances of them in a checkers game
    function Piece(element, position,allowedtomove=true,king=false,playerState=null,removed=false) {
      // when jump exist, regular move is not allowed
      // since there is no jump at round 1, all pieces are allowed to move initially
      this.removed = removed
      this.allowedtomove = allowedtomove;
      //linked DOM element
      this.element = element;
      //positions on gameBoard array in format row, column
      this.position = position;
      //which player's piece i it
      this.player = playerState;
      //figure out player by piece id
      if(playerState!==null){
        this.player=playerState
      }
      else if (this.element.attr("id") < 12)
        this.player = 1;
      else
        this.player = 2;
      //makes object a king
      this.king = king;
      
      this.makeKing = function () {
        this.element.css("backgroundImage", "url('images/king" + this.player + ".png')");
        this.king = true;
      }
      //moves the piece
      this.move = function (tile) {
        this.element.removeClass('selected');
        if (!Board.isValidPlacetoMove(tile.position[0], tile.position[1])) return false;
        //make sure piece doesn't go backwards if it's not a king
        if (this.player == 1 && this.king == false) {
          if (tile.position[0] < this.position[0]) return false;
        } else if (this.player == 2 && this.king == false) {
          if (tile.position[0] > this.position[0]) return false;
        }
        //remove the mark from Board.board and put it in the new spot
        Board.board[this.position[0]][this.position[1]] = 0;
        Board.board[tile.position[0]][tile.position[1]] = this.player;
        this.position = [tile.position[0], tile.position[1]];
        //change the css using board's dictionary
        this.element.css('top', Board.dictionary[this.position[0]]);
        this.element.css('left', Board.dictionary[this.position[1]]);
        //if piece reaches the end of the row on opposite side crown it a king (can move all directions)
        if (!this.king && (this.position[0] == 0 || this.position[0] == 7))
          this.makeKing();
        return true;
      };
  
      //tests if piece can jump anywhere
      this.canJumpAny = function () {
        return (this.canOpponentJump([this.position[0] + 2, this.position[1] + 2]) ||
          this.canOpponentJump([this.position[0] + 2, this.position[1] - 2]) ||
          this.canOpponentJump([this.position[0] - 2, this.position[1] + 2]) ||
          this.canOpponentJump([this.position[0] - 2, this.position[1] - 2]))
      };
  
      //tests if an opponent jump can be made to a specific place
      this.canOpponentJump = function (newPosition) {
        //find what the displacement is
        var dx = newPosition[1] - this.position[1];
        var dy = newPosition[0] - this.position[0];
        //make sure object doesn't go backwards if not a king
        if (this.player == 1 && this.king == false) {
          if (newPosition[0] < this.position[0]) return false;
        } else if (this.player == 2 && this.king == false) {
          if (newPosition[0] > this.position[0]) return false;
        }
        //must be in bounds
        if (newPosition[0] > 7 || newPosition[1] > 7 || newPosition[0] < 0 || newPosition[1] < 0) return false;
        //middle tile where the piece to be conquered sits
        var tileToCheckx = this.position[1] + dx / 2;
        var tileToChecky = this.position[0] + dy / 2;
        if (tileToCheckx > 7 || tileToChecky > 7 || tileToCheckx < 0 || tileToChecky < 0) return false;
        //if there is a piece there and there is no piece in the space after that
        if (!Board.isValidPlacetoMove(tileToChecky, tileToCheckx) && Board.isValidPlacetoMove(newPosition[0], newPosition[1])) {
          //find which object instance is sitting there
          for (let pieceIndex in pieces) {
            if (pieces[pieceIndex].position[0] == tileToChecky && pieces[pieceIndex].position[1] == tileToCheckx) {
              if (this.player != pieces[pieceIndex].player) {
                //return the piece sitting there
                return pieces[pieceIndex];
              }
            }
          }
        }
        return false;
      };
  
      this.opponentJump = function (tile) {
        var pieceToRemove = this.canOpponentJump(tile.position);
        //if there is a piece to be removed, remove it
        if (pieceToRemove) {
          pieceToRemove.remove(pieceToRemove.element.attr('id'));
          return true;
        }
        return false;
      };
  
      this.remove = function (id) {
        //remove it and delete it from the gameboard
        console.log(pieces)
        console.log(id)
        pieces[id].removed=true
        this.element.css("display", "none");
        if (this.player == 1) {
          $('#player2').append("<div class='capturedPiece'></div>");
          Board.score.player2 += 1;
        }
        if (this.player == 2) {
          $('#player1').append("<div class='capturedPiece'></div>");
          Board.score.player1 += 1;
        }
        console.log(this.position[0])
        if(!isNaN(this.position[0])){
          Board.board[this.position[0]][this.position[1]] = 0;

        }
        //reset position so it doesn't get picked up by the for loop in the canOpponentJump method
        this.position = [];
        var playerWon = Board.checkifAnybodyWon();
        if (playerWon) {
          $('#winner').html("Player " + playerWon + " has won!");
        }
      }
    }
  
    function Tile(element, position) {
      //linked DOM element
      this.element = element;
      //position in gameboard
      this.position = position;
      //if tile is in range from the piece
      this.inRange = function (piece) {
        for (let k of pieces)
          if (k.position[0] == this.position[0] && k.position[1] == this.position[1]) return 'wrong';
        if (!piece.king && piece.player == 1 && this.position[0] < piece.position[0]) return 'wrong';
        if (!piece.king && piece.player == 2 && this.position[0] > piece.position[0]) return 'wrong';
        if (dist(this.position[0], this.position[1], piece.position[0], piece.position[1]) == Math.sqrt(2)) {
          //regular move
          return 'regular';
        } else if (dist(this.position[0], this.position[1], piece.position[0], piece.position[1]) == 2 * Math.sqrt(2)) {
          //jump move
          return 'jump';
        }
      };
    }
  
    //Board object - controls logistics of game
    var Board = {
      board: gameBoard,
      score: score,
      playerTurn: playerTurn,
      jumpexist: jumpexist,
      continuousjump: continuousjump,
      tilesElement: $('div.tiles'),
      //dictionary to convert position in Board.board to the viewport units
      dictionary: ["0vmin", "10vmin", "20vmin", "30vmin", "40vmin", "50vmin", "60vmin", "70vmin", "80vmin", "90vmin"],
      //initialize the 8x8 board
      initalize: function () {
        this.board = [
          [0, 1, 0, 1, 0, 1, 0, 1],
          [1, 0, 1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 0, 1],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [2, 0, 2, 0, 2, 0, 2, 0],
          [0, 2, 0, 2, 0, 2, 0, 2],
          [2, 0, 2, 0, 2, 0, 2, 0]
        ];
        this.playerTurn = 1
        this.score={
          player1: 0,
          player2: 0
        }
        this.jumpexist = false
        this.continuousjump = false
        pieces =[]
        $(`.player1pieces`).empty();
        $(`.player2pieces`).empty();
        $('.tiles').empty()
        tiles = []
        var countPieces = 0;
        var countTiles = 0;
        for (let row in this.board) { //row is the index
          for (let column in this.board[row]) { //column is the index
            //whole set of if statements control where the tiles and pieces should be placed on the board
            if (row % 2 == 1) {
              if (column % 2 == 0) {
                countTiles = this.tileRender(row, column, countTiles)
              }
            } else {
              if (column % 2 == 1) {
                countTiles = this.tileRender(row, column, countTiles)
              }
            }
            if (this.board[row][column] == 1) {
              countPieces = this.playerPiecesRender(1, row, column, countPieces)
            } else if (this.board[row][column] == 2) {
              countPieces = this.playerPiecesRender(2, row, column, countPieces)
            }
          }
        }
      },
      reinitalize: function () {
        var countPieces = 0;
        var countTiles = 0;
        this.board = gameBoard
        this.playerTurn = playerTurn
        this.score={
          player1: 0,
          player2: 0
        }
        this.jumpexist = jumpexist
        this.continuousjump = continuousjump
        $('.tiles').empty()
        tiles = []

        for (let row in this.board) { //row is the index
          for (let column in this.board[row]) { //column is the index
            //whole set of if statements control where the tiles and pieces should be placed on the board
            if (row % 2 == 1) {
              if (column % 2 == 0) {
                countTiles = this.tileRender(row, column, countTiles)
              }
            } else {
              if (column % 2 == 1) {
                countTiles = this.tileRender(row, column, countTiles)
              }
            }
          }
        }
        pieces =[]
        $(`.player1pieces`).empty();
        $(`.player2pieces`).empty();
        for(let i =0;i<oldpieces.length;i++){
          countPieces = this.playerPiecesRender(oldpieces[i].player, oldpieces[i].position[0], oldpieces[i].position[1], oldpieces[i].id,oldpieces[i].allowedtomove,oldpieces[i].king,oldpieces[i].removed)
        }
        if (this.playerTurn == 2) {
          $('.turn').css("background", "linear-gradient(to right, transparent 50%, #BEEE62 50%)");
        } else {
          $('.turn').css("background", "linear-gradient(to right, #BEEE62 50%, transparent 50%)");
        }
        oldpieces=[]
        
      },
      tileRender: function (row, column, countTiles) {
        this.tilesElement.append("<div class='tile' id='tile" + countTiles + "' style='top:" + this.dictionary[row] + ";left:" + this.dictionary[column] + ";'></div>");
        tiles[countTiles] = new Tile($("#tile" + countTiles), [parseInt(row), parseInt(column)]);
        return countTiles + 1
      },
  
      playerPiecesRender: function (playerNumber, row, column, countPieces,allowedtomove=true,king=false,removed=false) {
        $(`.player${playerNumber}pieces`).append("<div class='piece' id='" + countPieces + "' style='top:" + this.dictionary[row] + ";left:" + this.dictionary[column] + ";'></div>");
        pieces[countPieces] = new Piece($("#" + countPieces), [parseInt(row), parseInt(column)],allowedtomove,king,playerNumber,removed);
        if(removed){
          console.log(pieces[countPieces])  
          pieces[countPieces].remove(pieces[countPieces].element.attr('id'))
          return countPieces;
        }
        if(king){
          console.log(pieces[countPieces])  
          pieces[countPieces].makeKing()
        }
        return countPieces + 1;
      },
      //check if the location has an object
      isValidPlacetoMove: function (row, column) {
        // console.log(row); console.log(column); console.log(this.board);
        if (row < 0 || row > 7 || column < 0 || column > 7) return false;
        if (this.board[row][column] == 0) {
          return true;
        }
        return false;
      },
      //change the active player - also changes div.turn's CSS
      changePlayerTurn: function () {
        if (this.playerTurn == 1) {
          this.playerTurn = 2;
          $('.turn').css("background", "linear-gradient(to right, transparent 50%, #BEEE62 50%)");
        } else {
          this.playerTurn = 1;
          $('.turn').css("background", "linear-gradient(to right, #BEEE62 50%, transparent 50%)");
        }
        this.check_if_jump_exist()
        return;
      },
      checkifAnybodyWon: function () {
        if (this.score.player1 == 12) {
          return 1;
        } else if (this.score.player2 == 12) {
          return 2;
        }
        return false;
      },
      //reset the game
      clear: function () {
        location.reload();
      },
      check_if_jump_exist: function () {
        this.jumpexist = false
        this.continuousjump = false;
        for (let k of pieces) {
          k.allowedtomove = false;
          // if jump exist, only set those "jump" pieces "allowed to move"
          if (k.position.length != 0 && k.player == this.playerTurn && k.canJumpAny()) {
            this.jumpexist = true
            k.allowedtomove = true;
          }
        }
        // if jump doesn't exist, all pieces are allowed to move
        if (!this.jumpexist) {
          for (let k of pieces) k.allowedtomove = true;
        }
      },
      // Possibly helpful for communication with back-end.
      str_board: function () {
        ret = ""
        for (let i in this.board) {
          for (let j in this.board[i]) {
            var found = false
            for (let k of pieces) {
              if (k.position[0] == i && k.position[1] == j) {
                if (k.king) ret += (this.board[i][j] + 2)
                else ret += this.board[i][j]
                found = true
                break
              }
            }
            if (!found) ret += '0'
          }
        }
        return ret
      }
    }
    $('.stats').on("click",".loadgame", function () {
      var gid = $(this).attr("game")
      $.ajax('/api/games/load/'+gid, {
        type: "GET",
        headers: {
          Authorization : sessionStorage.getItem('Authorization')
        },
        success: function(data){
          console.log(data)
          if(data.result){
            continuousjump=data.result.continuousjump
            playerTurn=data.result.playerTurn
            jumpexist = data.result.jumpexist
            score=data.result.score
            gameBoard=data.result.gameboard
            oldpieces = data.result.pieces
            gameId = data.result.gameid
            Board.reinitalize()
          }
        },
        error: function(error){
          console.log(error)
        }
      })
    });
    $('.stats').on("click",".delgame", function () {
      var gid = $(this).attr("game")
      $.ajax('/api/games/delete/'+gid, {
        type: "GET",
        headers: {
          Authorization : sessionStorage.getItem('Authorization')
        },
        success: function(data){
          console.log(data)
          

        },
        error: function(error){
          console.log(error)
        }
      })
      let  selector = "#game"+gid
          console.log(selector)
          $(selector).remove()
    });

    //initialize the board
    $('#newgame').on("click", function () {
      Board.initalize();
      var pcs_arr=[]
      for (let i=0;i<pieces.length;i++){
        let pc = {
          allowedtomove: pieces[i].allowedtomove,
          position: pieces[i].position,
          king: pieces[i].king,
          player: pieces[i].player,
          id:pieces[i].element.attr('id'),
          removed: pieces[i].removed
        }
        pcs_arr.push(pc)
      }
      $.ajax("/api/games/new",{
        type: "POST",
        data: {
          pieces: JSON.stringify(pcs_arr),
          score: JSON.stringify(Board.score),
        },
        headers: {
          Authorization : sessionStorage.getItem('Authorization'),
        },
        success: function (data){
          gameId = data.gameid
          
        },
        error: function (err){
          console.log(err)
        }
        
      })
    });
    
    $.ajax('/api/games/',{
      type: "GET",
      headers: {
        Authorization : sessionStorage.getItem('Authorization')
      },
      success: function (data){
        let  res_games = data;
        console.log(res_games)
        for(let i=0;i<res_games.length;i++){
          $('.game-tables-body').append(`<tr id="game${res_games[i].gameid}"><td class="border p-2">${res_games[i].gameid}</td><td class="border p-2">${moment(res_games[i].lastMove).format("YYYY/MM/DD - HH:mm:ss")}</td><td class="border p-2">${res_games[i].score.player1}:${res_games[i].score.player2 }</td><td class="border p-2"><button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded loadgame" game="${res_games[i].gameid}">Load Game</button></td><td class="border p-2"><button class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded delgame" game="${res_games[i].gameid}">Delete</button></td></tr>`)
        }
        // console.log($('game-tables-body'))
      },
      error: function (error){
        console.log(error)
      }
    })
    /***
    Events
    ***/
  
    //select the piece on click if it is the player's turn
    $('.pieces').on("click",".piece", function () {
      var selected;
      console.log("Turn")
      var isPlayersTurn = ($(this).parent().attr("class").split(' ')[0] == "player" + Board.playerTurn + "pieces");
      if (isPlayersTurn) {
        if (!Board.continuousjump && pieces[$(this).attr("id")].allowedtomove) {
          if ($(this).hasClass('selected')) selected = true;
          $('.piece').each(function (index) {
            $('.piece').eq(index).removeClass('selected')
          });
          if (!selected) {
            $(this).addClass('selected');
          }
        } else {
          let exist = "jump exist for other pieces, that piece is not allowed to move"
          let continuous = "continuous jump exist, you have to jump the same piece"
          let message = !Board.continuousjump ? exist : continuous
          console.log(message)
        }
      }
    });
  
    //reset game when clear button is pressed
    $('#cleargame').on("click", function () {
      Board.clear();
    });
  
    //move piece when tile is clicked
    $('.tiles').on("click",".tile", function () {
      //make sure a piece is selected
      if ($('.selected').length != 0) {
        //find the tile object being clicked
        var tileID = $(this).attr("id").replace(/tile/, '');
        console.log(tileID)
        var tile = tiles[tileID];
        //find the piece being selected
        var piece = pieces[$('.selected').attr("id")];
        //check if the tile is in range from the object
        var inRange = tile.inRange(piece);
        console.log(inRange)
        if (inRange != 'wrong') {
          //if the move needed is jump, then move it but also check if another move can be made (double and triple jumps)
          if (inRange == 'jump') {
            if (piece.opponentJump(tile)) {
              piece.move(tile);
              if (piece.canJumpAny()) {
                // Board.changePlayerTurn(); //change back to original since another turn can be made
                piece.element.addClass('selected');
                // exist continuous jump, you are not allowed to de-select this piece or select other pieces
                Board.continuousjump = true;
              } else {
                Board.changePlayerTurn()
              }
            }
            //if it's regular then move it if no jumping is available
          } else if (inRange == 'regular' && !Board.jumpexist) {
            console.log(piece.canJumpAny()) 
            if (!piece.canJumpAny()) {
              let  res = piece.move(tile);
              console.log("moved : ", res)
              Board.changePlayerTurn()
            } else {
              alert("You must jump when possible!");
            }
          }
        }
      }
      var pcs_arr=[]
      for (let i=0;i<pieces.length;i++){
        let pc = {
          allowedtomove: pieces[i].allowedtomove,
          position: pieces[i].position,
          king: pieces[i].king,
          player: pieces[i].player,
          id:pieces[i].element.attr('id'),
          removed: pieces[i].removed
        }
        pcs_arr.push(pc)
      }
      // var gameboard = ''
      // for (let i=0;i<gameBoard.length;i++){
      //   for (let j=0;j<gameBoard[i].length;j++){
      //     gameboard+=gameBoard[i][j]
      //   }
      // }
      console.log(tiles)
      console.log(pcs_arr)
      // console.log(gameboard)
      $.ajax('/api/games/save',{
        type: 'POST',
        headers: {
          Authorization : sessionStorage.getItem('Authorization')
        },
        data: {
          gameid: gameId,
          gameboard: JSON.stringify(Board.board),
          pieces: JSON.stringify(pcs_arr),
          score: Board.score,
          playerTurn: Board.playerTurn,
          jumpexist: Board.jumpexist,
          score: JSON.stringify(Board.score),
          continuousjump: Board.continuousjump,
        },
        success: function (data){
          console.log(data)
        },
        error: function (error){
          console.log(error)
        }
      })
    });
  }
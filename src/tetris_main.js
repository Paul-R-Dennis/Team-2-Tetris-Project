const gamecanvas = document.getElementById('tetrisboard');             // Grid Context
const gamectx    = gamecanvas.getContext('2d');                        // 2D context
const gamenext       = document.getElementById('tetrisnext');          // Grid Context
const gamectxnext    = gamenext.getContext('2d');                      // 2D context

gamectx.canvas.width  = COLS * BLOCK_SIZE;                             // Set GRID width  - multiple of columns
gamectx.canvas.height = ROWS * BLOCK_SIZE;                             // Set GRID height - multiple of rows
gamectx.scale(BLOCK_SIZE, BLOCK_SIZE);                                 // Scale the blocks

gamectxnext.canvas.width  = NEXTCOLS * BLOCK_SIZE;                     // Set next piece GRID width  - multiple of columns
gamectxnext.canvas.height = NEXTROWS * BLOCK_SIZE;                     // Set next piece GRID height - multiple of rows
gamectxnext.scale(BLOCK_SIZE, BLOCK_SIZE);                             // Scale the blocks

let gameboard = new Tetris_board(gamectx, gamectxnext);                // Create Game board object
let gamestatus = new Tetris_status();                                  // Create Game status object
let scoreboard = document.querySelector("#score");

let grid = generateGrid();                                             // Generate Blank Grid
let nextPieceObj = null;                                               // Game piece that will be falling next
let fallingPieceObj = null;                                            // Game piece that is currently falling
let score = 0;                                                         // Current score
let set_interval_id = null;                                            // Game interval ID - needs to be global - multiple functions need it

gamestatus.set_playbutton_status();                                    // Set the play button status to enabled & pause button to disabled
gamestatus.set_login_status();                                         // Set the login = enabled / logout = disabled

document.addEventListener("keydown",function(e){                       // Add keyboard events for arrow keys
    let key = e.key;
    if(key == "ArrowDown"  && gamestatus.get_is_game_in_play_mode()){
        moveDown();
    }else if(key == "ArrowLeft" && gamestatus.get_is_game_in_play_mode()){
        moveLeft();
    }else if(key == "ArrowRight" && gamestatus.get_is_game_in_play_mode()){
        moveRight();
    }else if(key == "ArrowUp" && gamestatus.get_is_game_in_play_mode()){
        rotate();
    }else if(key == "a" && gamestatus.get_is_game_in_play_mode()){
        moveLeft();
    }else if(key == "d" && gamestatus.get_is_game_in_play_mode()){
        moveRight();
    }else if(key == "w" && gamestatus.get_is_game_in_play_mode()){
        rotate();
    }else if(key == "s"  && gamestatus.get_is_game_in_play_mode()){
        moveDown();
    }
})

auth.onAuthStateChanged(user => {                                      // Check if USER is logged in
    if (user)
        {
            // !!!!!!!! CONSOLE.LOG !!!!!!!!!!!
        console.log(user);
        console.log(auth.currentUser.email, "is logged in");        
        console.log("User ID: ", auth.currentUser.uid);
        db.collection('users').doc(user.uid).get().then(doc => {        // Sets User name
            const name = ` ${doc.data().name}`;
            Userid.innerText = name;
        })
        Userid.innerText = auth.currentUser.email;
        db.collection('users').doc(user.uid).get().then(doc => {        // Sets High Score
            const score = ` ${doc.data().HighScore}
            `;
            level.innerText = score
        })
        gamestatus.set_logout_status();                                // Set the login login = disabled / logout = enabled
        }
  })

COLORS = []                                                            // List of colors for Tetris pieces - Order is IMPORTANT
db.collection('colors').get().then((snapshot) => {                     // Read in COLORS from Firebase and populate COLORS list
    snapshot.docs.forEach(doc => {
        const uoallcolors = doc.data()                                 // Read in un-ordered colors data
        skallcolors = Object.keys(uoallcolors).sort()                  // Make a list of Sorted keys

        for (const [jk, sk] of Object.entries(skallcolors)) {          // Loop through all keys and 
            COLORS[jk] = uoallcolors[sk]                               // populate the COLORS list
        }
    })
})

SHAPES = []                                                           // List of shapes - Order is IMPORTANT
db.collection('shapes').get().then((snapshot) => {                     // Read in SHAPES from Firebase and populate SHAPES list
    snapshot.docs.forEach(doc => {
        const allshapes = doc.data()                                   // Read in shapes data
        //console.log("Current Shapes: ", SHAPES)
        //console.log("DB Shapes: ", allshapes)
        skshapes = Object.keys(allshapes).sort()                       // Make a list of Sorted keys

        for (let [jk, sk] of Object.entries(skshapes)) {               // Loop through all keys and populate the TSHAPES list
            tshapelist = allshapes[sk]                                 // tshapelist = List of array values
            //console.log("Temp Shape var1: ", tshapelist)
            SHAPES[jk] = []                                           // Add empty list at 1st level

            for (let [i, tshape] of Object.entries(tshapelist)) {      // i=0 & tshape=0100
                SHAPES[jk][i] = []                                    // Add empty list at 2nd level

                for (let [j, tpoint] of Object.entries(tshape)) {     // Loop on last level - tpoint = last value

                    //console.log("last Inner values: ", j, tpoint)
                    SHAPES[jk][i][j] = parseInt(tpoint)
                }
            }
        }
    })
    //console.log("Temp Shapes: ", TSHAPES)
})

function play_tetris() {

  gamestatus.set_pausebutton_status();                                 // Set the play button status to disabled & pause button to enabled

  set_interval_id = setInterval(newGameState,500);                     // Start the GAME !!!!!

}


function pause_tetris() {
    gamestatus.set_playbutton_status();                                // Set the play button status to disabled & pause button to enabled

    clearInterval(set_interval_id);                                    // Pause THE GAME !!!!!

}




// function play_tetris() {
//   gamestatus.set_pausebutton_status();                                 // Set the play button status to disabled & pause button to enabled
//   //console.log("Play Tetris --- Start");
//   gameboard.reset();                                                   // Reset Game board to initial state
//   //console.table(gameboard.grid);                                     // Debugging --- Show gameboard grid
//   gameboard.draw();                                                    // Draw the game board
//   let piece = new Tetris_piece(gamectx);
//   piece.draw();
//   gameboard.piece = piece;
//   //console.log("Play Tetris --- End");
// }

function login_tetris() {                                              // Handle LOGIN button
    window.location.href = "../Team-2-Tetris-Project/login.html";
  }


  function logout_tetris() {                                           // Handle LOGOUT button
    // window.location.href = "/logout.html";
    gamestatus.set_login_status();                                     // Set the login = enabled / logout = disabled
    const logout = document.querySelector('#logout-button');
    auth.signOut().then(() => {
            // !!!!!!!! CONSOLE.LOG !!!!!!!!!!!
            console.log('user signed out');
            Userid.innerText = "";
            level.innerText = "";
            alert("Logged out!");
    });
    Userid.innerText = "x"
  }


function newGameState(){
    checkGrid();

    if (!nextPieceObj) {nextPieceObj = randomPieceObject();}           // Cover Initial case of no next piece

    if (!fallingPieceObj) {
        fallingPieceObj = nextPieceObj;                                // Make next piece the current falling piece
        nextPieceObj = randomPieceObject();                            // Make next piece the current
        renderPiece();                                                 // Render falling piece
        rendernextPiece();                                             // Render next    piece
    }

    moveDown();                                                        // Move falling piece down

   }

function checkGrid(){
    let count = 0;
    for(let i=0;i<grid.length;i++){
        let allFilled = true;
        for(let j=0;j<grid[0].length;j++){
            if(grid[i][j] == 0){
                allFilled = false
            }
        }
        if(allFilled){
            count++;
            grid.splice(i,1);
            grid.unshift([0,0,0,0,0,0,0,0,0,0]);
        }
    }
    if(count == 1){
        score+=10;
    }else if(count == 2){
        score+=30;
    }else if(count == 3){
        score+=50;
    }else if(count>3){
        score+=100
    }
    scoreboard.innerText = score;
}

function generateGrid(){
    let grid = [];
    for(let i=0;i<ROWS;i++){
        grid.push([]);
        for(let j=0;j<COLS;j++){
            grid[i].push(0)
        }
    }
    return grid;
}

function randomPieceObject(){
    let ran = Math.floor(Math.random()*7);
    let piece = SHAPES[ran];
    let colorIndex = ran+1;
    let minx = 0; maxx = 7;
    let ranxloc = (Math.floor(Math.random() * (maxx-minx+1)) + minx);  // Start piece in random position
    let x = ranxloc;
    //let x = 4;
    // upcoming.innerText = ranxloc;
    let y = 0;
    return {piece,colorIndex,x,y}
}

function renderPiece(){                                                // Render falling piece
    if (fallingPieceObj == null) {return}                              // If there is no falling piece, return. This is a safety check.
    let piece = fallingPieceObj.piece;
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            if(piece[i][j] == 1){
            gamectx.fillStyle = COLORS[fallingPieceObj.colorIndex];
            gamectx.fillRect(fallingPieceObj.x+j,fallingPieceObj.y+i,1,1);
        }
        }
    }
}

function rendernextPiece(){                                            // Render next piece
    gamectxnext.clearRect(0, 0, gamectxnext.canvas.width, gamectxnext.canvas.height); //Clear next piece grid
    let piece = nextPieceObj.piece;
    for(let i=0;i<piece.length;i++){                                   // Render next piece by looping through the piece grid
        for(let j=0;j<piece[i].length;j++){
            if(piece[i][j] == 1){
            gamectxnext.fillStyle = COLORS[nextPieceObj.colorIndex];
            //gamectxnext.fillRect(nextPieceObj.x+j,nextPieceObj.y+i,1,1);
            gamectxnext.fillRect(j+1,nextPieceObj.y+i,1,1);
        }
        }
    }
}


function moveDown(){
    if (fallingPieceObj == null) {return}                              // If there is no falling piece, return. This is a safety check.
    if(!collision(fallingPieceObj.x,fallingPieceObj.y+1))
        fallingPieceObj.y+=1;
    else{
        let piece = fallingPieceObj.piece
        for(let i=0;i<piece.length;i++){
            for(let j=0;j<piece[i].length;j++){
                if(piece[i][j] == 1){
                    let p = fallingPieceObj.x+j;
                    let q = fallingPieceObj.y+i;
                    grid[q][p] = fallingPieceObj.colorIndex;
                }
            }
        }
        if(fallingPieceObj.y == 0){
            gameOver();
            alert("game over");                                             // gameOver function to trigger Firebase updates
            grid = generateGrid();
            score = 0;

        }
        
        fallingPieceObj = null;
    }
    renderGame();
}


function collision(x,y,rotatedPiece){
    let piece = rotatedPiece || fallingPieceObj.piece
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            if(piece[i][j] == 1){
            let p = x+j;
            let q = y+i;
            if(p>=0 && p<COLS && q>=0 && q<ROWS){
                if(grid[q][p]>0){
                    return true;
                }
            }else{
                return true;
            }}
        }
    }
    return false;
}

function renderGame(){
    for(let i=0;i<grid.length;i++){
        for(let j=0;j<grid[i].length;j++){
            gamectx.fillStyle = COLORS[grid[i][j]];
            gamectx.fillRect(j,i,1,1)
        }
    }
    renderPiece();
}

function moveLeft(){
    if (fallingPieceObj == null) {return}                              // If there is no falling piece, return. This is a safety check.
    if(!collision(fallingPieceObj.x-1,fallingPieceObj.y))
        fallingPieceObj.x-=1;
    renderGame();
}

function moveRight(){
    if (fallingPieceObj == null) {return}                              // If there is no falling piece, return. This is a safety check.
    if(!collision(fallingPieceObj.x+1,fallingPieceObj.y))
        fallingPieceObj.x+=1;
    renderGame();
}

function rotate(){
    if (fallingPieceObj == null) {return}                              // If there is no falling piece, return. This is a safety check.
    let rotatedPiece = [];
    let piece = fallingPieceObj.piece;
    for(let i=0;i<piece.length;i++){
        rotatedPiece.push([]);
        for(let j=0;j<piece[i].length;j++){
            rotatedPiece[i].push(0);
        }
    }
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            rotatedPiece[i][j] = piece[j][i]
        }
    }

    for(let i=0;i<rotatedPiece.length;i++){
        rotatedPiece[i] = rotatedPiece[i].reverse();
    }
    if(!collision(fallingPieceObj.x,fallingPieceObj.y,rotatedPiece))
        fallingPieceObj.piece = rotatedPiece
    renderGame()
}


function gameOver(){
    const user = auth.currentUser;
    if (user !== null) {                                                       // checking fore FBDB updates.
        var dbRef = db.collection('users').doc(auth.currentUser.uid);           // db initialization
        var tempHighScore = score;                                             // saves current score

        dbRef.get().then((doc) => {                                             // gets the High SCore
            if (doc.exists) {
                var data = doc.data();
                var highScore = data.HighScore;

                var gamesPlayed = data.GamesPlayed;                             // GamesPlayed Update
                var tempGamesPlayed = gamesPlayed + 1;
                

                var totalScore = data.TotalScore;                                   // AvgScore Update
                var tempTotalScore = totalScore + tempHighScore;

                var newAvgScore = tempTotalScore / tempGamesPlayed;
                
                dbRef.update({                                                  // Updates the database
                    GamesPlayed: tempGamesPlayed,
                    TotalScore: tempTotalScore,
                    AvgScore: newAvgScore
                })

                if (highScore < tempHighScore) {                                // checks if current score is greater than high score
                    return dbRef.update({
                        HighScore: tempHighScore
                    })
                    .then(() => {
                        // !!!!!!!! CONSOLE.LOG !!!!!!!!!!!
                        console.log("High Score Updated!");
                        level.innerText = tempHighScore;                        // updates the displayed high score
                    })
                    .catch((error) => {
                        // !!!!!!!! CONSOLE.LOG !!!!!!!!!!!
                        console.error("Error updating document: ", error);
                    });
                }
            } else {
                // !!!!!!!! CONSOLE.LOG !!!!!!!!!!!
                console.log("No such document.");
            }
        }).catch((error) => {
            // !!!!!!!! CONSOLE.LOG !!!!!!!!!!!
            console.log("Error getting document: ", error);
        });
    }
}


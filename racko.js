//Wade Zengel
//Rack-o

//different places for cards
var mainDeck, discardDeck, extra;
//players
var player1, player2;
//bools to keep track of what the player can activate depending on the part of the turn
var timeToDraw = 1, timeToDiscard = 0, timeToSwap = 0, turnSwitch = 0;
//either 1 or 2 depending on the current player
var currentPlayer, nextCurrentPlayer;

//0 with no winner or the number of the winning player
var winner = 0;

//swap card
var cardToSwap = -1;

const CARD_LENGTH = 150;
const CARD_WIDTH = 92;

function setup(){

    createCanvas(750, 500);
    frameRate(60);
    currentPlayer = 1;
    mainDeck = new mainDeck(40, 450, 25);
    mainDeck.shuffle();
    discardDeck = new discardDeck(150, 25);
    discardDeck.addCard(mainDeck.topCard());
    player1 = new player("player1", 0, 1);
    player2 = new player("player2", 0, 2);
    player1.startingHand(mainDeck.deck);
    player2.startingHand(mainDeck.deck);
    extra = new extraCard();
    nextTurnButton = new nextTurn();

    // all 10 swap buttons
    swap0 = new swapButton(200, 260, 0);
    swap1 = new swapButton(275, 280, 1);
    swap2 = new swapButton(350, 300, 2);
    swap3 = new swapButton(425, 320, 3);
    swap4 = new swapButton(500, 340, 4);
    swap5 = new swapButton(200, 350, 5);
    swap6 = new swapButton(275, 370, 6);
    swap7 = new swapButton(350, 390, 7);
    swap8 = new swapButton(425, 410, 8);
    swap9 = new swapButton(500, 430, 9);
    endGame = new gameOver();
    debuggyBoi = new debuggingText();
    
}

function draw(){

    background(7, 99, 36);
    mainDeck.display();
    discardDeck.display();
    player1.display();
    player2.display();
    extra.display();
    nextTurnButton.display();
    swap0.display();
    swap1.display();
    swap2.display();
    swap3.display();
    swap4.display();
    swap5.display();
    swap6.display();
    swap7.display();
    swap8.display();
    swap9.display();
    endGame.display();

    //used to display global "timeTo" variables
    //debuggyBoi.display();
}

function mainDeck(deckSize, x, y){

    this.x = x;
    this.y = y;
    this.deckSize = deckSize - 20;
    this.deck = buildDeck(deckSize);
    this.chooseDeck = false;

    this.display = function(){

        if(this.deckSize > 0){
        //draw the deck
            push();
            stroke(0);
            fill(0, 25, 75);
            rect(this.x, this.y, CARD_LENGTH, CARD_WIDTH);
            pop();

            if(timeToDraw){
                textSize(24);
                text("Click to draw", this.x + 7, this.y + CARD_WIDTH + 24);
            }
        }
    }

    this.shuffle = function(){

        var current = this.deck.length;
        var temp, rand;
    
        //while there are still elements to shuffle
        while(current !== 0){
    
            //pick an element
            rand = Math.floor(Math.random() * current);
            current--;
    
            //swap em
            temp = this.deck[current];
            this.deck[current] = this.deck[rand];
            this.deck[rand] = temp;
        }
    }

    this.topCard = function(){
        this.deckSize = this.deckSize - 1;
        return this.deck.pop();
    }

    //give the top card to the "extra"
    this.drawCard = function(extraDeck){
        extraDeck.value = this.deck.pop();
        this.deckSize -= 1;
    }

    this.mouseInBox = function(){

        if(mouseX > this.x && mouseX < this.x + CARD_LENGTH && mouseY > this.y && mouseY < this.y + CARD_WIDTH){
            return true;
        } else{
            return false;
        }
    }
}

function discardDeck(x, y){
    this.x = x;
    this.y = y;
    this.deckSize = 0;
    this.deck = [];

    this.display = function(){

        //if there is a card in the deck display its value
        if(this.deckSize){

            //draw the deck
            push();
            stroke(0);
            fill(200, 200, 200);
            rect(this.x, this.y, 150, 92);
            pop();

            textSize(32);
            text(this.deck[this.deckSize - 1], this.x - 20 + CARD_LENGTH/2, this.y + 10 + CARD_WIDTH/2);
        }

        if(timeToDraw){
            textSize(24);
            text("Click to draw", this.x + 7, this.y + CARD_WIDTH + 24);
        }

        if(timeToDiscard){
            textSize(24);
            text("Click to discard", this.x + 7, this.y + CARD_WIDTH + 24);
        }

    }

    //add a card to the deck
    this.addCard = function(newCard){
        this.deck[this.deckSize] = newCard;
        this.deckSize += 1;
    }

    //give the top card to the "extra"
    this.drawCard = function(extraDeck){
        extraDeck.value = this.deck.pop();
        this.deckSize -= 1;
    }

    //returns true if the mouse is in the box
    this.mouseInBox = function(){

        if(mouseX > this.x && mouseX < this.x + CARD_LENGTH && mouseY > this.y && mouseY < this.y + CARD_WIDTH){
            return true;
        } else{
            return false;
        }
    }
}

//takes the number of players to determine the starting deck
function buildDeck(deckSize){

        var deck = [];
    
        for(i = 0; i < deckSize; i++){
            deck[i] = i+1;
        }
    
        return deck;
}

function player(name, score, playerNum){
    if(playerNum == 1){
        this.x = 25;
    } else{
        this.x = 575;
    }
    this.y = 275;
    this.myPlayer = playerNum;
    this.name = name;
    this.score = score;
    this.hand = [];

    this.display = function(){

        //print out the 10 cards that belong to the player
        var yCounter = 0;
        for(i = 0; i < 10; i++){

            push();
            stroke(0);
            fill(200, 200, 200);
            rect(this.x, this.y + yCounter, CARD_LENGTH, CARD_WIDTH);
            pop();

            yCounter += 20;
        }

        //print the text on each card
        yCounter = 0;

                                            // checks for 3 because then the game is over
        if(currentPlayer == this.myPlayer || currentPlayer == 3){
            for(i = 0; i < 10; i++){

                push();
                fill(0);
                textSize(12);
                text(this.hand[i], this.x + this.hand[i]*3 + 1, this.y + 15 + yCounter);
                pop();

                yCounter += 20;
            }
        }
    }

    this.startingHand = function(deck){

        for(i = 0; i < 10; i++){
            this.hand[i] = deck.pop();
        }
    }

    this.checkForWinner = function(){

        var retVal = this.myPlayer;
        var sequence = false;

        for(i = 1; i < 10; i++){
            
            // checks for order
            if(this.hand[i - 1] < this.hand[i]){

                retVal = 0;
            }

            //checks for sequence
            if(i < 9){
                if(this.hand[i - 1] == this.hand[i] + 1 && this.hand[i] - 1 == this.hand[i + 1]){
                    
                    sequence = true;
                }
            }
        }

        if (sequence == false)
            retVal = 0;

        return retVal;
    }
}


function swapButton(x, y, cardNum){

    this.x = x;
    this.y = y;
    this.cardNum = cardNum;

    this.display = function(){

        // the yellow button itself
        push();
        stroke(0);
        fill(255,255,0);
        rect(this.x, this.y, 50, 50);
        pop();

        // the text on the button depending on the current player
        if(currentPlayer == 1){
            push();
            fill(0);
            textSize(12);
            text(player1.hand[this.cardNum], this.x + 17, this.y + 30);
            pop();
        }

        else if(currentPlayer == 2){
            push();
            fill(0);
            textSize(12);
            text(player2.hand[this.cardNum], this.x + 17, this.y + 30);
            pop();
        }
    }

    //sets a global variable to the rank that will need to 
    this.mouseInBoxSwap = function(){

        if(mouseX > this.x && mouseX < this.x + 50 && mouseY > this.y && mouseY < this.y + 50){
            cardToSwap = this.cardNum;
        }
    }
}

function extraCard(){
    //value of the extra card
    this.x = 300;
    this.y = 150;
    this.value = 0;

    this.display = function(){

        if(this.value){

            push();
            stroke(0);
            fill(200, 200, 200);
            rect(this.x, this.y, CARD_LENGTH, CARD_WIDTH);
            pop();

            push();
            fill(0);
            textSize(32);
            text(this.value, this.x - 10 + CARD_LENGTH/2, this.y + 10 + CARD_WIDTH/2);
            pop();
        }
    }
}

function nextTurn(){

    this.x = 225;
    this.y = 150;
    this.display = function(){
        
        if(turnSwitch){

            push();
            stroke(0);
            fill(0, 128, 128);
            rect(this.x, this.y, CARD_LENGTH * 2, CARD_WIDTH);
            pop();

            push();
            fill(0);
            textSize(16);
            text("Click to start Player " + (currentPlayer + 2) + "'s turn!" , this.x - 25 + CARD_LENGTH/2, this.y + 10 + CARD_WIDTH/2);
            pop();
        }
    }

    //returns true if the mouse is in the box
    this.mouseInBox = function(){
        
        if(mouseX > this.x && mouseX < this.x + CARD_LENGTH*  2 && mouseY > this.y && mouseY < this.y + CARD_WIDTH){
            return true;
        } else{
            return false;
        }
    }

}

function gameOver(){

    this.x = 225;
    this.y = 150;

    this.display = function(){
        if(winner > 0){

            push();
            stroke(0);
            fill(250, 250, 210);
            rect(this.x, this.y, CARD_LENGTH * 2, CARD_WIDTH);
            pop();

            push();
            fill(0);
            textSize(32);
            text("Player " + winner + " wins!" , this.x - 25 + CARD_LENGTH/2, this.y + 10 + CARD_WIDTH/2);
            pop();
        }
    }
}

function switchPlayers(){

    //check for winner
    winner = player1.checkForWinner();

    if(winner == 0){

        winner = player2.checkForWinner();
    }

    //neither player has won yet
    if(winner == 0){
        turnSwitch = 1;

        if(currentPlayer == 1){
            nextCurrentPlayer = 2;
        }   else{
            nextCurrentPlayer = 1;
        }

        if(currentPlayer == 1){
            currentPlayer = 0;
        }   else{
            currentPlayer = -1;
        }
    }

    // game is over
    else{

        timeToDiscard = 0;
        timeToDraw = 0;
        turnSwitch = 0;
        timeToSwap = 0;
        currentPlayer = 3;
    }
}

function newTurn(){

    currentPlayer = nextCurrentPlayer;
}

//handles all of the moving of cards whenever something is clicked
function mouseClicked(){

    // check if the mouse was inside 
    swap0.mouseInBoxSwap();
    swap1.mouseInBoxSwap();
    swap2.mouseInBoxSwap();
    swap3.mouseInBoxSwap();
    swap4.mouseInBoxSwap();
    swap5.mouseInBoxSwap();
    swap6.mouseInBoxSwap();
    swap7.mouseInBoxSwap();
    swap8.mouseInBoxSwap();
    swap9.mouseInBoxSwap();

    if(!turnSwitch){
        //draws a card from the discard deck 
        if(timeToDraw == 1 && discardDeck.mouseInBox()){
            timeToDraw = 0;
            timeToDiscard = 0;
            timeToSwap = 1;
            discardDeck.drawCard(extra);
        }

        //draws a card from the main deck
        else if(timeToDraw == 1 && mainDeck.mouseInBox()){
            timeToDraw = 0;
            timeToDiscard = 1;
            timeToSwap = 1;
            mainDeck.drawCard(extra);
        }

        //places drawn card into discard deck
        else if(timeToDiscard == 1 && discardDeck.mouseInBox()){
            timeToDraw = 1;
            timeToDiscard = 0;
            timeToSwap = 0;
            discardDeck.addCard(extra.value);
            extra.value = 0;
            switchPlayers();
        }

        //swap the extra card with a card in your tray
        else if(timeToSwap == 1 && cardToSwap > -1){

            if(currentPlayer == 1){
                discardDeck.addCard(player1.hand[cardToSwap]);
                player1.hand[cardToSwap] = extra.value;
            }
            else{
                discardDeck.addCard(player2.hand[cardToSwap]);
                player2.hand[cardToSwap] = extra.value;
            }

            extra.value = 0;
            timeToSwap = 0;
            timeToDiscard = 0;
            timeToDraw = 1;
            cardToSwap = -1;
            switchPlayers();
        }
    }

    else{

        if(nextTurnButton.mouseInBox()){

            newTurn();
            turnSwitch = 0;

            //shuffle the discard deck into the maindeck when out of cards
            if(mainDeck.deckSize == 0){

                
                discardDeck.drawCard(extra);
                
                mainDeck.deck = discardDeck.deck;
                mainDeck.deckSize = discardDeck.deckSize;
                
                mainDeck.shuffle();
               
                discardDeck.deck = [];
                discardDeck.deckSize = 0;
                discardDeck.addCard(extra.value);
                
                extra.value = 0;
                
            }
        }
    }
}

function debuggingText(){

    this.display = function(){

        push();
        fill(0);
        textSize(32);
        text(timeToDiscard, 50, 50);
        pop();

        push();
        fill(0);
        textSize(32);
        text(timeToSwap, 50, 100);
        pop();

        push();
        fill(0);
        textSize(32);
        text(timeToDraw, 50, 150);
        pop();
    }
}
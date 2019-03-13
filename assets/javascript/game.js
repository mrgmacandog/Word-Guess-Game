"use strict";

(function(){



    // Have a bunch of cards that have pictures and the guesses and then make the appear
    // functionality for making the game end when all words have been guessed and give stats.



    const NUM_START_GUESSES = 8;
    const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

    // Not jQuery but uses same function name to return the DOM element
    function $(id) {
        return document.getElementById(id);
    }

    // Hangman game object
    let game = {
        totalGames: 0, // Number of total games played
        wins: 0,  // Number of wins
        wordsLeft: ["m&m's", "reese's", "hershey's", "snickers", "kit kat", "twix", "twizzlers",  
                    "skittles", "starburst", "milkyway", "butterfinger"],  // Array of candies
        currWord: "",  // Current word
        currWordOutput: "",  // How the word will appear on the webpage
        currWordLetters: [],  // Nested array with each letter of the word
                              // and a boolean that signifies if the letter
                              // should be displayed or not
        numGuessesLeft: NUM_START_GUESSES,  // Amount of guesses the user has left
                                            // Starts off with the constant
        numLettersFound: 0,  // Number of letters found
        lettersGuessed: "",  // String of letter guessed that are not in the word

        // Starts a new game by selecting a random word from the array of words
        startNewGame: function() {
            console.log("Wins: " + this.wins);

            // Selects the random word from the array and sets it as the current word
            this.currWord = this.wordsLeft[Math.floor(Math.random() * this.wordsLeft.length)];
            console.log("Word being guessed: " + this.currWord);

            // Remove current word from the list of words left
            this.wordsLeft.splice(this.wordsLeft.indexOf(this.currWord), 1);


            for (let i = 0; i < this.currWord.length; i++) {
                let thisLetter = this.currWord.charAt(i);
                if (ALPHABET.includes(thisLetter)) {
                    let oneLetter = [this.currWord.charAt(i), false];
                    this.currWordLetters.push(oneLetter);
                } else {
                    let oneLetter = [this.currWord.charAt(i), true];
                    this.currWordLetters.push(oneLetter);
                    this.numLettersFound++;
                }
                
            }

            this.createOutput();

            $("total-games").textContent = this.totalGames;
            $("num-wins").textContent = this.wins;
            $("curr-word").textContent = this.currWordOutput;
            $("num-guesses-left").textContent = this.numGuessesLeft;
            $("letters-guessed").textContent = this.lettersGuessed;


        },
        guessLetter: function(key) {
            if (!this.lettersGuessed.includes(key)) {
                if (this.currWord.includes(key)) {
                    this.updateOutput(key);
                } else {  // Add to lettersGuessed
                    console.log("Word doesn't include " + key);
                    // this.lettersGuessed.push(key);
                    this.lettersGuessed += key + "\xa0";
                    this.numGuessesLeft--;  // Add to lettersGuessed
                }
                
            } else {
                console.log("Already pressed the " + key + " key");
            }
            console.log("# guesses left: " + this.numGuessesLeft);
            console.log("Current word output: " + this.currWordOutput);
            $("curr-word").textContent = this.currWordOutput;
            $("num-guesses-left").textContent = this.numGuessesLeft;




            $("letters-guessed").textContent = this.lettersGuessed;

        },
        createOutput: function() {  //SOLVE FENCE POST
            this.currWordOutput = "";
            for (let i = 0; i < this.currWordLetters.length; i++) {
                if (this.currWordLetters[i][1] === true) {
                    this.currWordOutput += "\xa0" + this.currWordLetters[i][0] + "\xa0";
                } else {
                    this.currWordOutput += "\xa0_\xa0";
                }
            }
            
            
            
        },
        
        updateOutput: function(key) {
            for (let i = 0; i < this.currWordLetters.length; i++) {
                if (this.currWordLetters[i][0] === key &&
                    this.currWordLetters[i][1] === false) {
                    this.currWordLetters[i][1] = true;
                    this.numLettersFound++;
                }
            }
            console.log("# letters found: " + this.numLettersFound);
            console.log("current word length: " + this.currWord.length);

            this.createOutput();
        },
        checkIfSolved: function() {
            return this.numLettersFound === this.currWord.length;
        },
        reset: function() {
            this.currWordOutput = "";
            this.currWordLetters = [];
            this.numGuessesLeft = NUM_START_GUESSES;
            this.numLettersFound = 0;
            this.lettersGuessed = [];
        }
    }

    window.onload = function() {
        // Testing area
        
        // Initiate a new game
        game.startNewGame();

        // Listens for a key press
        document.onkeyup = function(event) {
            console.log("Key pressed: " + event.key);

            if (event.keyCode >= 65 && event.keyCode <= 90) {
                // Guesses with a key
                game.guessLetter(event.key); 

                // Continue with current word if it's not solved yet
                if (!game.checkIfSolved() && game.numGuessesLeft > 0) {
                    console.log("Continuing game");
                // Start new game with new word
                } else {
                    if (game.checkIfSolved()) {
                        console.log("You solved it!");
                        game.wins++;

                        // Open assets/audio/Fanfare-sound/Read.txt for licencing
                        let audio = new Audio("assets/audio/Fanfare-sound/Fanfare-sound.mp3");
                        audio.play();
                    } else {
                        console.log("You ran out of guesses. Game over!");

                        // Open assets/audio/womp-womp/Read.txt for licencing
                        let audio = new Audio("assets/audio/womp-womp/womp-womp.mp3");
                        audio.play();
                    }
                    game.totalGames++;
                    console.log("Total Games:" + game.totalGames)
                    console.log("");
                    game.reset();
                    game.startNewGame();
                }
            } else {
                console.log("Input must be a letter");
            }


            
            console.log("");
            
            
        }
    }
    
})();
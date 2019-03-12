"use strict";

(function(){

    // Pseudo code
    /*
    1. Have a word from an array of word displayed as _ _ _ _ 
    2. 




    */

    const STARTING_GUESSES = 12;


    // Returns the DOM element
    function $(id) {
        return document.getElementById(id);
    }

    // Hangman game object
    let game = {
        wins: 0,
        wordsLeft: ["html", "css", "javascript", "php", "sql"],
        currWord: "",  // Current word
        currWordOutput: "",  // How the word will appear on the webpage
        currWordLetters: [],  // List of the letters the user had guessed that are not in the word
        numGuessesLeft: STARTING_GUESSES,  // Amount of guesses the user has left
        numLettersFound: 0,
        lettersGuessed: [],
        startNewGame: function() {  // CHECK
            console.log("Wins: " + this.wins);
            this.currWord = this.wordsLeft[Math.floor(Math.random() * this.wordsLeft.length)];  // CHECK
            console.log("Word being guessed: " + this.currWord);  // CHECK

            // Remove current word from the list of words left
            this.wordsLeft.splice(this.wordsLeft.indexOf(this.currWord), 1);  // CHECK

            for (let i = 0; i < this.currWord.length; i++) {  // CHECK
                let oneLetter = [this.currWord.charAt(i), false];  // CHECK
                this.currWordLetters.push(oneLetter);  // CHECK
            }

            this.createOutput();

            $("num-wins").textContent = this.wins;
            $("curr-word").textContent = this.currWordOutput;
            $("num-guesses-left").textContent = this.numGuessesLeft;
            $("letters-guessed").textContent = this.lettersGuessed;


        },
        guessLetter: function(key) {  // CHECK
            if (!this.lettersGuessed.includes(key)) {
                if (this.currWord.includes(key)) {
                    this.updateOutput(key);
                } else {  // Add to lettersGuessed
                    console.log("Word doesn't include " + key);
                    this.lettersGuessed.push(key);
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
                    this.currWordOutput += this.currWordLetters[i][0];
                } else {
                    this.currWordOutput += " _ ";
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

            this.createOutput();
        },
        checkIfSolved: function() {
            return this.numLettersFound === this.currWord.length;
        },
        reset: function() {
            this.currWordOutput = "";
            this.currWordLetters = [];
            this.numGuessesLeft = STARTING_GUESSES;
            this.numLettersFound = 0;
            this.lettersGuessed = [];
        }
    }




    window.onload = function() {
        // Testing area
        
        // game.displayWord();

        // Initiate a new game
        game.startNewGame();  // CHECK

        // Listens for a key press
        document.onkeyup = function(event) {
            console.log("Key pressed: " + event.key);

            if (event.keyCode >= 65 && event.keyCode <= 90) {
                // Guesses with a key
                game.guessLetter(event.key);  // CHECK

                // Continue with current word if it's not solved yet
                if (!game.checkIfSolved() && game.numGuessesLeft > 0) {
                    console.log("Continuing game");
                // Start new game with new word
                } else {
                    if (game.checkIfSolved()) {
                        console.log("You solved it!");
                        game.wins++;
                    } else {
                        console.log("You ran out of guesses. Game over!");
                    }
                    
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
"use strict";

(function(){

    const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

    // Not jQuery but uses same function name to return the DOM element
    function $(id) {
        return document.getElementById(id);
    }

    // Hangman game object
    let game = {
        totalGames: 0, // Number of total games played
        wins: 0,  // Number of wins
        wordsLeft: ["skittles", "m&m's", "snickers", "reese's cups", "starburst", "candy corn",
                    "hot tamales", "hershey's minis", "tootsie pops", "jolly ranchers", "taffy",
                    "sour patch kids", "almond joy", "butterfinger", "blow pops", "milky way",
                    "swedish fish", "kit kat", "dubble bubble gum", "three musketeers",
                    "lemonheads", "twix", "life savers", "whoppers", "licorice"],  // Array of candies
        currWord: "",  // Current word
        currWordOutput: "",  // How the word will appear on the webpage
        currWordLetters: [],  // Nested array with each letter of the word
                              // and a boolean that signifies if the letter
                              // should be displayed or not
        numGuessesStart: 0,  // Number of guesses to start, depending on the difficulty
        numGuessesLeft: 0,  // Amount of guesses the user has left
                                            // Starts off with the constant
        numLettersFound: 0,  // Number of letters found
        lettersGuessed: "",  // String of letter guessed that are not in the word
        isDifficultySet: false,  // Flag for setting the difficulty

        // Creates a card to be displayed below the game
        createCandyCard: function(isSolved) {
            
            // Create a bootstrap column
            let column = document.createElement("div");

            // "d-flex align-items-stretch" allows the cards to be the same height in a row
            column.className = "col-md-3 d-flex align-items-stretch";

            // Create a card and append it to the column
            let card = document.createElement("div");
            card.className = "card text-white shadow rounded";
            // Word is guessed
            if (isSolved) {
                card.classList.add("bg-success");
            } else {  // Word is not guessed
                card.classList.add("bg-danger");
            }
            column.append(card);

            // Create an image tag and append it to card
            let image = document.createElement("img");
            image.className = "card-img-top";
            // The image file name has to match exactly the word that's being guessed
            image.src = "assets/images/candies/" + this.currWord + ".jpg";
            image.alt = this.currWord;
            card.appendChild(image);

            // Create a card body and append it to the card
            let cardBody = document.createElement("div");
            cardBody.className = "card-body";
            card.append(cardBody);

            // Create a card title and append it to the card body
            let cardTitle = document.createElement("h5");
            cardTitle.className = "card-title";
            cardTitle.innerText = this.currWord;
            cardBody.append(cardTitle);

            // Create a description and append it to the card body
            let cardText = document.createElement("p");
            cardText.className = "card-text";
            // Word is guessed
            if (isSolved) {
                cardText.innerText = "Correct!";
            } else {  // Word is not guessed
                cardText.innerText = "You got this far: " + this.currWordOutput;
            }
            cardBody.append(cardText);
            
            // Adds to the beginning of the cards
            $("candies").insertBefore(column, $("candies").firstChild);
        },

        // Start a new game by selecting a random word from the array of words
        startNewGame: function() {
            // Select the random word from the array and sets it as the current word
            this.currWord = this.wordsLeft[Math.floor(Math.random() * this.wordsLeft.length)];

            // Create nested array that holds a character and a boolean that
            // signifies whether the letter or underscore will be shown
            for (let i = 0; i < this.currWord.length; i++) {
                let thisLetter = this.currWord.charAt(i);
                // Set the boolean associated with the alphabetic letter to false 
                if (ALPHABET.includes(thisLetter)) {
                    let oneLetter = [this.currWord.charAt(i), false];
                    this.currWordLetters.push(oneLetter);
                // Set the boolean associated with non-alphabetic characters to true to
                //     be displayed without guessing them
                } else {
                    let oneLetter = [this.currWord.charAt(i), true];
                    this.currWordLetters.push(oneLetter);
                    this.numLettersFound++;
                }   
            }

            // Create what the output would look like
            this.createOutput();

            // Update screen
            $("total-games").textContent = this.totalGames;
            $("num-wins").textContent = this.wins;
            $("curr-word").textContent = this.currWordOutput;
            $("num-guesses-left").textContent = this.numGuessesLeft;
            $("letters-guessed").textContent = this.lettersGuessed;

        },

        // Perform a guess with the key press
        guessLetter: function(key) {
            // Check to see if user already guessed the letter before
            if (!this.lettersGuessed.includes(key)) {
                // Check if word has letter
                if (this.currWord.includes(key)) {
                    this.updateOutput(key);
                } else {  // Add to lettersGuessed
                    this.lettersGuessed += key + "\xa0";
                    this.numGuessesLeft--;  // Add to lettersGuessed
                } 
            }

            // Update screen
            $("curr-word").textContent = this.currWordOutput;
            $("num-guesses-left").textContent = this.numGuessesLeft;
            $("letters-guessed").textContent = this.lettersGuessed.toUpperCase();
        },

        // Build output
        createOutput: function() { 
            this.currWordOutput = "";
            for (let i = 0; i < this.currWordLetters.length; i++) {
                // Display letter if true
                if (this.currWordLetters[i][1] === true) {
                    this.currWordOutput += "\xa0" + this.currWordLetters[i][0] + "\xa0";

                // Display underscore
                } else {
                    this.currWordOutput += "\xa0_\xa0";
                }
            }
        },
        
        // Update output
        updateOutput: function(key) {
            for (let i = 0; i < this.currWordLetters.length; i++) {
                // Update the boolean associated with each letter of the letter guessed is correct
                if (this.currWordLetters[i][0] === key &&
                    this.currWordLetters[i][1] === false) {
                    this.currWordLetters[i][1] = true;
                    this.numLettersFound++;
                }
            }
            // Create output with new letter to boolean associatons
            this.createOutput();
        },

        // Check if user has found all the letters
        checkIfSolved: function() {
            return this.numLettersFound === this.currWord.length;
        },

        // Show rsults when all words have been attempted to be guessed
        displayResults: function() {
            $("results").classList.remove("hidden");
            $("in-game").classList.add("hidden");
            $("end-wins").textContent = this.wins;
            $("end-total-games").textContent = this.totalGames;
        },

        // Resets this game object's attributes
        reset: function() {
            // Remove current word from the list of words left
            this.wordsLeft.splice(this.wordsLeft.indexOf(this.currWord), 1);

            // Reserts game attributes
            this.currWordOutput = "";
            this.currWordLetters = [];
            this.numGuessesLeft = this.numGuessesStart;
            this.numLettersFound = 0;
            this.lettersGuessed = "";
        }
    }

    window.onload = function() {

        // Choose easy mode
        $("easy").onclick = function() {
            game.numGuessesStart = 12;
            game.numGuessesLeft = 12;
            $("num-guesses-left").textContent = game.numGuessesLeft;
            $("easy").classList.add("active");
            $("normal").classList.remove("active");
            $("hard").classList.remove("active");
            $("ready").disabled = false;
        }

        // Choose normal mode
        $("normal").onclick = function() {
            game.numGuessesStart = 8;
            game.numGuessesLeft = 8;
            $("num-guesses-left").textContent = game.numGuessesLeft;
            $("easy").classList.remove("active");
            $("normal").classList.add("active");
            $("hard").classList.remove("active");
            $("ready").disabled = false;
        }

        // Choose hard mode
        $("hard").onclick = function() {
            game.numGuessesStart = 4;
            game.numGuessesLeft = 4;
            $("num-guesses-left").textContent = game.numGuessesLeft;
            $("easy").classList.remove("active");
            $("normal").classList.remove("active");
            $("hard").classList.add("active");
            $("ready").disabled = false;
        }

        // Hide buttons, change instructions, and start game
        $("ready").onclick = function() {
            game.isDifficultySet = true;
            $("in-game").classList.remove("hidden");
            $("easy").classList.add("hidden");
            $("normal").classList.add("hidden");
            $("hard").classList.add("hidden");
            $("ready").classList.add("hidden");
            $("instructions").innerText = "Press any key to make your first guess!";
        }

        // Initiate a new game
        game.startNewGame();

        // Listens for a key press
        document.onkeyup = function(event) {

            // Continue game only if difficulty is set, there are still words to be guessed
            //     and the key pressed is a letter
            if (game.isDifficultySet && game.wordsLeft.length > 0 && event.keyCode >= 65 && event.keyCode <= 90) {

                // Guesses with a key
                game.guessLetter(event.key); 

                // Continue with current word if it's not solved yet
                if (game.checkIfSolved() || game.numGuessesLeft === 0) {

                    let isSolved = game.checkIfSolved()

                    if (isSolved) {
                        game.wins++;
                        // Open assets/audio/Fanfare-sound/Read.txt for licensing
                        let audio = new Audio("assets/audio/Game-show-correct-answer/Game-show-correct-answer.mp3");
                        audio.play();
                    } else {
                        // Open assets/audio/womp-womp/Read.txt for licensing
                        let audio = new Audio("assets/audio/womp-womp/womp-womp.mp3");
                        audio.play();
                    }

                    game.createCandyCard(isSolved);
                    game.totalGames++;
                    game.reset();

                    // Only start a new game if there are words left
                    if (game.wordsLeft.length > 0) {
                        game.startNewGame();
                    } else {  // Else display the results
                        game.displayResults();
                        $("instructions").innerText = "Hit refresh to play again!";
                    }
                }
            }
        }
    }
    
})();
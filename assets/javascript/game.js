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
        wordsLeft: ["skittles", "m&m's", "snickers", "reese's cups", "starburst", "candy corn",
                    "hot tamales", "hershey's minis", "tootsie pops", "jolly ranchers", "taffy",
                    "sour patch kids", "almond joy", "butterfinger", "blow pops", "milky way",
                    "swedish fish", "kit kat", "double bubble gum", "three musketeers",
                    "lemonheads", "twix", "life savers", "whoppers", "licorice"],  // Array of candies
        currWord: "",  // Current word
        currWordOutput: "",  // How the word will appear on the webpage
        currWordLetters: [],  // Nested array with each letter of the word
                              // and a boolean that signifies if the letter
                              // should be displayed or not
        numGuessesLeft: NUM_START_GUESSES,  // Amount of guesses the user has left
                                            // Starts off with the constant
        numLettersFound: 0,  // Number of letters found
        lettersGuessed: "",  // String of letter guessed that are not in the word

        // createCandyCards: function() {
        //     for (let i = 0; i < this.wordsLeft.length; i++) {
        //         // Create a bootstrap column
        //         let column = document.createElement("div");
        //         column.className = "col-md-3";

        //         // Create a card and append it to the column
        //         let card = document.createElement("div");
        //         card.className = "card";
        //         column.append(card);

        //         // Create an image tag and append it to card
        //         let image = document.createElement("img");
        //         image.className = "card-img-top";
        //         image.src = "assets/images/candies/skittles.jpg";
        //         image.alt = this.wordsLeft[i];
        //         card.appendChild(image);

        //         // Create a card body and append it to the card
        //         let cardBody = document.createElement("div");
        //         cardBody.className = "card-body";
        //         card.append(cardBody);

        //         // Create a card title and append it to the card body
        //         let cardTitle = document.createElement("h5");
        //         cardTitle.className = "card-title";
        //         cardTitle.innerText = this.wordsLeft[i];
        //         cardBody.append(cardTitle);

        //         // Create a description and append it to the card body
        //         let cardText = document.createElement("p");
        //         cardText.className = "card-text";
        //         cardText.innerText = "You got this right!";
        //         cardBody.append(cardText);
                
        //         $("candies").appendChild(column);
        //     }
        // },

        createCandyCard: function(isSolved) {
            
            // Create a bootstrap column
            let column = document.createElement("div");
            column.className = "col-md-3";

            // Create a card and append it to the column
            let card = document.createElement("div");
            card.className = "card";
            column.append(card);

            // Create an image tag and append it to card
            let image = document.createElement("img");
            image.className = "card-img-top";
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
            // If word is guessed
            if (isSolved) {
                cardText.innerText = "You got this right!";
            } else {  // Word is not guessed
                cardText.innerText = "You got this wrong!";
            }
            
            cardBody.append(cardText);
            
            $("candies").appendChild(column);
        },

        // Starts a new game by selecting a random word from the array of words
        startNewGame: function() {
            console.log("Wins: " + this.wins);

            // Selects the random word from the array and sets it as the current word
            this.currWord = this.wordsLeft[Math.floor(Math.random() * this.wordsLeft.length)];
            console.log("Word being guessed: " + this.currWord);

            


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

        displayIsSolved: function(isSolved) {
            let output = "You "

            // If the word is guessed
            if (isSolved) {
                output += "succesfully guessed ";
            } else {  // Word is not guessed
                output += "failed to guess ";
            }

            output += this.currWord;
            console.log(this.currWord);
            $("outcome").textContent = output;
        },

        displayResults: function() {
            $("game-over").classList.toggle("hidden");
            $("end-wins").textContent = this.wins;
            $("end-total-games").textContent = this.totalGames;
        },

        // Resets this game object's attributes
        reset: function() {
            // Remove current word from the list of words left
            this.wordsLeft.splice(this.wordsLeft.indexOf(this.currWord), 1);

            this.currWordOutput = "";
            this.currWordLetters = [];
            this.numGuessesLeft = NUM_START_GUESSES;
            this.numLettersFound = 0;
            this.lettersGuessed = [];
        }
    }

    window.onload = function() {
        // Testing area
        

        // game.createCandyCards();

        // Initiate a new game
        game.startNewGame();

        // Listens for a key press
        document.onkeyup = function(event) {
            console.log("Key pressed: " + event.key);

            // If there are still words to be guessed
            if (game.wordsLeft.length > 0) {

                if (event.keyCode >= 65 && event.keyCode <= 90) {
                    // Guesses with a key
                    game.guessLetter(event.key); 

                    // Continue with current word if it's not solved yet
                    if (!game.checkIfSolved() && game.numGuessesLeft > 0) {
                        console.log("Continuing game");
                    // Start new game with new word
                    } else {

                        let isSolved = game.checkIfSolved()

                        if (isSolved) {
                            console.log("You solved it!");
                            game.wins++;
                            

                            // Open assets/audio/Fanfare-sound/Read.txt for licencing
                            let audio = new Audio("assets/audio/Fanfare-sound/Fanfare-sound.mp3");
                            audio.play();
                        } else {
                            console.log("You ran out of guesses. Next word!");

                            // Open assets/audio/womp-womp/Read.txt for licencing
                            let audio = new Audio("assets/audio/womp-womp/womp-womp.mp3");
                            audio.play();
                        }

                        game.createCandyCard(isSolved);
                        game.displayIsSolved(isSolved);

                        game.totalGames++;
                        console.log("Total Games:" + game.totalGames)
                        console.log("");
                        game.reset();

                        // Only start a new game if there are words left
                        if (game.wordsLeft.length > 0) {
                            game.startNewGame();
                        } else {  // Else display the results
                            game.displayResults();
                            console.log("Congratulations, you were able to find " + game.wins +
                                        " out of the " + game.totalGames +" played");
                        }
                    }
                } else {
                    console.log("Input must be a letter");
                }
            
            console.log("");
            
            }
        }
    }
    
})();
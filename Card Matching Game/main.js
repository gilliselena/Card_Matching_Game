/**
 * Project: Snap! 
 * Description: A card matching game
 * Author: Elena Gillis
 *
 * This is my take on Rob Merrill's original project
 */


var cardsArray = [
  {    'name': 'CSS',    'img': 'https://github.com/robgmerrill/img/blob/master/css3-logo.png?raw=true',  },
  {    'name': 'HTML',    'img': 'https://github.com/robgmerrill/img/blob/master/html5-logo.png?raw=true',  },
  {    'name': 'jQuery',    'img': 'https://github.com/robgmerrill/img/blob/master/jquery-logo.png?raw=true',  },
  {    'name': 'JS',    'img': 'https://github.com/robgmerrill/img/blob/master/js-logo.png?raw=true',  },
  {    'name': 'Node',    'img': 'https://github.com/robgmerrill/img/blob/master/nodejs-logo.png?raw=true',  },
  {    'name': 'Photo Shop',    'img': 'https://github.com/robgmerrill/img/blob/master/photoshop-logo.png?raw=true',  },
  {    'name': 'PHP',    'img': 'https://github.com/robgmerrill/img/blob/master/php-logo_1.png?raw=true',  },
  {    'name': 'Python',    'img': 'https://github.com/robgmerrill/img/blob/master/python-logo.png?raw=true',  },
  {    'name': 'Ruby',    'img': 'https://github.com/robgmerrill/img/blob/master/rails-logo.png?raw=true',  },
  {    'name': 'Sass',    'img': 'https://github.com/robgmerrill/img/blob/master/sass-logo.png?raw=true',  },
  {    'name': 'Sublime',    'img': 'https://github.com/robgmerrill/img/blob/master/sublime-logo.png?raw=true',  },
  {    'name': 'Wordpress',    'img': 'https://github.com/robgmerrill/img/blob/master/wordpress-logo.png?raw=true',  },
];

// Duplicate cardsArray to create a match for each card
var gameGrid = cardsArray.concat(cardsArray);

// Randomize game grid on each load
var randomCards = function(){
  gameGrid.sort(function() {
    return 0.5 - Math.random();
  }) 
}
randomCards();

// Grab the div with an id of game-board and assign to a variable game
var game = document.getElementById('game-board');

// Create a section element and assign it to variable grid
var grid = document.createElement('section');

// Give section element a class of grid.
grid.setAttribute('class', 'grid');

// Append the grid section to the game-board div
game.appendChild(grid);

// Append the cards to the game grid
var drawGrid = function(){
  for (i = 0; i < gameGrid.length; i++) {
    // Create a card
    var card = document.createElement('div');
    card.classList.add('card');

    // Set the data-name attribute of the div to the cardsArray name
    card.dataset.name = gameGrid[i].name;

    // Create front of card
    var front = document.createElement('div');
    front.classList.add('front');

    // Create back of card
    var back = document.createElement('div');
    back.classList.add('back');
    back.style.backgroundImage = `url(${gameGrid[i].img})`;

    // Append card to grid
    grid.appendChild(card);
    card.appendChild(front);
    card.appendChild(back);
  }
}
drawGrid();

var firstGuess = '';
var secondGuess = '';
// Set count to 0
var count = 0;
var previousTarget = null;
var delay = 500;
var tries = 0;
var matched = 0;

// Game Instruction Modal
var gameInstructions = function(){
  var instructions = document.createElement('div');
  var overlayInstructions = document.createElement('div');
  overlayInstructions.id = 'overlayInst';
  instructions.id = "instructions";
  instructions.innerHTML = "<h1>Welcome to <strong>Snap!</strong> - </br><span>the Memory Game</span></h1>";
  instructions.innerHTML += "<ol><li>Turn over any two cards.</li><li>If the two cards match, they will disappear.</li><li>If they don't match, they will flip back.</li><li>Remember what was on each card and where it was.</li><li>The game is over when all the cards have been matched and the screen is clear.</li></ol>"
  instructions.innerHTML += "<button onclick='startTheGame()' id='ready'>Ready to play</button>";

  game.appendChild(overlayInstructions);
  game.appendChild(instructions);
};

gameInstructions();

//Start the Game 

var startTheGame = function(){
  var instructions = document.querySelector('#instructions');
  instructions.parentNode.removeChild(instructions);
  var overlayInst = document.querySelector('#overlayInst')
  overlayInst.parentNode.removeChild(overlayInst);
};

// Add match CSS
var match = function() {
  var selected = document.querySelectorAll('.selected');
  // loop through the array like object containing `selected` class
  for (i = 0; i < selected.length; i++) {
    selected[i].classList.add('match');
  };
  matched++;
  console.log('you matched ' + matched)
};

// If matched all the cards 
var cardsMatched = function(){
  if(matched === 1){
      var result = document.createElement('div');
      var overlay = document.createElement('div');
      result.id = 'result';
      overlay.id = 'overlay';
      result.innerHTML = '<h1>Game Over</h1><p>It took you ' + tries + ' tries to win the game</p><button onclick="reload()" id="playAgain">Play again</button>';

      game.appendChild(overlay); 
      game.appendChild(result);
    };
};
// Reset guesses after two attempts
var resetGuesses = function() {
  firstGuess = '';
  secondGuess = '';
  count = 0;
  previousTarget = null;

  var selected = document.querySelectorAll('.selected');
  for (i = 0; i < selected.length; i++) {
    selected[i].classList.remove('selected');
  }
};

//Add Event Listener to reload button

var reload = function(){
  var result = document.querySelector('#result');
  var overlay = document.querySelector('#overlay');
  result.parentNode.removeChild(result);
  overlay.parentNode.removeChild(overlay);
  grid.innerHTML = '';
  firstGuess = '';
  secondGuess = '';
  count = 0;
  previousTarget = null;
  tries = 0;
  matched = 0;
  randomCards();
  drawGrid(); 
}


// Add event listener to grid
grid.addEventListener('click', function(event) {
  // Declare variable to target our clicked item
  var clicked = event.target;
  // Do not allow the grid section itself to be selected;
  // only select divs inside the grid
  if (clicked.nodeName === 'SECTION' || clicked === previousTarget || clicked.parentNode.classList.contains('match') || clicked.parentNode.classList.contains('selected')) {
    return;
  }
  // We only want to add `selected` class if the current count is less than 2
  if (count < 2) {
    count++;

    if (count === 1) {
      // Assign first guess
      firstGuess = clicked.parentNode.dataset.name;
      clicked.parentNode.classList.add('selected');
    } else {
      // Assign second guess
      secondGuess = clicked.parentNode.dataset.name;
      clicked.parentNode.classList.add('selected');
      tries ++;
    }
    // If both guesses are not empty
    if (firstGuess !== '' && secondGuess !== '') {
      // And the firstGuess matches secondGuess
      if (firstGuess === secondGuess) {
        // Run the match function
        setTimeout(match, delay);
        setTimeout(resetGuesses, delay);
      } else {
        setTimeout(resetGuesses, delay);
      }
    }
    previousTarget = clicked;
  };
  setTimeout(cardsMatched, delay);
});

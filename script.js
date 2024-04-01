//===================================Scoreboard=====================================
const scoreBoard = document.getElementById("scoreBoard").getElementsByTagName('h3');
scoreBoard[0].innerText = 0;
let highScoreText = document.getElementById("highScore").getElementsByTagName('h3');
if (localStorage.getItem('score') === null){
  localStorage.setItem('score', 99999)
  }
highScoreText[0].innerText = localStorage.getItem('score');
//==============================scoreboard above here==============================

function isNumeric(value){
  return /^\d+$/.test(value);
}

//======================================Game========================================
const gameContainer = document.getElementById("game");
const gameControl = document.getElementById("gameControl");
const deckSizeInput = document.getElementById("deckSize");
const start = document.getElementById("startBtn");
start.addEventListener("click", function(){  
  // hides button because reset should not be possible without refresh or victory
  // hide deck size input
  // clear gameContainer
  // reset scoreboard
  // start Game
  let score = 0;
  scoreBoard[0].innerText = score;
  let deckSize = deckSizeInput.value;
  
  if (isNumeric(deckSize) === false){
    alert("Please only enter a whole positive number for the deck size");
    return;
  }
  deckSize = Math.round(deckSize);
  if (deckSize / 2 === 1){deckSize++;}
  //prevet deckSize from being odd number.  Rounds up
  gameContainer.innerHTML = '';
  gameControl.style.display = 'none';
  
  let COLORS = [];
  // new setup to allow COLORS to scale indefinitely for deck size
  const COLORTYPES = [
    "red",
    "blue",
    "green",
    "orange",
    "purple",
  ];
  let scoreMod = (deckSize/2)/COLORTYPES.length; 
  // modify score based on deck size
  console.log(scoreMod);
  let colorCount = 0;
  for(let i = 0; i < deckSize; i+=2){
    if(colorCount >= COLORTYPES.length){
      colorCount = 0;
    }
    COLORS[i] = COLORTYPES[colorCount];
    COLORS[i+1] = COLORTYPES[colorCount];
    colorCount++;
  }



  // here is a helper function to shuffle an array
  // it returns the same array with values shuffled
  // it is based on an algorithm called Fisher Yates if you want ot research more
  function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  }

  let shuffledColors = shuffle(COLORS);
  let selectedCardCount = 0;

  // this function loops over the array of colors
  // it creates a new div and gives it a class with the value of the color
  // it also adds an event listener for a click for each card
  function createDivsForColors(colorArray) {
    for (let color of colorArray) {
      // create a new div
      const newDiv = document.createElement("div");
      // give it a face down texture class to hide color
      newDiv.classList.add("face-down");
      
      // give it a class attribute for the value we are looping over
      newDiv.classList.add(color);

    

      // call a function handleCardClick when a div is clicked on
      newDiv.addEventListener("click", handleCardClick);

      // append the div to the element with an id of game
      gameContainer.append(newDiv);
    }
  }

  // TODO: Implement this function!
  function handleCardClick(event) {
    // you can use event.target to see which element was clicked

    if (event.target.tagName === 'DIV'){
      if (selectedCardCount < 2){
        if(event.target.classList.contains("face-down") === true){
          selectCard(event);
        }  
      }
    } 
  }


  function selectCard(event){
    // flips Cards face up and selects them
    event.target.classList.toggle("face-down");
    event.target.setAttribute('id', selectedCardCount);
    selectedCardCount++;
    if(selectedCardCount >= 2){
      checkMatch();  
    }
  }

  function flipCardsDown (){
    // adds class "face-down" to gameContainer DIV missing this class after 1 second delay
    // excludes DIV with class "matched" 
    setTimeout(function (){
              
      for(const child of gameContainer.children){
        if(child.classList.contains("matched") === false){
          if(child.classList.contains("face-down") === false){
            child.classList.add("face-down");
          }
        }  
      }
      selectedCardCount = 0;
    }, 1000)
  }

  function checkMatch(){
    // check if Cards selected match, request flipCardsDown if false, add class "matched" if true
    // add point to score and updates current score board
    score = score + (1 / scoreMod);
    
    scoreBoard[0].innerText = score;

    let cardOne = document.getElementById("0");
    let cardTwo = document.getElementById("1");
    if(cardOne.classList.value === cardTwo.classList.value){
      cardOne.classList.add("matched");
      cardTwo.classList.add("matched");
      selectedCardCount = 0;
      checkVictory();
    }else{
      flipCardsDown();
    }
    cardOne.removeAttribute('id');
    cardTwo.removeAttribute('id');
  }
  function checkVictory(){
    // Confirms if player won  
    // Adds restart button
    // Saves score
    for(const child of gameContainer.children){
      if(child.classList.contains("face-down") === true){
        return;
      }
    }
    console.log (parseInt(localStorage.getItem('score')), ">", score);
    if(parseInt(localStorage.getItem('score')) > score){
      localStorage.setItem('score', score) 
      highScoreText[0].innerText = localStorage.getItem('score');
    }
    gameContainer.innerHTML = '';
    // repurpose startBtn for a restart button
    start.innerText = "Restart"
    gameControl.style.display = 'block'
  }


  // when the DOM loads
  createDivsForColors(shuffledColors);
})
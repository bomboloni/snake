const LINE_PIXEL_COUNT = 40
const TOTAL_PIXEL_COUNT = LINE_PIXEL_COUNT**2
const ROWS = 40
const COLUMNS = 40
const LEFT_DIR = 37
const UP_DIR = 38
const RIGHT_DIR = 39
const DOWN_DIR = 40

let totalFoodEaten = 0
let totalDistanceTraveled = 0

const gameContainer = document.getElementById('gameContainer')

// generates the game board
const createGameBoardPixels = () => {
  for (let i = 1; i<= TOTAL_PIXEL_COUNT; i++) {
    gameContainer.innerHTML = `${gameContainer.innerHTML} <div class="gameBoardPixel" id="pixel${i}"></div>`;
  }
}

const gameBoardPixels = document.getElementsByClassName('gameBoardPixel')
let currentFoodPosition = 0

// randomly generate food items
const createFood = () => {
    gameBoardPixels[currentFoodPosition].classList.remove('food')   
    currentFoodPosition = Math.floor(Math.random() * TOTAL_PIXEL_COUNT)
    gameBoardPixels[currentFoodPosition].classList.add('food')
}

let currentHeadPosition = TOTAL_PIXEL_COUNT/2 
let snakeLength = 200
let currentSnakeDirection = RIGHT_DIR

const changeDirection = newDirectionCode => {
    // rooting out invalid user input
    if(newDirectionCode === currentSnakeDirection
        || newDirectionCode === RIGHT_DIR && currentSnakeDirection === LEFT_DIR
        || newDirectionCode === LEFT_DIR && currentSnakeDirection === RIGHT_DIR
        || newDirectionCode === UP_DIR && currentSnakeDirection === DOWN_DIR
        ||newDirectionCode === DOWN_DIR && currentSnakeDirection === UP_DIR) return

        currentSnakeDirection = newDirectionCode
}

const moveSnake = () => {
    switch (currentSnakeDirection) {
        case LEFT_DIR:
          --currentHeadPosition
          const isHeadAtLeft = currentHeadPosition % LINE_PIXEL_COUNT == LINE_PIXEL_COUNT - 1 || currentHeadPosition < 0
          if (isHeadAtLeft) {
            currentHeadPosition = currentHeadPosition + LINE_PIXEL_COUNT
          }
        break;
        case RIGHT_DIR:
          ++currentHeadPosition
          const isHeadAtRight = currentHeadPosition % LINE_PIXEL_COUNT == 0
          if (isHeadAtRight) {
            currentHeadPosition = currentHeadPosition - LINE_PIXEL_COUNT
          }
          break;
        case UP_DIR :
          currentHeadPosition = currentHeadPosition - LINE_PIXEL_COUNT
          const isHeadAtTop = currentHeadPosition < 0
          if (isHeadAtTop) {
            currentHeadPosition = currentHeadPosition + TOTAL_PIXEL_COUNT
          }
          break;
        case DOWN_DIR: 
          currentHeadPosition = currentHeadPosition + LINE_PIXEL_COUNT
          const isHeadAtBottom = currentHeadPosition > TOTAL_PIXEL_COUNT -1
          if (isHeadAtBottom) {
            currentHeadPosition = currentHeadPosition - TOTAL_PIXEL_COUNT
          }
          break;
        //   this empty default is from the tutorial
          default:
          break;
        }

        let nextSnakeHeadPixel = gameBoardPixels[currentHeadPosition]

        if(nextSnakeHeadPixel.classList.contains('snakeBodyPixel')) {
            clearInterval(moveSnakeInterval)
            alert(`You have eaten ${totalFoodEaten} and traveled ${totalDistanceTraveled} blocks`)
            window.location.reload()
        }
        // add pixel to move snake forward...
        nextSnakeHeadPixel.classList.add("snakeBodyPixel")

        // ...and subtract pixel from the other end
        setTimeout(() => {
            nextSnakeHeadPixel.classList.remove('snakeBodyPixel')
        }, snakeLength)

        // if snake eats: update points, length, set new food
        if(currentHeadPosition === currentFoodPosition) {
          totalFoodEaten++
          document.getElementById('pointsEarned').innerText = totalFoodEaten
          snakeLength += 100
          createFood()
        }

        totalDistanceTraveled++
        document.getElementById('pointsTraveled').innerText = totalDistanceTraveled
}

// spin up a game
createGameBoardPixels()
createFood()
// sets animation speed
let moveSnakeInterval = setInterval(moveSnake, 100)

// steer the snake! (also, look into changing this with KeyboardEvent.code - TODO)
addEventListener('keydown', e => changeDirection(e.keyCode))

// mobile controls (onscreen buttons)
const leftButton = document.getElementById('leftButton')
const rightButton = document.getElementById('rightButton')
const upButton = document.getElementById('upButton')
const downButton = document.getElementById('downButton')

leftButton.onclick = () => changeDirection(LEFT_DIR)
rightButton.onclick = () => changeDirection(RIGHT_DIR)
upButton.onclick = () => changeDirection(UP_DIR)
downButton.onclick = () => changeDirection(DOWN_DIR)

////////////////////////////////////////////////////////////////////////////
// some board generating logic to work in when the time comes to refactor:
// const createGameBoardPixels = () => {
//     for(let i = 1; i <= ROWS; i++) {
//         for(let j = 1; j <= COLUMNS; j++) {
//             gameContainer.innerHTML = `${gameContainer.innerHTML} <div class="gameBoardPixel" id="pixel${i*j}"></div>`
//         }
//     }
// }
// 
// Actually, I'll want to create a matrix array, something like
// Array(ROWS).fill().map(()=>Array(COLUMNS).fill())
// or
// Array(ROWS).fill(Array(COLUMNS))
// giving everything a 'pixel' class ?

// I'll then want to refactor createFood() to reference coordinates

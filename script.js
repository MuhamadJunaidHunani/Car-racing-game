const gameArea = document.getElementById("gameArea");
const playerCar = document.getElementById("playerCar");
const distanceMeter = document.querySelector(".distanceMeter");

// Road and car settings
let roadSpeed = 3;
let maxSpeed = 30;
let minSpeed = 3;
let distance = 0;
console.log(gameArea.offsetHeight);

const car = {
  x: gameArea.offsetWidth / 2 - 25,
  y: gameArea.offsetHeight - 120,
  moveSpeed: 5,
};

const keys = {};
const enemyCars = [];
const enemyCarWidth = 30;
const enemyCarHeight = 60;

let roadPosition = 0;

// Event listeners for key presses
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Update road position
function updateRoad() {
  roadPosition += roadSpeed;
  gameArea.style.backgroundPositionY = `${roadPosition}px`;
}

// Create a new enemy car
function createEnemyCar() {
  const xPosition = Math.random() * (gameArea.offsetWidth - enemyCarWidth);
  const enemyCar = document.createElement("div");
  enemyCar.classList.add("enemy");
  enemyCar.style.left = `${xPosition}px`;
  enemyCar.style.top = `-${enemyCarHeight}px`;
  gameArea.appendChild(enemyCar);
  enemyCars.push({
    element: enemyCar,
    x: xPosition,
    y: -enemyCarHeight,
    speed: Math.random() * 2 + 2,
  });
}

// Update enemy car positions
function updateEnemyCars() {
  enemyCars.forEach((enemyCar, index) => {
    enemyCar.y += roadSpeed;
    enemyCar.element.style.top = `${enemyCar.y}px`;

    // Remove cars that move out of the screen
    if (enemyCar.y > gameArea.offsetHeight) {
      gameArea.removeChild(enemyCar.element);
      enemyCars.splice(index, 1);
    }
  });
}

// Collision detection
function checkCollision() {
  for (let enemyCar of enemyCars) {
    if (
      enemyCar.x < car.x + 50 &&
      enemyCar.x + enemyCarWidth > car.x &&
      enemyCar.y < car.y + 100 &&
      enemyCar.y + enemyCarHeight > car.y
    ) {
      return true;
    }
  }
  return false;
}

// Handle car movement
function adjustMovement() {
  if (keys["ArrowLeft"] && car.x > 0) {
    car.x -= car.moveSpeed;
  }
  if (keys["ArrowRight"] && car.x < gameArea.offsetWidth - 50) {
    car.x += car.moveSpeed;
  }
  if (keys["ArrowUp"] && roadSpeed < maxSpeed) {
    roadSpeed += 0.05; // Gradual speed increase
  }
  if (keys["ArrowDown"] && roadSpeed > minSpeed) {
    roadSpeed -= 0.05; // Gradual speed decrease
  }
  playerCar.style.left = `${car.x}px`;
  playerCar.style.top = `${car.y}px`;
}

// Gradual speed decay when keys are released
function handleSpeedDecay() {
  if (!keys["ArrowUp"] && roadSpeed > minSpeed) {
    roadSpeed -= 0.01; // Decay speed over time
  }
}
let lastTimestamp = performance.now();
const speedMeter = document.querySelector(".speedMeter");
function updateDistance(currentTimestamp) {
  const elapsedTime = (currentTimestamp - lastTimestamp) / 1000 ||0; // Time in seconds
  lastTimestamp = currentTimestamp; // Update the last timestamp

  // Calculate the distance
  distance += roadSpeed * (1000 / 3600) * elapsedTime; // roadSpeed converted to m/s


  // Request the next animation frame
}

// Main game loop
function gameLoop(currentTimestamp) {
  speedMeter.innerHTML = `${Math.round(roadSpeed * 10)} kmh`;
  distanceMeter.innerHTML = `${distance.toFixed(2)} m`;
  updateDistance(currentTimestamp)
  adjustMovement(); // Adjust player movement
  handleSpeedDecay(); // Handle gradual speed decay
  updateRoad(); // Update road scrolling
  updateEnemyCars(); // Update enemy car positions

  // Check for collision
  if (checkCollision()) {
    roadSpeed = 0;
  }

  // Randomly create enemy cars
  if (Math.random() < 0.001 && roadSpeed > 2) {
    createEnemyCar();
  }

  requestAnimationFrame(gameLoop); // Continue the loop
}

// Start the game loop
gameLoop();

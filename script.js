const gameArea = document.getElementById("gameArea");
const playerCar = document.getElementById("playerCar");
const distanceMeter = document.querySelector(".distanceMeter");

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

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});



function updateRoad() {
  roadPosition += roadSpeed;
  gameArea.style.backgroundPositionY = `${roadPosition}px`;
}

function createEnemyCar() {
  const xPosition = Math.random() * (gameArea.offsetWidth - enemyCarWidth);
  const enemyCar = document.createElement("div");
  enemyCar.classList.add("enemy");
  enemyCar.style.left = `${xPosition}px`;
  enemyCar.style.top = `-${enemyCarHeight + 200}px`;
  gameArea.appendChild(enemyCar);
  enemyCars.push({
    element: enemyCar,
    x: xPosition,
    y: -enemyCarHeight,
    speed: Math.random() * 2 + 2,
  });
}

function updateEnemyCars() {
  enemyCars.forEach((enemyCar, index) => {
    enemyCar.y += roadSpeed;
    enemyCar.element.style.top = `${enemyCar.y}px`;

  
    if (enemyCar.y > gameArea.offsetHeight) {
      gameArea.removeChild(enemyCar.element);
      enemyCars.splice(index, 1);
    }
  });
}

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

function adjustMovement() {
  if (keys["ArrowLeft"] && car.x > 0) {
    car.x -= car.moveSpeed;
  }
  if (keys["ArrowRight"] && car.x < gameArea.offsetWidth - 50) {
    car.x += car.moveSpeed;
  }
  if (keys["ArrowUp"] && roadSpeed < maxSpeed) {
    roadSpeed += 0.05;
  }
  if (keys["ArrowDown"] && roadSpeed > minSpeed) {
    roadSpeed -= 0.05;
  }
  playerCar.style.left = `${car.x}px`;
  playerCar.style.top = `${car.y}px`;
}

function handleSpeedDecay() {
  if (!keys["ArrowUp"] && roadSpeed > minSpeed) {
    roadSpeed -= 0.01;
  }
}
let lastTimestamp = performance.now();
const speedMeter = document.querySelector(".speedMeter");
function updateDistance(currentTimestamp) {
  const elapsedTime = (currentTimestamp - lastTimestamp) / 1000 ||0;
  lastTimestamp = currentTimestamp;


  distance += roadSpeed * (1000 / 3600) * elapsedTime;



}
function gameLoop(currentTimestamp) {
  speedMeter.innerHTML = `${Math.round(roadSpeed * 10)} kmh`;
  distanceMeter.innerHTML = `${distance.toFixed(2)} m`;
  updateDistance(currentTimestamp)
  adjustMovement();
  handleSpeedDecay();
  updateRoad();
  updateEnemyCars();



  if (checkCollision()) {
    roadSpeed = 0;
  }


  if (Math.random() < 0.01 && roadSpeed > 2) {
    createEnemyCar();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();

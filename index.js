// ================================================== constants / enums

// misc
const FRAME_RATE = 16.66; // 60fps = 16.66
const ARROW_DELAY = 150; //ms
const FONT_SIZE = 20; //px
const FONT = "Courier New";

// boundaries
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 800;
const MOVEMENT_BOUNDARY_SIZE = 170;

// speed
const PLAYER_MOVEMENT_SPEED = 80;
const ENEMY_MOVEMENT_SPEED = 4;
const ARROW_MOVEMENT_SPEED = 10;

// score
const TRIGGER_LOSS_AMOUNT = 5;
const SCORE_TO_RUBIES = 1250;

const EVENT_TYPES = {
  KEYBOARD_EVENT: "KEYBOARD_EVENT",
  CLICK: "CLICK",
};

const KEY_MAP = {
  w: "w",
  W: "w",
  ArrowUp: "w",
  space: "w",

  a: "a",
  A: "a",
  ArrowLeft: "a",

  d: "d",
  D: "d",
  ArrowRight: "d",

  Enter: "Enter",
};

// ================================================== init canvas
const canvas = document.getElementById("canvas");

canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;
canvas.style.backgroundColor = "black";

const ctx = canvas.getContext("2d");

// ================================================== image handling

const playerImage = new Image();
const enemyImage = new Image();
const arrowImage = new Image();
const bgImage = new Image();
const castleImage = new Image();
const rubyImage = new Image();
const startBgImage = new Image();
const endBgImage = new Image();

window.onload = () => {
  async function renderImages() {
    await loadImage(playerImage, "./images/player.png");
    await loadImage(enemyImage, "./images/enemy.png");
    await loadImage(arrowImage, "./images/arrow.png");
    await loadImage(castleImage, "./images/castle.png");
    await loadImage(bgImage, "./images/bg.png");
    await loadImage(rubyImage, "./images/ruby.png");
    await loadImage(startBgImage, "./images/new-start.png");
    await loadImage(startBgImage, "./images/new-start.png");
    await loadImage(endBgImage, "./images/end-bg.png");
  }
  renderImages();
};

async function loadImage(image, imagePath) {
  return new Promise((resolve) => {
    image.src = imagePath;
    image.addEventListener("load", () => {
      resolve();
    });
  });
}

function getCenteredTextDimensions(text, fontSize) {
  const font = FONT;
  let size = fontSize;
  const bold = true;

  const div = document.createElement("div");
  div.innerHTML = text;
  div.style.position = "absolute";
  div.style.top = "-9999px";
  div.style.left = "-9999px";
  div.style.fontFamily = font;
  div.style.fontWeight = bold ? "bold" : "normal";
  div.style.fontSize = size + "px"; // or 'px'
  document.body.appendChild(div);
  size = [div.offsetWidth, div.offsetHeight];
  document.body.removeChild(div);
  return size;
}

// ================================================== helpers
// texts

const scoreDisplay = (text) => {
  ctx.fillStyle = "#ea3150";
  ctx.font = `${FONT_SIZE}px ${FONT}`;
  ctx.textAlign = "left";
  ctx.textBaseLine = "center";
  ctx.fillText(text, 150, CANVAS_HEIGHT - 22);
};

const enemiesEscapedDisplay = (text) => {
  ctx.fillStyle = "#ea3150";
  ctx.font = `${FONT_SIZE}px ${FONT}`;
  ctx.textAlign = "left";
  ctx.textBaseLine = "center";
  ctx.fillText(text, CANVAS_WIDTH - 170, CANVAS_HEIGHT - 22);
};

const gameOverText = (text, fontSize) => {
  const textWidth = getCenteredTextDimensions(text, fontSize)[0];
  const textHeight = getCenteredTextDimensions(text, fontSize)[1];
  const centerX = CANVAS_WIDTH / 2 - textWidth / 2;
  const centerY = CANVAS_HEIGHT / 2 - textHeight / 2;

  ctx.fillStyle = "white";
  ctx.font = `${fontSize}px ${FONT}`;
  ctx.textAlign = "left";
  ctx.textBaseLine = "center";
  ctx.fillText(text, centerX, centerY);
};

const gameOverScore = (text, fontSize) => {
  const textWidth = getCenteredTextDimensions(text, fontSize)[0];
  const textHeight = getCenteredTextDimensions(text, fontSize)[1];
  const centerX = CANVAS_WIDTH / 2 - textWidth / 2;
  const centerY = CANVAS_HEIGHT / 2 - textHeight / 2;

  ctx.fillStyle = "white";
  ctx.font = `${fontSize}px ${FONT}`;
  ctx.textAlign = "left";
  ctx.textBaseLine = "center";
  ctx.fillText(text, centerX, centerY);
};

const playAgain = (text, fontSize) => {
  const textWidth = getCenteredTextDimensions(text, fontSize)[0];
  const textHeight = getCenteredTextDimensions(text, fontSize)[1];
  const centerX = CANVAS_WIDTH / 2 - textWidth / 2;
  const centerY = CANVAS_HEIGHT / 2 - textHeight / 2;

  ctx.fillStyle = "white";
  ctx.font = `${fontSize}px ${FONT}`;
  ctx.textAlign = "left";
  ctx.textBaseLine = "center";
  ctx.fillText(text, centerX, 400);
};

const play = (text, fontSize) => {
  const textWidth = getCenteredTextDimensions(text, fontSize)[0];
  const textHeight = getCenteredTextDimensions(text, fontSize)[1];
  const centerX = CANVAS_WIDTH / 2 - textWidth / 2;
  const centerY = CANVAS_HEIGHT / 2 - textHeight / 2;

  ctx.fillStyle = "white";
  ctx.font = `${fontSize}px ${FONT}`;
  ctx.textAlign = "left";
  ctx.textBaseLine = "center";
  ctx.fillText(text, centerX, 290);
};

// ===

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const randomNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const checkSpriteCollision = (spriteOne, spriteTwo) => {
  const spriteOneBounds = spriteOne.globalVariables();
  const spriteTwoBounds = spriteTwo.globalVariables();

  if (
    spriteOneBounds.x >= spriteTwoBounds.x &&
    spriteOneBounds.x <= spriteTwoBounds.x + spriteTwoBounds.width &&
    spriteOneBounds.y >= spriteTwoBounds.y &&
    spriteOneBounds.y <= spriteTwoBounds.y + spriteTwoBounds.height
  ) {
    return true;
  }
  return false;
};

const checkCollisionOfArrays = (arrayOne, arrayTwo, callback) => {
  for (let i = 0; i < arrayOne.length; i++) {
    const itemOne = arrayOne[i];

    for (let j = 0; j < arrayTwo.length; j++) {
      const itemTwo = arrayTwo[j];

      if (checkSpriteCollision(itemOne, itemTwo)) {
        arrayOne.splice(i, 1);
        arrayTwo.splice(j, 1);

        if (callback) callback();
      }
    }
  }
};

// ================================================== sprite
class Sprite {
  isText = false;

  constructor(x, y, height, width, image) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.image = image;
  }

  setPosition = (x, y) => {
    this.x = x;
    this.y = y;
  };

  move = (x, y) => {
    this.x += x;
    this.y += y;
  };

  draw = () => {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  };

  globalVariables = () => {
    return {
      x: this.x,
      y: this.y,
      height: this.height,
      width: this.width,
    };
  };
}

class Ruby extends Sprite {
  constructor() {
    super(110, CANVAS_HEIGHT - 40, 24, 24, rubyImage);
  }
}

class Background extends Sprite {
  constructor() {
    super(0, 0, 500, 800, bgImage);
  }
}

class StartBackground extends Sprite {
  constructor() {
    super(0, 0, 500, 800, startBgImage);
  }
}
class EndBackground extends Sprite {
  constructor() {
    super(0, 0, 500, 800, endBgImage);
  }
}

class Castle extends Sprite {
  constructor() {
    super(0, 0, 500, 800, castleImage);
  }
}

class Player extends Sprite {
  arrows = [];
  arrowLimiter = false;

  constructor() {
    super(CANVAS_WIDTH / 2 - 25, CANVAS_HEIGHT / 2 + 100, 100, 30, playerImage);
  }

  atRightWall = () => {
    return this.x + this.width >= CANVAS_WIDTH - MOVEMENT_BOUNDARY_SIZE;
  };

  atLeftWall = () => {
    return this.x <= MOVEMENT_BOUNDARY_SIZE;
  };

  shootArrow = () => {
    this.arrows.push(new Arrow(this.x + this.width / 2, this.y));
  };

  moveArrows = () => {
    for (let i = 0; i < this.arrows.length; i++) {
      this.arrows[i].move(0, -ARROW_MOVEMENT_SPEED);

      if (this.arrowGone(this.arrows[i])) this.arrows.splice(i, 1);
    }
  };

  drawArrows = () => {
    for (let i = 0; i < this.arrows.length; i++) {
      this.arrows[i].draw();
    }
  };

  arrowGone = (arrow) => {
    if (arrow.y < -50) return true;
  };
}

// class Text extends Sprite {
//   constructor(text, x, y, height, width, color) {
//     super(x, y, height, width);
//     this.text = text;
//     this.color = color;
//     this.isText = true;
//   }
//   draw = () => {
//     ctx.fillStyle = this.color;
//     ctx.fillText(this.text, this.x, this.y);
//   };
// }

class Arrow extends Sprite {
  constructor(x, y) {
    super(x, y, 80, 5, arrowImage);
  }
}

class Enemy extends Sprite {
  constructor(x, y) {
    super(x, y, 150, 125, enemyImage);

    this.x = this.getRandomX();
    this.y = this.getRandomY();
  }

  getRandomX = () => {
    return randomNumberBetween(100, CANVAS_WIDTH - this.width - 100);
  };

  getRandomY = () => {
    return randomNumberBetween(-100, -800);
  };
}

class Enemies {
  timesCalled = 0;
  amount = 5;
  army = [];

  generate = () => {
    for (let i = 0; i < this.amount + this.timesCalled; i++) {
      this.army.push(new Enemy());
    }
    this.timesCalled++;
  };

  moveAll = () => {
    for (let i = 0; i < this.army.length; i++) {
      this.army[i].move(0, ENEMY_MOVEMENT_SPEED);
      this.checkIfEnemyEscaped(this.army, i);
    }
    if (!this.army[0]) this.generate();
  };

  drawAll = () => {
    for (let i = 0; i < this.army.length; i++) {
      this.army[i].draw();
    }
  };

  checkIfEnemyEscaped = (army, index) => {
    if (army[index].y > 400) {
      this.army.splice(index, 1);
      score.countEscape();
    }
  };
}
// ================================================== score

class Score {
  enemiesKilled = 0;
  enemiesEscaped = 0;

  getScore = () => {
    return this.getRubies(this.enemiesKilled);
  };

  getLives = () => {
    return this.enemiesEscaped;
  };

  countKill = () => {
    this.enemiesKilled++;
    console.log("rubies: ", this.getRubies(this.enemiesKilled));
  };

  countEscape = () => {
    this.enemiesEscaped++;
    console.log("enemies infiltrated: ", this.enemiesEscaped);
  };

  loseConditionMet = () => {
    if (this.enemiesEscaped >= TRIGGER_LOSS_AMOUNT) {
      console.log(
        "GAMEOVER // total rubies: ",
        this.getRubies(this.enemiesKilled)
      );
      return true;
    }
    return false;
  };

  getRubies = (score) => {
    return score * SCORE_TO_RUBIES;
  };
}

// ================================================== main game loop
class Game {
  gameData = {
    gameState: new StateHandler(),
    inputQueue: [],
  };
  constructor() {
    const startState = new StartState(this.gameData);
    this.gameData.gameState.setState(startState);

    this.run();
  }

  // run = async () => {
  //   this.initEventListeners();
  //   while (score.loseConditionMet() === false) {
  //     ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH);
  //     this.gameData.gameState.getState().handleInput();
  //     this.gameData.gameState.getState().update();
  //     this.gameData.gameState.getState().draw();
  //     await sleep(FRAME_RATE);
  //   }
  // };

  run = () => {
    this.initEventListeners();
    setInterval(() => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH);
      this.gameData.gameState.getState().handleInput();
      this.gameData.gameState.getState().update();
      this.gameData.gameState.getState().draw();
    }, FRAME_RATE);
  };

  initEventListeners = () => {
    window.addEventListener("keydown", this.handleKeyDown);
  };

  handleKeyDown = (event) => {
    let { key } = event;
    if (key === " ") key = "space";

    const keyValue = KEY_MAP[key];

    if (!keyValue) return;

    this.gameData.inputQueue.push({
      type: EVENT_TYPES.KEYBOARD_EVENT,
      key: keyValue,
    });
  };
}

// ================================================== state handler
class StateHandler {
  currentState;

  setState = (newState) => {
    this.currentState = newState;
  };

  getState = () => {
    return this.currentState;
  };
}

// ================================================== gameover

class StartState {
  gameData;

  constructor(gameData) {
    this.gameData = gameData;
    this.startBgImage = new StartBackground();
  }
  handleInput = () => {
    const nextInput = this.gameData.inputQueue[0];
    if (!nextInput) return;
    if (nextInput.type === EVENT_TYPES.KEYBOARD_EVENT) {
      if (nextInput.key === KEY_MAP.Enter) {
        const activeGameState = new ActiveGameState(this.gameData);
        this.gameData.gameState.setState(activeGameState);
      }
    }
    this.gameData.inputQueue.splice(0, 1);
  };

  update = () => {};

  draw = () => {
    this.startBgImage.draw();
    play("[ Press ENTER to Play ]", 20);
  };
}

// ================================================== active game state

class ActiveGameState {
  gameData;
  player;
  enemies;
  castle;
  background;
  ruby;

  constructor(gameData) {
    this.gameData = gameData;
    this.ruby = new Ruby();
    this.player = new Player();
    this.enemies = new Enemies();
    this.castle = new Castle();
    this.background = new Background();

    if (this.enemies.timesCalled === 0) this.enemies.generate();
  }

  handleInput = () => {
    const nextInput = this.gameData.inputQueue[0];

    if (!nextInput) return;

    if (nextInput.type === EVENT_TYPES.KEYBOARD_EVENT) {
      //
      if (nextInput.key === KEY_MAP.a && !this.player.atLeftWall()) {
        this.player.move(-PLAYER_MOVEMENT_SPEED, 0);
      }
      if (nextInput.key === KEY_MAP.d && !this.player.atRightWall()) {
        this.player.move(PLAYER_MOVEMENT_SPEED, 0);
      }
      if (nextInput.key === KEY_MAP.w && this.player.arrowLimiter === false) {
        this.player.shootArrow();
        this.player.arrowLimiter = true;

        setTimeout(() => {
          this.player.arrowLimiter = false;
        }, ARROW_DELAY);
      }
    }
    this.gameData.inputQueue.splice(0, 1);
  };

  update = () => {
    this.enemies.moveAll();
    this.player.moveArrows();

    checkCollisionOfArrays(this.player.arrows, this.enemies.army, () => {
      score.countKill();
    });

    if (score.loseConditionMet()) {
      const endGameState = new EndGameState(this.gameData);
      this.gameData.gameState.setState(endGameState);
    }
  };

  draw = () => {
    this.background.draw();
    this.enemies.drawAll();
    this.castle.draw();
    this.player.drawArrows();
    this.player.draw();
    this.ruby.draw();
    scoreDisplay(`${score.getScore()}`);
    enemiesEscapedDisplay(`${score.getLives()} / 5`);
  };
}

// ================================================== gameover

class EndGameState {
  gameData;

  constructor(gameData) {
    this.gameData = gameData;
    this.startBgImage = new StartBackground();
    this.endBgImage = new EndBackground();
  }
  handleInput = () => {
    const nextInput = this.gameData.inputQueue[0];
    if (!nextInput) return;

    if (nextInput.type === EVENT_TYPES.KEYBOARD_EVENT) {
      if (nextInput.key === KEY_MAP.Enter) {
        score.enemiesEscaped = 0;
        score.enemiesKilled = 0;

        const activeGameState = new ActiveGameState(this.gameData);
        this.gameData.gameState.setState(activeGameState);
      }
    }
    this.gameData.inputQueue.splice(0, 1);
  };

  update = () => {};

  draw = () => {
    this.endBgImage.draw();
    gameOverText("GAME OVER", 30);
    play(`Score: ${score.getScore()}`, 20);
    playAgain(`[ Press ENTER to Play Again ]`, 20);
  };
}
// ================================================== run game

const score = new Score();
const game = new Game();

// space enemies

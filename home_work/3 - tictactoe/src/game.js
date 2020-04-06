/* eslint-disable linebreak-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */

const { v4 } = require('uuid');
const { logger } = require('./logger');

// очистка всего поля, используется только из объекта Game (описан внизу)
function emptyField(currentGame) {
  currentGame.field = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  currentGame.winner = 0;
  currentGame.currentPlayer = 1;
}

// смена игрок, используется после совершения удачного хода
function changePlayer(currentGame) {
  if (currentGame.currentPlayer === 1) {
    currentGame.currentPlayer = 2;
  } else {
    currentGame.currentPlayer = 1;
  }
}

// проверка победителя по горизонтали
function checkWinnerHorizontPlayer(currentGame) {
  for (let str = 0; str < 3 && currentGame.winner === 0; str += 1) {
    if (currentGame.field[str][0] === currentGame.field[str][1]
          && currentGame.field[str][1] === currentGame.field[str][2]
          && currentGame.field[str][0] !== 0) {
      currentGame.winner = currentGame.field[str][0];
    }
  }
}

// проверка победителя по вертикали
function checkWinnerVertPlayer(currentGame) {
  for (let col = 0; col < 3 && currentGame.winner === 0; col += 1) {
    if (currentGame.field[0][col] === currentGame.field[1][col]
          && currentGame.field[1][col] === currentGame.field[2][col]
          && currentGame.field[0][col] !== 0) {
      currentGame.winner = currentGame.field[0][col];
    }
  }
}

// проверка победителя по диагонали
function checkWinnerDiagPlayer(currentGame) {
  if (currentGame.field[0][0] === currentGame.field[1][1]
      && currentGame.field[1][1] === currentGame.field[2][2]
      && currentGame.field[0][0] !== 0) {
    currentGame.winner = currentGame.field[0][0];
  } else if (currentGame.field[2][0] === currentGame.field[1][1]
            && currentGame.field[1][1] === currentGame.field[0][2]
            && currentGame.field[0][2] !== 0) {
    currentGame.winner = currentGame.field[0][2];
  }
}

// проверка Ничья
function checkDeadHeat(currentGame) {
  for (let str = 0; str < 3 && currentGame.winner === 0; str += 1) {
    for (let col = 0; col < 3; col += 1) {
      if (currentGame.field[str][col] === 0) {
        return;
      }
    }
  }
  if (currentGame.winner === 0) {
    currentGame.winner = -1;
  }
}

// проверка победителя
function checkWinner(currentGame) {
  currentGame.winner = 0;

  checkWinnerHorizontPlayer(currentGame);
  checkWinnerVertPlayer(currentGame);
  checkWinnerDiagPlayer(currentGame);
  checkDeadHeat(currentGame);

  // если победил игрок 1 или 2, то в победителя пишем Id игрок
  if (currentGame.winner === 1) {
    currentGame.winner = currentGame.playerParentId;
  } else if (currentGame.winner === 2) {
    currentGame.winner = currentGame.playerSecondId;
  }

  return currentGame.winner;
}

// новый ход
function newStep(currentGame, userId, y, x) {
  // различные проверки
  if (currentGame.winner !== 0) {
    logger(__filename, `game: ${currentGame.gameId}, newStep, winner already exist: ${currentGame.winner}`);
    return false;
  }
  if (x < 1 || x > 3) {
    logger(__filename, `game: ${currentGame.gameId}, newStep, wrong X: ${x}`);
    return false;
  }
  if (y < 1 || y > 3) {
    logger(__filename, `game: ${currentGame.gameId}, newStep, wrong Y: ${y}`);
    return false;
  }
  if (currentGame.field[x - 1][y - 1] !== 0) {
    logger(__filename, `game: ${currentGame.gameId}, newStep, field not empty: x: ${y}, x: ${y}`);
    return false;
  }
  if (currentGame.playerParentId !== userId && currentGame.playerSecondId !== userId) {
    logger(__filename, `game: ${currentGame.gameId}, newStep, wrong player: ${userId}`);
    return false;
  }
  if (currentGame.playerParentId === userId && currentGame.currentPlayer !== 1) {
    logger(__filename, `game: ${currentGame.gameId}, newStep, move of wrong player`);
    return false;
  }
  if (currentGame.playerSecondId === userId && currentGame.currentPlayer !== 2) {
    logger(__filename, `game: ${currentGame.gameId}, newStep, move of wrong player`);
    return false;
  }

  currentGame.field[x - 1][y - 1] = currentGame.currentPlayer;
  checkWinner(currentGame);
  if (currentGame.winner === 0) {
    changePlayer(currentGame);
  }
  return true;
}

function setSecondPlayer(currentGame, playerSecondId) {
  if (currentGame.playerSecondId === -1 && currentGame.playerParentId !== playerSecondId) {
    currentGame.playerSecondId = playerSecondId;
    return true;
  }

  logger(__filename, 'setSecondPlayer');
  return false;
}


function getStatusGame(currentGame) {
  if (currentGame.playerParentId === -1) {
    return 'Parent player does not exist';
  }
  if (currentGame.playerSecondId === -1) {
    return 'Second player does not exist';
  }
  if (currentGame.winner !== 0) {
    return 'The next move is not available, the winner exists';
  }

  return 'ready'; // good status
}

// конструктор создания новой игры
function Game(userId) {
  this.field = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  this.winner = 0;
  this.currentPlayer = 1;

  this.playerParentId = userId;
  this.playerSecondId = -1;
  this.gameId = v4(); // уникальный Id формируется при создании новой игры

  this.emptyField = () => { emptyField(this); };
  this.checkWinner = () => { checkWinner(this); };
  this.newStep = (inputUserId, y, x) => newStep(this, inputUserId, y, x);
  this.setSecondPlayer = (inpId) => setSecondPlayer(this, inpId);
  this.getStatusGame = () => getStatusGame(this);
}

// возвращает объект новая игра
function getNewGameObj(userId) {
  return new Game(userId);
}

module.exports = {
  getNewGameObj,
};

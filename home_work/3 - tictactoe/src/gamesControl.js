/* eslint-disable linebreak-style */
/* eslint-disable max-len */

const game = require('./game');
const { logger } = require('./logger');

// массив объектов игр
const arrayGames = [];

// ************* ДЕЙСТВИЯ С ИГРАМИ ****************

// создание новой игры - new Game(...) - возвращает готовый объект Game и
// в общий массив его вставляет. Текущая функция возвращает Id новой игры
function createNewGame(userId) {
  if (!userId) {
    logger(__filename, `createNewGame, userId: ${userId}`);
    return -1;
  }
  const newGame = game.getNewGameObj(userId);
  arrayGames.push(newGame);
  return newGame.gameId;
}

// удаление игры из массива игр - может удалять только создатель
function deleteGame(gameId, userId) {
  const foundItems = arrayGames.filter((el) => el.gameId === gameId && el.playerParentId === userId);
  foundItems.forEach((item) => {
    const index = arrayGames.indexOf(item);
    arrayGames.splice(index, 1);
  });
  return foundItems.length > 0;
}

// возвращает массив Id игр, у которых пользователь - создатель
function getGamesFromParent(userId) {
  const foundItems = arrayGames.filter((item) => item.playerParentId === userId);
  return foundItems.map((item) => item.gameId);
}

// возвращает массив Id игр, у которых свободное место 2-ого игрока
function getGamesForConnect(userId) {
  const foundItems = arrayGames.filter((el) => el.playerParentId !== userId && el.playerSecondId === -1);
  return foundItems.map((item) => item.gameId);
}

// возвращает массив Id игр, у которых второй игрок текущий пользователь
function getGamesIAmSecondPlayer(userId) {
  const foundItems = arrayGames.filter((item) => item.playerSecondId === userId);
  return foundItems.map((item) => item.gameId);
}

// ************* ДЕЙСТВИЯ В КОНКРЕТНОЙ ИГРЕ ****************

function getGameCheckAccess(gameId, userId) {
  // получим ссылку на игру
  const currentGame = arrayGames.find((item) => (gameId === item.gameId));
  if (currentGame === undefined) {
    logger(__filename, `getGameCheckAccess, Game not found, gameId: ${gameId}, userId: ${userId}`);
    return undefined;
  }

  // доступ только создатель или второй игрок
  if (currentGame.playerParentId !== userId && currentGame.playerSecondId !== userId) {
    logger(__filename, `getGameCheckAccess, Access denied, gameId: ${gameId}, userId: ${userId}`);
    return undefined;
  }

  return currentGame;
}

// возвращает победителя игры
function getWinnerOfGame(gameId, userId) {
  const currentGame = getGameCheckAccess(gameId, userId);
  if (currentGame === undefined) {
    logger(__filename, `getWinnerOfGame, gameId: ${gameId}, userId: ${userId}`);
    return undefined;
  }

  return currentGame.winner;
}

// сделать ход в игру
function move(gameId, userId, x, y) {
  const currentGame = getGameCheckAccess(gameId, userId);
  if (currentGame === undefined) {
    logger(__filename, `move, gameId: ${gameId}, userId: ${userId}`);
    return undefined;
  }

  return currentGame.newStep(userId, x, y);
}

// получить поле текущей игры - массив
function getField(gameId, userId) {
  const currentGame = getGameCheckAccess(gameId, userId);
  if (currentGame === undefined) {
    logger(__filename, `getField, gameId: ${gameId}, userId: ${userId}`);
    return undefined;
  }

  return currentGame.field;
}

// получить статус текущей игры
function getStatusGame(gameId, userId) {
  const currentGame = getGameCheckAccess(gameId, userId);

  if (currentGame === undefined) {
    logger(__filename, `getStatusGame, gameId: ${gameId}, userId: ${userId}`);
    return undefined;
  }

  return currentGame.getStatusGame();
}

// подключает второго пользовтеля к игре, если Id корректный и второй пользователь у игры пуст
function connectSecondPlayerToGame(gameId, userId) {
  // получим ссылку на игру, если второй пользователь пуст
  const currentGame = arrayGames.find((el) => (gameId === el.gameId && el.playerSecondId === -1));
  if (currentGame === undefined) {
    logger(__filename, `connectSecondPlayerToGame, Game not found, gameId: ${gameId}, userId: ${userId}`);
    return false;
  }
  currentGame.playerSecondId = userId;
  return true;
}


module.exports = {
  createNewGame,
  deleteGame,
  getGamesFromParent,
  getGamesForConnect,
  getGamesIAmSecondPlayer,

  getWinnerOfGame,
  move,
  connectSecondPlayerToGame,
  getField,
  getStatusGame,

  arrayGames, // only for test
};

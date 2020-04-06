/* eslint-disable linebreak-style */
const gamesControl = require('./gamesControl');
const game = require('./game');
const users = require('./users');
const sessions = require('./sessions');

// для тестов использована отдельная билиотека,
// потому что данные функции не нужны в общей логике в программе

function createNewUser(login, password, userId) {
  const newUserObj = users.getNewUserObj(login, password);
  newUserObj.id = userId;
  users.usersArray.push(newUserObj);
}

function createNewSession(userId, sessionId) {
  const newSession = sessions.getNewSession(userId);
  newSession.sessionId = sessionId;
  sessions.sessionsArray.push(newSession);
}

function createNewGame(userSessionId, gameId) {
  const userId = sessions.getUserIdBySessionId(userSessionId);
  if (userId) {
    const newGame = game.getNewGameObj(userId);
    newGame.gameId = gameId;
    gamesControl.arrayGames.push(newGame);
  }
}

function setWinnerToGame(gameId, newWinner) {
  const currentGame = gamesControl.arrayGames.find((el) => el.gameId === gameId);
  if (currentGame) {
    currentGame.winner = newWinner;
  }
}

function fieldArrayToString(inputArray) {
  if (!inputArray) {
    return '';
  }

  let res = '';

  for (let str = 0; str < 3; str += 1) {
    for (let col = 0; col < 3; col += 1) {
      res += inputArray[str][col];

      if (col === 2 && str !== 2) {
        res += '|';
      }
    }
  }
  return res;
}

function getFieldFromGameString(gameId) {
  const currentGame = gamesControl.arrayGames.find((el) => el.gameId === gameId);
  if (currentGame) {
    return fieldArrayToString(currentGame.field);
  }
  return undefined;
}

function filedStringToArr(inp) {
  const arr = inp.split('|');
  const arrayResult = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

  for (let str = 0; str < 3; str += 1) {
    for (let col = 0; col < 3; col += 1) {
      arrayResult[str][col] = +(arr[str][col]);
    }
  }
  return arrayResult;
}

function setFieldToGameFromString(gameId, newFieldString) {
  const currentGame = gamesControl.arrayGames.find((el) => el.gameId === gameId);
  if (currentGame) {
    currentGame.field = filedStringToArr(newFieldString);
  }
}

function setNextMove(gameId, sessionId) {
  const userId = sessions.getUserIdBySessionId(sessionId);
  const currentGame = gamesControl.arrayGames.find((el) => el.gameId === gameId);
  if (currentGame) {
    if (currentGame.playerParentId === userId) {
      currentGame.currentPlayer = 1;
    }
    if (currentGame.playerSecondId === userId) {
      currentGame.currentPlayer = 2;
    }
  }
}

function getWinner(gameId) {
  const currentGame = gamesControl.arrayGames.find((el) => el.gameId === gameId);
  if (currentGame) {
    return currentGame.winner;
  }
  return undefined;
}


module.exports = {
  createNewUser,
  createNewSession,
  createNewGame,
  setWinnerToGame,
  getFieldFromGameString,
  setFieldToGameFromString,
  setNextMove,
  getWinner,
  fieldArrayToString,
};

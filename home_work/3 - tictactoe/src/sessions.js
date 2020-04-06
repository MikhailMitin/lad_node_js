/* eslint-disable linebreak-style */
const { v4 } = require('uuid');
const { logger } = require('./logger');

// массив объектов
const sessionsArray = [];

// конструктор нового объекта сессия
function Session(userId) {
  this.userId = userId;
  this.sessionId = v4(); // уникальный Id формируется при создании новой сессии
}

// создает новый объект перед добавлением в массив
function getNewSession(userId) {
  return new Session(userId);
}

// получить Id сессии по пользовательскому Id
function getSessionByUserId(userId) {
  const currentSession = sessionsArray.find((item) => userId === item.userId);
  if (currentSession === undefined) {
    logger(__filename, `findSession, userId ${userId}`);
    return -1;
  }
  return currentSession.sessionId;
}

// получить Id пользователя по Id сессии
function getUserIdBySessionId(sessionId) {
  const currentSession = sessionsArray.find((item) => sessionId === item.sessionId);
  if (currentSession === undefined) {
    logger(__filename, `getUserIdBySessionId, sessionId ${sessionId}`);
    return undefined;
  }
  return currentSession.userId;
}

// удаляем старые сессии по пользовательскому Id
function deleteSession(userId) {
  const foundItems = sessionsArray.filter((item) => item.userId === userId);
  foundItems.forEach((item) => {
    const index = sessionsArray.indexOf(item);
    sessionsArray.splice(index, 1);
  });
}

// создадим новую сессию
function createSession(userId) {
  if (userId === -1 || userId === undefined) {
    logger(__filename, `createSession, userId ${userId}`);
    return -1;
  }

  deleteSession(userId); // удалим старые сессии с данным userId
  const newSession = getNewSession(userId);
  sessionsArray.push(newSession);
  return newSession.sessionId;
}


module.exports = {
  getSessionByUserId,
  getUserIdBySessionId,
  createSession,

  sessionsArray, // only for test
  getNewSession, // only for test
};

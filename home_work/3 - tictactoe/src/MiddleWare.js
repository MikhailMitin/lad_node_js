/* eslint-disable linebreak-style */
const sessions = require('./sessions');

function findUserId(req, res, next) {
  const userId = sessions.getUserIdBySessionId(req.headers.authorization);
  req.userId = userId;
  next();
}

function checkUserId(req, res, next) {
  if (!req.userId) {
    res.send(401);
    return;
  }
  next();
}

const fullCheckUser = [findUserId, checkUserId];

module.exports = {
  fullCheckUser,
};

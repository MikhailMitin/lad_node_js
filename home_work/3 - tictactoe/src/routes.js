/* eslint-disable linebreak-style */

const router = require('express').Router();
const games = require('./gamesControl');
const users = require('./users');
const middleware = require('./MiddleWare');
const sessions = require('./sessions');

// /////////////////////////////////////////////////////////////////////

router.post('/registration', (req, res) => {
  const sessionId = users.registration(req.body.login, req.body.password);
  if (sessionId === -1) {
    res.send(401, { sessionId });
  } else {
    res.send(200, { sessionId });
  }
});

router.post('/login', (req, res) => {
  const sessionId = users.loginUser(req.body.login, req.body.password);
  if (sessionId === -1) {
    res.send(401);
  } else {
    res.send(200, { sessionId });
  }
});

// /////////////////////////////////////////////////////////////////////

router.post('/createNewGame', middleware.fullCheckUser, (req, res) => {
  const gameId = games.createNewGame(req.userId);

  if (gameId === -1) {
    res.send(400);
  } else {
    res.send(200, { gameId });
  }
});

router.post('/deleteGame', middleware.fullCheckUser, (req, res) => {
  const successDeleted = games.deleteGame(req.body.gameId, req.userId);

  if (!successDeleted) {
    res.send(400);
  } else {
    res.send(200);
  }
});

// /////////////////////////////////////////////////////////////////////

router.get('/getMyGames', middleware.fullCheckUser, (req, res) => {
  const arrayGames = games.getGamesFromParent(req.userId);
  res.send(200, arrayGames);
});

router.get('/getGamesForConnect', middleware.fullCheckUser, (req, res) => {
  const arrayGames = games.getGamesForConnect(req.userId);
  res.send(200, arrayGames);
});

router.get('/getGamesIAmSecondPlayer', middleware.fullCheckUser, (req, res) => {
  const arrayGames = games.getGamesIAmSecondPlayer(req.userId);
  res.send(200, arrayGames);
});

// /////////////////////////////////////////////////////////////////////

router.get('/getWinnerOfGame', middleware.fullCheckUser, (req, res) => {
  const winnerId = games.getWinnerOfGame(req.body.gameId, req.userId);
  if (!winnerId) {
    res.send(400, { winnerId });
  }
  // dead heat
  if (winnerId === -1) {
    res.send(200, { winnerId });
  } else {
    const userId = sessions.getSessionByUserId(winnerId);
    res.send(200, { winnerId: userId });
  }
});

router.get('/getStatusOfGame', middleware.fullCheckUser, (req, res) => {
  const status = games.getStatusGame(req.body.gameId, req.userId);

  if (!status) {
    res.send(400, { status });
  } else {
    res.send(200, { status });
  }
});

router.post('/move', middleware.fullCheckUser, (req, res) => {
  const move = games.move(req.body.gameId, req.userId, req.body.x, req.body.y);
  if (move === undefined) {
    res.send(403, { move } );
  } else if (move === false) {
    res.send(400, { move });
  } else {
    res.send(200, { move });
  }
});

router.post('/connectSecondPlayerToGame', middleware.fullCheckUser, (req, res) => {
  const connect = games.connectSecondPlayerToGame(req.body.gameId, req.userId);
  if (!connect) {
    res.send(400, { connect } );
  } else {
    res.send(200, { connect } );
  }
});

router.get('/getField', middleware.fullCheckUser, (req, res) => {
  const field = games.getField(req.body.gameId, req.userId);
  if (!field) {
    res.send(400, { field } );
  } else {
    res.send(200, { field } );
  }
});


module.exports = router;

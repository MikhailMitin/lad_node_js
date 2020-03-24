/* eslint-disable linebreak-style */

const router = require('express').Router();
const tictactoe = require('./tictaktoe');

router.get('/getField', (req, res) => {
  res.send(200, tictactoe.getFieldArr());
});

router.post('/move', (req, res) => {
  if (tictactoe.newStep(req.body.x, req.body.y)) {
    res.send(200);
  } else {
    res.send(412); // 412 Precondition Failed («условие ложно»)
  }
});

router.post('/moveFromPlayer', (req, res) => {
  tictactoe.setCurrentPlayer(req.body.player);
  if (tictactoe.newStep(req.body.x, req.body.y)) {
    res.send(200);
  } else {
    res.send(412); // 412 Precondition Failed («условие ложно»)
  }
});

router.post('/fillField', (req, res) => {
  tictactoe.fillFieldFromString(req.body.newField);
  res.send(200);
});

router.post('/changePlayer', (req, res) => {
  tictactoe.changePlayer();
  res.send(200);
});

router.post('/setCurrentPlayer', (req, res) => {
  tictactoe.setCurrentPlayer(req.body.CurrentPlayer);
  res.send(200);
});

router.post('/reset', (req, res) => {
  tictactoe.emptyField();
  res.send(200);
});

router.get('/getWinner', (req, res) => {
  tictactoe.checkWinner();
  res.send(200, tictactoe.getWinner());
});

module.exports = router;

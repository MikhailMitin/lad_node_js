/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable arrow-body-style */

const { Given, Then } = require('cucumber');
const request = require('supertest');

const tictactoe = require('../src/tictaktoe');
const app = require('../src/server');

let lastMoveStatus = false; // записываем сюда результат ответа сервера после каждого хода

Given('пустое поле', () => {
    // tictactoe.emptyField(); // решил не делать как на занятии было, а сделать через post
    return request(app)
            .post('/reset')
            .send()
            .then((res) => {
                if (res.status !== 200) {
                    throw res.status;
                }
            });
});

Given('ходит игрок {int}', (CurrentPlayer) => {
    return request(app)
            .post('/setCurrentPlayer')
            .send({ CurrentPlayer })
            .then((res) => {
                if (res.status !== 200) {
                    throw res.status;
                }
            });
});

Given('игрок ходит в клетку {int}, {int}', (x, y) => {
    return request(app)
            .post('/move')
            .send({ x, y })
            .then((res) => {
                lastMoveStatus = res.status;

                /* 412 Precondition Failed («условие ложно») */
                if (res.status !== 200 && res.status !== 412) {
                    throw res.status;
                }
            });
});


Then('поле становится {string}', (expectFieldString) => {
    return request(app)
            .get('/getField')
            .then((res) => {
                if (res.status !== 200) {
                    throw res.status;
                }

                const currentFieldString = tictactoe.fieldArrToString(res.body); // конверт в строку
                if (currentFieldString !== expectFieldString) {
                    throw currentFieldString;
                }
            });
});


Given('поле {string}', (newField) => {
    return request(app)
            .post('/fillField')
            .send({ newField })
            .then((res) => {
                if (res.status !== 200) {
                    throw res.status;
                }
            });
});


Then('возвращается ошибка', () => {
    if (lastMoveStatus !== 412) {
        throw lastMoveStatus;
    }
});


Then('победил игрок {int}', (expectWinner) => {
    return request(app)
            .get('/getWinner')
            .then((res) => {
                if (res.status !== 200) {
                    throw res.status;
                }

                if (res.body !== expectWinner) {
                    throw res.body;
                }
            });
});


Then('ничья', () => {
    return request(app)
            .get('/getWinner')
            .then((res) => {
                if (res.status !== 200) {
                    throw res.status;
                }

                // -1  у меня возвращается при ничьей
                if (res.body !== -1) {
                    throw res.body;
                }
            });
});

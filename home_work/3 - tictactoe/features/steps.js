/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable arrow-body-style */

const { Given, Then } = require('cucumber');
const request = require('supertest');

const games = require('../src/gamesControl');
const users = require('../src/users');
const sessions = require('../src/sessions');
const libForTest = require('../src/libForTest');
const app = require('../src/server');

// сюда пишет результаты ответа сервера после каждого запроса
const lastResponse = {
    status: 401,
    body: '',
};

// функция пишет в объект
function setLastResponse(status, body) {
    lastResponse.status = status;
    lastResponse.body = body;
}


Given('список пользователей пуст, список сессий пуст, список игр пуст', () => {
    users.usersArray.splice(0, users.usersArray.length);
    sessions.sessionsArray.splice(0, sessions.sessionsArray.length);
    games.arrayGames.splice(0, games.arrayGames.length);
});

// ///////////////////////////////////////////////////////////

Given('количество пользователей {int}', (quantUsers) => {
    if (users.usersArray.length !== quantUsers) {
        throw users.usersArray.length;
    }
});

Given('количество сессий {int}', (quantSessions) => {
    if (sessions.sessionsArray.length !== quantSessions) {
        throw users.sessionsArray.length;
    }
});

Then('количество игр {int}', (quantGames) => {
    if (games.arrayGames.length !== quantGames) {
        throw games.arrayGames.length;
    }
});

// ///////////////////////////////////////////////////////////

Given('игрок регистрируется, логин {string} и пароль {string}', (login, password) => {
    return request(app)
            .post('/registration')
            .send({ login, password })
            .then((res) => {
                setLastResponse(res.status, res.body);
            });
});

Then('возвращается успех', () => {
    if (lastResponse.status !== 200) {
        throw lastResponse.status;
    }
});

Then('возвращается ошибка', () => {
    if (lastResponse.status === 200) {
        throw lastResponse.status;
    }
});

Given('игрок авторизуется {string}, {string}', (login, password) => {
    return request(app)
            .post('/login')
            .send({ login, password })
            .then((res) => {
                setLastResponse(res.status, res.body);
            });
});

Given('есть пользователь, логин {string}, пароль {string}, id {string}', (login, password, userId) => {
    libForTest.createNewUser(login, password, userId);
});

Given('есть авторизированный пользователь, логин {string}, пароль {string}, id {string}, сессия {string}', (login, password, userId, sessionId) => {
    libForTest.createNewUser(login, password, userId);
    libForTest.createNewSession(userId, sessionId);
});

Given('пользователь с сессией {string} создает игру', (sessionId) => {
    return request(app)
            .post('/createNewGame')
            .send()
            .set('authorization', sessionId)
            .then((res) => {
                setLastResponse(res.status, res.body);
            });
});

Given('пользователь с сессией {string} запрашивает список игр, где он Создатель', (sessionId) => {
    return request(app)
            .get('/getMyGames')
            .send()
            .set('authorization', sessionId)
            .then((res) => {
                setLastResponse(res.status, res.body);
            });
});

Then('количество элементов полученного списка = {int}', (result) => {
    if (lastResponse.body.length !== result) {
        throw lastResponse.body.length;
    }
});

Given('пользователь с сессией {string} запрашивает список игр, где он Второй игрок', (sessionId) => {
    return request(app)
            .get('/getGamesIAmSecondPlayer')
            .send()
            .set('authorization', sessionId)
            .then((res) => {
                setLastResponse(res.status, res.body);
            });
});

Given('пользователь с сессией {string} запрашивает список игр, куда можно подключиться', (sessionId) => {
    return request(app)
            .get('/getGamesForConnect')
            .send()
            .set('authorization', sessionId)
            .then((res) => {
                setLastResponse(res.status, res.body);
            });
});

Given('есть игра с id {string}, которую создал пользователь с Id сессии {string}', (gameId, sessionId) => {
    libForTest.createNewGame(sessionId, gameId);
});

Given('пользователь с сессией {string} подключается к игре с id {string}', (sessionId, gameId) => {
    return request(app)
            .post('/connectSecondPlayerToGame')
            .send({ gameId })
            .set('authorization', sessionId)
            .then((res) => {
                setLastResponse(res.status, res.body);
            });
});

Given('пользователь с сессией {string} удаляет игру с Id {string}', (sessionId, gameId) => {
    return request(app)
            .post('/deleteGame')
            .send({ gameId })
            .set('authorization', sessionId)
            .then((res) => {
                setLastResponse(res.status, res.body);
            });
});

Given('пользователь с сессией {string} получает статус игры с id {string}', (sessionId, gameId) => {
    return request(app)
            .get('/getStatusOfGame')
            .send({ gameId })
            .set('authorization', sessionId)
            .then((res) => {
                setLastResponse(res.status, res.body);
            });
});

Then('статус игры {string}', (status) => {
    if (lastResponse.status !== 200) {
        throw lastResponse.status;
    } else if (lastResponse.body.status !== status) {
        throw lastResponse.body.status;
    }
});

Given('в игре с id {string} ничья', (gameId) => {
    libForTest.setWinnerToGame(gameId, -1); // -1 у меня ничья
});


Given('игрок с сессией {string}, в игре {string}, ходит в клетку {int}, {int}', (sessionId, gameId, x, y) => {
    return request(app)
            .post('/move')
            .send({ gameId, x, y })
            .set('authorization', sessionId)
            .then((res) => {
                setLastResponse(res.status, res.body);
            });
});

/*
Then('в игре {string}, поле становится {string}', (gameId, inputField) => {
    const currentField = libForTest.getFieldFromGameString(gameId);

    if (inputField !== currentField) {
        throw currentField;
    }
});
*/

Then('игрок с сессией {string}, в игре {string}, получает поле {string}', (sessionId, gameId, inputFieldString) => {
    return request(app)
            .get('/getField')
            .send({ gameId })
            .set('authorization', sessionId)
            .then((res) => {
                setLastResponse(res.status, res.body);

                const currentField = libForTest.fieldArrayToString(res.body.field);

                if (currentField !== inputFieldString) {
                    throw currentField;
                }
            });
});

Given('в игре с Id {string}, текущее поле {string}', (gameId, inputFieldString) => {
    libForTest.setFieldToGameFromString(gameId, inputFieldString);
});

Then('в игре {string}, победил игрок с сессией {string}', (gameId, sessionId) => {
    return request(app)
            .get('/getWinnerOfGame')
            .send({ gameId })
            .set('authorization', sessionId)
            .then((res) => {
                setLastResponse(res.status, res.body);

                if (res.body.winnerId !== sessionId) {
                    throw res.body;
                }
            });
});

Given('в игре {string} следующий ход делает игрок с сессией {string}', (gameId, sessionId) => {
    libForTest.setNextMove(gameId, sessionId);
});


Then('в игре {string}, ничья', (gameId) => {
    const winner = libForTest.getWinner(gameId);

    if (winner !== -1) {
        throw winner;
    }
  });

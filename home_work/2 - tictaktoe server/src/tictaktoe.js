/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-const */

let field = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
let winner = 0;
let currentPlayer = 1;

function emptyField() {
    field = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    winner = 0;
    currentPlayer = 1;
}


function setCurrentPlayer(inp) {
    if (inp === 1 || inp === 2) {
        currentPlayer = inp;
    }
}

function getCurrentPlayer() {
    return currentPlayer;
}

function changePlayer() {
    if (currentPlayer === 1) {
        currentPlayer = 2;
    } else if (currentPlayer === 2) {
        currentPlayer = 1;
    } else {
        currentPlayer = 1;
    }
}


function checkWinnerHorizontPlayer() {
    for (let str = 0; str < 3 && winner === 0; str += 1) {
        if (field[str][0] === field[str][1]
            && field[str][1] === field[str][2]
            && field[str][0] !== 0) {
            winner = field[str][0];
        }
    }
}

function checkWinnerVertPlayer() {
    for (let col = 0; col < 3 && winner === 0; col += 1) {
        if (field[0][col] === field[1][col]
            && field[1][col] === field[2][col]
            && field[0][col] !== 0) {
            winner = field[0][col];
        }
    }
}

function checkWinnerDiagPlayer() {
    if (field[0][0] === field[1][1] && field[1][1] === field[2][2] && field[0][0] !== 0) {
        winner = field[0][0];
    } else if (field[2][0] === field[1][1] && field[1][1] === field[0][2] && field[0][2] !== 0) {
        winner = field[0][2];
    }
}

// ничья
function checkDeadHeat() {
    for (let str = 0; str < 3 && winner === 0; str += 1) {
        for (let col = 0; col < 3; col += 1) {
            if (field[str][col] === 0) {
                return;
            }
        }
    }
    if (winner === 0) {
        winner = -1;
    }
}

function getWinner() {
    return winner;
  }

function checkWinner() {
    winner = 0;

    checkWinnerHorizontPlayer();
    checkWinnerVertPlayer();
    checkWinnerDiagPlayer();
    checkDeadHeat();

    return getWinner();
}


function newStep(y, x) {
    if (winner !== 0) {
        return false;
    }
    if (x < 1 || x > 3) {
        return false;
    }
    if (y < 1 || y > 3) {
        return false;
    }
    if (field[x - 1][y - 1] !== 0) {
        return false;
    }

    field[x - 1][y - 1] = getCurrentPlayer();
    checkWinner();
    changePlayer();
    return true;
}


function fieldArrToString(inpArray) {
    let res = '';

    for (let str = 0; str < 3; str += 1) {
        for (let col = 0; col < 3; col += 1) {
            res += inpArray[str][col];

            if (col === 2 && str !== 2) {
                res += '|';
            }
        }
    }
    return res;
}


function getFieldString() {
    return fieldArrToString(field);
}

function getFieldArr() {
    return field;
}

function filedStringToArr(inp) {
    const arr = inp.split('|');
    let arrayResult = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    for (let str = 0; str < 3; str += 1) {
        for (let col = 0; col < 3; col += 1) {
            arrayResult[str][col] = Number(arr[str][col]);
        }
    }
    return arrayResult;
}

function fillFieldFromString(inpString) {
    emptyField(); // to default
    field = filedStringToArr(inpString);
}


module.exports = {
    emptyField, // очистить игровое поле
    fillFieldFromString, // заполнить поле входящей строкой
    getFieldArr,
    getFieldString,

    setCurrentPlayer, // входящий параметр - номер нового игрока
    getCurrentPlayer,
    changePlayer, // смена игрока на другого (варианты 1 и 2)

    newStep, // новый ход

    checkWinner, // проверка выигрывшего; 1,2 - игрок, -1 - ничья, 0 - есть еще ходы
    getWinner,

    filedStringToArr, // принимает строку, возвращает массив двумерный
    fieldArrToString, // принимает массив двумерный, возвращает строку
};

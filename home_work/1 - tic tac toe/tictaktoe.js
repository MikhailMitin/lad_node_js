"use strict";

let field = [[0,0,0],[0,0,0],[0,0,0]];
let winner = 0;

function emptyField(){
    field = [[0,0,0],[0,0,0],[0,0,0]];
}

let currentPlayer = 1;

function setCurrentPlayer(inp){
    currentPlayer = inp;
}

function getCurrentPlayer(){
    return currentPlayer;
}

function newStep(x, y){
    if (x < 1 || x > 3)
        return false;
    else if (y < 1 || y > 3)
        return false; 
    else if (field[x-1][y-1] != 0)
        return false;
    
    field[x-1][y-1] = getCurrentPlayer();
    return true;
}



function checkWinner(){
    winner = 0;
    
    checkWinnerHorizontPlayer();
    checkWinnerVertPlayer();
    checkWinnerDiagPlayer();
    checkDeadHeat();

    return getWinner();
}


function checkWinnerHorizontPlayer(){
    for (let str = 0 ; str < 3 && winner == 0; str++)
        if (field[str][0] == field[str][1] && field[str][1] == field[str][2] && field[str][0] != 0)
            winner = field[str][0];
}

function checkWinnerVertPlayer(){
    for (let col = 0 ; col < 3 && winner == 0; col++)
        if (field[0][col] == field[1][col] && field[1][col] == field[2][col] && field[0][col] != 0) 
            winner = field[0][col];
}

function checkWinnerDiagPlayer(){
    if (field[0][0] == field[1][1] && field[1][1] == field[2][2] && field[0][0] != 0) 
        winner = field[0][0];
    else if (field[2][0] == field[1][1] && field[1][1] == field[0][2] && field[0][2] != 0) 
        winner = field[0][2];
}

// ничья
function checkDeadHeat(){
    for (let str = 0 ; str < 3 && winner == 0; str++)
        for (let col = 0 ; col < 3 ; col++)
            if (field[str][col] == 0)
                return;
    if (winner == 0)
        winner = -1;
}


function getFieldForPrint(){
    let res = "";

    for (let str = 0 ; str < 3 ; str++)
        for (let col = 0 ; col < 3 ; col++){
            res = res + field[str][col];

            if (col === 2 && str != 2)
                res = res + "|";
        }
    return res;
}

function fillField(inp){
    const arr = inp.split("|");

    for (let str = 0 ; str < 3 ; str++)
        for (let col = 0 ; col < 3 ; col++)
            field[str][col] = arr[str][col];
}

function getWinner(){
    return winner;
}


/*
function test(){
    emptyField();
    console.log(getFieldForPrint());

    newStep(1,1,1);
    checkWinner();
    console.log(getFieldForPrint());
}

test();
*/

// eslint-disable-next-line no-undef
module.exports = {
    getFieldForPrint,
    checkDeadHeat, // ничья
    checkWinnerDiagPlayer, // выигрш по диагонали
    checkWinnerVertPlayer, // выигрш по вертикали
    checkWinnerHorizontPlayer, // выигрш по горизонтали
    checkWinner, // проверка выигрывшего
    newStep, // новый ход
    emptyField, // очистить игровое поле
    setCurrentPlayer, 
    getCurrentPlayer,
    fillField,
    getWinner,
};
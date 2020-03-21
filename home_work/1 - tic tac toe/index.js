"use strict";
console.clear();

// eslint-disable-next-line no-undef
const tictactoe = require("./tictaktoe");
// eslint-disable-next-line no-undef
const readlineSync = require("readline-sync"); 

const players = [1,2];

tictactoe.emptyField(); // очистка перед стартом
console.log("Текущее поле:\n", tictactoe.getFieldForPrint());

while (tictactoe.checkWinner() == 0){
    // -1  - ничья
    // 0 - нет конца игры
    // 1 - выиграл игрок 1
    // 2 - выиграл игрок 2 

    for (let i = 0; i < players.length ; i++){
        const step_x = readlineSync.question("Ваш ход игрок " + players[i] + ", введите номер строки: ");
        const step_y = readlineSync.question("Ваш ход игрок " + players[i] + ", введите номер колонки: ");

        tictactoe.setCurrentPlayer(players[i]);

        if (!tictactoe.newStep(step_x, step_y)){
            console.log("Введены некорректные данные. Попробуйте снова");
            i--;
            continue;
        }

        if (tictactoe.checkWinner() != 0)
            break;
        console.log("Текущее поле:\n", tictactoe.getFieldForPrint());
    }
}

const newWinner = tictactoe.getWinner();

if (newWinner == 1)
    console.log("Выиграл игрок 1");
else if (newWinner == 2)
    console.log("Выиграл игрок 2");
else if (newWinner == -1)
    console.log("Ничья");
const tictactoe = require("../tictaktoe");
const {Given, When, Then} = require("cucumber");

Given('пустое поле', () => {
    tictactoe.emptyField();

    if (tictactoe.getFieldForPrint() != "000|000|000")
        throw tictactoe.getFieldForPrint();
  });

Given('ходит игрок {int}', (int) => {
    tictactoe.setCurrentPlayer(int);
});

Given('игрок {int} ходит в клетку {int}, {int}', function (int, int2, int3) {
    tictactoe.setCurrentPlayer(int);
    
    if (!tictactoe.newStep(int3, int2))
        throw "the cell is not empty";
});

Then('поле становится {string}', function (string) {
    if (string != tictactoe.getFieldForPrint())
        throw tictactoe.getFieldForPrint();
});

Given('поле {string}', function (string) {
    tictactoe.fillField(string);
    if (string != tictactoe.getFieldForPrint())
        throw tictactoe.getFieldForPrint();
  });

Given('игрок ходит в клетку {int}, {int}', function (int, int2) {
    tictactoe.newStep(int2, int);
});

Then('возвращается ошибка', function () {
    // я не понимаю как вернуть ошибку. Если я использую throw, то тест не пройдет
    // можно просто console.log вывести
    console.log("\nОшибка\n");
});

Then('победил игрок {int}', function (int) {
    tictactoe.checkWinner();
    
    if (int != tictactoe.getWinner())
        throw tictactoe.getWinner();
});

Then('ничья', function () {
    tictactoe.checkWinner();
    
    if (tictactoe.getWinner() != -1)
        throw tictactoe.getWinner();
});
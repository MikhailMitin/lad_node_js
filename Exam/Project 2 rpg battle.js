'use strict'
console.clear();
const readlineSync = require('readline-sync');
let usedMovesMonster = []; // для рассчета cooldown противника
let usedMovesMe = []; // для рассчета cooldown игрока


const monster = {
        maxHealth: 10,
        name: "Лютый",
        moves: [
            {
                "name": "Удар когтистой лапой",
                "physicalDmg": 3, // физический урон
                "magicDmg": 0,    // магический урон
                "physicArmorPercents": 20, // физическая броня
                "magicArmorPercents": 20,  // магическая броня
                "cooldown": 0     // ходов на восстановление
            },
            {
                "name": "Огненное дыхание",
                "physicalDmg": 0,
                "magicDmg": 4,
                "physicArmorPercents": 0,
                "magicArmorPercents": 0,
                "cooldown": 3
            },
            {
                "name": "Удар хвостом",
                "physicalDmg": 2,
                "magicDmg": 0,
                "physicArmorPercents": 50,
                "magicArmorPercents": 0,
                "cooldown": 2
            },
        ]
    }
	


const me = {
moves: [
            {
                "name": "Удар боевым кадилом",
                "physicalDmg": 2,
                "magicDmg": 0,
                "physicArmorPercents": 0,
                "magicArmorPercents": 50,
                "cooldown": 0
            },
            {
                "name": "Вертушка левой пяткой",
                "physicalDmg": 4,
                "magicDmg": 0,
                "physicArmorPercents": 0,
                "magicArmorPercents": 0,
                "cooldown": 4
            },
            {
                "name": "Каноничный фаербол",
                "physicalDmg": 0,
                "magicDmg": 5,
                "physicArmorPercents": 0,
                "magicArmorPercents": 0,
                "cooldown": 3
            },
            {
                "name": "Магический блок",
                "physicalDmg": 0,
                "magicDmg": 0,
                "physicArmorPercents": 100,
                "magicArmorPercents": 100,
                "cooldown": 4
            },
        ]
}









// Перед началом боя игрок выбирает сложность (начальное здоровье Евстафия)
console.log("Ваш враг", monster.name, "\nЕго здоровье", monster.maxHealth);
const inpHealth = readlineSync.question('Введите значение своего здоровья  ');
me.maxHealth = inpHealth;
me.name = "Евстафий";
let stepNum = 1; // номер хода


while (action())
{
	stepNum++;
}


if (monster.maxHealth <= 0 && me.maxHealth <= 0)
	console.log("\nВзаимное уничтожение");
else if (monster.maxHealth <= 0)
	console.log("\nВы выиграли. Монстер уничтожен");
else if (me.maxHealth <= 0)
	console.log("\nВы проиграли. Монстер победил");




function action(){
	
	// Каждый ход компьютер случайно выбирает одно из доступных действий и сообщает, что он собирается делать
	let moveOfBotInteger = randomInteger(0, monster.moves.length-1);
	let moveOfBot = monster.moves[moveOfBotInteger];
	while (!moveIsAvailable(moveOfBot, usedMovesMonster))
	{
		moveOfBotInteger = randomInteger(0, monster.moves.length-1);
		moveOfBot = monster.moves[moveOfBotInteger];
	}
	
	console.log("\nВраг выбрал удар:", descriptionOfMove(moveOfBot));
	
	// В ответ на это игрок (Евстафий) должен выбрать свое действие.
	console.log("Выбирете ваш удар:"); 
	const arrayAvailableMovesOfMe = getAvailableMoves(me, usedMovesMe);
	for (let i = 0 ; i < arrayAvailableMovesOfMe.length ; i++)
		console.log("" + (i+1) + ":", descriptionOfMove(arrayAvailableMovesOfMe[i]));

	let moveOfPlayerInteger = readlineSync.question("");
	while (moveOfPlayerInteger < 1 || moveOfPlayerInteger > arrayAvailableMovesOfMe.length)
	{
		moveOfPlayerInteger = readlineSync.question("Введенное значение не корректно, попробуйте еще раз: ");
	}
	let moveOfPlayer = arrayAvailableMovesOfMe[moveOfPlayerInteger-1];
	//console.log("\nВраг выбрал удар:", descriptionOfMove(moveOfBot));
	console.log("Ваш удар:", descriptionOfMove(moveOfPlayer));
	
	// После происходит взаимное нанесение урона
	usedMovesMonster.push(moveOfBot); // записываем в массив текущий удар
	usedMovesMe.push(moveOfPlayer);
	actionEffect(moveOfBot, moveOfPlayer, me);
	actionEffect(moveOfPlayer, moveOfBot, monster);
	console.log("Ваше здоровье:", me.maxHealth, "Здоровье врага:", monster.maxHealth);
	
	// здоровье кончилось
	if (monster.maxHealth <= 0 || me.maxHealth <= 0)
		return false;
	
	return true;
}


function actionEffect(moveOfAction, moveOfArmor, obj){
	/*
	console.log("Name", obj.name);
	console.log("moveOfAction.physicalDmg", moveOfAction.physicalDmg, "moveOfArmor.physicArmorPercents", moveOfArmor.physicArmorPercents);
	console.log("moveOfAction.magicDmg", moveOfAction.magicDmg, "moveOfArmor.magicArmorPercents", moveOfArmor.magicArmorPercents);
	console.log("health start", obj.maxHealth);
	*/
	
	const physicalDmg = resultDamage(moveOfAction.physicalDmg, moveOfArmor.physicArmorPercents);
	const magicDmg =    resultDamage(moveOfAction.magicDmg, moveOfArmor.magicArmorPercents);
	
	obj.maxHealth = obj.maxHealth - physicalDmg - magicDmg;
	
	if (obj.maxHealth < 0)
		obj.maxHealth = 0; // не очень хорошо, если показатели здоровья будут отрицательные
	 
	//console.log("physicalDmg", physicalDmg, "magicDmg", magicDmg, "health", obj.maxHealth, "\n");
}

// считает итоговый урон, с учетом брони
function resultDamage(damage, armor){
	if (damage == 0)
		return 0;
	else if (armor == 0)
		return damage;
	else
	{
		let result = damage * ((100 - armor)/100);
		result = Math.round(result);
		return result;
	}
}


function moveIsAvailable(move, array){
	
	for (let i = array.length-1 ; i >= array.length - move.cooldown && i >= 0; i--)
		if (array[i] == move)
			return false;
	
	return true;
}


function getAvailableMoves(obj, arrayUsedMoves){
	let result = [];
	for (let i = 0; i < obj.moves.length ; i++)
	{
		if (moveIsAvailable(obj.moves[i], arrayUsedMoves))
			result.push(obj.moves[i]);
	}
	return result;
}



function descriptionOfMove(move){
	return "" + move.name + " (phys dmg " + move.physicalDmg + "; magic dmg " + move.magicDmg + "; phys armor " + move.physicArmorPercents + "; magic armor " + move.magicArmorPercents + "; cooldown " + move.cooldown + ")";
}



function randomInteger(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

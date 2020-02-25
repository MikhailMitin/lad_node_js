'use strict'
console.clear();
const readlineSync = require('readline-sync');

const fs = require('fs');
const path = require('path');
const INPUT_PATH = "C:/JS/quiz";
const MAX_QUESTIONS = 5;

//fs.close();
//readFolder(dir);

let arrayFiles = getArrayFiles(INPUT_PATH);


// Нужно написать программу-викторину, которая выбирает 5 случайных файлов вопросов
let questionsAsked = 0; // количество заданных вопросов
let rightAnswers = 0; // количество правильных ответов

// пока не достигли МАКС колво вопросов, либо колво файлов не кончилось
while (questionsAsked < MAX_QUESTIONS && arrayFiles.length > 0)
{
	// выбор файла с вопросом
	let numCurrentQuestion = -1; // номер файла в массиве arrayFiles
	let currentQuestion = null; // тут будет ссылка на объект с вопросом
	while (true){
		// в массиве не осталось доступныхх файлов с нужной структурой
		if (arrayFiles.length == 0)
			break;
		
		// произволный номер файла из массива
		numCurrentQuestion = randomInteger(0, arrayFiles.length - 1);
		
		// вопрос с ответами в объекте
		currentQuestion = getQuestion(arrayFiles[numCurrentQuestion]);
		
		// проверка - что-то не считалось, либо структура файла не та - удаляем путь файла из массива
		if (currentQuestion === null)
		{
			arrayFiles.splice(numCurrentQuestion, 1);
			continue;
		}
		break;
	}
	
	if (currentQuestion === null)
		break;
	
	// удалим файл из массива файлов вопрос, чтобы не было повтора вопросов
	arrayFiles.splice(numCurrentQuestion, 1);
	
	// зададим вопрос пользователю
	console.log("Вопрос", (questionsAsked+1), "-", currentQuestion.question);
	for (let i = 0 ; i < currentQuestion.answers.length ; i++)
		console.log("\t", (i+1), "-", currentQuestion.answers[i]);
	
	// получим и обработаме ответ
	let answer = readlineSync.question('Введите номер ответа: ');
	while (!isFinite(answer) || answer < 1 || answer > currentQuestion.answers.length)
		answer = readlineSync.question('Вы ввели некорректный номер ответа. Введите номер ответа: ');
	
	if (answer == currentQuestion.rightAnswer)
		rightAnswers++;
	
	questionsAsked++;
	console.log("\n");
}

console.log("Викторина завершена. Правильных ответов", rightAnswers, "из", questionsAsked);



function getQuestion(filePath){
	// открываем файл на чтение
	let data = "";
	try {
		data = fs.readFileSync(filePath);
	} catch (err) {
		console.log(err);
		return null;
	}
	
	// разложим в массив с разделителем - перевод каретки
	data = data.toString();
	data = data.trim();
	const arrayString = data.split("\n"); 
	
	// проверка - есть 1 строка с вопросом, 1 с ответом, мин 2 с вариантами отвтов
	if (arrayString.length < 4)
		return null;
	
	// в ячейке ответа хранится число
	if (!isFinite(arrayString[1]))
		return null;
	
	// ответ с таким номером есть в списке вопросов
	if (arrayString[1] < 1 || arrayString[1] > arrayString.length - 2)
		return null;
	
	// создадим объект с вопросом, ответов и вариантами
	const question = {
		question: arrayString[0].trim(),
		rightAnswer: arrayString[1].trim(),
		answers:[],
	};
	
	// заполним варианты
	for (let i = 2 ; i < arrayString.length ; i++)
		question.answers.push(arrayString[i].trim());
	
	//console.log(question);
	return question;
}


function getArrayFiles(pathFolder){
	
	let resultArray = [];
	const files = fs.readdirSync(pathFolder);
	
	for (let file in files)
	{
		const filePath = path.join(pathFolder, files[file]);
		
		// check what is it folder OR file / access / 
		if (fs.lstatSync(filePath).isFile() && checkAccessFile(filePath))
		{
			resultArray.push(filePath);
		}
			
	}
	
	return resultArray;
}



function checkAccessFile(filePath){
	// check Access
	try {
		fs.accessSync(filePath, fs.constants.R_OK);
		return true;
	} 
	catch (err) {
		//console.error('no access!');
		return false;
	}
}


function randomInteger(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}
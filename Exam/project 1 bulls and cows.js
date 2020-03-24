console.clear();
const readlineSync = require('readline-sync');
const MIN_DIGITS = 3;
const MAX_DIGITS = 6;
const MIN_TRY = 3;
const MAX_TRY = 20;

// вычисляемые константы
const MIN_VALUE = Math.pow(10, MIN_DIGITS-1);
const MAX_VALUE = Math.pow(10, MAX_DIGITS) - 1;

// Компьютер загадывает число из нескольких различающихся цифр (от 3 до 6)
const secretNum = randomInteger(MIN_VALUE, MAX_VALUE); 
//console.log("Загаданное число = ",  secretNum);

// Игроку дается несколько попыток на то, чтобы угадать это число.
const quantMaxTry = randomInteger(MIN_TRY, MAX_TRY);
console.log("Число загадано, максимальное количество попыток",  quantMaxTry);

// ходы
let numCurrentTry = 1;
while (numCurrentTry++ <= quantMaxTry)
{
	let inpNum = readlineSync.question("Введите число от " + MIN_VALUE + " до " + MAX_VALUE + ". Попытка номер " + (numCurrentTry-1) + " из " + quantMaxTry + ":  ");
	inpNum = Number(inpNum);
	
	if (!isFinite(inpNum)){
		console.log("Вы ввели не число. Попытка не засчитана. Попробуйте снова");
		continue;
	}
	else if (inpNum < MIN_VALUE){
		console.log("Введенное число меньше минимального. Попытка не засчитана. Попробуйте снова");
		continue;
	}
	else if (inpNum > MAX_VALUE){
		console.log("Введенное число больше максимального. Попытка не засчитана. Попробуйте снова");
		continue;
	} 
	
	const different = checkNum(secretNum, inpNum); // возвращает отличия
	
	if (different == ""){
		console.log("Вы угадали!!!");
		break;
	}
	
	console.log(different);
}

if (numCurrentTry > quantMaxTry){
	console.log("Превышено число попыток");
}







function checkNum(generalNum, inpNum){
	// они равны, дальнейшая проверка не требуется
	if (generalNum == inpNum)
		return "";
	
	// будем работать со строками одинаковой длины
	let generalNumString = "" + generalNum; // to string
	let inpNumString = "" + inpNum;
	const maxLength = (generalNumString.length > inpNumString.length ? generalNumString.length : inpNumString.length); // макс длина строки
	generalNumString = numericToString(generalNumString, maxLength); // забъем пробелами слева до нужной длины
	inpNumString = numericToString(inpNumString, maxLength); // забъем пробелами слева до нужной длины
	
	// тут будут индексы найденные
	let indexesRightPlace = []; 
	let indexesWrongPlace = []; // найденные "не на своем месте" из введенной строки
	let indexesWrongPlaceTemp = []; // найденные "не на своем месте" из загаданной строки, чтобы исключить дубли
	
	// совпавших цифр на своих местах
	for (let i = 0; i < generalNumString.length ; i++)
		if (generalNumString[i] == inpNumString[i])
			indexesRightPlace.push(i);
	
	// результат анализа в строку
	const logRightPlace = toLog(generalNumString, indexesRightPlace, "совпавших цифр на своих местах - ");
	
	// совпавших цифр не на своих местах
	for (let i = 0; i < inpNumString.length ; i++){		
		// был найден ранее в проверке "cовпавших цифр на своих местах"
		if (indexesRightPlace.includes(i))
			continue;
		// в строке могут быть пробелы слева, потому что мы их сделали для одинаковой длины строк
		else if (inpNumString[i] == " ")
			continue;
		
		for (let j = 0; j < generalNumString.length ; j++){
			// позиции строк одинаковые
			if (i == j)
				continue;
			// строки разные
			else if (generalNumString[j] != inpNumString[i])
				continue;
			// в строке могут быть пробелы слева, потому что мы их сделали для одинаковой длины строк
			else if (generalNumString[j] == " ")
				continue;
			// был найден ранее в проверке "cовпавших цифр не на своих местах"
			else if (indexesRightPlace.includes(j))
				continue;
			// данный элемент был уже найден и использован как "cовпавших цифр не на своих местах"
			else if (indexesWrongPlaceTemp.includes(j))
				continue;
			
			indexesWrongPlace.push(i);
			indexesWrongPlaceTemp.push(j);
			break; // дальнейший перебор строки не нужен
		}
	}
	
	// результат анализа в строку
	const logWrongPlace = toLog(inpNumString, indexesWrongPlace, "совпавших цифр НЕ на своих местах - ");
		
	// результат
	if (logRightPlace == "" && logWrongPlace == "")
		return "Нет совпадений";
	
	return logRightPlace + logWrongPlace;
}

function numericToString(inpNumString, maxLenght) {
	let result = inpNumString;
	
	while (result.length < maxLenght)
		result = " " + result; // забъем пробелами слева до нужной длины
	
	return result;
}


function toLog(stringInp, arrIndexes, prefix){
	let res = "";
	
	if (arrIndexes.length > 0){
		res = res + prefix + arrIndexes.length + " (";
		
		for (let i = 0; i < arrIndexes.length ; i++){
			res = res + stringInp[arrIndexes[i]];
			if (i != arrIndexes.length -1)
				res = res + ";";
		}
		res = res + ")  ";
	}
	return res;
}


function randomInteger(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

/* eslint-disable linebreak-style */
const { v4 } = require('uuid');
const { logger } = require('./logger');
const userDataBase = require('./usersDataBase');
const sessions = require('./sessions');


// массив пользователей считанный из базы данных
const usersArray = userDataBase.readUserFromDataBase();

// конструктор для создания объекта пользователи
function User(login, password) {
  this.login = login;
  this.password = password;
  this.id = v4(); // уникальный Id формируется при создании нового пользователя
}

// возвращает объект Пользователь с присвоенным Id - внутренняя, используется для регистрации новых
function getNewUserObj(login, password) {
  return new User(login, password);
}

// создание нового пользователя в массиве пользователей
function registration(login, password) {
  if (login === '') {
    logger(__filename, `registrationNewUser, empty login: ${login}`);
    return -1;
  }
  if (password === '') {
    logger(__filename, `registrationNewUser, empty password: ${password}`);
    return -1;
  }
  if (usersArray.find((item) => item.login === login) !== undefined) {
    logger(__filename, `registrationNewUser, user already exists: ${login}`);
    return -1;
  }

  const newUserObj = getNewUserObj(login, password);
  usersArray.push(newUserObj);

  // запись данных пользователя в базу данных
  userDataBase.writeUserToDataBase(newUserObj.login, newUserObj.password, newUserObj.id);

  return sessions.createSession(newUserObj.id); // создади новую сессию и вернем её
}

// возвращает Id пользователя по учетным данным
function loginUser(login, password) {
  const currentUser = usersArray.find((el) => (login === el.login && password === el.password));
  if (currentUser === undefined) {
    logger(__filename, `getUserId, login ${login}, password ${password}`);
    return -1;
  }

  return sessions.createSession(currentUser.id); // создади новую сессию и вернем её Id
}


module.exports = {
  registration,
  loginUser,

  usersArray, // only for test
  getNewUserObj, // only for test
};

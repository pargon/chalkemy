const Sequelize = require('sequelize');
//const chalk = require('chalk');
const { createModel: createCharacterModel } = require('./models/character');
const { createModel: createUserModel } = require('./models/user');
const { createModel: createFilmModel } = require('./models/film');
const { createModel: createGenreModel } = require('./models/genre');

const models = {};

async function connect(host, port, username, password, database) {
  const conn = new Sequelize({
    database,
    username,
    password,
    host,
    port,
    dialect: 'mysql',   //, mariadb
    timestamps: false,
  });

  // guarda modelos
  models.UserModel = createUserModel(conn);
  models.FilmModel = createFilmModel(conn);
  models.GenreModel = createGenreModel(conn);
  models.CharacterModel = createCharacterModel(conn);

  // relacion entre modelos
  models.FilmModel.belongsTo(models.GenreModel, { targetKey: 'name', foreignKey: 'genrekey' });
  models.CharacterModel.belongsTo(models.FilmModel, { targetKey: 'title', foreignKey: 'filmkey' });

  try {
    await conn.authenticate();
    await conn.sync();
    global.console.log('DB: Connect Success');
  } catch (err) {
    global.console.log(`server ${host}`);
    global.console.log('DB: Error connect', err);
  }
}

function getModel(name) {
  if (!models[name]) {
    global.console.log(`No existe model ${name}`);
    return null;
  }
  return models[name];
}

module.exports = {
  connect,
  getModel,
};

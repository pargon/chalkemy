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

  const FilmCharacter = conn.define('filmcharacter', {},
    {
      timestamps: false,
    });

  // relacion entre modelos
  models.FilmModel.belongsTo(models.GenreModel, { targetKey: 'name', foreignKey: 'genrekey' });
  models.CharacterModel.belongsToMany(models.FilmModel, { through: FilmCharacter });
  models.FilmModel.belongsToMany(models.CharacterModel, { through: FilmCharacter });

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

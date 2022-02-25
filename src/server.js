const express = require('express');
const cors = require('cors');
const { createRouter: createUserRouter } = require('./controllers/routers/users');
const { createRouter: createGenreRouter } = require('./controllers/routers/genres');
const { createRouter: createFilmRouter } = require('./controllers/routers/films');
const { createRouter: createCharacterRouter } = require('./controllers/routers/characters');

function makeServer() {
  const server = express();

  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));

  server.use(cors());
  
  // endpoints
  server.use('/v1/auth', createUserRouter());
  server.use('/v1/genres', createGenreRouter());
  server.use('/v1/films', createFilmRouter());
  server.use('/v1/characters', createCharacterRouter());  
  
  server.get('/', (req, res) => res.render('index', {
    title: 'App Alkemy',
    message: 'Debe ingresar a las rutas correctas. Docs: /docs',
  }));

  return server;
}

module.exports = {
  makeServer,
};

const express = require('express');
const cors = require('cors');
const { createRouter: createUserRouter } = require('./controllers/routers/users');
const { createRouter: createGenreRouter } = require('./controllers/routers/genres');


function makeServer() {
  const server = express();

  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));

  server.use(cors());
  
  // endpoints
  server.use('/v1/users', createUserRouter());
  server.use('/v1/genres', createGenreRouter());
  
  
  server.get('/', (req, res) => res.render('index', {
    title: 'App Alkemy',
    message: 'Debe ingresar a las rutas correctas. Docs: /docs',
  }));

  return server;
}

module.exports = {
  makeServer,
};

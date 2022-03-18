const { Router } = require('express');
const db = require('../../model');
const { chkToken } = require('../midds/token');
const { chkOrderQuery } = require('../midds/movie');

function createRouter() {
  const router = Router();

  /**
  * @swagger
  * /v1/movies:
  *  get:
  *    tags:
  *    - "Films"
  *    summary: List movies
  *    description:
  *    parameters:
  *    - in: query
  *      name: name
  *      schema:
  *        type: string
  *      description: The name of movie/serie
  *    - in: query
  *      name: genre
  *      schema:
  *        type: integer
  *      description: The genre id
  *    - in: query
  *      name: order
  *      schema:
  *        type: string
  *      description: List movies/series orrder by ASC/DESC
  *    produces:
  *    - "application/json"
  *    responses:
  *      200:
  *        description: Success
  *      401:
  *        description: Invalid credential
  *      406:
  *        description: Order invalid
  */
  router.get('/', chkToken, chkOrderQuery, async (req, res) => {

    // const type = db.filmType.Movie;
    const {
      name,
      genre,
      order
    } = req.query;

    const Film = db.getModel('FilmModel');
    const Genre = db.getModel('GenreModel');

    // where condition Movie
    let whereOptions = {};
    if (name) {
      whereOptions.title = name;
    }

    // where condition Genre    
    let whereOptionsGenre = {};
    if (genre) {
      whereOptionsGenre.id = genre;
    }

    // order
    let orderOptions = [];
    if (order) {
      orderOptions.push(["createdAt", order]);
    }

    // find
    const films = await Film.findAll({
      attributes: ["image", "title", "createdAt"],
      where: whereOptions,
      order: orderOptions,
      include: [{
        model: Genre,
        attributes: ["name"],
        where: whereOptionsGenre
      }]
    });

    res
      .status(200)
      .json(films);
  });


  return router;
}

module.exports = {
  createRouter,
};

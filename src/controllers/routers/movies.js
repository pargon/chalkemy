const { Router } = require('express');
const db = require('../../model');
const { chkToken } = require('../midds/token');

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
  *    produces:
  *    - "application/json"
  *    responses:
  *      200:
  *        description: Success
  *      401:
  *        description: Invalid credential
  */
  router.get('/', chkToken, async (req, res) => {

    const type = db.filmType.Movie;

    const Film = db.getModel('FilmModel');
    const films = await Film.findAll({
      where: {
        type 
      },
      attributes: ["image", "title", "createdAt"],
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

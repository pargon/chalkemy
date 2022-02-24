const { Router } = require('express');
const db = require('../../model');
const { chkToken } = require('../midds/token');

function createRouter() {
  const router = Router();

  /**
   * @swagger
   * /v1/genres:
   *  post:
   *    tags:
   *    - "Genres"
   *    summary: "Add a new genre"
   *    description: 
   *    consumes:
   *    - "application/json"
   *    parameters:
   *    - name: body
   *      description:
   *      in: body
   *      required: true
   *      type: string
   *      example: {name: String, imageurl: String}
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Genre created
   *      401:
   *        description: Invalid credential
   *      409:
   *        description: Record already exists
   */
  router.post('/', chkToken, async (req, res) => {

    // get modelo
    const Genre = db.getModel('GenreModel');
    const {
      name,
    } = req.body;

    // buscar por descripcion
    const current = await Genre.findOne({
      where: {
        name,
      },
    });

    // si encuentra, error
    if (current) {
      res
        .status(409)
        .send({ message: 'Record already exists' });
    } else {
      try {
        // crea nuevo medio de pago
        const newGenre = await Genre.create({
          name,
        });

        // retorna
        res
          .status(200)
          .json(newGenre);
      } catch (error) {
        res
          .status(501)
          .json(error);
      }
    }
  });
  /**
   * @swagger
   * /v1/genres:
   *  put:
   *    tags:
   *    - "Genres"
   *    summary: "Update a genre by name"
   *    description: 
   *    consumes:
   *    - "application/json"
   *    parameters:
   *    - name: body
   *      description:
   *      in: body
   *      required: true
   *      type: string
   *      example: {name: String, imageurl: String}
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Genre updated
   *      401:
   *        description: Invalid credential
   *      404:
   *        description: Genre not found
   */
  router.put('/', chkToken, async (req, res) => {

    // get modelo
    const Genre = db.getModel('GenreModel');
    const {
      name,
      imageurl,
    } = req.body;

    // buscar por id
    const current = await Genre.findOne({
      where: {
        name,
      },
    });
    // si encuentra, actualiza
    if (!current) {
      res
        .status(404)
        .json({ message: 'Genre not found' });
    } else {
      try {
        // update base
        current.descripcion = descripcion;
        await current.save();

        res
          .status(200)
          .json(current);
      } catch (error) {
        // si no encuentra, error
        res
          .status(501)
          .json(error);
      }
    }
  });
  /**
   * @swagger
   * /v1/genres:
   *  delete:
   *    tags:
   *    - "Genres"
   *    summary: "Delete a genre by name"
   *    description: 
   *    consumes:
   *    - "application/json"
   *    parameters:
   *    - name: body
   *      description:
   *      in: body
   *      required: true
   *      type: string
   *      example: {name: String}
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Genre deleted
   *      401:
   *        description: Invalid credential
   *      404:
   *        description: Genre not found
   */
  router.delete('/', chkToken, async (req, res) => {

    // get modelo
    const Genre = db.getModel('GenreModel');
    const {
      name,
    } = req.body;

    // buscar por id
    const current = await Genre.findOne({
      where: {
        name,
      },
    });
    // si encuentra, actualiza
    if (!current) {
      res
        .status(404)
        .json({ message: 'Genre not found' });
    } else {
      try {
        // delete medio
        await current.destroy();

        res
          .status(200)
          .json({ message: 'Genre deleted' });
      } catch (error) {
        // si no encuentra, error
        res
          .status(501)
          .json(error);
      }
    }
  });
  /**
   * @swagger
   * /v1/genres:
   *  get:
   *    tags:
   *    - "Genres"
   *    summary: List genres
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
    const Genre = db.getModel('GenreModel');
    const Genres = await Genre.findAll({});
    res
      .status(200)
      .json(Genres);
  });

  return router;
}

module.exports = {
  createRouter,
};

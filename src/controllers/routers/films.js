const { Router } = require('express');
const db = require('../../model');
const { chkToken } = require('../midds/token');

function createRouter() {
  const router = Router();

  /**
   * @swagger
   * /v1/films:
   *  post:
   *    tags:
   *    - "Films"
   *    summary: "Add a new film"
   *    description: 
   *    consumes:
   *    - "application/json"
   *    parameters:
   *    - name: body
   *      description:
   *      in: body
   *      required: true
   *      type: string
   *      example: {title: String, imageurl: String, rating: Integer}
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Film created
   *      401:
   *        description: Invalid credential
   *      409:
   *        description: Record already exists
   */
  router.post('/', chkToken, async (req, res) => {

    // get modelo
    const Film = db.getModel('FilmModel');
    const {
      title,
      imageurl,
      rating,
    } = req.body;

    // buscar por descripcion
    const current = await Film.findOne({
      where: {
        title,
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
        const newFilm = await Film.create({
          title,
          image:imageurl,
          rating,
        });

        // retorna
        res
          .status(200)
          .json(newFilm);
      } catch (error) {
        res
          .status(501)
          .json(error);
      }
    }
  });
  /**
   * @swagger
   * /v1/films:
   *  put:
   *    tags:
   *    - "Films"
   *    summary: "Update a film by name"
   *    description: 
   *    consumes:
   *    - "application/json"
   *    parameters:
   *    - name: body
   *      description:
   *      in: body
   *      required: true
   *      type: string
   *      example: {title: String, imageurl: String, rating: Integer}
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Film updated
   *      401:
   *        description: Invalid credential
   *      404:
   *        description: Film not found
   */
  router.put('/', chkToken, async (req, res) => {

    // get modelo
    const Film = db.getModel('FilmModel');
    const {
      title,
      imageurl,
      rating,
    } = req.body;

    // buscar por id
    const current = await Film.findOne({
      where: {
        title,
      },
    });
    // si encuentra, actualiza
    if (!current) {
      res
        .status(404)
        .json({ message: 'Film not found' });
    } else {
      try {
        // update base
        current.image = imageurl;
        current.rating = rating;
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
   * /v1/films:
   *  delete:
   *    tags:
   *    - "Films"
   *    summary: "Delete a film by name"
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
   *        description: Film deleted
   *      401:
   *        description: Invalid credential
   *      404:
   *        description: Film not found
   */
  router.delete('/', chkToken, async (req, res) => {

    // get modelo
    const Film = db.getModel('FilmModel');
    const {
      title,
    } = req.body;

    // buscar por id
    const current = await Film.findOne({
      where: {
        title,
      },
    });
    // si encuentra, actualiza
    if (!current) {
      res
        .status(404)
        .json({ message: 'Film not found' });
    } else {
      try {
        // delete medio
        await current.destroy();

        res
          .status(200)
          .json({ message: 'Film deleted' });
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
   * /v1/films:
   *  get:
   *    tags:
   *    - "Films"
   *    summary: List films
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
    const Film = db.getModel('FilmModel');
    const Films = await Film.findAll({});
    res
      .status(200)
      .json(Films);
  });
  /**
   * @swagger
   * /v1/films/character:
   *  post:
   *    tags:
   *    - "Films"
   *    summary: "Associate character to film"
   *    description: 
   *    consumes:
   *    - "application/json"
   *    parameters:
   *    - name: body
   *      description:
   *      in: body
   *      required: true
   *      type: string
   *      example: {title: String, character_name: String}
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Character associated
   *      401:
   *        description: Invalid credential
   *      404:
   *        description: Film not found
   *      403:
   *        description: Character invalid
   */
  router.post('/character', chkToken, async (req, res) => {

    // get modelo
    const Film = db.getModel('FilmModel');
    const Character = db.getModel('CharacterModel');
    const {
      title,
      character_name,
    } = req.body;

    // buscar film por title
    const current = await Film.findOne({
      where: {
        title,
      },
    });
    // si encuentra, actualiza
    if (!current) {
      res
        .status(404)
        .json({ message: 'Film not found' });
    } else {
      try {
        // busca character por name
        const charCurrent = await Character.findOne({
          where: {
            name:character_name,
          },
        });
        if (!charCurrent) {
          res
            .status(403)
            .json({ message: 'Character invalid' });
        } else {
          // update base
          current.addCharacter(charCurrent);
          await current.save();
          res
            .status(200)
            .json(current);
        }
      } catch (error) {
        // si no encuentra, error
        res
          .status(501)
          .json(error);
      }
    }
  });

  return router;
}

module.exports = {
  createRouter,
};

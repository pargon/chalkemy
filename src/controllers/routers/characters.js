const { Router } = require('express');
const db = require('../../model');
const { QueryTypes, Sequelize } = require('@sequelize/core');
const { chkToken } = require('../midds/token');

function createRouter() {
  const router = Router();

  /**
   * @swagger
   * /v1/characters:
   *  post:
   *    tags:
   *    - "Characters"
   *    summary: "Add a new character"
   *    description: 
   *    consumes:
   *    - "application/json"
   *    parameters:
   *    - name: body
   *      description:
   *      in: body
   *      required: true
   *      type: string
   *      example: {name: String, imageurl: String, age: Integer, weight: Double, story: Text }
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Character created
   *      401:
   *        description: Invalid credential
   *      409:
   *        description: Record already exists
   */
  router.post('/', chkToken, async (req, res) => {

    // get modelo
    const Character = db.getModel('CharacterModel');
    const {
      name,
      imageurl,
      age,
      weight,
      story,
    } = req.body;

    // buscar por descripcion
    const current = await Character.findOne({
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
        const newCharacter = await Character.create({
          name,
          image: imageurl,
          age,
          weight,
          story,
        });

        // retorna
        res
          .status(200)
          .json(newCharacter);
      } catch (error) {
        res
          .status(501)
          .json(error);
      }
    }
  });
  /**
   * @swagger
   * /v1/characters:
   *  put:
   *    tags:
   *    - "Characters"
   *    summary: "Update a character by name"
   *    description: 
   *    consumes:
   *    - "application/json"
   *    parameters:
   *    - name: body
   *      description:
   *      in: body
   *      required: true
   *      type: string
   *      example: {name: String, imageurl: String, age: Integer, weight: Double, story: Text }
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Character updated
   *      401:
   *        description: Invalid credential
   *      404:
   *        description: Character not found
   */
  router.put('/', chkToken, async (req, res) => {

    // get modelo
    const Character = db.getModel('CharacterModel');
    const {
      name,
      imageurl,
      age,
      weight,
      story,
    } = req.body;

    // buscar por id
    const current = await Character.findOne({
      where: {
        name,
      },
    });
    // si encuentra, actualiza
    if (!current) {
      res
        .status(404)
        .json({ message: 'Character not found' });
    } else {
      try {
        // update base
        current.image = imageurl;
        current.age = age;
        current.weight = weight;
        current.story = story;
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
   * /v1/characters:
   *  delete:
   *    tags:
   *    - "Characters"
   *    summary: "Delete a character by name"
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
   *        description: Character deleted
   *      401:
   *        description: Invalid credential
   *      404:
   *        description: Character not found
   */
  router.delete('/', chkToken, async (req, res) => {

    // get modelo
    const Character = db.getModel('CharacterModel');
    const {
      name,
    } = req.body;

    // buscar por id
    const current = await Character.findOne({
      where: {
        name,
      },
    });
    // si encuentra, actualiza
    if (!current) {
      res
        .status(404)
        .json({ message: 'Character not found' });
    } else {
      try {
        // delete medio
        await current.destroy();

        res
          .status(200)
          .json({ message: 'Character deleted' });
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
   * /v1/characters/:id:
   *  get:
   *    tags:
   *    - "Characters"
   *    summary: Get character
   *    description:
   *    parameters:
   *    - in: params
   *      name: id
   *      schema:
   *        type: string
   *      description: The id of character
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Success
   *      401:
   *        description: Invalid credential
   *      404:
   *        description: Character not found
   */
  router.get('/:id', chkToken, async (req, res) => {
    const {
      id
    } = req.params;

    const Film = db.getModel('FilmModel');
    const Character = db.getModel('CharacterModel');
    const characters = await Character.findByPk(id, {
      include: [{
        model: Film,
        attributes: ["title"],
      }]
    });

    if (characters) {
      res
        .status(200)
        .json(characters);
    } else {
      res
        .status(404)
        .json({ message: 'Character not found' });
    }
  });
  /**
  * @swagger
  * /v1/characters:
  *  get:
  *    tags:
  *    - "Characters"
  *    summary: List characters
  *    description:
  *    parameters:
  *    - in: query
  *      name: name
  *      schema:
  *        type: string
  *      description: The name of character
  *    - in: query
  *      name: age
  *      schema:
  *        type: integer
  *      description: The age of character
  *    - in: query
  *      name: movies
  *      schema:
  *        type: integer
  *      description: The movie id 
  *    produces:
  *    - "application/json"
  *    responses:
  *      200:
  *        description: Success
  *      401:
  *        description: Invalid credential
  */
  router.get('/', chkToken, async (req, res) => {

    const {
      name,
      age,
      movies
    } = req.query;

    const Film = db.getModel('FilmModel');
    const Character = db.getModel('CharacterModel');

    // where condition Character
    let whereOptions = {};
    if (name && age) {
      whereOptions = { name, age };
    } else {
      if (name) {
        whereOptions = { name };
      } else {
        if (age) {
          whereOptions = { age };
        }
      }
    }

    // where condition Film    
    let whereOptionsFilm = {};
    if (movies) {
      whereOptionsFilm = { id: movies };
    }

    // find
    const characters = await Character.findAll({
      attributes: ["name", "image"],
      where: whereOptions,
      include: [{
        model: Film,
        attributes: ["title"],
        where: whereOptionsFilm
      }]
    });

    res
      .status(200)
      .json(characters);
  });

  return router;
}

module.exports = {
  createRouter,
};

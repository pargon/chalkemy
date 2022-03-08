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

    const { name,
      age,
      movies
    } = req.query;

    const conn = db.getModel('conn');

    let condition = 'where 1=1';
    if (name) {
      condition = `${condition} and name='${name}'`;
    }
    if (age) {
      condition = `${condition} and age=${age}`;
    }
    if (movies) {
      condition = `${condition} and extists (select * from films f where f.id=${movies} and f.id in(select filmId from filmcharacters fc where fc.characterId = c.id))`;
    }

    const Film = db.getModel('FilmModel');
    const Character = db.getModel('CharacterModel');
    function convert(obj) {
      let arr = [];
      for (o in obj) {
        arr.push(o);
      }
      return arr;
    }

    try {
      // const movies = 'f.title as `films.film`';
      const objchars = await conn.query(
        // `select name as 'char.name', c.image as 'char.image', age as 'char.age', weight as 'char.w', story as 'char.st', ${movies} `+
        // `select 'c'.'name', 'c'.'age', 'f'.'title' `
        `select c.id ` +
        `from characters as c ` +
        // `inner join filmcharacters fc on fc.characterId = c.id ` +
        // `inner join films as f on f.id = fc.filmId `+
        `${condition}`,
        {
          // model: Character,
          // nest: false,
          raw: true,
          type: QueryTypes.SELECT,
        });

      const idchars = convert(objchars);
      console.log(`id encontrados: ${idchars}`);


      let whereOptions = {};
      if (name) {
        whereOptions = { name };
      }
      // if (age) {
      //   whereOptions = whereOptions +  { age };
      // }
      // if (movies) {
      //   condition = `${condition} and extists (select * from films f where f.id=${movies} and f.id in(select filmId from filmcharacters fc where fc.characterId = c.id))`;
      // }


      //   where: {
      //     id: {
      //       [Sequelize.Op.in]: idchars
      //     }
      //   }
      // };

      console.log(`where: ${JSON.stringify(whereOptions)}`);

      const characters = await Character.findAll({
        attributes: ["name", "image"],
        where: whereOptions,
        include: [{
          model: Film,
          attributes: ["title"]
        }
        ]
      }
      );

      res
        .status(200)
        .json(characters);

    } catch (error) {
      console.log(error);
    }
  });

  return router;
}

module.exports = {
  createRouter,
};

const { Router } = require('express');
const db = require('../../model');
const { chkToken } = require('../midds/token');
const { chkAssociateGenre } = require('../midds/genre');

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
   *      example: {title: String, imageurl: String, rating: Integer, genre: String, type: [movie, serie]}
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Film created
   *      401:
   *        description: Invalid credential
   *      403:
   *        description: Genre invalid
   *      409:
   *        description: Record already exists
*/
  router.post('/', chkToken, chkAssociateGenre, async (req, res) => {

    // get modelo
    const Film = db.getModel('FilmModel');
    const {
      title,
      imageurl,
      rating,
      genre,
      type,
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
          image: imageurl,
          rating,
          genrekey: genre,
          type,
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
   *      example: {title: String, imageurl: String, rating: Integer, genre: String, type: [movie, serie]}
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Film updated
   *      401:
   *        description: Invalid credential
   *      403:
   *        description: Genre invalid
   *      404:
   *        description: Film not found
   */
  router.put('/', chkToken, chkAssociateGenre, async (req, res) => {

    // get modelo
    const Film = db.getModel('FilmModel');
    const {
      title,
      imageurl,
      rating,
      genre,
      type,
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
        current.genrekey = genre;
        current.type = type;
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
   * /v1/films/:id:
   *  get:
   *    tags:
   *    - "Films"
   *    summary: Get film
   *    description:
   *    parameters:
   *    - in: params
   *      name: id
   *      schema:
   *        type: string
   *      description: The id of film
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Success
   *      401:
   *        description: Invalid credential
   *      404:
   *        description: Film not found
   */
  router.get('/:id', chkToken, async (req, res) => {
    const {
      id
    } = req.params;

    const Film = db.getModel('FilmModel');
    const Character = db.getModel('CharacterModel');
    const films = await Film.findByPk(id, {
      include: [{
        model: Character,
        attributes: ["name"],
      },
      ]
    });

    if (films) {
      res
        .status(200)
        .json(films);
    } else {
      res
        .status(404)
        .json({ message: 'Film not found' });
    }
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
   *      example: {title: String, character: String}
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
      character,
    } = req.body;

    // buscar film por title
    const current = await Film.findOne({
      where: {
        title,
      },
    });

    console.log(`post film/char ${title} y ${character}`);

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
            name: character,
          },
        });
        if (!charCurrent) {
          res
            .status(403)
            .json({ message: 'Character invalid' });
        } else {
          console.log(`char curr: ${JSON.stringify(charCurrent)}`);
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

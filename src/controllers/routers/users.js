const { Router } = require('express');
const CryptoJS = require('crypto-js');
const db = require('../../model');
const { chkNewUser, login, chkAdmin, chkUserActive, sendmail } = require('../midds/users');
const { newToken, chkToken } = require('../midds/token');

function createRouter() {
  const router = Router();


  /**
 * @swagger
 * /v1/auth/register:
 *  post:
 *    tags:
 *    - "Users"
 *    summary: Add new user
 *    description:
 *    consumes:
 *    - "application/json"
 *    parameters:
 *    - name: body
 *      description:
 *      in: body
 *      required: true
 *      example: { userid: String, name: String, lastname: String, mail: String, password: String }
 *    produces:
 *    - "application/json"
 *    responses:
 *      200:
 *        description: User created
 */
  router.post('/register', chkNewUser, async (req, res) => {
    const { CRYPTO_KEY } = process.env;
    const User = db.getModel('UserModel');
    const {
      userid,
      name,
      lastname,
      mail,
      password,
    } = req.body;

    // encripta pass
    const passwordCryp = CryptoJS.AES.encrypt(password, CRYPTO_KEY).toString();

    try {
      // inserta base
      const newUser = await User.create({
        userid,
        name,
        lastname,
        mail,
        password: passwordCryp,
      },
      );

      // envio mail;
      sendmail(mail);

      // devuelvo ok el endpoint
      res.status(200).json(newUser);

    } catch (error) {
      global.console.log(error);
      res.status(406).json(error);
    }
  });
  /**
   * @swagger
   * /v1/auth/login:
   *  post:
   *    tags:
   *    - "Users"
   *    summary: User login to get a token
   *    description: 
   *    consumes:
   *    - "application/json"
   *    parameters:
   *    - name: body
   *      description:
   *      in: body
   *      required: true
   *      type: string
   *      example: {userid: String, password: String}
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Success
   *      404:
   *        description: User not found
   */
  router.post('/login', login, newToken, async (req, res) => {
    if (req.token) {
      return res.status(200).json({ token: req.token });
    }
    return res.status(404);
  });

  return router;
}

module.exports = {
  createRouter,
};

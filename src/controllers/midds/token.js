// const chalk = require('chalk');
const jwt = require('jsonwebtoken');

async function newToken(req, res, next) {
  const { JWT_PASS } = process.env;
  const { userid } = req.body;

  try {
    const newtoken = jwt.sign({ userid }, JWT_PASS, { expiresIn: '1h' });
    req.token = newtoken;
    next();
  } catch (error) {
    res
      .status(401)
      .json(
        { message: 'Invalid credential' },
      );
  }
}

async function chkToken(req, res, next) {
  console.log('token');
  const { JWT_PASS } = process.env;
  const bearer = req.headers.authorization;
  const token = (bearer !== undefined ? bearer : '')
    .replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, JWT_PASS);
    req.user = decoded;
    req.token = token;
    console.log( `usuario conectado ${JSON.stringify( req.user) } de ${JSON.stringify(decoded)}`);

    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: 'Invalid credential' });
  }
}

module.exports = {
  newToken,
  chkToken,
};

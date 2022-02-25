const db = require('../../model');

async function chkAssociateGenre(req, res, next) {
  const Genre = db.getModel('GenreModel');
  // buscar por name
  const current = await Genre.findOne({
    where: {
      name: req.body.genre,
    },
  });
  if (!current) {
    res
      .status(403)
      .send({ message: 'Genre invalid' });
  } else {
    next();
  }
}

module.exports = {
  chkAssociateGenre,
};

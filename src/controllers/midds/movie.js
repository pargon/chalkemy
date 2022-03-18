

async function chkOrderQuery(req, res, next) {
  const {
    order
  } = req.query;

  if (order) {
    if (order == 'ASC' || order == 'DESC') {
      next();
    } else {
      res
        .status(406)
        .send({ message: 'Order invalid' });
    }
  } else {
    next();
  }
}

module.exports = {
  chkOrderQuery,
};

// const chalk = require('chalk');
const CryptoJS = require('crypto-js');
const sgMail = require('@sendgrid/mail');
const db = require('../../model');

async function chkNewUser(req, res, next) {

  if (!req.body.mail) {
    res
      .status(406)
      .send({ message: 'Invalid Mail' });
  }

  const User = db.getModel('UserModel');
  // buscar por mail
  const current = await User.findOne({
    where: {
      mail: req.body.mail,
    },
  });
  if (current) {
    res
      .status(403)
      .send({ message: 'Record already exists' });
  } else {
    // buscar por userid
    const current2 = await User.findOne({
      where: {
        userid: req.body.userid,
      },
    });
    if (current2) {
      res
        .status(403)
        .send({ message: 'Record already exists' });
    } else {
      next();
    }
  }
}

async function login(req, res, next) {
  const { CRYPTO_KEY } = process.env;
  const User = db.getModel('UserModel');
  console.log(JSON.stringify(req.body));

  // buscar por userid
  const current = await User.findOne({
    where: {
      userid: req.body.userid,
    },
  });
  if (current) {
    // desencripta pass guardado
    const bytesPass = CryptoJS.AES.decrypt(current.password, CRYPTO_KEY);
    const password = bytesPass.toString(CryptoJS.enc.Utf8);

    // coinciden pass encriptados
    if (password === req.body.password) {

      // guarda en json el user
      req.user = { userid: current.userid };

      next();

    } else {
      res
        .status(404)
        .send({ message: 'User not found' });
    }
  } else {
    res
      .status(404)
      .send({ message: 'User not found' });
  }
}

async function sendmail(mail) {

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: mail,
    from: process.env.SENDGRID_API_SENDER,
    subject: 'Welcome to DB Disney Alkemy',
    text: 'This is a automatic message. Not response',
    html: '<strong>and thank you for register</strong>',
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log(`mail enviado a: ${mail}`)
    }, error => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body)
      }
    });
}

module.exports = {
  chkNewUser,
  login,
  sendmail,
};

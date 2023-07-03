const express = require('express');
const session = require('express-session');
const router = express.Router();
const app = express();

const bcrypt = require('bcrypt');
require('dotenv').config();

const db = require('./database').DB();
const port = process.env.PORT || 5000;

app.use(express.static('static'));
app.use(express.urlencoded({
  extended: true
}));
app.use(session({
  secret: 'a secret token that should be apart of a .env file!',
  resave: true,
  cookie: {maxAge: 1000*60*60*24 },
  saveUninitialized: true
}));

const render = require('./template');
const login_rend = require('./templates/login')
const register_rend = require('./templates/register')

router.route("/").get((req, res, next) => {
  if (req.session.auth) {
    res.redirect(`/${req.session.username}`);
  } else {
    res.redirect('/login');
  }
});

router.route("/login").get((req, res, next) => {
  res.send(render("Login", login_rend()));
}).post((req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const user = db.getUser(username);
    let authenticated = null;

    if (user) {
      authenticated = bcrypt.compareSync(password, user.password);
    }

    if (authenticated) {
      console.log(authenticated);
      req.session.auth = true;
      req.session.username = username;
      // redirect
      res.redirect(`/${username}`);
    } else {
      res.send(render("Login", login_rend('Incorrect Username or Password.')));
    }
  } else {
    res.send(render("Login", login_rend('Please enter a Username and Password.')));
  }
});

router.route("/register").get((req, res, next) => {
  res.send(render("register", register_rend()));
}).post((req, res, next) => {

  const username = req.body.username;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const password = req.body.password;

  const success = db.newUser(username, firstname, lastname, bcrypt.hashSync(password, 10));
  if (success) {
    req.session.auth = true;
    req.session.username = username;
    // redirect
    res.redirect(`/${username}`);
  } else {
    res.send(render("register", register_rend('Username already taken.')));
  }
});

router.route("/:user").get((req, res, next) => {
  res.send(render("user", "w3eb"));
});

router.route("/:user/:item").get((req, res, next) => {
  res.send(render("item", "w3eb"));
});

app.use("/", router);

app.listen(port, () => console.log(`on port ${port}`));

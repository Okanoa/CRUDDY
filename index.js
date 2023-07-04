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
const login_rend = require('./templates/login');
const register_rend = require('./templates/register');
const user_rend = require('./templates/user');
const item_rend = require('./templates/item');

const navbar_rend = require('./templates/navbar')

router.route("/").get((req, res) => {
  if (req.session.auth) {
    res.redirect(`/${req.session.username}`);
  } else {
    res.redirect('/login');
  }
});

router.route("/login").get((req, res) => {
  if (req.session.auth) {
    res.redirect(`/${req.session.username}`);
    return;
  }

  res.send(render("Login", login_rend()));
}).post((req, res) => {

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
      res.redirect(`/${username}`);
    } else {
      res.send(render("Login", login_rend('Incorrect Username or Password.')));
    }
  } else {
    res.send(render("Login", login_rend('Please enter a Username and Password.')));
  }
});

router.route("/logout").delete((req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  // this should refresh the user's page...
  res.send('');
});

router.route("/register").get((req, res) => {
  if (req.session.auth) {
    res.redirect(`/${req.session.username}`);
    return;
  }

  res.send(render("Register", register_rend()));
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
    res.send(render("Register", register_rend('Username already taken.')));
  }
});

router.route("/:user").get((req, res) => {
  res.send(render(
    `${req.params.user}'s Inventory`,
    user_rend(req.session.auth, db.getUser(req.params.user), req.session.username == req.params.user),
    navbar_rend(req.session.auth, req.session.username)
  ));
});

router.route("/:user/new").get((req, res) => {
  res.send(render("Create Item", "w3eb"));
}).post();

router.route("/:user/:item").get((req, res) => {
  res.send(render("put item name here", "w3eb", navbar_rend(req.session.auth, req.session.username)));
}).put().delete();

app.use("/", router);
app.listen(port, () => console.log(`on port ${port}`));

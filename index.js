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

const verifyOwnership = (req) => {
  if (req.session.auth && req.session.username == req.params.user) {
    return true
  }
}

router.route("/:user/new").get((req, res) => {
  res.send(render("Create Item", item_rend("new", `/${req.params.user}/new`, null, verifyOwnership(req))));
}).post((req, res) => {
  if (verifyOwnership(req)) {
    let usr = db.getUser(req.session.username);

    usr.newItem(req.body.name,req.body.description,req.body.quantity);

    usr.serialize();
    res.redirect(`/${req.session.username}`);
    return;
  }
});

router.route("/:user/:item/edit").get((req, res) => {
  const usr = db.getUser(req.params.user)  
  res.send(item_rend("edit", `/${req.params.user}/${req.params.item}`, usr.items[req.params.item], verifyOwnership(req)));
})

router.route("/:user/:item").get((req, res) => {
  const usr = db.getUser(req.params.user)  
  res.send(render(
    "Item",
    item_rend("view", `/${req.params.user}/${req.params.item}`, usr.items[req.params.item], verifyOwnership(req), req.params.user),
    navbar_rend(req.session.auth, req.session.username)
  ));
}).put((req, res) => {
  if (verifyOwnership(req)) {
    let usr = db.getUser(req.session.username);
console.log("puttty")
    usr.setItem(req.params.item, req.body.name,req.body.description,req.body.quantity);

    usr.serialize();
    res.redirect(`/${req.session.username}`);
    return;
  }
}).delete((req, res) => {
  if (verifyOwnership(req)) {
    let usr = db.getUser(req.session.username);

    console.log("del")
    usr.delItem(req.params.item);

    usr.serialize();
    res.redirect(301, `/${req.session.username}`);
    return;
  }
});

app.use("/", router);
app.listen(port, () => console.log(`on port ${port}`));

const express = require('express');
const app = express();

const db = require('./database').DB();

const path = require('path');
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.json());

db.newUser("jsmith","john", "smith", "nothashed")

let usr = db.getUser("bob");
usr.newItem("pickle", "really nasty no good food!", 1);

usr.serialize();

// loginpage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
});

app.get('/:user', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
});

app.get('/:user', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
});

// if I had more time it would be a good idea to setup a subdomain such as api.page.com/req
app.get('/api/:user', (req, res) => {
  res.json(db.getUser(req.params.user));
});

app.get('/api/:user/:item', (req, res) => {
  res.send(db.getUser(req.params.user).items[req.params.item])
});

app.listen(port, () => console.log(`on port ${port}`));

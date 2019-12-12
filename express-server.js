const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

const { emailLookupHelper, loginHelper, urlsForUser, generateShortURL, generateRandomID } = require('./helpers.js');

const PORT = 8080;
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ["the", "legend", "of", "zelda", "changed", "my", "life"],
  maxAge: 24 * 60 * 60 * 1000
}));

// DATABASE OBJECTS
const urlDatabase = {};
const usersDatabase = {};

// GET REQUESTS
app.get("/", (req, res) => {
  if (req.session.userID) {
    res.redirect("/urls");
  } else {
    res.redirect("urls/login");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const userID = req.session.userID;
  const userURLs = urlsForUser(userID, urlDatabase);
  let templateVars = {
    user: usersDatabase[userID],
    urls: userURLs
  };
  res.render("urls-index", templateVars);
});

app.get("/urls/new", (req,res) => {
  if (req.session.userID) {
    const userID = req.session.userID;
    let templateVars = {
      user: usersDatabase[userID],
      urls: urlDatabase
    };
    res.render("urls-new", templateVars);
  } else {
    res.redirect("/urls/login");
  }
});

app.get("/urls/register", (req, res) => {
  const userID = req.session.userID;
  let templateVars = {
    user: usersDatabase[userID],
    urls: urlDatabase
  };
  if (userID) {
    res.redirect("/urls");
  } else {
    res.render("urls-register", templateVars);
  }
});

app.get("/urls/login", (req, res) => {
  const userID = req.session.userID;
  let templateVars = {
    user: usersDatabase[userID],
    urls: urlDatabase
  };
  if (userID) {
    res.redirect("/urls");
  } else {
    res.render("urls-login", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.userID;
  const userURLs = urlsForUser(userID, urlDatabase);
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send('This TinyURL does not exist');
  }
  let templateVars = {
    user: usersDatabase[userID],
    urls: urlDatabase,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };
  if (userURLs[req.params.shortURL]) {
    res.render("urls-show", templateVars);
  } else {
    res.status(403).send('You do not have access to this TinyURL.');
  }
});

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send('This TinyURL does not exist');
  } else {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  }
});

// POST REQUESTS
app.post("/urls", (req, res) => {
  const shortURL = generateShortURL();
  urlDatabase[shortURL] = {};
  urlDatabase[shortURL].longURL = req.body.longURL;
  urlDatabase[shortURL].userID = req.session.userID;
  res.redirect(`./urls/${shortURL}`);
});

app.post("/register", (req, res) => {
  const userID = generateRandomID();
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  usersDatabase[userID] = {};
  usersDatabase[userID].id = userID;
  if (req.body.email.length === 0 || req.body.password.length === 0) {
    res.status(400).send('Must enter value into field.');
  } else if (emailLookupHelper(req.body.email, usersDatabase)) {
    res.status(400).send('User account with that email already exists.');
  } else {
    usersDatabase[userID].email = req.body.email;
    usersDatabase[userID].password = hashedPassword;
    req.session.userID = userID;
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  if (emailLookupHelper(req.body.email, usersDatabase)) {
    const requestPassword = req.body.password;
    let userID;
    if (requestPassword) {
      userID = loginHelper(req.body.email, requestPassword, usersDatabase);
    } else {
      res.status(403).send('Incorrect password for that user account.');
    }
    if (userID) {
      req.session.userID = userID;
      res.redirect("/urls");
    } else {
      res.status(403).send('Incorrect password for that user account.');
    }
  } else {
    res.status(403).send('No user account with that email address.');
  }
});

app.post("/logout", (req,res) => {
  req.session = null;
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const userID = req.session.userID;
  const userURLs = urlsForUser(userID, urlDatabase);
  if (userURLs[req.params.shortURL]) {
    urlDatabase[req.params.shortURL].longURL = req.body.updateURL;
    res.redirect("/urls");
  } else {
    res.status(403).send('You do not have access to this TinyURL.');
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.userID;
  const userURLs = urlsForUser(userID, urlDatabase);
  if (userURLs[req.params.shortURL]) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.status(403).send('You do not have access to this TinyURL.');
  }
});

// LISTENERS
app.listen(PORT, () => {
  console.log(`TinyApp Server running!\nTinyApp listening on port ${PORT}!`);
});

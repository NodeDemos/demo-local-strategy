'use strict';
/**
 * Step 1
 * Protect endpoint with Passport Local strategy using a **hardcoded** UN/PW
 */

const express = require('express');
const passport = require('passport');

const { Strategy: LocalStrategy } = require('passport-local');

const { PORT } = require('./config');

const app = express();
app.use(express.static('public'));
app.use(express.json());

// ===== Public endpoint =====
app.get('/api/welcome', function (req, res) {
  res.json({message: 'Hello!'});
});

// ===== Define and create a strategy =====
const localStrategy = new LocalStrategy((username, password, done) => {
  try {

    if (username !== 'bobuser') {
      console.log('Incorrect username');
      return done(null, false);
    }

    if (password !== 'baseball') {
      console.log('Incorrect password');
      return done(null, false);
    }

    const user = { username, password };
    done(null, user);

  } catch (err) {
    done(err);
  }
});

passport.use(localStrategy);
const localAuth = passport.authenticate('local', { session: false, failWithError: true });

// ===== Protected endpoint =====
app.post('/api/login', localAuth, (req, res, next) => {
  console.log(`${req.user.username} ${req.user.password} successfully logged in.`);
  res.json({
    message: 'Rosebud',
    username: req.user.username
  });
});

// Catch-all 404
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.code = 404;
  next(err);
});

// Catch-all Error handler
app.use((err, req, res, next) => {
  res.status(err.code || 500);
  res.json({ message: err.message });
});

app.listen(PORT, function () {
  console.log(`app listening on port ${this.address().port}`);
});


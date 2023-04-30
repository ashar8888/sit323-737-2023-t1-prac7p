const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const winston = require('winston'); //using winston logger

//JWT web Token for Authorization 
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const app = express(); //using express for defining apis

app.use(cors()); //using cors for reading data 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // uisng body parser to parse text to json

// Set up the Passport.js middleware
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_secret_key'
};

const strategy = new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  // check if user exists in a local user array
  const users = [
    { id: 1, username: 'user', password: 'password' },
    { id: 2, username: 'my', password: '123' }
  ];
  const user = users.find(u => u.id === jwtPayload.id);
  if (user) {
    return done(null, user);
  } else {
    return done(null, false);
  }
});
app.use(passport.initialize());
passport.use(strategy);
app.get('/' , (req,res) => {
  // const indexPath = path.join('/index.html');
  res.sendFile(__dirname + '/index.html');
})

// Authenticate the user and generate a JWT token
// creating a login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // check if user exists in a local user array
    const users = [
      { id: 1, username: 'user', password: 'password' },
      { id: 2, username: 'my', password: '123' }
    ];
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      // generate JWT token
      const payload = { id: user.id };
      const token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({ message: 'success', token: token });
    } else {
      res.status(401).json({ message: 'unauthorized' });
    }
  });
  
  // creating a protected route
  app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ message: 'success', user: req.user });
  });

// adding logger  

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-microservice' },
    transports: [
    new winston.transports.Console({
    format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
   });

// Addition endpoint
app.post('/add', (req, res) => {
     const { num1, num2 } = req.body;
     logger.log({
        level: 'info',
        message: `New add operation requested: ${num1} + ${num2}`,
      });
    if (num1 == null|| num2 == null) {
      res.status(400).json({ error: 'Invalid input parameters' });
    } else {
      const result = num1 + num2;
      res.json({ result });
    }
  });

// Subtraction endpoint
app.post('/subtract', (req, res) => {
  const { num1, num2 } = req.body;
  logger.log({
    level: 'info',
    message: `New add operation requested: ${num1} + ${num2}`,
  });
  if (num1 == null|| num2 == null) {
    res.status(400).json({ error: 'Invalid input parameters' });
  } else {
    const result = num1 - num2;
    res.json({ result });
  }
});

// Multiplication endpoint
app.post('/multiply', (req, res) => {
  const { num1, num2 } = req.body;
  logger.log({
    level: 'info',
    message: `New add operation requested: ${num1} + ${num2}`,
  });
  if (num1 == null|| num2 == null) {
    res.status(400).json({ error: 'Invalid input parameters' });
  } else {
    const result = num1 * num2;
    res.json({ result });
  }
});

// Division endpoint
app.post('/divide', (req, res) => {
  const { num1, num2 } = req.body;
  logger.log({
    level: 'info',
    message: `New add operation requested: ${num1} + ${num2}`,
  });
  if (num1 == null|| num2 == null) {
    res.status(400).json({ error: 'Invalid input parameters' });
  } else if (num2 === 0) {
    res.status(400).json({ error: 'Division by zero is not allowed' });
  } else {
    const result = num1 / num2;
    res.json({ result });
  }
});

const port = 3000; //defining port

app.listen(port, () => {
  console.log(`Calculator microservice listening at http://localhost:${port}`);
});


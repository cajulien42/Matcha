
const config = require('config');
const debug = require('debug')('index');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const requestIp = require('request-ip');
const users = require('./src/routes/users');
const reqIp = require('./src/middleware/locate');
const locate = require('./src/routes/locate');
const notifications = require('./src/routes/notifications');
const tags = require('./src/routes/tags');
const relationships = require('./src/routes/relationships');
const auth = require('./src/routes/auth');
const photos = require('./src/routes/photos');
const initdb = require('./src/init/initDb');
const seed = require('./src/init/createSeed');
const error = require('./src/middleware/error');

// console.log = console.warn = console.error = () => {}; 
const app = express();

if (!config.get('jwtPrivateKey')) {
  debug('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

app.use(helmet());
app.use(express.static('public'));
app.use(morgan('tiny'));
app.use(cors());

app.use(requestIp.mw());

app.use(reqIp);
app.use('/api/photos', photos);
app.use('/api/locate', locate);
app.use('/api/users', users);
app.use('/api/notifications', notifications);
app.use('/api/tags', tags);
app.use('/api/relationships', relationships);
app.use('/api/auth', auth);

app.use(error);
app.use((req, res, next) => {
  res.status(404);

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: '404 Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('404 Not found');
});


// seed()
//   .then(() => {
//     const port = 4000;
//     app.listen(port, () => debug(`Listening on port ${port}...`));
//   })
//   .catch(err => debug(err));


initdb()
  .then(() => {
    const port = 4000;
    app.listen(port, () => debug(`Listening on port ${port}...`));
  })
  .catch(err => debug(err));

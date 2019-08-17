
const config = require('config');
const debug = require('debug')('app:debug');
const users = require('./routes/users');
const home = require('./routes/home');
const auth = require('./routes/auth');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const populate = require('./database/users');

if (!config.get('jwtPrivateKey')) {
  debug('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

app.use(express.static('public'));
app.use(morgan('tiny'));
app.set('view engine', 'pug');
app.use(helmet());

app.use('/', home);
app.use('/api/users', users);
app.use('/api/auth', auth);

populate()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => debug(`Listening on port ${port}...`));
  })
  .catch(err => debug(err));



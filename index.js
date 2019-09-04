
const config = require('config');
const debug = require('debug')('app:debug');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const users = require('./routes/users');
const auth = require('./routes/auth');
const populate = require('./database/users');
const error = require('./middleware/error');

const app = express();

if (!config.get('jwtPrivateKey')) {
  debug('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

app.set('view engine', 'pug');

app.use(helmet());
app.use(express.static('public'));
app.use(morgan('tiny'));

app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error);

populate()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => debug(`Listening on port ${port}...`));
  })
  .catch(err => debug(err));

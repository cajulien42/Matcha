
const debug = require('debug')('app:debug');
const config = require('config');
const apoc = require('apoc');
const neo4j = require('neo4j-driver').v1;
const users = require('./routes/users');
const home = require('./routes/home');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

app.set('view engine', 'pug');
app.use(helmet());
app.use('/api/users', users);
app.use('/', home);
app.use(express.static('public'));
app.use(morgan('tiny'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
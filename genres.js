const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();

const genres = [
  {id: 1, name: 'horror'},
  {id: 2, name: 'action'},
  {id: 3, name: 'science-fiction'},
  {id: 4, name: 'biopic'},
  {id: 5, name: 'documentary'},
  {id: 6, name: 'erotic'},
  {id: 7, name: 'fantasy'}
];

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(6).required()
  };

  return Joi.validate(genre, schema);
}

router.use(express.json()); //populate req.body
router.use(express.urlencoded({ extended: true })); //key=value&...


router.post('/', (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };
  genres.push(genre);
  res.send(genre);
});

router.get('/', (req, res) => {
  res.send(genres);
});

router.get('/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if(!genre) return res.status(404).send('genre not found');
  res.send(genre);
});

router.put('/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if(!genre) return res.status(404).send('genre not found');

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  genre.name = req.body.name;
  res.send(genre);
});

router.delete('/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if(!genre) return res.status(404).send('genre not found');

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

module.exports = router;

const debug = require('debug')('init:orientation');
const _ = require('lodash');
const Orientation = require('../models/orientationClass');

const orientations = [
  'm_hetero',
  'm_homo',
  'm_bi',
  'm_pan',
  'f_hetero',
  'f_homo',
  'f_bi',
  'f_pan',
];

function populateOrientations() {
  return (orientations.reduce(async (prev, next) => {
    await prev;
    return new Orientation({ id: next }).createOrientation();
  }, Promise.resolve()));
}

module.exports = populateOrientations;

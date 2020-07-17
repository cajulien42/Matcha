
const debug = require('debug')('init:relationships');
const RelationShip = require('../models/relationshipsClass');
const orientationsRelationships = require('../util/orientationsRelationships');


function populateOrientationsRelationships() {
  return (orientationsRelationships.reduce(async (prev, next) => {
    await prev;
    return new RelationShip(next).createRelationship();
  }, Promise.resolve()));
}

module.exports = populateOrientationsRelationships;

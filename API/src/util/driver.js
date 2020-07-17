const neo4j = require('neo4j-driver').v1;

module.exports = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'),
  {
    MaxConnectionLifetime: 1800000,
    MaxConnectionPoolSize: 500,
    ConnectionAcquisitionTimeout: 300000,
    ConnectionTimeout: 10000,
    MaxTransactionRetryTime: 15000,
  });

const debug = require('debug')('app:debug');
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();

function populateUsers() {
  session.run('MATCH p=()-[r]->() DELETE p');
  session.run('MATCH (n) DELETE n');

  const users = [
    {
      username: 'Jean',
      password: 'B913D5BBB8E461C2C5961CBE0EDCDADFD29F068225CEB37DA6DEFCF89849368F8C6C2EB6A4C4AC75775D032A0ECFDFE8550573062B653FE92FC7B8FB3B7BE8D6',
      email: 'jean@gmail.com',
      birthyear: '1715'
    },
    {
      username: 'Bob',
      password: 'B913D5BBB8E461C2C5961CBE0EDCDADFD29F068225CEB37DA6DEFCF89849368F8C6C2EB6A4C4AC75775D032A0ECFDFE8550573062B653FE92FC7B8FB3B7BE8D6',
      email: 'marley@gmail.com',
      birthyear: '1879'
    },
    {
      username: 'Pilip',
      password: 'B913D5BBB8E461C2C5961CBE0EDCDADFD29F068225CEB37DA6DEFCF89849368F8C6C2EB6A4C4AC75775D032A0ECFDFE8550573062B653FE92FC7B8FB3B7BE8D6',
      email: 'pilip@gmail.com',
      birthyear: '1998'
    },
    {
      username: 'Claude',
      password: 'B913D5BBB8E461C2C5961CBE0EDCDADFD29F068225CEB37DA6DEFCF89849368F8C6C2EB6A4C4AC75775D032A0ECFDFE8550573062B653FE92FC7B8FB3B7BE8D6',
      email: 'claude@gmail.com',
      birthyear: '2018'
    },
  ];

  users.forEach((user) => {
    let resultPromise = session.run(
      'CREATE (n:User {username: $username, password: $password, email: $email, birthyear: $birthyear}) RETURN n',
      {username: user.username, password: user.password, email: user.email, birthyear: user.birthyear}
    );
    resultPromise.then(result => {
      session.close();
    
      const singleRecord = result.records[0];
      const node = singleRecord.get(0);
    
      debug('user:', node.properties);
    });
  });
};

module.exports = populateUsers;
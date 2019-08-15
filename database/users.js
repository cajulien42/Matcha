const debug = require('debug')('app:debug');
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();
const bcrypt = require('bcrypt');

function populateUsers() {
  session.run('MATCH p=()-[r]->() DELETE p');
  session.run('MATCH (n) DELETE n');

  const users = [
    {
      username: 'Jean',
      password : 'test',
      email: 'jean@gmail.com',
      birthyear: '1715'
    },
    {
      username: 'Bob',
      password : 'test',
      email: 'marley@gmail.com',
      birthyear: '1879'
    },
    {
      username: 'Pilip',
      password : 'test',
      email: 'pilip@gmail.com',
      birthyear: '1998'
    },
    {
      username: 'Claude',
      password : 'test',
      email: 'claude@gmail.com',
      birthyear: '2018'
    },
  ];

  users.forEach(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
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

  let resultPromise = session.run(
    'MATCH (a:User), (b:User) WHERE a.username=$a_username AND b.username=$b_username CREATE (a)-[r:LIKES]->(b) RETURN r',
    {a_username: 'Claude', b_username: 'Bob'}
  );
  resultPromise.then(result => {
    session.close();
  });
};



module.exports = populateUsers;
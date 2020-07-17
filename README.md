# MATCHA

2nd Web project for 42 Paris school.

<b>Summary:</b> We had to create, in the language of our choice, a dating site. Interaction between users is the heart of the project!

(Group project carried out with [Camille Julien](https://github.com/cajulien42))

## What is Matcha ?

A user must be able to register, connect, fill his/her profile, search and look into the profile of other users, like them, and chat with those that “liked” back. No ORM, validators or User Accounts Manager were allowed.

We used Node and Express for the back, Neo4j for the database and Reactjs for the front-end.

## Installation

```
neo4j start
./Matcha/API/npm i 
npm run dev //OR
npm run start //for production environment
./Matcha/Client/npm i
npm start
./Matcha/server/npm i
npm start
```

<ul>
  <li>The Client side is launched on the port 3000</li>
  <li>The API is launched on the port 4000</li>
  <li>And the sockets are launched on the port 5000</li>
</ul>

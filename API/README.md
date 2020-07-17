**API basics:**
```
Production mode: npm start
Dev mode : npm run dev (only once, after DB is online, just type 'rs' in the terminal to restart the API)
Run tests: npm test (after one of the above)
```

**DEBUG** 
* *Edit API/scripts/apiDev.sh, instructions are given in the comments*


**ROUTES ACCESS:**
```
      ROUTES                    |         CREDENTIALS          |    DESCRIPTION                                      |                              |
':' means variable              |   NONE: nothing needed       |
                                |   AUTH: x-auth-token         |
                                |   IDENTIFY: request target   |
                                |   must match username in JWT |

                                          */API/users*    

GET /:value                     | NONE (will only return public| returns :value list
                                | properties though)           | from db

GET /sendReset/:username       | NONE                         | send reset pwd mail
                                |                              | to :username

GET /reset/:username/:token     | NONE                         | erase token and returns 
                                |                              | true if valid token
                                
GET /confirm/:username/:token   | NONE                         | confirms new User email

GET /infos/:username            | AUTH && (IDENTIFY || ADMIN)  | get user infos

GET /matches/:username          | AUTH && (IDENTIFY || ADMIN)  | get :username's matches

GET /suggestions/:username      | AUTH && (IDENTIFY || ADMIN)  | get suggesion list for
                                |                              | :username

GET /:username/commonTags       | AUTH && ADMIN                | get list of users being  
                                |                              | one or more thing
                                |                              | :username looks for

GET /:username/likedBy          | AUTH && (IDENTIFY || ADMIN)  | get list of users who
                                |                              | likes :username


GET /:username/visits           | AUTH && (IDENTIFY || ADMIN)  | get list of users who
                                |                              | visited :username's profil

GET /:username/score            | AUTH && (IDENTIFY || ADMIN)  | get :username's popularity

GET /:username/conversations    | AUTH && (IDENTIFY || ADMIN)  | get :username's
                                |                              | conversation history

GET /:username/BLOCK            | AUTH && (IDENTIFY || ADMIN)  | get list of users blocked
                                |                              | by :username

GET /:username/:relation        | AUTH && (IDENTIFY || ADMIN)  | get undirectional list of
                                |                              | :relations for :username

POST /                          | NONE                         | create new user
                                |                              | body: { userData }

POST /:username/visit/:target   | AUTH && (IDENTIFY || ADMIN)  | create visit relation
                                |                              | between :username
                                |                              | and :target

POST /:username/chat            | AUTH && (IDENTIFY || ADMIN)  | body:  {target, message }
                                |                              | register message in conv

PUT /update/:username           | AUTH && (IDENTIFY || ADMIN)  | update user with                                          |                              | additional and/or
                                |                              | modified infos
                                |                              | body: { newUserData }

PUT /connect/:username          | AUTH && (IDENTIFY || ADMIN)  | update last connection
                                |                              | date for :username

DELETE /:username               | AUTH && ADMIN                | delete :username

DELETE /delete/duplicates       | AUTH && ADMIN                | delete users duplicates
                                |                              | (DEV ONLY)


                                        */API/notifications*

GET /:username                  | AUTH && (IDENTIFY || ADMIN)  | get :username notifs

POST /create                    | AUTH && (IDENTIFY || ADMIN)  | create notification in db
                                |                              | body : {type, emitter,
                                |                              | receiver }

PUT /read                       | AUTH                         | register notification as
                                | (NEED TO FIGURE OUT SOME     | read. body {notifId}
                                | IDENTIFICATION PROTOCOL HERE)|


                                        */API/relationships*

GET /type/:type                 | AUTH && ADMIN                |
GET /mutual                     | AUTH && ADMIN                |
GET/matches/:relation           | AUTH && ADMIN                |
POST /create                    | AUTH && ADMIN                |
POST /toggle                    | AUTH && (IDENTIFY || ADMIN)  | toggle relationship
                                |                              | body : {node_a, node_b,
                                |                              | relation }
DELETE /delete/relation         | AUTH && ADMIN                |
DELETE /delete/node             | AUTH && ADMIN                |
DELETE /delete/type             | AUTH && ADMIN                |
DELETE /delete/node/type        | AUTH && ADMIN                |
DELETE /delete/duplicate        | AUTH && ADMIN                | (DEV ONLY)


                                        */API/tags*

GET /list/:value                | AUTH && ADMIN                |
GET /:id                        | AUTH && ADMIN                |
POST /                          | AUTH && ADMIN                |
PUT /:id                        | AUTH && ADMIN                |
DELETE /:id                     | AUTH && ADMIN                |
DELETE /duplicates              | AUTH && ADMIN                | (DEV ONLY)


                                        */API/auth*

POST /                          | NONE                         | authenticate user
                                |                              | body: {username, password}


``

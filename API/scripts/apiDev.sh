neo4j start &&
sleep 15 &&
export matcha_jwtPrivateKey=aSecureKey &&
# DEBUG=models:relationships,index,init:* nodemon index.js
# DEBUG=init:*,middleware:*,models:*,routes:*,validation:*,tests:*,index nodemon index.js
DEBUG=init:*,middleware:*,index,routes:*,models:*,tests:* nodemon index.js
# DEBUG=index,init:* nodemon index.js
# DEBUG=index,routes:* nodemon index.js

#DEBUG USAGE : DEBUG=DIR1:FILE1,DIR2:FILE2... do not include 'Class' if the filename contain it
# EXAMPLES :
#   TO SEE EVERYTHING
#     init:*,middleware:*,models:*,routes:*,validation:*
#   TO SEE ROUTES
#     routes:*
#   TO SEE EVERYTHING REGARDING TAGS
#     middleware:error,models:tag,routes:tags,validation:tags

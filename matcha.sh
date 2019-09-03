# app:startup,
# app:model_user,
# app:route_user,
# app:middleware_auth,
# app:middleware_error,
# app:middleware_admin

export matcha_jwtPrivateKey=aSecureKey
DEBUG=app:startup,app:model_user,app:route_user,app:middleware_auth,app:middleware_error,app:middleware_admin,app:debug nodemon index.js

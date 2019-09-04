const userTemplate = require('./usertemplate');

const l = userTemplate.username.invalid.length;
const invalidUserData = [];
for (let i = 0; i < userTemplate.username.valid.length; i += 1) {
  invalidUserData.push({
    username: userTemplate.username.invalid[i],
    firstname: userTemplate.firstname.valid[i % l],
    lastname: userTemplate.lastname.valid[i % l],
    password: userTemplate.password.valid[i % l],
    email: userTemplate.email.valid[i % l],
    birthyear: userTemplate.birthyear.valid[i % l],
    optional: userTemplate.optional.valid[i % l],
    isAdmin: userTemplate.isAdmin.valid[i % 2],
  });
}

for (let i = 0; i < l; i += 1) {
  invalidUserData.push({
    username: userTemplate.username.valid[i % l],
    firstname: userTemplate.firstname.invalid[i],
    lastname: userTemplate.lastname.valid[i % l],
    password: userTemplate.password.valid[i % l],
    email: userTemplate.email.valid[i % l],
    birthyear: userTemplate.birthyear.valid[i % l],
    optional: userTemplate.optional.valid[i % l],
    isAdmin: userTemplate.isAdmin.valid[i % 2],
  });
}

for (let i = 0; i < l; i += 1) {
  invalidUserData.push({
    username: userTemplate.username.valid[i % l],
    firstname: userTemplate.firstname.valid[i % l],
    lastname: userTemplate.lastname.invalid[i],
    password: userTemplate.password.valid[i % l],
    email: userTemplate.email.valid[i % l],
    birthyear: userTemplate.birthyear.valid[i % l],
    optional: userTemplate.optional.valid[i % l],
    isAdmin: userTemplate.isAdmin.valid[i % 2],
  });
}

for (let i = 0; i < l; i += 1) {
  invalidUserData.push({
    username: userTemplate.username.valid[i % l],
    firstname: userTemplate.firstname.valid[i % l],
    lastname: userTemplate.lastname.valid[i % l],
    password: userTemplate.password.invalid[i],
    email: userTemplate.email.valid[i % l],
    birthyear: userTemplate.birthyear.valid[i % l],
    optional: userTemplate.optional.valid[i % l],
    isAdmin: userTemplate.isAdmin.valid[i % 2],
  });
}

for (let i = 0; i < l; i += 1) {
  invalidUserData.push({
    username: userTemplate.username.valid[i % l],
    firstname: userTemplate.firstname.valid[i % l],
    lastname: userTemplate.lastname.valid[i % l],
    password: userTemplate.password.valid[i % l],
    email: userTemplate.email.invalid[i],
    birthyear: userTemplate.birthyear.valid[i % l],
    optional: userTemplate.optional.valid[i % l],
    isAdmin: userTemplate.isAdmin.valid[i % 2],
  });
}

for (let i = 0; i < l; i += 1) {
  invalidUserData.push({
    username: userTemplate.username.valid[i % l],
    firstname: userTemplate.firstname.valid[i % l],
    lastname: userTemplate.lastname.valid[i % l],
    password: userTemplate.password.valid[i % l],
    email: userTemplate.email.invalid[i % l],
    birthyear: userTemplate.birthyear.valid[i % l],
    optional: userTemplate.optional.valid[i % l],
    isAdmin: userTemplate.isAdmin.valid[i % 2],
  });
}

for (let i = 0; i < l; i += 1) {
  invalidUserData.push({
    username: userTemplate.username.valid[i % l],
    firstname: userTemplate.firstname.valid[i % l],
    lastname: userTemplate.lastname.valid[i % l],
    password: userTemplate.password.valid[i % l],
    email: userTemplate.email.valid[i % l],
    birthyear: userTemplate.birthyear.valid[i % l],
    optional: userTemplate.optional.invalid[i],
    isAdmin: userTemplate.isAdmin.valid[i % 2],
  });
}

for (let i = 0; i < l; i += 1) {
  invalidUserData.push({
    username: userTemplate.username.valid[i % l],
    firstname: userTemplate.firstname.valid[i % l],
    lastname: userTemplate.lastname.valid[i % l],
    password: userTemplate.password.valid[i % l],
    email: userTemplate.email.valid[i % l],
    birthyear: userTemplate.birthyear.valid[i % l],
    optional: userTemplate.optional.valid[i % l],
    isAdmin: userTemplate.isAdmin.invalid[i],
  });
}

module.exports = invalidUserData;

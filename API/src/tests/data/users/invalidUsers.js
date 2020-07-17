const userTemplate = require('../../../util/userTemplate');

const l = userTemplate.username.invalid.length;
const invalidUserData = [];
for (let i = 0; i < userTemplate.username.valid.length; i += 1) {
  invalidUserData.push(
    {
      username: userTemplate.username.invalid[i],
      firstName: userTemplate.firstName.valid[i % l],
      lastName: userTemplate.lastName.valid[i % l],
      password: userTemplate.password.valid[i % l],
      email: userTemplate.email.valid[i % l],
      birthdate: userTemplate.birthdate.valid[i % l],
      optional: userTemplate.optional.valid[i % l],
      isAdmin: userTemplate.isAdmin.valid[i % 2],
    },
  );
}

for (let i = 0; i < l; i += 1) {
  invalidUserData.push(
    {
      username: userTemplate.username.valid[i % l],
      firstName: userTemplate.firstName.invalid[i],
      lastName: userTemplate.lastName.valid[i % l],
      password: userTemplate.password.valid[i % l],
      email: userTemplate.email.valid[i % l],
      birthdate: userTemplate.birthdate.valid[i % l],
      optional: userTemplate.optional.valid[i % l],
      isAdmin: userTemplate.isAdmin.valid[i % 2],
    },
  );
}

for (let i = 0; i < l; i += 1) {
  invalidUserData.push(
    {
      username: userTemplate.username.valid[i % l],
      firstName: userTemplate.firstName.valid[i % l],
      lastName: userTemplate.lastName.invalid[i],
      password: userTemplate.password.valid[i % l],
      email: userTemplate.email.valid[i % l],
      birthdate: userTemplate.birthdate.valid[i % l],
      optional: userTemplate.optional.valid[i % l],
      isAdmin: userTemplate.isAdmin.valid[i % 2],
    },
  );
}

for (let i = 0; i < l; i += 1) {
  invalidUserData.push(
    {
      username: userTemplate.username.valid[i % l],
      firstName: userTemplate.firstName.valid[i % l],
      lastName: userTemplate.lastName.valid[i % l],
      password: userTemplate.password.invalid[i],
      email: userTemplate.email.valid[i % l],
      birthdate: userTemplate.birthdate.valid[i % l],
      optional: userTemplate.optional.valid[i % l],
      isAdmin: userTemplate.isAdmin.valid[i % 2],
    },
  );
}

for (let i = 0; i < l; i += 1) {
  invalidUserData.push(
    {
      username: userTemplate.username.valid[i % l],
      firstName: userTemplate.firstName.valid[i % l],
      lastName: userTemplate.lastName.valid[i % l],
      password: userTemplate.password.valid[i % l],
      email: userTemplate.email.invalid[i],
      birthdate: userTemplate.birthdate.valid[i % l],
      optional: userTemplate.optional.valid[i % l],
      isAdmin: userTemplate.isAdmin.valid[i % 2],
    },
  );
}

for (let i = 0; i < l; i += 1) {
  invalidUserData.push(
    {
      username: userTemplate.username.valid[i % l],
      firstName: userTemplate.firstName.valid[i % l],
      lastName: userTemplate.lastName.valid[i % l],
      password: userTemplate.password.valid[i % l],
      email: userTemplate.email.invalid[i % l],
      birthdate: userTemplate.birthdate.valid[i % l],
      optional: userTemplate.optional.valid[i % l],
      isAdmin: userTemplate.isAdmin.valid[i % 2],
    },
  );
}

for (let i = 0; i < l; i += 1) {
  invalidUserData.push(
    {
      username: userTemplate.username.valid[i % l],
      firstName: userTemplate.firstName.valid[i % l],
      lastName: userTemplate.lastName.valid[i % l],
      password: userTemplate.password.valid[i % l],
      email: userTemplate.email.valid[i % l],
      birthdate: userTemplate.birthdate.valid[i % l],
      optional: userTemplate.optional.invalid[i],
      isAdmin: userTemplate.isAdmin.valid[i % 2],
    },
  );
}

for (let i = 0; i < l; i += 1) {
  invalidUserData.push(
    {
      username: userTemplate.username.valid[i % l],
      firstName: userTemplate.firstName.valid[i % l],
      lastName: userTemplate.lastName.valid[i % l],
      password: userTemplate.password.valid[i % l],
      email: userTemplate.email.valid[i % l],
      birthdate: userTemplate.birthdate.valid[i % l],
      optional: userTemplate.optional.valid[i % l],
      isAdmin: userTemplate.isAdmin.invalid[i],
    },
  );
}

module.exports = invalidUserData;

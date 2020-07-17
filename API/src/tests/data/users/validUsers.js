const userTemplate = require('../../../util/userTemplate');

const validUserData = [];
const l = userTemplate.username.valid.length;
for (let i = 0; i < l; i += 1) {
  validUserData.push(
    {
      username: userTemplate.username.valid[i],
      firstName: userTemplate.firstName.valid[i],
      lastName: userTemplate.lastName.valid[i],
      password: userTemplate.password.valid[i],
      email: userTemplate.email.valid[i],
      birthdate: userTemplate.birthdate.valid[i],
      optional: userTemplate.optional.valid[i],
      tags: userTemplate.tags.valid[0],
      isAdmin: userTemplate.isAdmin.valid[i % 2],
    },
  );
}

module.exports = validUserData;

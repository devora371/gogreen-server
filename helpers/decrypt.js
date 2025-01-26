const bcrypt = require("bcryptjs");
const decrypt = (text) => {
  try {
    return bcrypt.hashSync(text, 10);
  } catch (error) {
    console.log(error);
  }
};

const compare = (text, hash) => {
  try {
    return bcrypt.compareSync(text, hash);
  } catch (error) {
    console.log(error);
  }
  return false;
};

module.exports = { decrypt, compare };

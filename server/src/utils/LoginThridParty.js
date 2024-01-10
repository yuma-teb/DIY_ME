const token = require('./JsonWebToken');

module.exports = {
  loginThirdParty: (req, res) => {
    console.log(res);
    return res.send(res.user);
  },
};

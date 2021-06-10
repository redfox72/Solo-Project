const index = require('../index');
const jwt = require('jsonwebtoken');

const InvalidToken = index.mongoose.model('InvalidToken', {
  token: String
});

setInterval(async () => {
  let allTokens = await InvalidToken.find().exec();
  let invalidTokens = [];
  for (let token of allTokens) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      invalidTokens.push(token);
    }
  }
  await InvalidToken.deleteMany({
    token: {
      $in: invalidTokens
    }
  }).exec();
}, 3600000);


module.exports = InvalidToken;
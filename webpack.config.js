/**
 * Look in ./config folder for webpack.dev.js
 */
console.log(process.env.NODE_ENV)
switch (process.env.NODE_ENV) {
  case 'prod':
    module.exports = require('./config/webpack.prod')({env: 'prod'});
    break;
  case 'test':
    module.exports = require('./config/webpack.test')({env: 'test'});
    break;
  case 'dev':
  default:
    module.exports = require('./config/webpack.dev')({env: 'dev'});
}

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = NODE_ENV === 'development'
  ? require('./webpack.config.dev.js')
  : require('./webpack.config.common.js');

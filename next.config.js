const path = require('path');

module.exports = {
  outputFileTracingRoot: path.join(__dirname),
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.join(__dirname, 'src'),
      '@/lib': path.join(__dirname, 'lib')
    };

    return config;
  },
};

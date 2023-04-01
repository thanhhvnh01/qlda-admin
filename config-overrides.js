const path = require('path');
const rewireAliases = require('react-app-rewire-aliases');

module.exports = function override(config, env) {
  config = rewireAliases.aliasesOptions({
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@layouts': path.resolve(__dirname, 'src/layouts'),
    '@configs': path.resolve(__dirname, 'src/configs'),
    '@utilities': path.resolve(__dirname, 'src/utilities'),
    '@hooks': path.resolve(__dirname, 'src/hooks'),
    '@store': path.resolve(__dirname, 'src/redux'),
    '@views': path.resolve(__dirname, 'src/views'),
    '@api': path.resolve(__dirname, 'src/api'),
    '@hoc': path.resolve(__dirname, 'src/hoc'),
    '@sections': path.resolve(__dirname, 'src/sections'),
  })(config, env);

  return config;
};

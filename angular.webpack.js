/**
 * Custom angular webpack configuration
 */

// const webpack = require('webpack');

module.exports = (config, options) => {

  config.target = 'electron-renderer';
  if (options.customWebpackConfig.target) {
    config.target = options.customWebpackConfig.target;
  } else if (options.fileReplacements) {
    for (let fileReplacement of options.fileReplacements) {
      if (fileReplacement.replace !== 'src/environments/environment.ts') {
        continue;
      }

      let fileReplacementParts = fileReplacement['with'].split('.');
      if (['dev', 'prod', 'test', 'electron-renderer'].indexOf(fileReplacementParts[1]) < 0) {
        config.target = fileReplacementParts[1];
      }
      break;
    }
  }

  // config.plugins.push(
  //   new webpack.DefinePlugin({ "process.env.CUSTOM_TARGET": JSON.stringify(config.target) })
  // );

  return config;
}

const standard = require('@neutrinojs/standardjs');
const jest = require('@neutrinojs/jest');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    standard({
      eslint:{
       baseConfig:{
        env: { "browser": true },
        rules: {
          "react/jsx-closing-tag-location":"off"
        }
       }
      }
    }),
    jest(),
  ],
};

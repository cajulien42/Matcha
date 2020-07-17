module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "extends": [
    "eslint:recommended"
  ],
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
    "es6": true
  },
  "parserOptions": {
    "sourceType": "module",
    "allowImportExportEverywhere": true
  },
  "rules": {
    "no-use-before-define": "off",
    "react/jsx-filename-extension": "off",
    "react/prop-types": "off",
    "comma-dangle": "off",
    "padded-blocks": "off",
    "no-console": "warn",
    "func-names": "off",
    "no-param-reassign": [
      "error",
      {
        "props": true,
        "ignorePropertyModificationsFor": [
          "req",
          "res"
        ]
      }
    ]
  }, 
  "globals": {
    "fetch": false
  }
 }

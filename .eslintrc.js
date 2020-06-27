module.exports = {
  'extends': 'airbnb',
  'parser': 'babel-eslint',
  'env': {
    'jest': true,
  },
  'rules': {
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'comma-dangle': 'off',
    'react/destructuring-assignment': 'off',
    'import/no-cycle': 'off',
    'import/named':"off",
    'react/no-access-state-in-setstate':'off',
    'react/jsx-props-no-spreading':'off',
    'no-param-reassign':'off',
    'react/no-did-update-set-state':'off',
    'react/no-array-index-key':'off'
  },
  'globals': {
    "fetch": false
  }
}


module.exports = {
  root: true,
  extends: '@react-native-community',
};
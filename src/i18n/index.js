import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
// import locale from "react-native-language-detector";
import { AsyncStorage } from 'react-native';
import glob from 'glob';

import en from './en.json';
import es from './es.json';

glob('** / *. json', options, (er, files) => {
  console.log(files);
});


const STORAGE_KEY = '@APP:languageCode';

const languageDetector = {
  init: Function.prototype,
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: async (callback) => {
    const savedDataJSON = await AsyncStorage.getItem(STORAGE_KEY);
    const lng = savedDataJSON || 'en';
    callback(lng);
  },
  cacheUserLanguage: () => { }
};

i18n
  .use(languageDetector)
  .use(reactI18nextModule)
  .init({
    debug: true,
    initImmediate: false,
    preload: ['en', 'es'],
    fallbackLng: 'en',
    lng: 'en',
    resources: {
      en,
      es
    },
    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',

    //   cache: {
    //  enabled: true
    // },

    interpolation: {
      escapeValue: false // not needed for react as it does escape per default to prevent xss!
    }
  });

export default i18n;

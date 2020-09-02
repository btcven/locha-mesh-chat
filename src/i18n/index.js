/* eslint-disable no-unused-vars */
/* eslint-disable global-require */
import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
// import locale from "react-native-language-detector";
import AsyncStorage from '@react-native-community/async-storage';
import {
  esp, eng, hld, fra
} from './languages';

const en = require('./en.json');
const es = require('./es.json');
const fr = require('./fr.json');
const nl = require('./nl.json');

const languagesAllowed = {
  en: { ...en, ...eng },
  es: { ...es, ...esp },
  fr: { ...fr, ...fra },
  nl: { ...nl, ...hld }
};


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
    resources: languagesAllowed,
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

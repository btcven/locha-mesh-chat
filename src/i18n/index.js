import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import locale from "react-native-locale-detector";

import en from "./en.json";
import es from "./es.json";

// creating a language detection plugin using expo
// http://i18n.com/docs/ownplugin/#languagedetector
const languageDetector = {
  init: Function.prototype,
  type: "languageDetector",
  async: true, // flags below detection to be async
  detect: async callback => {
    // const savedDataJSON = await AsyncStorage.getItem(STORAGE_KEY);
    // const lng = savedDataJSON ? savedDataJSON : null;

    const selectLanguage = locale;
    console.log("detect - selectLanguage:", selectLanguage);
    callback(selectLanguage);
  },
  cacheUserLanguage: () => {}
};

i18n
  .use(languageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: "en",
    resources: { en, es },

    // have a common namespace used around the full app
    ns: ["common"],
    defaultNS: "common",

    debug: true

    //   cache: {
    //  enabled: true
    // },

    // interpolation: {
    //   escapeValue: false // not needed for react as it does escape per default to prevent xss!
    // }
  });

export default i18n;

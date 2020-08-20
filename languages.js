const axios = require('axios').default;
const fs = require('fs');

const url = 'https://api.github.com/repos/btcven/locha/contents/mobile_app?ref=dev';


const headers = {
  Authorization: 'Token f33ab410fd1b74d5693ab003463252a9a2f85087'
};
axios.get(url, { headers })
  .then((res) => {
    res.data.forEach((element) => {
      axios.get(element.url, { headers })
        .then((language) => {
          axios.get(language.data[0].url, { headers }).then(async (json) => {
            const payload = Buffer.from(json.data.content, 'base64').toString();
            fs.writeFileSync(`./src/i18n/${element.name}.json`, payload, 'utf8');
          }).catch((err) => {
            console.log('fail last request', err.toString());
          });
        }).catch((err) => {
          console.log('fail second request', err.toString());
        });
    });
  }).catch((err) => {
    console.log('fail first request', err.toString());
  });

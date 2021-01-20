/* eslint-disable global-require */
/* eslint-disable consistent-return */

import moment from 'moment';
import RNSF from 'react-native-fs';
import { bitcoin } from '../../App';

let utilsFuntions;
if (!process.env.JEST_WORKER_ID) {
  utilsFuntions = require('../utils/utils');
}

export default class CoreDatabase {
  constructor() {
    this.db = undefined;
  }

  getUserData = () => new Promise((resolve) => {
    const user = this.db.objects('user');

    const chats = [];

    const promise = new Promise((solve) => {
      user[0].chats.sorted('timestamp', true).slice(0, 15).forEach((msg, index, array) => {
        chats.push({
          fromUID: msg.fromUID,
          toUID: msg.toUID,
          timestamp: msg.timestamp,
          queue: { ...msg.queue },
          messages: msg.messages.sorted('timestamp', true).slice(0, 1),
        });

        if (index === array.length - 1) solve();
      });
    });

    promise.then(() => {
      resolve({
        uid: user[0].uid,
        peerID: user[0].peerID,
        name: user[0].name,
        picture: user[0].picture,
        contacts: user[0].contacts,
        chats
      });
    });
  });

  writteUser = (obj) => new Promise((resolve, reject) => {
    try {
      this.db.write(async () => {
        const userData = {
          uid: obj.uid,
          peerID: obj.peerID,
          name: obj.name,
          picture: obj.picture,
          chats: obj.chats,
          contacts: [],
          imageHash: obj.picture ? await bitcoin.sha256(obj.picture) : null
        };
        this.db.create(
          'user',
          userData,
          true
        );
        resolve(userData);
      });
    } catch (e) {
      reject(e);
    }
  });

  /**
   * save new ipv6 in the database
   * @param {*} uid  uid user
   * @param {*} ipv6 new ipv6 address
   */
  setNewIpv6 = (uid, ipv6) => new Promise((resolve, reject) => {
    try {
      this.db.write(() => {
        const userData = {
          uid,
          ipv6Address: ipv6,
        };
        this.db.create(
          'user',
          userData,
          true
        );
        resolve(userData);
      });
    } catch (e) {
      reject(e);
    }
  });

  saveUserPhoto = (obj) => new Promise((resolve, reject) => {
    try {
      this.db.write(async () => {
        this.db.create(
          'user',
          {
            ...obj,
            imageHash: null
          },
          true
        );
        resolve(obj);
      });
    } catch (e) {
      reject(e);
    }
  });


  converToString = (realmData) => {
    try {
      const result = JSON.parse(JSON.stringify(realmData));
      return Object.values(result);
    } catch (err) {
      return [];
    }
  }


  cancelUnreadMessages = (id) => new Promise((resolve) => {
    this.db.write(() => {
      try {
        const chat = this.db.objectForPrimaryKey('Chat', id);
        const notRead = this.converToString(chat.queue);
        chat.queue = [];
        resolve(chat.messages.sorted('timestamp', true).slice(0, 30));
      } catch (err) {
        console.log('cancel unread', err);
      }
    });
  });


  cancelMessages = () => new Promise((resolve) => {
    this.db.write(() => {
      const messages = this.db.objects('Message').filter((data) => {
        const timeCreated = moment(data.shippingTime);
        return (
          moment().diff(timeCreated, 's') > 60 && data.status === 'pending'
        );
      });

      const msg = messages.slice();
      messages.forEach((data, key) => {
        messages[key].status = 'not sent';
      });
      if (msg.length >= 1) {
        resolve(msg.length);
      }
    });
  });

  addContacts = (uid, obj, update) => new Promise((resolve) => {
    this.db.write(() => {
      try {
        const user = this.db.objectForPrimaryKey('user', uid);
        user.contacts.push({
          uid: obj.uid,
          name: obj.name,
          picture: obj.picture,
          hashUID: obj.hashUID,
          nodeAddress: obj.nodeAddress
        });

        if (!update) {
          user.chats.push({
            fromUID: uid,
            toUID: obj.uid,
            messages: [],
            queue: []
          });
        }
        resolve(user.contacts);
      } catch (error) {
        console.log('error', error);
      }
    });
  });

  setMessage = (id, obj, status) => new Promise((resolve, reject) => {
    this.db.write(() => {
      try {
        const chat = this.db.objectForPrimaryKey('Chat', id);
        const time = new Date().getTime();
        const file = obj.msg.typeFile
          ? {
            fileType: obj.msg.typeFile,
            file: obj.msg.file
          }
          : null;
        chat.messages.push({
          ...obj,
          id: obj.msgID,
          msg: obj.msg.text,
          file,
          shippingTime: new Date().getTime(),
          status
        });
        chat.timestamp = time;
        resolve(chat.messages.sorted('timestamp', true).slice(0, 50));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(['en el setFile', err]);
        // reject(err);
      }
    });
  });

  verifyValidMessage = (contactId) => new Promise((resolve, reject) => {
    this.db.write(() => {
      try {
        const contact = this.db.objectForPrimaryKey('Contact', contactId);
        if (contact) {
          resolve();
        } else {
          throw new Error('no contact found');
        }
      } catch (err) {
        reject(err);
      }
    });
  });


  addTemporalInfo = (obj) => new Promise((resolve) => {
    this.db.write(() => {
      this.db.create('temporalContacts', {
        ...obj
      }, true);
      resolve(obj);
    });
  });


  getTemporalContact = (id) => new Promise((resolve) => {
    const temporal = this.db.objectForPrimaryKey('temporalContacts', id);
    if (temporal) {
      resolve(JSON.parse(JSON.stringify(temporal)));
    } else {
      resolve(undefined);
    }
  });

  getMessageByTime = () => new Promise((resolve) => {
    const currentTime = moment();
    this.db.write(() => {
      const data = this.db.objects('Message').filtered('toUID == null');
      const temporalNames = this.db.objects('temporalContacts').filter((temporalContact) => {
        const timeCreated = moment(temporalContact.timestamp);
        return currentTime.diff(timeCreated, 'h') > 48;
      });
      if (data.length > 500) {
        const result = data.slice(0, 500);
        this.db.delete(result);
      }

      const newData = data.filter((filterData) => {
        const timeCreated = moment(filterData.timestamp);
        return currentTime.diff(timeCreated, 'h') > 48;
      });

      this.db.delete(newData);
      this.db.delete(temporalNames);
      resolve(JSON.parse(JSON.stringify(data)));
    });
  });


  deleteContact = (data) => new Promise((resolve) => {
    this.db.write(() => {
      // eslint-disable-next-line array-callback-return
      const contact = this.db.objects('Contact').filter((filterContact) => {
        const result = data.find((element) => filterContact.uid === element.uid);

        if (result) {
          return result.uid === filterContact.uid;
        }
      });
      // eslint-disable-next-line array-callback-return
      const chats = this.db.objects('Chat').filter((chat) => {
        const resultContact = contact.find((cont) => chat.toUID === cont.uid);

        if (resultContact) {
          return resultContact.uid === chat.toUID;
        }
      });


      this.db.delete(chats);
      this.db.delete(contact);
      resolve(true);
    });
  });

  editContact = (object) => new Promise((resolve) => {
    this.db.write(() => {
      this.db.create(
        'Contact',
        {
          ...object
        },
        true
      );
      resolve(object);
    });
  })

  listenerr = (chats, changes) => {
    changes.insertions.forEach((index) => {
      const { onNotification } = utilsFuntions;
      const changeChat = chats[index];
      onNotification(JSON.parse(JSON.stringify(changeChat)));
    });
  };

  realmObservable = () => {
    const chats = this.listener.objects('Message');
    chats.addListener(this.listenerr);
  };

  deleteChatss = (obj) => new Promise((resolve) => {
    this.db.write(() => {
      // eslint-disable-next-line array-callback-return
      const chat = this.db.objects('Chat').filter((msg) => {
        const result = obj.find((data) => data.toUID === msg.toUID);

        if (result) {
          return result.toUID === msg.toUID;
        }
      });

      const promise = new Promise((solve) => {
        chat.forEach(async (msg) => {
          msg.messages.forEach(async (message, index, array) => {
            if (message.file) {
              await RNSF.unlink(message.file.file);
            }
            if (index === array.length - 1) solve(array);
          });
        });
      });

      promise.then(() => {
        this.db.write(() => {
          chat.forEach((mes) => {
            this.db.delete(mes.messages);
          });
        });
      });
      resolve(obj);
    });
  });

  cleanChat = (id) => new Promise((resolve) => {
    this.db.write(() => {
      const chat = this.db.objectForPrimaryKey('Chat', id);
      const promise = new Promise((solve) => {
        chat.messages.forEach(async (msg, index, array) => {
          if (msg.file) {
            await RNSF.unlink(msg.file.file);
          }
          if (index === array.length - 1) solve(array);
        });
      });

      promise.then((array) => {
        this.db.write(() => {
          this.db.delete(array);
        });
      });
      resolve(true);
    });
  });


  deleteMessage = (id, obj) => new Promise((resolve) => {
    this.db.write(() => {
      const chat = this.db.objectForPrimaryKey('Chat', id);
      const messages = chat.messages.filter((data) => {
        const result = obj.find((message) => {
          if (message.id === data.id) {
            if (message.file) {
              RNSF.unlink(message.file.file).then(() => message);
              return message;
            }
            return message;
          }
        });
        return result;
      });
      this.db.delete(messages);
      resolve();
    });
  });

  unreadMessages = (id, idMessage) => new Promise((resolve) => {
    this.db.write(() => {
      const time = new Date().getTime();
      const chat = this.db.objectForPrimaryKey('Chat', id);
      try {
        chat.queue.push(idMessage);
        chat.timestamp = time;
        resolve(time);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    });
  });

  addStatusOnly = (eventStatus) => new Promise((resolve) => {
    this.db.write(() => {
      const message = this.db.objectForPrimaryKey(
        'Message',
        eventStatus.data.msgID
      );
      message.status = eventStatus.data.status;

      resolve(message);
    });
  });

  updateMessage = (message, time) => new Promise((resolve) => {
    this.db.write(() => {
      this.db.create(
        'Message',
        {
          id: message.id,
          status: 'pending',
          shippingTime: time,
        },
        true
      );
      const msg = this.db.objectForPrimaryKey('Message', message.id);
      resolve(msg);
    });
  });

  getAllData = () => new Promise((resolve, reject) => {
    try {
      const user = this.db.objects('user');
      const seed = this.seed.objects('Seed');
      resolve({ user: user[0], seed: seed[0] });
    } catch (err) {
      reject();
    }
  })

  savePhotoContact = (id, path, imageHash) => new Promise((resolve) => {
    this.db.write(() => {
      const result = this.db.objects('Contact').find((contact) => id === contact.hashUID);
      result.picture = path;
      result.imageHash = imageHash;
      resolve();
    });
  })


  getMoreMessages = (number, id) => new Promise((resolve) => {
    this.db.write(() => {
      try {
        const moreMessage = this.db.objectForPrimaryKey('Chat', id);
        resolve(moreMessage.messages
          .sorted('timestamp', true)
          .slice(0, number));
      } catch (error) {
        console.warn(error);
      }
    });
  })
}

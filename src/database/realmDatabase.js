/* eslint-disable consistent-return */

import moment from 'moment';
import { onNotification } from '../utils/utils';
// import Store from "../store";


export default class CoreDatabase {
  constructor() {
    this.db = undefined;
  }

  getUserData = () => new Promise((resolve) => {
    const user = this.db.objects('user');
    resolve(user.slice(0, 1));
  });

  writteUser = (obj) => new Promise((resolve, reject) => {
    try {
      this.db.write(() => {
        this.db.create(
          'user',
          {
            uid: obj.uid,
            name: obj.name,
            picture: obj.picture,
            chats: obj.chats
          },
          true
        );
      });
      resolve(obj);
    } catch (e) {
      reject(e);
    }
  });

  cancelUnreadMessages = (id) => new Promise((resolve) => {
    this.db.write(() => {
      if (id) {
        const chat = this.db.objectForPrimaryKey('Chat', id);
        const notRead = chat.queue.slice();
        chat.queue = [];

        resolve(notRead);
      } else {
        resolve();
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
      const user = this.db.objectForPrimaryKey('user', uid);

      user.contacts.push({
        uid: obj[0].uid,
        name: obj[0].name,
        picture: obj[0].picture,
        hashUID: obj[0].hashUID
      });

      if (!update) {
        user.chats.push({
          fromUID: uid,
          toUID: obj[0].hashUID,
          messages: [],
          queue: []
        });
      }
      resolve({
        fromUID: uid,
        toUID: obj[0].hashUID,
        messages: {},
        queue: []
      });
    });
  });


  setMessage = (id, obj, status) => new Promise((resolve) => {
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
        resolve({ file, time });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('function setMessage', err);
      }
    });
  });

  addTemporalInfo = (obj) => new Promise((resolve) => {
    this.db.write(() => {
      this.db.create('temporalContacts', {
        ...obj
      });
      resolve(obj);
    });
  });

  verifyContact = (hashUID) => new Promise((resolve) => {
    const contact = this.db.objects('Contact').find((data) => data.hashUID === hashUID);
    resolve(contact);
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
        const resultContact = contact.find((cont) => cont.hashUID === chat.toUID);

        if (resultContact) {
          return resultContact.hashUID === chat.toUID;
        }
      });

      this.db.delete(chats);
      this.db.delete(contact);

      resolve(contact);
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

      chat.forEach((msg) => {
        this.db.delete(msg.messages);
      });

      resolve(obj);
    });
  });


  cleanChat = (id) => new Promise((resolve) => {
    this.db.write(() => {
      const chat = this.db.objectForPrimaryKey('Chat', id);

      this.db.delete(chat.messages);
      resolve();
    });
  });


  deleteMessage = (id, obj) => new Promise((resolve) => {
    this.db.write(() => {
      const chat = this.db.objectForPrimaryKey('Chat', id);

      const messages = chat.messages.filter((data) => {
        const result = obj.find((message) => message.id === data.id);

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
      try {
        const message = this.db.objectForPrimaryKey(
          'Message',
          eventStatus.data.msgID
        );
        message.status = eventStatus.data.status;

        resolve();
      } catch (err) {
        if (Array.isArray(eventStatus.data.msgID)) {
          // eslint-disable-next-line array-callback-return
          eventStatus.data.msgID.map((id) => {
            const message = this.db.objectForPrimaryKey('Message', id);
            message.status = eventStatus.data.status;
          });
          resolve();
        }
      }
    });
  });


  updateMessage = (message) => new Promise((resolve) => {
    this.db.write(() => {
      try {
        this.db.create(
          'Message',
          {
            ...message,
            status: 'pending'
          },
          true
        );

        const msg = this.db.objectForPrimaryKey('Message', message.id);

        resolve(msg);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('in the cath', err);
      }
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
}

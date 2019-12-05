
import moment from "moment";
import { onNotification } from "../utils/utils";
// import Store from "../store";


export default class CoreDatabase {
  constructor(data) {
    this.db = undefined
  }

  getUserData = () =>
    new Promise(async resolve => {
      const user = this.db.objects("user");
      resolve(user.slice(0, 1));
    });

  writteUser = (obj) =>
    new Promise(async (resolve, reject) => {

      try {
        this.db.write(() => {
          this.db.create(
            "user",
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

  cancelUnreadMessages = id =>
    new Promise(resolve => {
      this.db.write(() => {
        if (id) {
          const chat = this.db.objectForPrimaryKey("Chat", id);
          notRead = chat.queue.slice();
          chat.queue = [];

          resolve(notRead);
        } else {
          resolve();
        }
      });
    });



  cancelMessages = () =>
    new Promise((resolve, reject) => {
      this.db.write(() => {
        const messages = this.db.objects("Message").filter(data => {
          const timeCreated = moment(data.timestamp);
          return (
            moment().diff(timeCreated, "s") > 60 && data.status === "pending"
          );
        });

        const msg = messages.slice();
        messages.map((data, key) => {
          messages[key].status = "not sent";
        });
        if (msg.length >= 1) {
          resolve(msg.length);
        }
      });
    });

  addContacts = (uid, obj, update) =>
    new Promise(async (resolve, reject) => {

      this.db.write(() => {
        let user = this.db.objectForPrimaryKey("user", uid);

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


  setMessage = (id, obj, status) =>
    new Promise(async (resolve, reject) => {

      this.db.write(() => {
        try {
          let chat = this.db.objectForPrimaryKey("Chat", id);
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
            file: file,
            status
          });
          chat.timestamp = new Date().getTime();
          resolve({ file, time });
        } catch (err) {
          console.log("function setMessage", err);
        }
      });

    });

  addTemporalInfo = obj =>
    new Promise(resolve => {

      this.db.write(() => {
        this.db.create("temporalContacts", {
          ...obj
        });
        resolve(obj);
      });
    });

  verifyContact = hashUID =>
    new Promise(resolve => {
      const contact = this.db.objects("Contact").find(data => {
        return data.hashUID === hashUID;
      });
      resolve(contact);

    });

  getTemporalContact = id =>
    this.db.open(databaseOptions).then(realm => {
      temporal = this.db.objectForPrimaryKey("temporalContacts", id);
      if (temporal) {
        resolve(JSON.parse(JSON.stringify(temporal)));
      } else {
        resolve(undefined);
      }
    });

  getMessageByTime = () =>
    new Promise(resolve => {
      const currentTime = moment();
      realm.write(() => {
        const data = this.db.objects("Message").filtered("toUID == null");
        const temporalNames = this.db.objects("temporalContacts").filter(data => {
          const timeCreated = moment(data.timestamp);
          return currentTime.diff(timeCreated, "h") > 48;
        });
        if (data.length > 500) {
          let result = data.slice(0, 500);
          this.db.delete(result);
        }

        let newData = data.filter(data => {
          const timeCreated = moment(data.timestamp);
          return currentTime.diff(timeCreated, "h") > 48;
        });

        this.db.delete(newData);
        this.db.delete(temporalNames);
        resolve(JSON.parse(JSON.stringify(data)));
      });
    });


  deleteContact = data =>
    new Promise(resolve => {

      this.db.write(() => {
        const contact = this.db.objects("Contact").filter(contact => {
          let result = data.find(element => {
            return contact.uid === element.uid;
          });

          if (result) {
            return result.uid === contact.uid;
          }
        });

        const chats = this.db.objects("Chat").filter(chat => {
          const resultContact = contact.find(cont => {
            return cont.hashUID === chat.toUID;
          });

          if (resultContact) {
            return resultContact.hashUID === chat.toUID;
          }
        });

        this.db.delete(chats);
        this.db.delete(contact);

        resolve(contact);
      });
    });

  editContact = object => new Promise(resolve => {
    this.db.write(() => {
      this.db.create(
        "Contact",
        {
          ...object
        },
        true
      );
      resolve(object);

    });
  })

  listener = (chats, changes) => {
    changes.insertions.forEach(index => {
      let changeChat = chats[index];
      onNotification(JSON.parse(JSON.stringify(changeChat)));
    });
  };

  realmObservable = () => {
    let chats = this.db.objects("Message");
    chats.addListener(listener);
  };

  deleteChatss = obj =>
    new Promise(resolve => {
      this.db.write(() => {
        const chat = this.db.objects("Chat").filter(msg => {
          const result = obj.find(data => {
            return data.toUID === msg.toUID;
          });

          if (result) {
            return result.toUID === msg.toUID;
          }
        });

        chat.forEach(msg => {
          this.db.delete(msg.messages);
        });

        resolve(obj);
      });
    });


  cleanChat = id =>
    new Promise(resolve => {

      this.db.write(() => {
        const chat = this.db.objectForPrimaryKey("Chat", id);

        this.db.delete(chat.messages);
        resolve();
      });
    });


  deleteMessage = (id, obj) =>
    new Promise(resolve => {
      this.db.write(() => {
        const chat = this.db.objectForPrimaryKey("Chat", id);

        const messages = chat.messages.filter(data => {
          const result = obj.find(message => {
            return message.id === data.id;
          });

          return result;
        });

        this.db.delete(messages);
        resolve();
      });
    });


  unreadMessages = (id, idMessage) =>
    new Promise((resolve, reject) => {
      this.db.write(() => {
        const time = new Date().getTime();
        const chat = this.db.objectForPrimaryKey("Chat", id);
        try {
          chat.queue.push(idMessage);
          chat.timestamp = time;
          resolve(time);
        } catch (err) { }
      });
    });




  addStatusOnly = eventStatus =>
    new Promise((resolve, reject) => {
      this.db.write(() => {
        try {
          const message = this.db.objectForPrimaryKey(
            "Message",
            eventStatus.data.msgID
          );
          message.status = eventStatus.data.status;

          resolve();
        } catch (err) {
          if (Array.isArray(eventStatus.data.msgID)) {
            eventStatus.data.msgID.map(id => {
              const message = this.db.objectForPrimaryKey("Message", id);
              message.status = eventStatus.data.status;
            });
            resolve();
          }
        }
      });
    });


  updateMessage = message =>
    new Promise((resolve, reject) => {
      this.db.write(() => {
        try {
          this.db.create(
            "Message",
            {
              ...message,
              status: "pending"
            },
            true
          );

          resolve();
        } catch (err) {
          console.log("in the cath", err);
        }
      });
    });


  getAllData = () => new Promise((resolve, reject) => {
    try {
      const user = this.db.objects("user");
      const seed = this.seed.objects("Seed");
      resolve({ user: user[0], seed: seed[0] })
    } catch (err) {
      console.log(err)
      reject()
    }
  })

}



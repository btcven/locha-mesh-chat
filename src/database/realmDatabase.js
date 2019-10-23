import Realm from "realm";
import moment from "moment";
import { onNotification } from "../utils/utils";
import {
  userSchema,
  contactSchema,
  chatSquema,
  BroadCasContacts,
  messageSquema
} from "./schemas";

const databaseOptions = {
  schema: [
    userSchema,
    contactSchema,
    chatSquema,
    messageSquema,
    BroadCasContacts,
    fileSchema
  ],
  schemaVersion: 17
};

const getRealm = () =>
  new Promise(resolve => {
    resolve(Realm.open(databaseOptions));
  });

export const writteUser = obj =>
  new Promise(async (resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
      try {
        realm.write(() => {
          realm.create(
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
  });

export const addContacts = (uid, obj, update) =>
  new Promise(async (resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
      realm.write(() => {
        let user = realm.objectForPrimaryKey("user", uid);

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
            messages: []
          });
        }
        resolve({ fromUID: uid, toUID: obj[0].hashUID, messages: {} });
      });
    });
  });

export const getUserData = () =>
  new Promise(async resolve => {
    Realm.open(databaseOptions).then(realm => {
      const user = realm.objects("user");
      resolve(user.slice(0, 1));
    });
  });

export const setMessage = (id, obj) =>
  new Promise(async (resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
      realm.write(() => {
        try {
          let chat = realm.objectForPrimaryKey("Chat", id);
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
            file: file
          });
          resolve(file);
        } catch (err) {
          console.log(err);
        }
      });
    });
  });

export const addTemporalInfo = obj =>
  new Promise(resolve => {
    Realm.open(databaseOptions).then(realm => {
      realm.write(() => {
        realm.create("temporalContacts", {
          ...obj
        });
        resolve(obj);
      });
    });
  });

export const verifyContact = hashUID =>
  new Promise(resolve => {
    Realm.open(databaseOptions).then(realm => {
      const contact = realm.objects("Contact").find(data => {
        return data.hashUID === hashUID;
      });
      resolve(contact);
    });
  });

export const getTemporalContact = id =>
  new Promise(resolve => {
    Realm.open(databaseOptions).then(realm => {
      temporal = realm.objectForPrimaryKey("temporalContacts", id);
      if (temporal) {
        resolve(JSON.parse(JSON.stringify(temporal)));
      } else {
        resolve(undefined);
      }
    });
  });

export const getMessageByTime = () =>
  new Promise(resolve => {
    const currentTime = moment();
    Realm.open(databaseOptions).then(realm => {
      realm.write(() => {
        const data = realm.objects("Message").filtered("toUID == null");
        const temporalNames = realm.objects("temporalContacts").filter(data => {
          const timeCreated = moment(data.timestamp);
          return currentTime.diff(timeCreated, "h") > 48;
        });
        if (data.length > 500) {
          let result = data.slice(0, 500);
          realm.delete(result);
        }

        let newData = data.filter(data => {
          const timeCreated = moment(data.timestamp);
          return currentTime.diff(timeCreated, "h") > 48;
        });

        realm.delete(newData);
        realm.delete(temporalNames);
        resolve(JSON.parse(JSON.stringify(data)));
      });
    });
  });

export const deleteContact = data =>
  new Promise(resolve => {
    Realm.open(databaseOptions).then(realm => {
      realm.write(() => {
        const contact = realm.objects("Contact").filter(contact => {
          let result = data.find(element => {
            return contact.uid === element.uid;
          });

          if (result) {
            return result.uid === contact.uid;
          }
        });

        const chats = realm.objects("Chat").filter(chat => {
          const resultContact = contact.find(cont => {
            return cont.hashUID === chat.toUID;
          });

          if (resultContact) {
            return resultContact.hashUID === chat.toUID;
          }
        });

        realm.delete(chats);
        realm.delete(contact);

        resolve(contact);
      });
    });
  });

export const editContact = object =>
  new Promise(resolve => {
    Realm.open(databaseOptions).then(realm => {
      realm.write(() => {
        realm.create(
          "Contact",
          {
            ...object
          },
          true
        );
        resolve(object);
      });
    });
  });

const listener = (chats, changes) => {
  changes.insertions.forEach(index => {
    let changeChat = chats[index];

    onNotification(JSON.parse(JSON.stringify(changeChat)));
  });
};

export const realmObservable = () => {
  Realm.open(databaseOptions).then(realm => {
    let chats = realm.objects("Message");

    chats.addListener(listener);
  });
};

export const deleteChatss = obj =>
  new Promise(resolve => {
    Realm.open(databaseOptions).then(realm => {
      realm.write(() => {
        const chat = realm.objects("Chat").filter(msg => {
          const result = obj.find(data => {
            return data.toUID === msg.toUID;
          });

          if (result) {
            return result.toUID === msg.toUID;
          }
        });

        chat.forEach(msg => {
          realm.delete(msg.messages);
        });

        resolve(obj);
      });
    });
  });

export const cleanChat = id =>
  new Promise(resolve => {
    Realm.open(databaseOptions).then(realm => {
      realm.write(() => {
        const chat = realm.objectForPrimaryKey("Chat", id);

        realm.delete(chat.messages);
        resolve();
      });
    });
  });

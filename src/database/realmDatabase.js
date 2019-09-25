import Realm from "realm";
import moment from "moment";
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
    BroadCasContacts
  ],
  schemaVersion: 12
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
    console.log("entro aqui");
    Realm.open(databaseOptions).then(realm => {
      realm.write(() => {
        let user = realm.objectForPrimaryKey("user", uid);
        let contact = realm.objects("Contact").forEach(contact => {
          console.log("data", contact);
        });

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
        resolve(obj);
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
        let chat = realm.objectForPrimaryKey("Chat", id);

        console.log("aca", chat);
        chat.messages.push({ ...obj, id: obj.msgID, msg: obj.msg.text });
        resolve();
      });
    });
  });

export const addTemporalInfo = obj =>
  new Promise(resolve => {
    Realm.open(databaseOptions).then(realm => {
      realm.write(() => {
        console.log("object", obj);
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

export const deletContact = id =>
  new Promise(resolve => {
    Realm.open(databaseOptions).then(realm => {
      realm.write(() => {
        const contact = realm.objectForPrimaryKey("Contact", id);
        realm.delete(contact);

        resolve();
      });
    });
  });

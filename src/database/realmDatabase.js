import Realm from "realm";

const contactSchema = {
  name: "Contact",
  properties: {
    uid: "string",
    name: "string",
    picture: "string?"
  }
};

const messageSquema = {
  name: "Message",
  primaryKey: "id",
  properties: {
    id: "string",
    fromUID: "string",
    toUID: "string?",
    msg: "string",
    timestamp: "string",
    type: "string"
  }
};

const chatSquema = {
  name: "Chat",
  primaryKey: "id",
  properties: {
    id: "string",
    fromUID: "string",
    toUID: "string?",
    messages: { type: "list", objectType: "Message" }
  }
};

const userSchema = {
  name: "user",
  primaryKey: "uid",
  properties: {
    uid: { type: "string", indexed: true },
    name: "string",
    picture: "string?",
    contacts: { type: "list", objectType: "Contact" },
    chats: { type: "list", objectType: "Chat" }
  }
};

const databaseOptions = {
  schema: [userSchema, contactSchema, chatSquema, messageSquema],
  schemaVersion: 3
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
              picture: obj.image,
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

export const addContacts = (uid, obj) =>
  new Promise(async (resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
      realm.write(() => {
        let user = realm.objectForPrimaryKey("user", uid);
        user.contacts.push({
          uid: obj[0].uid,
          name: obj[0].name,
          picture: obj[0].picture
        });
        resolve(obj);
      });
    });
  });

export const getUserData = () =>
  new Promise(async resolve => {
    Realm.open(databaseOptions).then(realm => {
      const user = realm.objects("user");

      resolve(user);
    });
  });

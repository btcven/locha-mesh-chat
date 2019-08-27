import Realm from "realm";

const contactSchema = {
  name: "Contact",
  properties: {
    uid: "string",
    name: "string",
    picture: "string?"
  }
};

const userSchema = {
  name: "user",
  primaryKey: "uid",
  properties: {
    uid: { type: "string", indexed: true },
    name: "string",
    picture: "string?",
    contacts: { type: "list", objectType: "Contact" }
  }
};

const getRealm = () =>
  new Promise(resolve => {
    resolve(
      Realm.open({
        schema: [userSchema, contactSchema],
        schemaVersion: 2
      })
    );
  });

export const writteUser = obj =>
  new Promise(async (resolve, reject) => {
    Realm.open({
      schema: [userSchema, contactSchema],
      schemaVersion: 2
    }).then(realm => {
      try {
        realm.write(() => {
          realm.create("user", {
            uid: obj.id,
            name: obj.name,
            picture: obj.image
          });
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });

export const getUserData = () =>
  new Promise(async resolve => {
    Realm.open({
      schema: [userSchema, contactSchema],
      schemaVersion: 2
    }).then(realm => {
      const user = realm.objects("user");
      console.log("aca", JSON.parse(JSON.stringify(user[0])));
      resolve();
    });
  });

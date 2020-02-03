/* eslint-disable no-empty */
/* eslint-disable max-classes-per-file */
export default class Realm {
  constructor(params) {
    this.schema = {};
    this.data = {};
    this.schemaCallbackList = {};
    params.schema.forEach((schema) => {
      this.data[schema.name] = {};
    });
    params.schema.forEach((schema) => {
      this.schema[schema.name] = schema;
    });
    this.lastLookedUpModel = null;
  }

  objects(schemaName) {
    this.lastLookedUpModel = schemaName;
    const objects = Object.values(this.data[schemaName]);
    objects.values = () => objects;
    objects.sorted = () => (this.compareFunc ? objects.sort(this.compareFunc) : objects.sort());
    objects.addListener = (cb) => {
      if (this.schemaCallbackList[schemaName]) {
        this.schemaCallbackList[schemaName].push(cb);
      } else {
        this.schemaCallbackList[schemaName] = [cb];
      }
    };
    objects.removeListener = () => { };
    objects.filtered = this.filtered ? this.filtered.bind(this, schemaName) : () => objects;
    return objects;
  }

  write(fn) {
    this.writing = true;
    fn();
    this.writing = false;
  }


  verifySchema(id) {
    const exist = !!this.schema[id];
    return exist;
  }

  create(schemaName, object) {
    const modelObject = object;
    const { properties } = this.schema[schemaName];
    const data = {};
    Object.keys(properties).forEach((key) => {
      if (modelObject[key]) {
        data[key] = modelObject[key];
      } else if (!modelObject[key]) {
        if (typeof properties[key] === 'string') {
          if (properties[key].substring(properties[key].length - 1) === '?') {
            data[key] = null;
          } else {
            throw new Error(`${properties[key]} is required`);
          }
        } else {
          const resultSchema = this.verifySchema(properties[key].objectType);
          if (resultSchema && properties[key].type === 'list') {
            data[key] = {};
          }
        }
      }
    });
  }

  objectForPrimaryKey(model, id) {
    this.lastLookedUpModel = model;
    return this.data[model][id];
  }

  delete(object) {
    if (this.lastLookedUpModel || object.model) {
      const model = object.model ? object.model : this.lastLookedUpModel;
      if (Array.isArray(object)) {
        object.forEach((item) => {
          delete this.data[model][item.id];
        });
      }
      delete this.data[model][object.id];
      if (this.writing) {
        if (this.schemaCallbackList[model]) {
          this.schemaCallbackList[model].forEach((cb) => cb(model, {
            insertions: { length: 0 },
            modifications: { length: 0 },
            deletions: { length: 1 },
          }));
        }
        this.callbackList.forEach((cb) => { cb(); });
      }
    }
  }

  deleteAll() {
    Object.keys(this.schema).forEach((key) => {
      if (this.writing && this.schemaCallbackList[this.schema[key].name]) {
        this.schemaCallbackList[this.schema[key].name].forEach((cb) => cb(key, {
          insertions: { length: 0 },
          modifications: { length: 0 },
          deletions: { length: Object.values(this.data[this.schema[key].name]).length },
        }));
      }
      this.data[this.schema[key].name] = {};
    });
    if (this.writing) this.callbackList.forEach((cb) => { cb(); });
  }

  addListener(_event, callback) {
    this.callbackList.push(callback);
  }

  prepareData(schemaName, objects) {
    objects.forEach((object) => {
      this.create(schemaName, object);
    });
  }
}

Realm.Object = class Object {
  // eslint-disable-next-line class-methods-use-this
  isValid() { return true; }
};

import { NativeModules } from 'react-native';

export default class PlayerModule {
  constructor(filename, callback) {
    this.player = NativeModules.PlayerModule;
    this.prepare(filename, callback);
  }


  prepare = (filename, callback) => {
    this.player.prepare(filename).then((res) => {
      this.IsPrepared = res.prepared;
      this.PlayerKey = res.key;
      this.duration = res.duration;
      if (callback) {
        callback(res.duration);
      }
      console.warn(res.duration, res.key);
    });
  }
}

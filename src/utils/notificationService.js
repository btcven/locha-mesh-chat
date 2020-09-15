import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import { notifyRedirect } from './utils';

/**
 *
 * notification settings
 * @export
 * @class NotifService
 */

export default class NotifService {
  constructor() {
    this.LocalNotification = NativeModules.LocalNotification;
    this.onNotification();
    // eslint-disable-next-line no-unused-expressions
    Platform.OS !== 'android' ? NativeModules.LocalNotification.requestPermission() : null;
  }

  onNotification = () => {
    const eventEmitter = new NativeEventEmitter(this.LocalNotification);
    eventEmitter.addListener('NoticationReceiver', (event) => {
      const notification = Platform.OS === 'android' ? JSON.parse(event.dataJSON) : event;
      notifyRedirect(notification);
    });
  }

  localNotif = (data, id) => {
    this.LocalNotification.createNotification(
      {
        id: id.toString(),
        title: data.name,
        message: data.msg
      }
    );
  }


  cancelNotif(id) {
    this.LocalNotification.clearNotificationID({ id });
  }

  cancelAll() {
    this.LocalNotification.clearNotificationAll();
  }
}

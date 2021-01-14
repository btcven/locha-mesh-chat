
import { Alert, NativeModules } from 'react-native';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import { chatService } from '../../App';

const device = NativeModules.RNDeviceInfo;

const errorHandler = (e, isFatal) => {
  if (isFatal) {
    console.log('diosss123', e);
    Alert.alert(
      'An error has occurred',
      `An unexpected fatal error has occurred, it is necessary to restart the application.

        it's this is caused by: ${e.message}
      `,
      [{
        text: 'Ok',
        onPress: () => {
          chatService.stop().then(
            () => { device.exitApp(); }
          );
        }
      }]
    );
  }
};

setJSExceptionHandler(errorHandler, true);


setNativeExceptionHandler((dataString) => {
  console.warn(dataString);
});

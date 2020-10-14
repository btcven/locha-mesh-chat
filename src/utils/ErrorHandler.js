
import { Alert, NativeModules } from 'react-native';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import { chatService } from '../../App';

const device = NativeModules.RNDeviceInfo;

const errorHandler = (e, isFatal) => {
  if (isFatal) {
    chatService.stop().then(() => {
      Alert.alert(
        'An error has occurred',
        'An unexpected fatal error has occurred, it is necessary to restart the application.',
        [{
          text: 'Ok',
          onPress: () => { device.exitApp(); }
        }]
      );
    });
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

setJSExceptionHandler(errorHandler, true);


setNativeExceptionHandler((dataString) => {
  console.warn(dataString);
})
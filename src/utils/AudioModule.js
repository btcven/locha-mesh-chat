import { NativeModules, PermissionsAndroid, NativeEventEmitter } from 'react-native';
import { FileDirectory } from './utils';

export default class AudioRecoder {
  constructor() {
    this.recoder = NativeModules.SoundMdoule;
    this.device = NativeModules.RNDeviceInfo;
    this.event = new NativeEventEmitter(this.recoder);

    this.onCloseEmiter = null;
    this.onProgressEmiter = null;
  }

  /**
   * add the specific format of the generated audios
   */
  prepareRecoder = async () => {
    await this.recoder.prepareRecoder({
      path: `${FileDirectory}/Audios/AUDIO_${new Date().getTime()}.aac`,
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
      OutputFormat: 'mpeg_4',
      AudioSource: 0,
      AudioEncodingBitRate: 32000,
    });
  }

  /**
   * verifying permission for recording
   */
  requestRecoderPermision = () => new Promise((resolve) => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    ).then((result) => {
      if (result === PermissionsAndroid.RESULTS.GRANTED || result === true) resolve(true);
      else resolve(false);
    });
  })

  checkRecorderPermisionStatus = () => new Promise((resolve) => {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    ).then((result) => {
      resolve(result);
    });
  })

  /**
   * start recording
   */
  startRecording = () => {
    this.recoder.startRecording();
  }

  /**
   * stop recording
   */
  stopRecording = () => {
    this.recoder.stopRecording();
  }

  /**
   * event receiving the recording duration in seconds
   * @param {Callback} callback
   */
  onProgres = (callback) => {
    this.onProgressEmiter = this.event.addListener('onProgress', (seconds) => {
      callback(seconds);
    });
  }

  /**
   * event return the audio in base64 when the recording finishes executing
   * @param {Callback} callback
   */
  onFinished = (callback) => {
    this.onCloseEmiter = this.event.addListener('onFinished', (file) => {
      callback(file);
    });
  }


  removeListener = () => {
    if (this.onCloseEmiter) {
      this.onCloseEmiter.remove();
    }
    if (this.onProgressEmiter) {
      this.onProgressEmiter.remove();
    }
  }
}

import { NativeModules, PermissionsAndroid } from 'react-native';

export default class AudioRecoder {
  constructor() {
    this.recoder = NativeModules.SoundMdoule;
    this.device = NativeModules.RNDeviceInfo;
    this.prepareRecoder();
  }

  /**
   * add the specific format of the generated audios
   */
  prepareRecoder = async () => {
    await this.recoder.prepareRecoder({
      path: `${this.device.DocumentDirectoryPath}/AUDIO_${new Date().getTime()}.aac`,
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
      OutputFormat: 'mpeg_4',
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


  /**
   * start recording
   */
  startRecording = () => {
    this.recoder.stopRecording();
  }


  stopRecording = () => {
    this.recoder.stopRecording();
  }
}

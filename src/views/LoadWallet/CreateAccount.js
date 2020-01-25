/* eslint-disable quotes */
import React, { Component } from 'react';
import { Button } from 'native-base';
import {
  View, Text, StyleSheet, Clipboard, Platform
} from 'react-native';
import Modal from 'react-native-modal';
import { Formik } from 'formik';
import DocumentPicker from 'react-native-document-picker';
import RNFS from "react-native-fs";
import CryptoJS from "crypto-js";
import { sha256 } from "js-sha256";
import RestoreFile from './RestoreWithPin';
import AddName from "./AddName";
import Phrases from "./Phrases";
import PinView from "./PinView";
import { toast } from "../../utils/utils"


/**
 * visual component to create or restore account
 */
export default class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      seed: null,
      file: null,
      name: ''
    };
  }

  copyPhrases = async () => {
    Clipboard.setString(this.props.stringPhrases);
  }


  componentDidMount = () => {
    if (this.props.restore) this.setState({ step: 4 });
  }

  back = () => {
    if (this.state.step === 1 || this.state.step === 4) {
      this.props.close();
    } else {
      this.setState({ step: this.state.step - 1 });
    }
  }

  continue = (values) => {
    if (!this.props.restore) {
      const seed = this.props.phrases.slice();
      while (seed.reduce((prev, curr) => prev + +(curr === ''), 0) < 6) {
        const k = Math.floor(Math.random() * (seed.length - 1));
        seed[k] = '';
      }
      if (this.state.step === 3) {
        this.setState({ step: 5 });
      } else {
        this.setState({ seed, step: 2 });
      }
    } else {
      for (let index = 0; index < values.length; index += 1) {
        if (values[index] === '') {
          toast(this.props.screenProps.t('Initial:error2'));
          return;
        }
      }
      this.setState({ step: 3 });
    }
  }

  confirm = (values) => {
    if (this.props.phrases.length !== values.length) {
      return;
    }

    for (let index = 0; index <= values.length; index += 1) {
      if (values[index] !== this.props.phrases[index]) {
        toast(this.props.screenProps.t('Initial:error3'));
        return;
      }
    }
    this.setState({ step: 3 });
  }

  createAccount = (pin) => {
    this.props.createNewAccount({
      pin,
      seed: this.props.stringPhrases,
      name: this.state.name
    });
  }

  closePin = () => {
    this.setState({ file: null });
  }

  getFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      this.setState({ file: res.uri });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  restoreAccountWithFile = (pin) => {
    try {
      RNFS.readFile(this.state.file).then((res) => {
        const bytes = CryptoJS.AES.decrypt(res, sha256(pin));
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        this.setState({ file: null });
        this.props.restoreWithFile(pin, decryptedData);
      }).catch(() => {
        toast(this.props.screenProps.t("Initial:error1"));
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('data', error);
    }
  }

  restoreAccount = (pin, values) => {
    let phrases;
    for (let index = 0; index < values.length; index += 1) {
      if (index === 0) {
        phrases = values[index];
      } else {
        // eslint-disable-next-line prefer-template
        phrases = phrases + " " + values[index];
      }
    }
    this.props.restoreWithPhrase(pin, phrases, this.state.name);
  }

  setName = (name) => {
    this.setState({ name });
  }

  componentWillUnmount = () => {
    this.closePin();
    this.props.close();
  }

  render() {
    const {
      open, close, phrases, screenProps
    } = this.props;
    const action = this.props.restore ? this.restoreAccount : this.createAccount;
    const values = (this.state.step !== 1 && this.state.step !== 4) ? this.state.seed : phrases;
    const rule = !!(this.state.step === 1 || this.state.step === 4 || this.state.step === 3);
    const restoreWithFile = !!this.state.file;
    const minHeight = this.state.step === 3 ? styles.NameHeight : styles.otherHeight;
    const disabled = !!(this.state.step === 3 && this.state.name.length < 4);
    return (
      <Formik
        enableReinitialize
        onSubmit={this.confirm}
        initialValues={values}
        render={
          // eslint-disable-next-line no-shadow
          ({ values, setFieldValue, handleSubmit }) => (
            <Modal
              isVisible={open}
              onBackdropPress={() => close('openModalPhoto')}
              swipeDirection={['up', 'left', 'right', 'down']}
              avoidKeyboard
              style={{
                margin: 0, justifyContent: 'flex-end',
              }}
            >
              <View style={[styles.container, minHeight]}>
                <RestoreFile
                  open={restoreWithFile}
                  close={this.closePin}
                  config
                  action={this.restoreAccountWithFile}
                  text={screenProps.t('Initial:textBackup')}
                />

                {/* ---------------------   Component header --------------------- */}

                {this.state.step === 1
                  && (
                    <View>
                      <Text style={{ textAlign: 'center', padding: 10, fontSize: 23 }}>
                        {screenProps.t('Initial:titleCreateAccount')}
                      </Text>
                      <Text style={{ paddingHorizontal: 10 }}>
                        {screenProps.t('Initial:subTitleCreateAccount')}
                      </Text>
                    </View>
                  )}

                {this.state.step === 2
                  && (
                    <View>
                      <Text style={{ textAlign: 'center', padding: 10, fontSize: 23 }}>
                        {screenProps.t('Initial:titleConfirm')}
                      </Text>
                      <Text style={{ paddingHorizontal: 10 }}>
                        {screenProps.t('Initial:subTitleCorfirm')}
                      </Text>
                    </View>
                  )}

                {this.state.step === 5
                  && (
                    <View>
                      <Text style={{ textAlign: 'center', padding: 10, fontSize: 23 }}>
                        {screenProps.t('Initial:titlePin')}
                      </Text>
                      <Text style={{ paddingHorizontal: 10 }}>
                        {screenProps.t('Initial:subtitlePin')}
                      </Text>
                    </View>
                  )}

                {this.state.step === 3
                  && (
                    <View>
                      <Text style={{ textAlign: 'center', padding: 10, fontSize: 23 }}>
                        {screenProps.t('Initial:titleUsername')}
                      </Text>
                      <Text style={{ paddingHorizontal: 10 }}>
                        {screenProps.t('Initial:textUsername')}
                      </Text>
                    </View>
                  )}

                {this.state.step === 4
                  && (
                    <View>
                      <Text style={{ textAlign: 'center', padding: 10, fontSize: 23 }}>
                        {screenProps.t('Initial:titleRestore')}
                      </Text>
                      <Text style={{ paddingHorizontal: 10 }}>
                        {screenProps.t('Initial:subtitleRestore')}
                      </Text>
                    </View>
                  )}

                {/* --------------------- End header --------------------- */}

                {/* ----------------------- Component body ------------------  */}

                {this.state.step !== 3 && this.state.step !== 5 && (
                  <Phrases values={values} setFieldValue={setFieldValue} />
                )}

                {this.state.step === 4 && (
                <View style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 40,
                  marginTop: 20
                }}
                >
                  <Button
                    success
                    onPress={this.getFile}
                    style={{
                      justifyContent: 'center',
                      minWidth: 150,
                      marginHorizontal: 10
                    }}
                  >
                    <Text>{`${screenProps.t('Initial:buttonFile')}`.toUpperCase()}</Text>
                  </Button>
                </View>
                )}

                {this.state.step === 3 && (
                  <View>
                    <AddName
                      screenProps={screenProps}
                      setName={this.setName}
                      name={this.state.name}
                    />
                  </View>
                )}

                {this.state.step === 5 && (
                  <View>
                    <PinView back={this.back} createAccount={action} values={values} />
                  </View>
                )}

                {/* ----------------------- End body ------------------  */}

                <View style={styles.buttonContainer}>
                  {this.state.step !== 5 && (
                    <Button
                      light
                      onPress={this.back}
                      style={{
                        justifyContent: 'center',
                        minWidth: 100,
                        marginHorizontal: 10
                      }}
                    >
                      <Text>{`${screenProps.t('Initial:back')}`.toUpperCase()}</Text>
                    </Button>
                  )}
                  {rule && (
                    <Button
                      disabled={disabled}
                      onPress={() => this.continue(values)}
                      style={{
                        marginHorizontal: 10,
                        justifyContent: 'center',
                        backgroundColor: '#fbc233',
                        minWidth: 100
                      }}
                    >
                      <Text>{`${screenProps.t('Initial:next')}`.toUpperCase()}</Text>
                    </Button>
                  )}

                  {this.state.step === 2 && (
                    <Button
                      onPress={handleSubmit}
                      style={{
                        marginHorizontal: 10,
                        justifyContent: 'center',
                        backgroundColor: '#fbc233',
                        minWidth: 100
                      }}
                    >
                      <Text>{`${screenProps.t('Initial:confirm')}`.toUpperCase()}</Text>
                    </Button>
                  )}
                </View>
              </View>

            </Modal>
          )
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: 'white'
  },
  NameHeight: {
    minHeight: 270,
  },
  otherHeight: {
    minHeight: 330,
  },
  phrasesContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginLeft: 12
  },
  buttonContainer: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 10,
    marginTop: '5%',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  inputStyles: {
    borderBottomWidth: 0.5,
    minWidth: 60,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        marginVertical: 15
      },
    }),
  }

});

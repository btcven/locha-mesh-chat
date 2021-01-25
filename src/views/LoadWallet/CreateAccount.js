/* eslint-disable no-shadow */
/* eslint-disable quotes */
import React, { Component } from 'react';
import { Button } from 'native-base';
import {
  View, Text, StyleSheet, Clipboard, Platform
} from 'react-native';
import Modal from 'react-native-modal';
import { Formik } from 'formik';
import RNFS from "react-native-fs";
import DocumentPicker from 'react-native-document-picker';
import RestoreFile from './RestoreWithPin';
import AddName from "./AddName";
import Phrases from "./Phrases";
import PinView from "./PinView";
import { toast } from "../../utils/utils";
import { bitcoin } from '../../../App';


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
    const seed = this.props.phrases.slice();
    if (!this.props.restore) {
      while (seed.reduce((prev, curr) => prev + +(curr === ''), 6) < 0) {
        const k = Math.floor(Math.random() * (seed.length - 1));
        seed[k] = '';
      }
      if (this.state.step === 3) {
        this.setState({ step: 5 });
      } else {
        this.setState({ seed, step: 2 });
      }
    } else if (this.state.step !== 3) {
      for (let index = 0; index < values.length; index += 1) {
        if (values[index] === '') {
          toast(this.props.screenProps.t('Initial:error2'));
          return;
        }
      }
      this.setState({ step: 3, seed });
    } else if (this.state.step === 3) {
      this.setState({ step: 5 });
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

  createAccount = (pin, callback) => {
    this.props.createNewAccount({
      pin,
      seed: this.props.stringPhrases,
      name: this.state.name
    }, () => {
      callback();
    });
  }

  closePin = () => {
    this.setState({ file: null });
  }

  getFile = async () => {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });

    this.setState({ file: res.uri });
  }

  restoreAccountWithFile = (pin) => {
    RNFS.readFile(this.state.file).then(async (res) => {
      const bytes = await bitcoin.decrypt(res, await bitcoin.sha256(pin));
      const decryptedData = JSON.parse(bytes);
      this.setState({ file: null });
      this.props.restoreWithFile(pin, decryptedData);
    }).catch(() => {
      toast(this.props.screenProps.t("Initial:error1"));
    });
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
      >
        {({ values, setFieldValue, handleSubmit }) => (
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
                  <View testID="TextCreateAccount">
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
                  <View testID="TextConfirmWords">
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
                  <View testID="TextPin">
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
                  <View testID="TextUserName">
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
                  <View testID="TextRestoreAccount">
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
                <View
                  testID="ButtonRestore"
                  style={{
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
                    testID="buttonBack"
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
                    testID="buttonContinue"
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
                    testID="buttonComfirm"
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
        )}
      </Formik>
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

import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet
} from 'react-native';
import { Button } from 'native-base';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import PinView from './PinView';
import { toast } from '../../utils/utils';
import { restoreAccountWithPin, newPin } from '../../store/aplication/aplicationAction';
import Phrases from './Phrases';
import { database } from '../../../App';

/**
 * component used for pin view
 */
class RestoreWithPin extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    step: 1,
    close: false,
    path: false
  }

  /**
   * Function that activates the option to restore the account with the pin or
   * the action of modifying the pin
   * @param {String} pin pin entered
   * @memberof RestoreWithPin
   */
  restoreAccount = (pin, values, callback) => {
    if (this.state.step === 1) {
      this.props.restoreAccountWithPin(pin, (res) => {
        if (res) {
          callback();
          return;
        }
        callback();
        toast(this.props.screenProps.t('Initial:error1'));
      });
    } else {
      this.props.newPin({ path: this.state.path, pin, phrases: this.state.phrases });
    }
  }

  componentWillUnmount = () => {
    this.setState({ close: true });
  }

  /**
   * Function used to verify that the words are correct before adding the new pin
   * @param {Array} Values pin entered
   * @memberof RestoreWithPin
   */
  restorePin = (values) => {
    let phrases;
    for (let index = 0; index < values.length; index += 1) {
      if (index === 0) {
        phrases = values[index];
      } else {
        phrases = `${phrases} ${values[index]}`;
      }
    }
    database.verifyPhrases(phrases).then(async (path) => {
      this.setState({ step: 3, path, phrases });
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log('reject', err);
    });
  }

  render() {
    const {
      screenProps, text, action, config, close, open
    } = this.props;
    const actionCreate = config ? action : this.restoreAccount;
    const openModal = this.state.close ? false : open;
    const values = ['', '', '', '', '', '', '', '', '', '', '', ''];
    const rule = !!(this.state.step === 1 || this.state.step === 3);

    return (
      <Formik
        initialValues={values}
        // eslint-disable-next-line no-shadow
        render={({ values, setFieldValue }) => (
          <View>
            <Modal
              isVisible={openModal}
              animationIn="slideInUp"
              animationOut="slideOutDown"
              animationOutTiming={800}
              onBackdropPress={() => (config ? close('pin') : null)}
              style={{
                margin: 0, justifyContent: 'flex-end',
              }}
            >
              <>
                {rule && (
                  <View style={styles.container}>
                    <View style={styles.viewContainer}>
                      {!config && this.state.step === 1 && (
                        <Text>
                          {' '}
                          {screenProps.t('Initial:subtitlePin2')}
                        </Text>
                      )}
                      {!config && this.state.step === 3 && (
                        <Text>
                          {' '}
                          {screenProps.t('Initial:subtitlePin')}
                        </Text>
                      )}
                      {config && (
                        <Text>
                          {text}
                          {' '}
                        </Text>
                      )}
                    </View>
                    <PinView createAccount={actionCreate} />
                    {!config && this.state.step === 1 && (
                      <View style={styles.viewContainer}>
                        <Text>{screenProps.t('Initial:forgotPin')}</Text>
                        <TouchableOpacity onPress={() => this.setState({ step: 2 })}>
                          <Text style={{ paddingHorizontal: 5, color: '#fbc233' }}>{screenProps.t('Initial:click')}</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
                {!rule && (
                  <View style={[styles.container, styles.phrasesHeight]}>
                    <View>
                      <Text style={{ textAlign: 'center', padding: 10, fontSize: 23 }}>
                        {screenProps.t('Initial:restorePinTitle')}
                      </Text>
                      <Text style={{ paddingHorizontal: 10 }}>
                        {screenProps.t('Initial:restorePinText')}
                      </Text>
                    </View>
                    <Phrases values={values} setFieldValue={setFieldValue} />
                    <View style={styles.buttonContainer}>
                      <Button
                        light
                        onPress={() => this.setState({ step: 1 })}
                        style={{
                          justifyContent: 'center',
                          minWidth: 100,
                          marginHorizontal: 10
                        }}
                      >
                        <Text>{`${screenProps.t('Initial:back')}`.toUpperCase()}</Text>
                      </Button>
                      <Button
                        // disabled={disabled}
                        onPress={() => this.restorePin(values)}
                        style={{
                          marginHorizontal: 10,
                          justifyContent: 'center',
                          backgroundColor: '#fbc233',
                          minWidth: 100
                        }}
                      >
                        <Text>{`${screenProps.t('Initial:next')}`.toUpperCase()}</Text>
                      </Button>
                    </View>
                  </View>
                )}
              </>
            </Modal>
          </View>
        )}
      />

    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps, { restoreAccountWithPin, newPin })(RestoreWithPin);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginHorizontal: 5
  },
  phrasesHeight: {
    minHeight: 330
  },
  buttonContainer: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 10,
    marginTop: '5%',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  viewContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20
  }
});

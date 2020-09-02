import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Linking,
  ScrollView
} from 'react-native';
import { Button, Text, Thumbnail } from 'native-base';
import { connect } from 'react-redux';
import {
  setInitialUser, createNewAccount, restoreWithPhrase, restoreWithFile
} from '../../store/aplication/aplicationAction';
import { images } from '../../utils/constans';
import CreateAccount from './CreateAccount';
import { bitcoin } from '../../../App';
/**
 *
 * @description Welcome component when the application is first opened
 * @class InitialStep
 * @extends {Component}
 */
class InitialStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phrases: null,
      open: false,
      restore: false,
    };
  }

  close = () => {
    this.setState({ open: false, restore: false });
  };

  handleSubmit = async () => {
    const code = await bitcoin.getNewMnemonic();
    this.setState({ phrases: code.toString().split(' '), open: true, stringPhrases: code.toString() });
  };

  restore = () => {
    const array = ['', '', '', '', '', '', '', '', '', '', '', ''];
    this.setState({ open: true, restore: true, phrases: array });
  }

  render() {
    const { screenProps } = this.props;

    return (
      <View>
        <ScrollView contentContainerStyle={styles.container}>
          {this.state.open && (
            <CreateAccount
              phrases={this.state.phrases}
              close={this.close}
              open={this.state.open}
              stringPhrases={this.state.stringPhrases}
              createNewAccount={this.props.createNewAccount}
              restore={this.state.restore}
              restoreWithPhrase={this.props.restoreWithPhrase}
              screenProps={screenProps}
              restoreWithFile={this.props.restoreWithFile}
            />
          )}
          <>
            <Thumbnail
              source={images.logo2.url}
              style={{
                height: 150,
                width: 150,
                marginBottom: '10%'
              }}
            />
            <Text style={styles.title}>
              {screenProps.t('Initial:title')}
            </Text>
            <View style={{ marginTop: 20 }}>
              <Text
                style={{
                  paddingBottom: 10,
                  color: '#424242',
                  textAlign: 'justify'
                }}
              >
                {screenProps.t('Initial:subtitle')}
              </Text>
            </View>
            <View style={{ padding: 30, }}>
              <Button onPress={() => Linking.openURL('https://locha.io/buy/')} transparent>
                <Text style={{ color: '#fbc233', fontWeight: 'bold' }}>
                  {screenProps.t('Initial:buy')}
                </Text>
              </Button>
            </View>

            <View style={{ paddingTop: 20 }}>
              <Text
                style={{
                  color: '#424242',
                  textAlign: 'justify'
                }}
              >
                {screenProps.t('Initial:text')}
              </Text>
            </View>

            <View
              style={{
                width: '100%',
                paddingTop: '10%',
                flex: 1
              }}
            >
              <View
                style={{
                  flexDirection: 'row',

                  justifyContent: 'space-around',
                  alignItems: 'flex-end',
                  flex: 1
                }}
              >
                <Button onPress={this.restore} transparent>
                  <Text style={{ color: '#fbc233', fontWeight: 'bold' }}>
                    {screenProps.t('Initial:restore')}
                  </Text>
                </Button>

                <Button transparent onPress={this.handleSubmit}>
                  <Text style={{ color: '#fbc233', fontWeight: 'bold' }}>
                    {screenProps.t('Initial:create')}
                  </Text>
                </Button>
              </View>
            </View>
          </>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = () => ({

});

export default connect(mapStateToProps, {
  setInitialUser, createNewAccount, restoreWithPhrase, restoreWithFile
})(InitialStep);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 0
  },
  title: {
    paddingBottom: 20,
    fontSize: 30,
    color: '#fbc233'
  },

  formContainer: {
    paddingTop: 40
  }
});

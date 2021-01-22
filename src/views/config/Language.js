import React, { Component } from 'react';
import Modal from 'react-native-modal';
import {
  View,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Text,
  Left,
  Right,
  Radio,
  List,
  ListItem
} from 'native-base';
import i18n from '../../i18n';

/**
 *
 *
 * @export
 * @class EditName
 * @description component to edit the username
 * @extends {Component}
 */
export default class Lenguajes extends Component {

  async onChangeLang(lang) {
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem('@APP:languageCode', lang);
    this.props.close('language');
  }

  render() {
    const { open, close, screenProps } = this.props;

    const language = i18n.language.substr(0, 2);

    const languages = [
      {
        key: 'en',
        label: screenProps.t('Languages:en')
      },

      { key: 'es', label: screenProps.t('Languages:es') },
      {
        key: 'fr', label: screenProps.t('Languages:fr')
      },
      {
        key: 'nl', label: screenProps.t('Languages:nl')
      }
    ];

    return (
      <View>
        <Modal
          style={{
            margin: 0,
            justifyContent: 'flex-end'
          }}
          avoidKeyboard
          isVisible={open}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationOutTiming={800}
          onBackdropPress={() => close('language')}
        >
          <View
            style={{
              minHeight: '40%',
              backgroundColor: 'white',
              borderRadius: 5,
              marginHorizontal: 5
            }}
          >
            <Text style={styles.titleModal}>
              {screenProps.t('Settings:language')}
            </Text>

            <View style={{ flex: 1 }}>
              <List>
                {languages.map((languageItem) => (
                  <ListItem key={languageItem.key}>
                    <Left>
                      <Text>{languageItem.label}</Text>
                    </Left>
                    <Right>
                      <Radio
                        selectedColor="#FAB300"
                        selected={language === languageItem.key}
                        onPress={() => this.onChangeLang(languageItem.key)}
                      />
                    </Right>
                  </ListItem>
                ))}
              </List>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  styleTextButton: {
    paddingHorizontal: 10
  },
  qrCodeContainer: {
    alignItems: 'center',
    paddingTop: '5%',
    paddingBottom: 20
  },

  buttonContainer: {
    padding: 20,
    flexDirection: 'row',

    justifyContent: 'flex-end'
  },
  titleModal: {
    padding: 20,
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: '400'
  },
  iconStyle: {
    fontSize: 24,
    color: 'white'
  }
});

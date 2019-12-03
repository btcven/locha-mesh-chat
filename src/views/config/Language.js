import React, { Component } from "react";
import Modal from "react-native-modal";
import {
  View,
  StyleSheet,
  TouchableHighlight,
  AsyncStorage
} from "react-native";
import {
  Button,
  Text,
  Header,
  Left,
  Body,
  Title,
  Icon,
  Right,
  Radio,
  List,
  ListItem
} from "native-base";
import i18n from "../../i18n";

/**
 *
 *
 * @export
 * @class EditName
 * @description component to edit the username
 * @extends {Component}
 */
export default class Lenguajes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }

  saveName = () => {
    this.props.editName(
      { name: this.state.name, uid: this.props.config.uid },
      () => {
        this.props.close("viewQR");
      }
    );
  };

  async onChangeLang(lang) {
    console.log("holaaaaaaaaaa", lang);
    i18n.changeLanguage(lang);
    try {
      await AsyncStorage.setItem("@APP:languageCode", lang);
    } catch (error) {
      console.log(` Hi Errorrrr : ${error}`);
    }

    this.props.close("language");
  }

  render() {
    const { open, close, screenProps } = this.props;
    const disabled = this.state.name.length > 1 ? false : true;

    language = i18n.language.substr(0, 2);

    const languajes = [
      {
        key: "en",
        label: screenProps.t("Languages:en")
      },

      { key: "es", label: screenProps.t("Languages:es") }
    ];

    return (
      <View>
        <Modal
          style={{
            margin: 0,
            justifyContent: "flex-end"
          }}
          avoidKeyboard={true}
          isVisible={open}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationOutTiming={800}
          onBackdropPress={() => close("language")}
        >
          <View
            style={{
              minHeight: "40%",
              backgroundColor: "white", borderRadius: 5,
              marginHorizontal: 5
            }}
          >
            <Text style={styles.titleModal}>
              {screenProps.t("Settings:language")}
            </Text>

            <View style={{ flex: 1 }}>
              <List>
                {languajes.map(languajes => {
                  return (
                    <ListItem key={languajes.key}>
                      <Left>
                        <Text>{languajes.label}</Text>
                      </Left>
                      <Right>
                        <Radio
                          selectedColor="#FAB300"
                          selected={language === languajes.key ? true : false}
                          onPress={() => this.onChangeLang(languajes.key)}
                        />
                      </Right>
                    </ListItem>
                  );
                })}
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
    alignItems: "center",
    paddingTop: "5%",
    paddingBottom: 20
  },

  buttonContainer: {
    padding: 20,
    flexDirection: "row",

    justifyContent: "flex-end"
  },
  titleModal: {
    padding: 20,
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: "400"
  },
  iconStyle: {
    fontSize: 24,
    color: "white"
  }
});

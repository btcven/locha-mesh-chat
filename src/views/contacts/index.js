import React, { Component } from "react";
import { chats, images } from "../../utils/constans";
import Header from "../../components/Header";
import AddContact from "./AddContact";
import FloatButton from "../../components/FloatButton";
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Right,
  Text
} from "native-base";
import { selectedChat } from "../../store/chats";

import { Image, StyleSheet, Alert } from "react-native";
import { saveContact, getContacts, deleteContact } from "../../store/contacts";
import { connect } from "react-redux";

class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      selected: undefined
    };
  }
  static navigationOptions = {
    header: null
  };

  openModal = () => {
    this.setState({ openModal: true });
  };

  closeModal = () => {
    this.setState({ openModal: false });
  };

  onSuccess = e => {
    console.log("aca", e);
  };

  onSelect = (contact, chat) => {
    if (!this.state.selected) {
      this.props.selectedChat(chat);
      this.props.navigation.push("chat", {
        ...contact
      });
      return;
    }

    // ----- For later --------
    // const result = Object.values(this.state.selected).find(selected => {
    //   return contact.uid === selected.uid;
    // });

    if (this.state.selected.uid === contact.uid) {
      this.setState({ selected: undefined });
    } else {
      this.setState({ selected: contact });
    }
  };

  getContactChat = contact => {
    const result = Object.values(this.props.chat).find(chat => {
      return chat.toUID === contact.uid;
    });

    return result;
  };

  deleteContact = () => {
    let id = this.state.selected.uid;
    Alert.alert(
      "Eliminar Contactos",
      "¿Esta seguro de eliminar este contacto?",
      [
        {
          text: "Cancel",
          onPress: () => this.setState({ selected: undefined }),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () =>
            this.props.deleteContact(id, () => {
              this.setState({ selected: undefined });
            })
        }
      ],
      { cancelable: false }
    );
  };

  editContact = () => {
    this.openModal();
  };

  seleted = data => {
    this.setState({ selected: data });
  };

  closeSelected = () => {
    this.setState({ selected: undefined });
  };

  render() {
    return (
      <Container>
        <Header
          {...this.props}
          back={this.closeSelected}
          selected={this.state.selected}
          modal={this.state.openModal}
          delete={this.deleteContact}
          edit={this.editContact}
        />
        {this.state.openModal && (
          <AddContact {...this.props} close={this.closeModal} {...this.state} />
        )}

        <Content>
          {this.props.contacts.map((contact, key) => {
            const chatInfo = this.getContactChat(contact);
            const backgroundColor =
              this.state.selected && contact.uid === this.state.selected.uid
                ? "#f5f5f5"
                : "#fff";
            return (
              <List key={key} style={{ backgroundColor: backgroundColor }}>
                <ListItem
                  button
                  style={{ height: 80 }}
                  onPress={() => this.onSelect(contact, chatInfo)}
                  onLongPress={() => this.seleted(contact)}
                >
                  <Left style={styles.textContainer}>
                    <Text style={{ width: "100%", paddingBottom: 5 }}>
                      {contact.name}
                    </Text>
                    <Text note>
                      {`${contact.uid}`.length > 25
                        ? `${contact.uid}`.substr(0, 25) + `...`
                        : contact.uid}
                    </Text>
                  </Left>
                  <Right>
                    {contact.picture && (
                      <Image
                        style={styles.imageStyles}
                        source={{
                          uri: contact.picture,
                          cache: "force-cache"
                        }}
                      />
                    )}
                    {!contact.picture && (
                      <Image
                        style={styles.imageStyles}
                        source={images.noPhoto.url}
                      />
                    )}
                  </Right>
                </ListItem>
              </List>
            );
          })}
        </Content>
        {!this.state.selected && <FloatButton add={this.openModal} />}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  contacts: Object.values(state.contacts.contacts),
  chat: state.chats.chat,
  userData: state.config
});

export default connect(
  mapStateToProps,
  { saveContact, getContacts, selectedChat, deleteContact }
)(Contacts);

const styles = StyleSheet.create({
  imageStyles: {
    width: 60,
    height: 60,
    borderRadius: 100
  },
  textContainer: {
    flexWrap: "wrap"
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777"
  },
  textBold: {
    fontWeight: "500",
    color: "#000"
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)"
  },
  buttonTouchable: {
    padding: 16
  }
});

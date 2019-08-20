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
import { Image, View, StyleSheet, TouchableOpacity } from "react-native";
import { saveContact, getContacts } from "../../store/contacts";
import { connect } from "react-redux";


class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false
    };
  }
  static navigationOptions = {
    header: null
  };

  componentWillMount = () => {
    this.props.getContacts();
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

  render() {
    console.log(this.props.contacts);
    return (
      <Container>
        <Header {...this.props} modal={this.state.openModal} />
        {this.state.openModal && (
          <AddContact {...this.state} {...this.props} close={this.closeModal} />
        )}

        <Content>
          {this.props.contacts.map((contact, key) => {
            console.log(contact.image);
            return (
              <List key={key}>
                <ListItem button style={{ height: 80 }}>
                  <Left style={styles.textContainer}>
                    <Text style={{ width: "100%", paddingBottom: 5 }}>
                      {contact.name}
                    </Text>
                    <Text note>{contact.uid}</Text>
                  </Left>
                  <Right>
                    <Image
                      style={styles.imageStyles}
                      source={{
                        uri: contact.image,
                        cache: "force-cache"
                      }}
                    />
                  </Right>
                </ListItem>
              </List>
            );
          })}
        </Content>
        <FloatButton add={this.openModal} />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  contacts: state.contacts.contacts
});

export default connect(
  mapStateToProps,
  { saveContact, getContacts }
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

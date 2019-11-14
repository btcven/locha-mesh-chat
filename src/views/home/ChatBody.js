import React, { Component } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { sha256 } from "js-sha256";
import FileModal from "./fileModal";
import { ReceiveMessage, SenderMessage, SoundMessage } from "./Messages";
import Sound from "react-native-sound";
import { songs } from "../../utils/constans";

/**
 *
 *
 * @export
 * @class ChatBody
 * @description component where messages sent and received are displayed
 * @extends {Component}
 */

export default class ChatBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: []
    };
  }

  componentDidMount = () => {
    this.sound = new Sound(songs.song3.url, error => {
      if (error) {
        console.warn("failed to load the sound", error);
      } else {
      }
    });
  };

  componentDidUpdate = prevProps => {
    if (this.props.chats.length > 0) {
      const rule1 = prevProps
        ? this.props.chats.length !== prevProps.chats.length
        : false;

      lastMessage = this.props.chats[0];
      if (rule1) {
        if (sha256(this.props.user.uid) !== lastMessage.fromUID) {
          this.sound.setVolume(0.1).play();

          const sendStatus = {
            fromUID: this.props.user.uid,
            toUID: lastMessage.fromUID,
            timestamp: new Date().getTime(),
            data: {
              status: "read",
              msgID: lastMessage.id
            },
            type: "status"
          };

          if (lastMessage.toUID) {
            this.props.sendReadMessageStatus(sendStatus);
          }
        }
      }
    }
  };

  getContactInfo = item => {
    const result = this.props.contacts.find(contact => {
      return item.fromUID === contact.hashUID;
    });

    return result;
  };

  onSelected = item => {
    this.setState({
      selected: this.state.selected.concat(item)
    });
  };

  verifySelected = item => {
    const result = this.props.selected.find(select => {
      return select.id === item.id;
    });

    if (result) {
      return styles.selected;
    }
  };

  retry = item => {
    item.timestamp = new Date().getTime();

    this.props.sendAgain(item);
  };

  render() {
    const { screenProps } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {this.props.open && (
          <FileModal
            open={this.props.open}
            close={this.props.close}
            sendFileWithImage={this.props.sendFileWithImage}
            screenProps={screenProps}
          />
        )}

        <FlatList
          inverted
          contentContainerStyle={styles.container}
          data={this.props.chats}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const contactInfo = this.getContactInfo(item);
            const selected =
              this.props.selected.length > 0 ? this.verifySelected(item) : null;
            let userInfo = contactInfo ? contactInfo : item;
            const file = item.file ? item.file.fileType : undefined;

            const rule =
              sha256(this.props.user.uid) === item.fromUID ? true : false;

            if (!rule && file !== "audio") {
              return (
                <ReceiveMessage
                  {...this.props}
                  item={item}
                  contactInfo={contactInfo}
                  userInfo={userInfo}
                  selected={selected}
                  index={index}
                />
              );
            } else if (rule && file !== "audio") {
              return (
                <SenderMessage
                  {...this.props}
                  item={item}
                  selected={selected}
                  index={index}
                  retry={this.retry}
                />
              );
            } else {
              return (
                <SoundMessage
                  {...this.props}
                  item={item}
                  rule={rule}
                  contactInfo={contactInfo}
                  userInfo={userInfo}
                  selected={selected}
                  index={index}
                />
              );
            }
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    backgroundColor: "#eeeeee",
    paddingBottom: 10
  },
  senderContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10
  },

  selected: {
    backgroundColor: "rgba(255, 235, 59 , 0.5)"
  },

  receiveContainer: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 10,
    flexDirection: "row"
  },
  textContent1: {
    maxWidth: "82%",
    backgroundColor: "#fff",
    minHeight: 30,
    paddingTop: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 7,
    flexDirection: "column"
  },
  textContent2: {
    maxWidth: "82%",
    backgroundColor: "#fff",
    minHeight: 30,
    paddingTop: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 7,
    flexDirection: "column",
    backgroundColor: "#90caf9"
  }
});

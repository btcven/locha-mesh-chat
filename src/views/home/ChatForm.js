import React, { Component } from "react";
import { Icon, Button } from "native-base";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity
} from "react-native";

export default class ChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      height: 20
    };
  }

  send = () => {
    const { user, navigation, setChat, previousChat } = this.props;
    const sendObject = {
      fromUID: user.id,
      toUID: navigation.params.uid,
      data: {
        text: this.state.message
      },
      timestamp: new Date().getTime(),
      type: "text"
    };
    const newArray = previousChat.concat({ ...sendObject }).sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    setChat(newArray);
  };

  render() {
    return (
      <View style={{minHeight: 50 , height:this.state.height , maxHeight:120}} >
        <ScrollView contentContainerStyle={styles.contentForm}>
          <TouchableOpacity>
            <Icon
              style={styles.iconChatStyle}
              type="MaterialIcons"
              name="attach-file"
            />
          </TouchableOpacity>
          <TextInput
            multiline={true}
            style={{ height: this.state.height }}
            value={this.state.message}
            onChangeText={text => this.setState({ message: text })}
            onContentSizeChange={event => {
              this.setState({ height: event.nativeEvent.contentSize.height });
            }}
            placeholder="Mensaje"
            style={{
              flex: 1
            }}
          />

          {this.state.message.length === 0 && (
            <TouchableOpacity>
              <Icon
                style={styles.iconChatStyle}
                type="MaterialIcons"
                name="mic"
              />
            </TouchableOpacity>
          )}

          {this.state.message.length !== 0 && (
            <TouchableOpacity onPress={this.send}>
              <Icon
                style={styles.iconChatStyle}
                type="MaterialIcons"
                name="send"
              />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {

    minHeight: 50
  },

  iconChatStyle: {
    color: "#80cbc4",
    fontSize: 32,
    paddingHorizontal: 5,
    paddingBottom:7
  },
  contentForm: {
    flexDirection: "row",
    alignItems: "flex-end",
    flex: 1,
    justifyContent: "space-between"
  }
});

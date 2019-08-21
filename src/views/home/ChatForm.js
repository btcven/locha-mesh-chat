import React, { Component } from "react";
import { Icon } from "native-base";
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
      message: ""
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentForm}>
          <TouchableOpacity>
            <Icon
              style={styles.iconChatStyle}
              type="MaterialIcons"
              name="attach-file"
            />
          </TouchableOpacity>
          <TextInput
            value={this.state.message}
            onChangeText={text => this.setState({ message: text })}
            placeholder="Mensage"
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
            <TouchableOpacity>
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
    height: "8%",
    minHeight: 50
  },

  iconChatStyle: {
    color: "#80cbc4",
    fontSize: 32,
    paddingHorizontal: 5
  },
  contentForm: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between"
  }
});

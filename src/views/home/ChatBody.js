import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableNativeFeedback
} from "react-native";
import Moment from "moment";
import { Thumbnail, Button } from "native-base";
import { sha256 } from "js-sha256";
import { getIcon, hashGenerateColort } from "../../utils/utils";
import FileModal from "./fileModal";

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
      console.log("holaaa", select.id === item.id);
      console.log(select.id, item.id);
      return select.id === item.id;
    });

    if (result) {
      return styles.selected;
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.open && (
          <FileModal open={this.props.open} close={this.props.close} />
        )}
        <FlatList
          inverted
          extraData={this.props.selected}
          contentContainerStyle={styles.container}
          data={this.props.chats}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const contactInfo = this.getContactInfo(item);
            const selected =
              this.props.selected.length > 0 ? this.verifySelected(item) : null;

            let userInfo = contactInfo ? contactInfo : item;
            if (sha256(this.props.user.uid) !== item.fromUID) {
              return (
                <TouchableNativeFeedback
                  onLongPress={() => this.props.onSelected(item)}
                  onPress={() => this.props.onClick(item)}
                  style={{
                    marginVertical: 5,
                    minHeight: 70,
                    width: "100%",
                    flexDirection: "row"
                  }}
                >
                  <View
                    key={index.toString()}
                    style={[styles.receiveContainer, selected]}
                  >
                    <>
                      {!item.toUID && !contactInfo && (
                        <Thumbnail
                          style={{
                            marginLeft: 5,
                            marginTop: 5
                          }}
                          source={{
                            uri: `${getIcon(item.fromUID)}`
                          }}
                        />
                      )}

                      {!item.toUID && contactInfo && (
                        <Thumbnail
                          style={{
                            marginLeft: 5,
                            marginTop: 5
                          }}
                          source={{
                            uri: `${userInfo.picture}`
                          }}
                        />
                      )}
                      <View style={{ width: "90%", flexDirection: "row" }}>
                        <View style={styles.textContent1}>
                          {item.name && (
                            <Text
                              style={{
                                paddingBottom: 7,
                                color: hashGenerateColort(item.fromUID)
                              }}
                            >
                              {userInfo.name}
                            </Text>
                          )}
                          <View style={{ minWidth: 110 }}>
                            <Text style={{ fontSize: 15 }}>{item.msg}</Text>
                          </View>
                          <Text
                            style={{
                              paddingTop: 3,
                              paddingLeft: 10,
                              paddingBottom: 6,
                              fontSize: 12,
                              textAlign: "right"
                            }}
                          >
                            {Moment(Number(item.timestamp)).format("LT")}
                          </Text>
                        </View>
                      </View>
                    </>
                  </View>
                </TouchableNativeFeedback>
              );
            } else {
              return (
                <TouchableNativeFeedback
                  useForeground
                  style={{
                    marginVertical: 5,
                    width: "100%",
                    justifyContent: "flex-end",
                    flexDirection: "row"
                  }}
                  onLongPress={() => this.props.onSelected(item)}
                  onPress={() => this.props.onClick(item)}
                >
                  <View
                    key={index.toString()}
                    style={[styles.senderContainer, selected]}
                  >
                    <View style={styles.textContent2}>
                      <Text style={{ fontSize: 15 }}>{item.msg}</Text>
                      <Text
                        style={{
                          paddingTop: 7,
                          paddingLeft: 5,
                          paddingBottom: 6,
                          fontSize: 12,
                          textAlign: "right"
                        }}
                      >
                        {Moment(Number(item.timestamp)).format("LT")}
                      </Text>
                    </View>
                  </View>
                </TouchableNativeFeedback>
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

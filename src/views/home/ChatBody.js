import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, FlatList } from "react-native";
import Moment from "moment";
import { Thumbnail } from "native-base";
import { sha256 } from "js-sha256";
import { getIcon, hashGenerateColort } from "../../utils/utils";

export default class ChatBody extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          inverted
          contentContainerStyle={styles.container}
          data={this.props.chats}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            if (sha256(this.props.user.uid) !== item.fromUID) {
              return (
                <View key={index.toString()} style={styles.receiveContainer}>
                  <Thumbnail
                    style={{
                     marginLeft:5,
                     marginTop:5
                    }}
                    source={{
                      uri: `${getIcon(item.fromUID)}`
                    }}
                  />
                  <View style={styles.textContent1}>
                    <Text
                      style={{
                        paddingBottom: 7,
                        color: hashGenerateColort(item.fromUID)
                      }}
                    >
                      {item.name}
                    </Text>
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
              );
            } else {
              return (
                <View key={index.toString()} style={styles.senderContainer}>
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
    alignItems: "flex-end",
    marginBottom: 10
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

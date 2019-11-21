import React, { Component } from "react";
import { Text, View, TextInput, StyleSheet } from "react-native";
import { Button } from "native-base";
import Modal from "react-native-modal";

export default class CreateAccount extends Component {
  render() {
    const { open, close, phrases } = this.props;
    return (
      <Modal
        isVisible={open}
        onBackdropPress={() => close("openModalPhoto")}
        swipeDirection={["up", "left", "right", "down"]}
        style={{
          margin: 0
        }}
      >
        <View style={styles.container}>
          <Text style={{ textAlign: "center", padding: 10, fontSize: 23 }}>
            Create new Account
          </Text>
          <Text style={{ paddingHorizontal: 10 }}>
            You'll need to save your backup phrase in case this app deleted
          </Text>
          <View style={styles.phrasesContainer}>
            {this.props.phrases.map((phrase, key) => {
              return (
                <View
                  key={key}
                  style={{
                    width: "20%",
                    margin: 0,
                    flexDirection: "row"
                  }}
                >
                  <TextInput
                    value={phrase}
                    style={{
                      borderBottomWidth: 0.5,
                      minWidth: 60,
                      textAlign: "center"
                    }}
                  />
                </View>
              );
            })}

            <View style={{ width: "100%", alignItems: "center", padding: 20 }}>
              <Button
                success
                style={{
                  minWidth: 100,
                  justifyContent: "center"
                }}
              >
                <Text style={{ marginHorizontal: 25 }}>Copiar</Text>
              </Button>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              light
              onPress={close}
              style={{
                justifyContent: "center",
                minWidth: 100,
                marginHorizontal: 10
              }}
            >
              <Text>{`atras`.toUpperCase()}</Text>
            </Button>
            <Button
              style={{
                marginHorizontal: 10,
                justifyContent: "center",
                backgroundColor: "#fbc233",
                minWidth: 100
              }}
            >
              <Text>{`Continue`.toUpperCase()}</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    minHeight: "60%",
    borderRadius: 5,
    marginHorizontal: 5
  },

  phrasesContainer: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginLeft: 12
  },
  buttonContainer: {
    flexDirection: "row",
    flex: 1,
    marginBottom: 10,
    marginTop: "15%",
    alignItems: "flex-end",
    justifyContent: "space-between"
  }
});

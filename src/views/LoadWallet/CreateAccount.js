import React, { Component } from "react";
import { Button } from "native-base";
import { Text, View, TextInput, StyleSheet, Clipboard } from "react-native";
import Modal from "react-native-modal";
import { Formik } from 'formik'
import { cleanSingle } from "react-native-image-crop-picker";


export default class CreateAccount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirm: null
    }
  }

  copyPhrases = async () => {
    Clipboard.setString(this.props.stringPhrases)
  }


  back = () => {
    if (!this.state.confirm) {
      this.props.back()
    } else {
      this.setState({ confirm: null })
    }
  }

  continue = () => {
    const seed = this.props.phrases.slice()


    while (seed.reduce((prev, curr) => prev + +(curr === ''), 0) < 3) {
      const k = Math.floor(Math.random() * (seed.length - 1));
      seed[k] = '';
    }

    this.setState({ confirm: seed })

  }

  confirm = (values) => {
    console.log(this.props.phrases.length , values.length);
    if (this.props.phrases.length !== values.length) return
  
  
    for (let index = 0; index <= values.length; index++) {
       console.log(values , this.props.phrases[index]);
      if (values[index] !== this.props.phrases[index]) return false
    }

    console.log("paso")
  }

  render() {
    const { open, close, phrases } = this.props;
    const values = this.state.confirm ? this.state.confirm : phrases
    return (
      <Formik
        enableReinitialize
        onSubmit={this.confirm}
        initialValues={values}
        render={
          ({ values, setFieldValue , handleSubmit }) => {
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
                  {this.state.confirm &&
                    <View>
                      <Text style={{ textAlign: "center", padding: 10, fontSize: 23 }}>
                        Confirm phrases
                  </Text>
                      <Text style={{ paddingHorizontal: 10 }}>
                        You'll need to save your backup phrase in case this app deleted
                  </Text>
                    </View>}

                  {!this.state.confirm &&
                    <View>
                      <Text style={{ textAlign: "center", padding: 10, fontSize: 23 }}>
                        Create new Account
                  </Text>
                      <Text style={{ paddingHorizontal: 10 }}>Please complete the backup phrase with missing words
                  </Text>
                    </View>}
                  <View style={styles.phrasesContainer}>
                    {values.map((phrase, key) => {
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
                            onChangeText={(text) => {
                              setFieldValue(`${key}`, text)
                            }}
                            style={{
                              borderBottomWidth: 0.5,
                              minWidth: 60,
                              textAlign: "center"
                            }}
                          />
                        </View>
                      );
                    })}

                    {!this.state.confirm && <View style={{ width: "100%", alignItems: "center", padding: 20 }}>
                      <Button
                        onPress={this.copyPhrases}
                        success
                        style={{
                          minWidth: 100,
                          justifyContent: "center"
                        }}
                      >
                        <Text style={{ marginHorizontal: 25 }}>Copiar</Text>
                      </Button>
                    </View>}
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button
                      light
                      onPress={this.back}
                      style={{
                        justifyContent: "center",
                        minWidth: 100,
                        marginHorizontal: 10
                      }}
                    >
                      <Text>{`atras`.toUpperCase()}</Text>
                    </Button>
                    {!this.state.confirm && <Button
                      onPress={this.continue}
                      style={{
                        marginHorizontal: 10,
                        justifyContent: "center",
                        backgroundColor: "#fbc233",
                        minWidth: 100
                      }}
                    >
                      <Text>{`Continue`.toUpperCase()}</Text>
                    </Button>}

                    {this.state.confirm && <Button
                      onPress={this.confirm}
                      style={{
                        marginHorizontal: 10,
                        justifyContent: "center",
                        backgroundColor: "#fbc233",
                        minWidth: 100
                      }}
                    >
                      <Text>{`Confirm`.toUpperCase()}</Text>
                    </Button>}
                  </View>
                </View>
              </Modal>
            )
          }
        }
      />
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

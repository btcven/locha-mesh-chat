import React, { Component } from "react";
import { Button } from "native-base";
import { Text, View, TextInput, StyleSheet, Clipboard } from "react-native";
import Modal from "react-native-modal";
import { Formik } from 'formik'
import PinView from "./PinView";


export default class CreateAccount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 3,
      seed: null
    }
  }

  copyPhrases = async () => {
    Clipboard.setString(this.props.stringPhrases)
  }


  back = () => {

    if (this.state.step === 1) {
      this.props.close()
    } else {
      this.setState({ step: this.state.step - 1 })
    }
  }

  continue = () => {
    const seed = this.props.phrases.slice()


    while (seed.reduce((prev, curr) => prev + +(curr === ''), 0) < 1) {
      const k = Math.floor(Math.random() * (seed.length - 1));
      seed[k] = '';
    }

    this.setState({ seed, step: 2 })

  }

  confirm = (values) => {
    if (this.props.phrases.length !== values.length) return


    for (let index = 0; index <= values.length; index++) {
      console.log(values, this.props.phrases[index]);
      if (values[index] !== this.props.phrases[index]) return
    }

    this.setState({ step: 3 })

  }

  render() {
    const { open, close, phrases, stringPhrases } = this.props;
    const values = this.state.step !== 1 ? this.state.seed : phrases

    return (
      <Formik
        enableReinitialize
        onSubmit={this.confirm}
        initialValues={values}
        render={
          ({ values, setFieldValue, handleSubmit }) => {
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
                  {this.state.step === 1 &&
                    <View>
                      <Text style={{ textAlign: "center", padding: 10, fontSize: 23 }}>
                        Confirm phrases
                  </Text>
                      <Text style={{ paddingHorizontal: 10 }}>
                        You'll need to save your backup phrase in case this app deleted
                  </Text>
                    </View>}

                  {this.state.step === 2 &&
                    <View>
                      <Text style={{ textAlign: "center", padding: 10, fontSize: 23 }}>
                        Create new Account
                  </Text>
                      <Text style={{ paddingHorizontal: 10 }}>Please complete the backup phrase with missing words
                  </Text>
                    </View>}
                  <View style={styles.phrasesContainer}>
                    {this.state.step !== 3 && values.map((phrase, key) => {
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
                  </View>
                  {this.state.step === 3 && < View >

                    <PinView />
                  </View>}

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
                    {this.state.step === 1 && <Button
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

                    {this.state.step === 2 && <Button
                      onPress={handleSubmit}
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

              </Modal >
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
    minHeight: 330,

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
    marginTop: "5%",
    alignItems: "flex-end",
    justifyContent: "space-between"
  }
});

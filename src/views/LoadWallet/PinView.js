import React, { Component } from 'react';
import { Button, Icon } from 'native-base'
import { View, Text, StyleSheet, TextInput } from 'react-native';


export default class PinView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: ['', '', '', '', '', ''],
      buttons: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      values: props.values
    }
  }

  componentDidMount = () => {
    const result = this.shuffle(this.state.buttons)
    const penultimate = result[result.length - 1]
    result[result.length - 1] = ''
    result.push(penultimate)
    result.push('delete')

    this.setState({ buttons: result, })
  }


  componentDidUpdate = () => {
    let pin = ""
    if (this.state.pin[5] !== "") {
      this.state.pin.map(arr => {
        pin += arr
      })
      this.props.createAccount(pin, this.state.values)
      this.setState({ pin: ['', '', '', '', '', ''] })
    }

  }

  setPin = (character) => {
    const array = this.state.pin.slice()
    if (character === "delete") {
      const result = array.findIndex((pin) => {
        return pin === ""
      })

      if (result === -1 && array[array.length - 1] !== "") {
        array[array.length - 1] = ""
      } else if (result === 0) {
        // this.props.back() 
      } else {
        array[result - 1] = ""
      }
      this.setState({ pin: array })
    } else {
      const result = array.findIndex((pin) => {
        return pin === ""
      })

      array[result] = character

      this.setState({ pin: array })
    }
  }

  shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      if (array[currentIndex] !== 'delete') {

        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      } else {
        currentIndex -= 1;
      }
    }

    return array;

  }

  render() {
    return (
      <>
        <View style={styles.numberContainer}>
          {this.state.pin.map((pin, key) => {
            return <View
              key={key}
              style={{
                width: "15%",
                margin: 0,
                flexDirection: "row",
                justifyContent: 'center',
                marginBottom: 30,
              }}
            >
              <TextInput
                value={pin === "" ? pin : "*"}
                editable={false}
                style={{
                  color: "black",
                  borderBottomWidth: 0.5,
                  minWidth: 40,
                  height: 50,
                  fontSize: 20,
                  textAlign: "center"
                }}
              />
            </View>
          })}
        </View>
        <View style={styles.container}>
          {this.state.buttons.map((button, key) => {
            return (
              <View key={key} style={styles.buttonContainer}>
                <Button style={{ width: "50%", justifyContent: 'center' }} transparent onPress={() => this.setPin(button)}>
                  {button !== 'delete' && <Text style={styles.text}> {button} </Text>}
                  {button === 'delete' && <Icon name="backspace" style={{ color: '#fbc233' }} />}
                </Button>
              </View>
            )
          })
          }
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },

  buttonContainer: {
    width: '33%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 5
  },
  text: {
    fontSize: 20
  },

  numberContainer: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
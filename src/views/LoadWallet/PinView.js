import React, { Component } from 'react';
import { Button, Icon } from 'native-base'
import { View, Text, StyleSheet, TextInput } from 'react-native';


export default class PinView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pin: ['', '', '', '']
        }
    }

    componentDidUpdate =() =>{

    }


    setPin = (character) => {
        const array = this.state.pin.slice()
        if (character === "delete") {
            const result = array.findIndex((pin) => {
                return pin === ""
            })

            if (result === -1 && array[array.length - 1] !== "") {
                array[array.length - 1] = ""
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



    render() {
        const array = ['1', '2', '3', '4', '5', '6', '7', '8', ' 9', '', '0', 'delete',]
        return (
            <>
                <View style={styles.numberContainer}>
                    {this.state.pin.map((pin, key) => {
                        return <View
                            key={key}
                            style={{
                                width: "20%",
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
                                    color:"black",
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
                    {array.map((button, key) => {
                        return (
                            <View key={key} style={styles.buttonContainer}>
                                <Button transparent onPress={() => this.setPin(button)}>
                                    {array.length - 1 !== key && <Text style={styles.text}> {button} </Text>}
                                    {array.length - 1 === key && <Icon name="backspace" />}
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
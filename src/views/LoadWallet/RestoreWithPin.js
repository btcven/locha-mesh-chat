import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PinView from './PinView'
import Modal from 'react-native-modal'
import { restoreAccountWithPin } from '../../store/aplication/aplicationAction'
import { connect } from "react-redux"

class RestoreWithPin extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    restoreAccount = (pin) => {

        this.props.restoreAccountWithPin(pin)
    }


    render() {
        return (
            <View>
                <Modal
                    isVisible={this.props.open}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    animationOutTiming={800}
                    style={{
                        margin: 0, justifyContent: "flex-end",
                    }}
                >
                    <View style={styles.container}>
                        <View style={styles.viewContainer}>
                            <Text>Enter your pin to access your account</Text>
                        </View>
                        <PinView createAccount={this.restoreAccount} />

                        <View style={styles.viewContainer}>
                            <Text>Forgot your pin?</Text>
                            <TouchableOpacity onPress={() => alert('not available at the moment')}>

                                <Text style={{ paddingHorizontal: 5, color: '#fbc233' }}>Click here</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}


export default connect(null, { restoreAccountWithPin })(RestoreWithPin)

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white", borderRadius: 5,
        marginHorizontal: 5
    },
    viewContainer: { flexDirection: "row", justifyContent: 'center', padding: 20 }
})
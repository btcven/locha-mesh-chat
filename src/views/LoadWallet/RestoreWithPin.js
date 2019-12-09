import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PinView from './PinView'
import Modal from 'react-native-modal'
import { androidToast } from '../../utils/utils'
import { restoreAccountWithPin } from '../../store/aplication/aplicationAction'
import { connect } from "react-redux"

class RestoreWithPin extends Component {
    state = {
        close: false
    }
    restoreAccount = (pin) => {
        this.props.restoreAccountWithPin(pin, (res) => {
            androidToast(this.props.screenProps.t("Initial:error1"))
        })
    }


    componentWillUnmount = () => {
        this.setState({ close: true })
    }

    render() {
        const { screenProps, text, action, config, close, open } = this.props

        const actionCreate = config ? action : this.restoreAccount
        const openModal = this.state.close ? false : open
        return (
            <View>
                <Modal
                    isVisible={openModal}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    animationOutTiming={800}
                    onBackdropPress={() => config ? close("pin") : null}
                    style={{
                        margin: 0, justifyContent: "flex-end",
                    }}
                >
                    <View style={styles.container}>
                        <View style={styles.viewContainer}>
                            {!config && <Text> {screenProps.t("Initial:subtitlePin2")}</Text>}
                            {config && <Text>{text} </Text>}
                        </View>
                        <PinView createAccount={actionCreate} />

                        {!config && <View style={styles.viewContainer}>
                            <Text>{screenProps.t("Initial:forgotPin")}</Text>
                            <TouchableOpacity onPress={() => alert('not available at the moment')}>
                                <Text style={{ paddingHorizontal: 5, color: '#fbc233' }}>{screenProps.t("Initial:click")}</Text>
                            </TouchableOpacity>
                        </View>}
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
    viewContainer: {
        flexDirection: "row",
        justifyContent: 'center',
        padding: 20
    }
})
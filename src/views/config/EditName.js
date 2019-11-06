import React, { Component } from "react";
import Modal from "react-native-modal";
import { View, StyleSheet } from "react-native";
import { Item, Input, Form, Button, Right, Text } from "native-base";
/**
 *
 *
 * @export
 * @class EditName
 * @description component to edit the username
 * @extends {Component}
 */
export default class EditName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }

  saveName = () => {
    this.props.editName(
      { name: this.state.name, uid: this.props.config.uid },
      () => {
        this.props.close("openModalName");
      }
    );
  };

  render() {
    const { open, close } = this.props;
    const disabled = this.state.name.length > 1 ? false : true;
    return (
      <View>
        <Modal
          style={{
            justifyContent: "flex-end",
            margin: 0
          }}
          avoidKeyboard={true}
          isVisible={open}
          onBackdropPress={() => close("openModalName")}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: "100%"
            }}
          >
            <Text style={styles.titleModal}>Editar Nombre </Text>
            <Form>
              <Text style={{ position: "absolute", top: "40%", right: "5%" }}>
                {12 - this.state.name.length}
              </Text>
              <Item stackedLabel>
                <Input
                  maxLength={12}
                  placeholder="Ingrese Nombre"
                  value={this.state.name}
                  onChangeText={event => this.setState({ name: event })}
                />
              </Item>
            </Form>
            <View
              style={{
                padding: 20,
                flexDirection: "row",
                justifyContent: "flex-end"
              }}
            >
              <Button
                onPress={() => close("openModalName")}
                transparent
                style={{
                  marginHorizontal: 10
                }}
              >
                <Text style={styles.styleTextButton}>Cancelar</Text>
              </Button>
              <Button
                transparent
                disabled={disabled}
                onPress={() => this.saveName()}
                style={styles.styleTextButton}
              >
                <Text>Guardar</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  styleTextButton: {
    paddingHorizontal: 10
  },

  titleModal: {
    padding: 20,
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: "400"
  }
});

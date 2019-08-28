import React, { Component } from "react";
import Modal from "react-native-modal";
import { View, Text, StyleSheet } from "react-native";
import { Item, Input, Form, Button, Right } from "native-base";

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
              <Item stackedLabel>
                <Input
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
                danger
                style={{
                  marginHorizontal: 10
                }}
              >
                <Text style={styles.styleTextButton}>Cancelar</Text>
              </Button>
              <Button
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

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { Button, Text, Icon } from 'native-base';

const AlerMessage = ({ open, close }) => (
  <View>
    <Modal
      avoidKeyboard

      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationOutTiming={800}
      isVisible={open}
    >
      <View style={{ backgroundColor: 'white', borderRadius: 5 }}>
        <View style={{ justifyContent: 'center', width: '100%', alignItems: 'center' }}>
          <Icon type="MaterialIcons" name="warning" style={styles.iconStyle} />
        </View>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 16, textAlign: 'justify' }}>Usuario y contraseña para acceder a la configuración de esp32 esta por defecto para mayor seguridad se le recomienda cambiarla</Text>
          <View style={{ width: '100%', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <Button
              styles={styles.styleTextButton}
              onPress={close}
              transparent
            >
              <Text>OK</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  </View>
);
const styles = StyleSheet.create({
  styleTextButton: {
    paddingHorizontal: 10
  },

  iconStyle: {
    color: '#fbc233',
    fontSize: 60,
    paddingTop: 20,
    paddingBottom: 10
  },

  titleModal: {
    padding: 20,
    fontSize: 20,
    fontWeight: '400'
  }
});

export default AlerMessage;

import React from 'react';
import {
  Text, StyleSheet, Button, View
} from 'react-native';
import { Icon, Container } from 'native-base';


/**
 * component used to show when there is no connection to the server
 */

const ErrorInfo = ({ getDeviceInfo, screenProps }) => (
  <Container style={styles.container}>
    <Icon type="MaterialIcons" name="error" style={styles.iconStyle} />
    <Text style={styles.textStyle}>{screenProps.t('DeviceSettings:errorInfo')}</Text>
    <View style={styles.buttonStyle}>
      <Button color="#fbc233" title={screenProps.t('DeviceSettings:retryButton')} onPress={getDeviceInfo} />
    </View>
  </Container>
);

export default ErrorInfo;


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },

  iconStyle: {
    color: '#fbc233',
    fontSize: 60,
    paddingTop: 20,
    paddingBottom: 20
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 15
  },
  buttonStyle: {
    paddingVertical: 20
  }
});

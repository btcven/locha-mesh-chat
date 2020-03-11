import React from 'react';
import { View, ActivityIndicator, Modal } from 'react-native';

/**
 *
 *@function
 *@description reusable component is a spinner that is used when the app is loading something
 */

const Spinner = () => (
  <Modal
    animationType="fade"
    transparent
    visible
    onRequestClose={() => {}}
  >
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator color="#FAB300" size="large" />
    </View>
  </Modal>
);

export default Spinner;

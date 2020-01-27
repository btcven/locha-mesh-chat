import React from 'react';
import {
  View, TextInput, StyleSheet, Platform
} from 'react-native';

const Phrases = ({
  values,
  setFieldValue
}) => (
  <View style={styles.phrasesContainer}>
    {values.map((phrase, key) => (
      <View
        key={key}
        style={{
          width: '20%',
          margin: 0,
          flexDirection: 'row'
        }}
      >
        <TextInput
          value={phrase}
          autoCapitalize="none"
          onChangeText={(text) => {
            setFieldValue(`${key}`, text);
          }}
          style={styles.inputStyles}
        />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  phrasesContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginLeft: 12
  },
  inputStyles: {
    borderBottomWidth: 0.5,
    minWidth: 60,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        marginVertical: 15
      },
    }),
  }
});

export default Phrases;

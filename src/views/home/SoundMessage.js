/* eslint-disable consistent-return */
import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform
} from 'react-native';
import Moment from 'moment';
import { Thumbnail } from 'native-base';
import Player from '../../components/Player ';
import { getIcon, hashGenerateColort } from '../../utils/utils';

const TouchableList = Platform.select({
  ios: () => TouchableHighlight,
  android: () => TouchableNativeFeedback,
})();
export default class SoundMessage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      onClick,
      onSelected,
      userInfo,
      item,
      contactInfo,
      selected,
      view,
      index,
    } = this.props;
    if (view === 'receive') {
      return (
        <TouchableList
          key={index}
          underlayColor="#DDD"
          onLongPress={() => onSelected(item)}
          onPress={() => onClick(item)}
          style={{
            marginVertical: 5,
            minHeight: 70,
            width: '100%',
            flexDirection: 'row'
          }}
        >
          <View style={[styles.receiveContainer, selected]}>
            {item.toUID === 'broadcast' && !contactInfo && (
              <Thumbnail
                style={{
                  marginLeft: 5,
                  marginTop: 5
                }}
                source={{
                  uri: `${getIcon(item.idHash)}`
                }}
              />
            )}

            {item.toUID !== 'broadcast' && contactInfo && (
              <Thumbnail
                style={{
                  marginLeft: 5,
                  marginTop: 5
                }}
                source={{
                  uri: userInfo.picture
                    ? `${userInfo.picture}`
                    : `${getIcon(item.idHash)}`
                }}
              />
            )}
            <View style={{ width: '90%', flexDirection: 'row' }}>
              <View style={styles.textContent1}>
                {item.name && (
                  <Text
                    style={{
                      paddingBottom: 7,
                      color: hashGenerateColort(item.fromUID)
                    }}
                  >
                    {userInfo.name}
                  </Text>
                )}
                <Player path={item.file.file} />
                <Text
                  style={styles.timeStyle}
                >
                  {Moment(Number(item.timestamp)).format('LT')}
                </Text>
              </View>
            </View>
          </View>
        </TouchableList>
      );
    }
    return (
      <TouchableList
        key={index}
        underlayColor="#DDD"
        useForeground
        style={{
          marginVertical: 5,
          width: '100%',
          justifyContent: 'flex-end',
          flexDirection: 'row'
        }}
        onLongPress={() => onSelected(item)}
        onPress={() => onClick(item)}
      >
        <View style={[styles.senderContainer, selected]}>
          <View style={styles.textContent2}>
            <Player path={item.file.file} index={index} />
            <Text
              style={{
                paddingTop: 7,
                paddingLeft: 5,
                paddingBottom: 6,
                fontSize: 12,
                textAlign: 'right'
              }}
            >
              {Moment(Number(item.timestamp)).format('LT')}
            </Text>
          </View>
        </View>
      </TouchableList>
    );
  }
}

const styles = StyleSheet.create({
  senderContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10
  },

  receiveContainer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  textContent1: {
    maxWidth: '82%',
    backgroundColor: '#fff',
    minHeight: 30,
    paddingTop: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 7,
    flexDirection: 'column'
  },
  textContent2: {
    maxWidth: '82%',
    backgroundColor: '#fff',
    minHeight: 30,
    paddingTop: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 7,
    flexDirection: 'column',
  },

  timeStyle: {
    paddingTop: 3,
    paddingLeft: 10,
    paddingBottom: 6,
    fontSize: 12,
    textAlign: 'right'
  }
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableHighlight,
  Image,
  Platform
} from 'react-native';
import Moment from 'moment';
import { Thumbnail, Icon } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getIcon, hashGenerateColort } from '../../utils/utils';
import Player from '../../components/Player ';

const TouchableList = Platform.select({
  ios: () => TouchableHighlight,
  android: () => TouchableNativeFeedback,
})();

export const ReceiveMessage = ({
  onClick,
  onSelected,
  userInfo,
  item,
  contactInfo,
  selected
}) => (
  <TouchableList
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
          uri: `${getIcon(item.fromUID)}`
        }}
      />
      )}

      {item.toUID === 'broadcast' && contactInfo && (
      <Thumbnail
        style={{
          marginLeft: 5,
          marginTop: 5
        }}
        source={{
          uri: `${userInfo.picture ? userInfo.picture : getIcon(item.fromUID)
          }`
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
          <View style={{ minWidth: 110 }}>
            {item.file && (
            <View style={{ minWidth: '80%' }}>
              <Image
                style={{ width: '100%', height: 150 }}
                source={{
                  resizeMode: 'contain',
                  uri: item.file.file,
                  cache: 'force-cache'
                }}
              />
            </View>
            )}
            <Text style={{ fontSize: 15 }}>{item.msg}</Text>
          </View>
          <Text
            style={{
              paddingTop: 3,
              paddingLeft: 10,
              paddingBottom: 6,
              fontSize: 12,
              textAlign: 'right'
            }}
          >
            {Moment(Number(item.timestamp)).format('LT')}
          </Text>
        </View>
      </View>
    </View>
  </TouchableList>
);

export const SenderMessage = ({
  onClick,
  onSelected,
  item,
  selected,
  retry
}) => {
  const timeCreated = Moment(item.shippingTime);
  const cancelled = !!((Moment().diff(timeCreated, 's') > 30 && item.status === 'pending')
    || item.status === 'not sent');

  const styleBody = item.msg.length < 20 ? styles.styleBody1 : styles.styleBody2;

  const textStyle = item.msg.length < 20 ? styles.textStyle1 : styles.textStyle2;

  const iconName = item.toUID ? 'checkmark' : 'user-check';
  const IconType = iconName === 'checkmark' ? 'Ionicons' : 'FontAwesome5';
  return (
    <TouchableList
      underlayColor="#DDD"
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
          {item.file && (
            <View style={{ minWidth: '80%' }}>
              <Image
                style={{ width: '100%', height: 150 }}
                source={{
                  resizeMode: 'contain',
                  uri: item.file.file,
                  cache: 'force-cache'
                }}
              />
            </View>
          )}
          <View style={styleBody}>
            <View>
              <Text style={{ fontSize: 15 }}>{item.msg}</Text>
            </View>
            <View style={textStyle}>
              <View style={{ flexDirection: 'row' }}>
                <Text>{Moment(Number(item.timestamp)).format('LT')}</Text>
                {item.status === 'pending' && !cancelled && (
                  <Icon
                    style={{ color: 'gray', fontSize: 15, marginLeft: 10 }}
                    name="time"
                  />
                )}
                {item.status === 'delivered' && (
                  <Icon
                    style={{ color: 'gray', fontSize: 15, marginLeft: 10 }}
                    type={IconType}
                    name={iconName}
                  />
                )}
                {item.status === 'read' && (
                  <Icon
                    style={{ color: 'gray', fontSize: 15, marginLeft: 10 }}
                    name="done-all"
                  />
                )}
                {cancelled && (
                  <TouchableOpacity onPress={() => retry(item)}>
                    <Icon
                      type="MaterialIcons"
                      style={{ color: 'gray', fontSize: 16, marginLeft: 10 }}
                      name="error"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableList>
  );
};

export const SoundMessage = ({
  onClick,
  onSelected,
  userInfo,
  item,
  contactInfo,
  selected,
  rule,
  index,
  chats
  // eslint-disable-next-line consistent-return
}) => {
  if (!rule) {
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
          {!item.toUID && !contactInfo && (
            <Thumbnail
              style={{
                marginLeft: 5,
                marginTop: 5
              }}
              source={{
                uri: `${getIcon(item.fromUID)}`
              }}
            />
          )}

          {!item.toUID && contactInfo && (
            <Thumbnail
              style={{
                marginLeft: 5,
                marginTop: 5
              }}
              source={{
                uri: userInfo.picture
                  ? `${userInfo.picture}`
                  : `${getIcon(item.fromUID)}`
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
                style={{
                  paddingTop: 3,
                  paddingLeft: 10,
                  paddingBottom: 6,
                  fontSize: 12,
                  textAlign: 'right'
                }}
              >
                {Moment(Number(item.timestamp)).format('LT')}
              </Text>
            </View>
          </View>
        </View>
      </TouchableList>
    );
  }
  if (item.file.file === chats[index].file.file) {
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
};

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    backgroundColor: '#eeeeee',
    paddingBottom: 10
  },
  senderContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 10
  },

  selected: {
    backgroundColor: 'rgba(255, 235, 59 , 0.5)'
  },

  receiveContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 10,
    flexDirection: 'row'
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
    paddingTop: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 7,
    flexDirection: 'column',
  },
  styleBody1: {
    flexDirection: 'row',
    flex: 1
  },
  styleBody2: {
    flexDirection: 'column'
  },

  textStyle1: {
    paddingTop: 7,
    paddingLeft: 10,
    paddingBottom: 6,
    fontSize: 12,
    alignItems: 'flex-end'
  },

  textStyle2: {
    paddingTop: 5,
    paddingBottom: 6,
    flex: 1,
    alignItems: 'flex-end'
  }
});

import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Sound from 'react-native-sound';
import FileModal from './fileModal';
import { ReceiveMessage, SenderMessage, SoundMessage } from './Messages';
import { songs, messageType } from '../../utils/constans';
import ImagesView from './imagesView';


/**
 *
 * @export
 * @class ChatBody
 * @description component where messages sent and received are displayed
 * @extends {Component}
 */

export default class ChatBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      imagesView: []
    };
  }

  componentDidMount = () => {
    this.sound = new Sound(songs.song3.url, (error) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.warn('failed to load the sound', error);
      }
    });
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.chats.length > 0) {
      const rule1 = prevProps
        ? this.props.chats.length !== prevProps.chats.length
        : false;

      const lastMessage = this.props.chats[0];
      if (rule1) {
        if (this.props.user.peerID !== lastMessage.fromUID) {
          this.sound.setVolume(0.1).play();
          const sendStatus = {
            fromUID: this.props.user.peerID,
            toUID: lastMessage.fromUID,
            timestamp: new Date().getTime(),
            data: {
              status: 'read',
              msgID: lastMessage.id
            },
            type: messageType.STATUS
          };

          if (lastMessage.toUID) {
            this.props.sendReadMessageStatus(sendStatus);
          }
        }
      }
    }
  };

  getContactInfo = (infoItem) => {
    const result = this.props.contacts.find((contact) => infoItem.fromUID === contact.uid);

    return result;
  };

  onSelected = (item) => {
    this.setState({
      selected: this.state.selected.concat(item)
    });
  };

  verifySelected = (item) => {
    const result = this.props.selected.find((select) => select.id === item.id);

    if (result) {
      return styles.selected;
    }
    return undefined;
  };

  retry = (retryItem) => {
    // eslint-disable-next-line no-param-reassign
    retryItem.shippingTime = new Date().getTime();

    this.props.sendAgain(retryItem);
  };

  setImageView = (imageArray) => {
    setTimeout(() => {
      this.setState({ imagesView: imageArray });
    }, 200);
  }

  closeView = () => {
    this.setState({ imagesView: [] });
  };

  render() {
    const { screenProps } = this.props;
    const { imagesView } = this.state;
    const viewImages = imagesView.length !== 0;
    return (
      <View style={{ flex: 1 }}>
        {this.props.open && (
          <FileModal
            open={this.props.open}
            close={this.props.close}
            sendFileWithImage={this.props.sendFileWithImage}
            screenProps={screenProps}
            setImageView={this.setImageView}
          />
        )}

        <ImagesView
          sendFileWithImage={this.props.sendFileWithImage}
          open={viewImages}
          images={imagesView}
          close={this.closeView}
          screenProps={screenProps}
        />

        <FlatList
          inverted
          contentContainerStyle={styles.container}
          data={this.props.chats}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const contactInfo = this.getContactInfo(item);
            const selected = this.props.selected.length > 0 ? this.verifySelected(item) : null;
            const userInfo = contactInfo || item;
            const file = item.file ? item.file.fileType : undefined;

            const rule = this.props.user.peerID === item.fromUID;

            if (!rule && file !== 'audio') {
              return (
                <ReceiveMessage
                  {...this.props}
                  item={item}
                  contactInfo={contactInfo}
                  userInfo={userInfo}
                  selected={selected}
                  index={index}
                />
              );
            } if (rule && file !== 'audio') {
              return (
                <SenderMessage
                  {...this.props}
                  item={item}
                  selected={selected}
                  index={index}
                  retry={this.retry}
                />
              );
            }
            return (
              <SoundMessage
                {...this.props}
                item={item}
                rule={rule}
                contactInfo={contactInfo}
                userInfo={userInfo}
                selected={selected}
                index={index}
              />
            );
          }}
        />
      </View>
    );
  }
}

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
    marginBottom: 10
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
  }
});

/* eslint-disable react/sort-comp */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Icon
} from 'native-base';
import { connect } from 'react-redux';
import {
  Alert, View,
} from 'react-native';
import Moment from 'moment';
import {
  getSelectedColor,
  unSelect,
  getIcon
} from '../../utils/utils';
import Header from '../../components/Header';
import { selectedChat, deleteChat } from '../../store/chats';
import FloatButton from '../../components/FloatButton';
import { broadcastInfo } from '../../utils/constans';

/**
 *
 * @class index
 * @description main component of the home where the list of open chats are
 * @extends {Component}
 *
 */
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: []
    };
  }

  // eslint-disable-next-line react/sort-comp
  static navigationOptions = {
    drawerLabel: 'Home'
  };

  selectedChat = (info, obj) => {
    if (this.state.selected.length === 0) {
      this.props.navigation.navigate('chat',
        {
          contacts: {
            ...obj,
          },
          chatUID: obj.toUID,
          hashUID: info.hashUID,
          name: info.name
        });
      return;
    }

    const selected = unSelect(this.state.selected, obj);

    if (selected.found) {
      this.setState({ selected: selected.data });
    } else {
      this.setState({
        selected: this.state.selected.concat(obj)
      });
    }
  };

  deleteChat = async () => {
    const { screenProps } = this.props;
    Alert.alert(
      `${screenProps.t('Chats:titleDelete')}`,
      `${screenProps.t('Chats:deleteBody')}`,
      [
        {
          text: 'Cancel',
          onPress: () => this.setState({ selected: [] }),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => this.props.deleteChat(this.state.selected, () => {
            this.setState({ selected: [] });
          })
        }
      ],
      { cancelable: false }
    );
  };

  getContactInformation = (data) => {
    if (data.toUID === broadcastInfo.name.toLowerCase()) {
      return {
        name: broadcastInfo.name,
        picture: null,
        hashUID: broadcastInfo.hashUID
      };
    }

    const result = this.props.contacts.find((contact) => data.toUID === contact.uid);
    return result;
  };

  seleted = (data) => {
    const object = { ...data };
    delete object.messages;

    this.setState({
      selected: this.state.selected.concat(data)
    });
  };

  search = (text) => {
    this.setState({ search: text });
  };

  /**
   *
   * This function is used to return the chat and contact information
   * @param {string} id
   * @returns {object}
   */

  getFilesInfo = (typeFile) => {
    const { screenProps } = this.props;
    if (typeFile === 'image') {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <Icon style={{ fontSize: 20, color: '#9e9e9e' }} name="camera" />
          <Text style={{ marginHorizontal: 5 }} note>
            {screenProps.t('Chats:photo')}
          </Text>
        </View>
      );
    } if (typeFile === 'audio') {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <Icon style={{ fontSize: 20, color: '#9e9e9e' }} name="mic" />
          <Text style={{ marginHorizontal: 5 }} note>
            {screenProps.t('Chats:voice')}
          </Text>
        </View>
      );
    }
    return (
      <Text note>
        {typeFile.length > 25
          ? `${`${typeFile}`.substr(0, 25)}...`
          : typeFile}
      </Text>
    );
  };

  getDataTypeMessage = (message) => {
    if (typeof message === 'string') {
      return this.getFilesInfo(message);
    }
    if (message.file) {
      return this.getFilesInfo(message.file.fileType);
    }
    return this.getFilesInfo(message.msg);
  };

  closeSelected = () => {
    this.setState({ selected: [] });
  };

  orderChats = (orderChats) => {
    const sort = orderChats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return sort;
  };

  render() {
    const result = this.state.search
      ? Object.values(this.props.chats).filter((chat) => (
        chat.toUID.toLowerCase().includes(this.state.search)
        || this.getContactInformation(chat)
          .name.toLowerCase()
          .includes(this.state.search.toLowerCase())
      ))
      : Object.values(this.props.chats);

    return (
      <Container>
        <Header
          {...this.props}
          {...this.state}
          delete={this.deleteChat}
          back={this.closeSelected}
          search={this.search}
        />
        <Content>
          {this.orderChats(result).map((chat) => {
            const queue = chat.queue ? Object.values(chat.queue) : [];

            const backgroundColor = getSelectedColor(
              this.state.selected,
              chat.toUID
            );
            const infoData = this.getContactInformation(chat);
            const messages = Object.values(chat.messages);


            if (messages.length !== 0 || (infoData && infoData.name.toLowerCase() === 'broadcast' && this.props.broadcast)) {
              const message = messages[messages.length - 1]
                ? messages[0]
                : broadcastInfo.lastMessage;

              //  getting last message
              const lastmessage = this.getDataTypeMessage(message);
              //  getting last datetime
              const lasTime = infoData.name === broadcastInfo.name
                ? broadcastInfo.date
                : Number(messages[messages.length - 1].timestamp);

              return (
                <List key={chat.toUID} style={{ backgroundColor }}>
                  <ListItem
                    avatar
                    button
                    onPress={() => {
                      this.selectedChat(infoData, chat);
                    }}
                    onLongPress={() => this.seleted(chat)}
                  >
                    <Left>
                      {!infoData.picture && (
                        <Thumbnail source={{
                          uri: `${getIcon(infoData.hashUID)}`
                        }}
                        />
                      )}
                      {infoData.picture && (
                        <Thumbnail
                          source={{
                            uri: infoData.picture,
                            cache: 'force-cache'
                          }}
                        />
                      )}
                    </Left>
                    <Body>
                      <Text>{infoData.name}</Text>
                      {lastmessage}
                    </Body>
                    <Right
                      style={{
                        height: '97%'
                      }}
                    >
                      <Text note>
                        {Moment(lasTime).format('LT')}
                      </Text>

                      {queue.length > 0 && (
                        <View
                          style={{
                            backgroundColor: '#52b202',
                            width: 25,
                            height: 24,
                            borderRadius: 100,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '10%',
                            marginRight: '10%'
                          }}
                        >
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 14,
                              marginBottom: 2
                            }}
                          >
                            {queue.length}
                          </Text>
                        </View>
                      )}
                    </Right>
                  </ListItem>
                </List>
              );
            }
          })}
        </Content>
        <FloatButton
          add={() => this.props.navigation.navigate('contacts')}
          icon={(
            <Icon
              type="MaterialIcons"
              name="message"
              style={{ fontSize: 24, color: '#f5f5f5' }}
            />
          )}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  chats: state.chats.chat,
  contacts: state.contacts.contacts,
  broadcast: state.chats.broadcast
});

export default connect(mapStateToProps, { selectedChat, deleteChat })(index);

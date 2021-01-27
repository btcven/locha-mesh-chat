/* eslint-disable class-methods-use-this */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/sort-comp */
import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Messages from './Messages';
// import { songs, messageType } from '../../utils/constans';
import ImagesView from './imagesView';
import SoundMessage from './SoundMessage';

/**
 *
 * @export
 * @class ChatBody
 * @description component where messages sent and received are displayed
 * @extends {Component}
 */

export default class ChatBody extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      columnNumber: 50,
      scroll: 0,
      imagesView: []
    };
  }

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
    this.props.sendAgain(retryItem, new Date().getTime());
  };


  handleMoreRequest = () => {
    const columns = this.state.columnNumber + 50;
    this.setState({
      columnNumber: columns
    });
    this.props.getMoreMessages(columns);
  }

  renderItem({ item }) {
    const contactInfo = this.getContactInfo(item);
    const selected = this.props.selected.length > 0 ? this.verifySelected(item) : null;
    const userInfo = contactInfo || item;
    const file = item.file ? item.file.fileType : undefined;

    const view = this.props.user.peerID === item.fromUID ? 'sender' : 'receive';
    if (file !== 'audio') {
      return (
        <Messages
          onClick={this.props.onClick}
          onSelected={this.props.onSelected}
          item={item}
          contactInfo={contactInfo}
          userInfo={userInfo}
          selected={selected}
          index={item.key}
          retry={this.retry}
          view={view}
        >
          {item.key}
        </Messages>
      );
    }
    return (
      <SoundMessage
        onClick={this.props.onClick}
        onSelected={this.props.onSelected}
        item={item}
        contactInfo={contactInfo}
        userInfo={userInfo}
        view={view}
        selected={selected}
        index={item.key}
      >
        {item.key}
      </SoundMessage>
    );
  }

  getKey(item, index) {
    return index.toString();
  }

  onScroll(e) {
    if (this.state.scroll < e.nativeEvent.contentOffset.y) {
      this.setState({
        scroll: e.nativeEvent.contentOffset.y
      });
    }

    const halfScroll = this.state.scroll / 2;
    if (e.nativeEvent.contentOffset.y <= halfScroll && this.state.columnNumber > 100) {
      const halfColumnNumbers = this.state.columnNumber / 2;
      this.setState({
        scroll: parseInt(halfScroll, 10),
        columnNumber: halfColumnNumbers
      });
      this.props.getMoreMessages(parseInt(this.state.columnNumber / 2, 10));
    }
  }

  render() {
    const { screenProps, imagesView, onlyView } = this.props;

    const viewImages = imagesView.length !== 0;
    return (
      <View style={{ flex: 1 }}>
        {viewImages
          && (
          <ImagesView
            sendFileWithImage={this.props.sendFileWithImage}
            onlyView={this.props.onlyView}
            open={viewImages}
            images={imagesView}
            close={this.props.closeView}
            screenProps={screenProps}
          />
          )}
        <FlatList
          inverted
          contentContainerStyle={styles.container}
          data={this.props.chats}
          onEndReached={this.handleMoreRequest}
          removeClippedSubviews
          onEndReachedThreshold={0.1}
          keyExtractor={this.getKey}
          onScroll={this.onScroll.bind(this)}
          renderItem={this.renderItem.bind(this)}
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

import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import RNFS from 'react-native-fs';
import {
  Icon, Header, Left, Body,
} from 'native-base';

export default class ImageView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 20,
      postition: 0,
      message: ''
    };
  }

  sendFile = () => {
    const obj = {
      position: this.state.postition,
      message: this.state.message,
      ...this.props.images[0]
    };
    this.props.sendFileWithImage(obj, () => {
      this.setState({
        message: ''
      });
      this.props.close();
    });
  };

  back = async () => {
    if (!this.props.onlyView) {
      await RNFS.unlink(this.props.images[0].url);
    }
    this.props.close();
  }


  render() {
    const { screenProps } = this.props;
    return (
      <View>
        {this.props.images.length > 0
          && (
            <Modal
              visible={this.props.open}
              transparent
              onRequestClose={() => this.props.close()}
            >
              <ImageViewer
                imageUrls={this.props.images}
                // onChange={event => this.setState({ postition: event })}
                renderHeader={() => (
                  <Header
                    style={styles.headerContainer}
                    androidStatusBarColor="black"
                  >
                    <Left>
                      <TouchableHighlight
                        underlayColor="#eeeeee"
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 100
                        }}
                        onPress={() => {
                          this.back();
                        }}
                      >
                        <Icon
                          style={{ color: 'white' }}
                          name="arrow-back"
                        />
                      </TouchableHighlight>
                    </Left>
                    <Body />
                  </Header>
                )}
              />

              {!this.props.onlyView && (
                <View
                  style={{
                    backgroundColor: 'black',
                    minHeight: 50,
                    paddingHorizontal: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <TextInput
                    placeholderTextColor="gray"
                    multiline
                    style={{
                      height: this.state.height,
                      flex: 1,
                      color: 'gray',
                      backgroundColor: 'black'
                    }}
                    value={this.state.message}
                    onChangeText={(text) => this.setState({ message: text })}
                    onContentSizeChange={(event) => {
                      this.setState({
                        height: event.nativeEvent.contentSize.height
                      });
                    }}
                    placeholder={screenProps.t('Chats:commentImage')}
                  />

                  <TouchableOpacity onPress={this.sendFile}>
                    <Icon
                      style={styles.iconChatStyle}
                      type="MaterialIcons"
                      name="send"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </Modal>
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'black'
  },
  iconChatStyle: {
    color: '#fbc233',
    fontSize: 32,
  }
});

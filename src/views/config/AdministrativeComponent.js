/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { Text, Alert } from 'react-native';
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Right,
  Icon,
  Switch
} from 'native-base';
import { connect } from 'react-redux';
import { closeAdministrativePanel, openAdministrativePanel } from '../../store/aplication/aplicationAction';
import { startManualService, stopService, setNewDials } from '../../store/chats/chatAction';
import { toast } from '../../utils/utils';
import AddManualAddress from './AddManualAddress';
import AddNewAddressListen from './AddNewAddressListen';

class AdministrativeComponent extends Component {
  constructor() {
    super();
    this.state = {
      dialAddress: false,
      manualBootstrap: false,
      addresListen: false
    };
  }

  static navigationOptions = {
    title: 'Admistrative dashboard'
  };

  closeOrActiveAdministration = async () => {
    const { screenProps } = this.props;
    if (this.props.administrative) {
      this.props.closeAdministrativePanel(() => {
        toast(screenProps.t('Admin:hideMessage'));
      });
    } else {
      this.props.openAdministrativePanel(() => {
        toast(screenProps.t('Admin:showPannelMessage'));
      });
    }
  }

  startOrClose = async () => {
    const { screenProps } = this.props;
    if (this.props.chatService) {
      this.props.stopService(() => {
        toast(screenProps.t('Admin:stoppedChatServiceMessage'));
      });
    } else {
      this.props.startManualService(() => {
        toast(screenProps.t('Admin:startingChatserviceMessage'));
      });
    }
  }

  closeModal = (name) => {
    if (name === 'dialAddress') {
      this.setState({
        dialAddress: false
      });
    } else if (name === 'bootstrapAddress') {
      this.setState({
        manualBootstrap: false
      });
    } else {
      this.setState({
        addresListen: false
      });
    }
  }

  sendDialToChatService = async (address, callback) => {
    const { screenProps } = this.props;
    this.props.setNewDials(address, (res) => {
      if (res) {
        this.setState({ dialAddress: false });
        toast(screenProps.t('Admin:successfullyDial'));
      } else {
        callback();
        toast(screenProps.t('Admin:errorDial'));
      }
    });
  }

  render() {
    const { screenProps } = this.props;
    return (
      <Container>
        <Content>
          <AddManualAddress
            screenProps={screenProps}
            open={this.state.dialAddress}
            close={this.closeModal}
            title="Add dial"
            nameComponent="dialAddress"
            action={this.sendDialToChatService}
          />
          <AddManualAddress
            screenProps={screenProps}
            open={this.state.manualBootstrap}
            close={this.closeModal}
            title="Add Bootstrap address"
            nameComponent="bootstrapAddress"
          />

          <AddNewAddressListen screenProps={screenProps} open={this.state.addresListen} close={this.closeModal} />
          <List>
            <ListItem>
              <Left>
                <Text>{screenProps.t('Admin:chatService')}</Text>
              </Left>
              <Right>
                <Switch value={this.props.chatService} onTouchEnd={this.startOrClose} />
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>{screenProps.t('Admin:peers')}</Text>
              </Left>
              <Right>
                <Text>{this.props.peersConnected.length}</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>{screenProps.t('Admin:upnp')}</Text>
              </Left>
              <Right>
                <Switch value={false} onTouchEnd={() => alert('this is not available now')} />
              </Right>
            </ListItem>

            <ListItem button onPress={() => this.setState({ dialAddress: true })}>
              <Left>
                <Text>{screenProps.t('Admin:dials')}</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem button onPress={() => alert('this is not available now')}>
              <Left>
                <Text>
                  {screenProps.t('Admin:bootstrapAddress')}
                </Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>{screenProps.t('Admin:hidePannel')}</Text>
              </Left>
              <Right>
                <Switch
                  value={this.props.administrative}
                  onTouchEnd={() => this.closeOrActiveAdministration()}
                />
              </Right>
            </ListItem>
            <ListItem button onPress={() => this.setState({ addresListen: true })}>
              <Left>
                <Text>{screenProps.t('Admin:manualListen')}</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  administrative: state.aplication.administrative,
  chatService: state.chats.chatService,
  peersConnected: state.chats.peersConnected
});

export default connect(
  mapStateToProps,
  {
    setNewDials,
    stopService,
    startManualService,
    closeAdministrativePanel,
    openAdministrativePanel
  }
)(AdministrativeComponent);

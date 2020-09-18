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


  closeOrActiveAdministration = () => {
    if (this.props.administrative) {
      this.props.closeAdministrativePanel(() => {
        toast('you have hidden the admin panel');
      });
    } else {
      this.props.openAdministrativePanel(() => {
        toast('admin panel is no longer hidden');
      });
    }
  }

  startOrClose = async () => {
    if (this.props.chatService) {
      this.props.stopService(() => {
        toast('Chat service it stopped');
      });
    } else {
      this.props.startManualService(() => {
        toast('chat service started successfully');
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

  sendDialToChatService = (address, callback) => {
    this.props.setNewDials(address, (res) => {
      if (res) {
        this.setState({ dialAddress: false });
        toast('dial added successfully');
      } else {
        callback();
        toast('Error,dial not valid');
      }
    });
  }

  render() {
    return (
      <Container>
        <Content>
          <AddManualAddress
            open={this.state.dialAddress}
            close={this.closeModal}
            title="Add dial"
            nameComponent="dialAddress"
            action={this.sendDialToChatService}
          />
          <AddManualAddress
            open={this.state.manualBootstrap}
            close={this.closeModal}
            title="Add Bootstrap address"
            nameComponent="bootstrapAddress"
          />

          <AddNewAddressListen open={this.state.addresListen} close={this.closeModal} />
          <List>
            <ListItem>
              <Left>
                <Text>Chat Service</Text>
              </Left>
              <Right>
                <Switch value={this.props.chatService} onTouchEnd={this.startOrClose} />
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Peers Conected</Text>
              </Left>
              <Right>
                <Text>{this.props.peersConnected.length}</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>UPN</Text>
              </Left>
              <Right>
                <Switch value={false} onTouchEnd={() => alert('this is not available now')} />
              </Right>
            </ListItem>

            <ListItem button onPress={() => this.setState({ dialAddress: true })}>
              <Left>
                <Text>Add Dials </Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem button onPress={() => alert('this is not available now')}>
              <Left>
                <Text>Add boopstraps address </Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Hide administrative panel</Text>
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
                <Text>configure manual listening </Text>
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

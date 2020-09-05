import React, { Component } from 'react';
import { Text } from 'react-native';
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
import { startManualService, stopService } from '../../store/chats/chatAction';
import { toast } from '../../utils/utils';

class AdministrativeComponent extends Component {
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
        toast('Chat service it stoped ');
      });
    } else {
      this.props.startManualService(() => {
        toast('chat service is started successfully');
      });
    }
  }

  render() {
    return (
      <Container>
        <Content>
          <List>
            <ListItem selected>
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
                <Text>20</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Left>
                <Text>UPN</Text>
              </Left>
              <Right>
                <Switch value />
              </Right>
            </ListItem>

            <ListItem>
              <Left>
                <Text>Add Dials </Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
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
          </List>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  administrative: state.aplication.administrative,
  chatService: state.chats.chatService
});

export default connect(
  mapStateToProps,
  {
    stopService,
    startManualService,
    closeAdministrativePanel,
    openAdministrativePanel
  }
)(AdministrativeComponent);

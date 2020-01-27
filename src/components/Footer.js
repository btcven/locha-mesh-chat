import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {
  Footer, FooterTab, Button, Text, Icon
} from 'native-base';
import { connect } from 'react-redux';
import { changeTab } from '../store/aplication/aplicationAction';

class FooterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 1
    };
  }

  hangleChage = (active) => {
    this.setState({
      active
    });
    this.props.changeTab(active);
  };

  render() {
    const { active } = this.state;
    return (
      <Footer style={styles.footerContainer}>
        <FooterTab style={styles.footerTab}>
          <Button
            vertical
            style={styles.bottonActive}
            onPress={() => this.hangleChage('initial', 1)}
            active={active === 1}
          >
            <Icon
              type="MaterialIcons"
              style={active === 1 ? styles.textTabColor2 : styles.textTabColor1}
              name="chat"
            />
            <Text
              style={active === 1 ? styles.textTabColor2 : styles.textTabColor1}
            >
              chats
            </Text>
          </Button>
          <Button
            vertical
            style={styles.bottonActive}
            onPress={() => this.hangleChage('contacts', 2)}
            active={active === 2}
          >
            <Icon
              type="MaterialIcons"
              style={active === 2 ? styles.textTabColor2 : styles.textTabColor1}
              name="person"
            />
            <Text
              style={active === 2 ? styles.textTabColor2 : styles.textTabColor1}
            >
              Contactos
            </Text>
          </Button>
          <Button
            onPress={() => this.hangleChage('config', 3)}
            active={active === 3}
            style={styles.bottonActive}
          >
            <Icon
              type="MaterialIcons"
              style={active === 3 ? styles.textTabColor2 : styles.textTabColor1}
              name="settings"
            />
            <Text
              style={active === 3 ? styles.textTabColor2 : styles.textTabColor1}
            >
              Configuracion
            </Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

const mapStateToProps = (state) => ({
  stateP: state
});

export default connect(
  mapStateToProps,
  { changeTab }
)(FooterComponent);

const styles = StyleSheet.create({
  footerContainer: {

    borderTopColor: '#bdbdbd'
  },

  footerTab: {
    backgroundColor: '#fff',
    color: 'red'
  },

  bottonActive: {
    display: 'flex',
    backgroundColor: '#fafafa',


    borderTopColor: '#bdbdbd',
    borderLeftColor: '#bdbdbd'
  },
  textTabColor1: {
    color: 'black'
  },
  textTabColor2: {
    color: '#fbc233'
  }
});

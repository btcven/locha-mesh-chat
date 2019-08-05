import React, { Component } from 'react';
import { Container, Header, Left, Body, Right, Title } from 'native-base';
import {StyleSheet } from 'react-native'

export default class HeaderComponent extends Component {
  render() {
    return (
        <Header style={styles.container}>
          <Left/>
          <Body>
            <Title>Header</Title>
          </Body>
          <Right />
        </Header>
    
    );
  }
}

const styles = StyleSheet.create({
    container: {
       width:'100%',
    }
})
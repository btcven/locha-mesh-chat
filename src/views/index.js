import React, { Component } from 'react'
import {Container} from 'native-base'
import { Text, View } from 'react-native'



export default class index extends Component {
    static navigationOptions = {
        header: null
      };
    
    
    render() {
        return (
            <Container>
                <Text> Init </Text>
            </Container>
        )
    }
}

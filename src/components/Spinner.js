import React from 'react';
import { View, ActivityIndicator , Modal } from 'react-native';

const componentName = ({ params }) => (
    
    <Modal
                  
    animationType="fade"
    transparent={true}
    visible={true}
    onRequestClose={ ()=>{ }}
    
    >
        <View style={{flex:1 , justifyContent:'center'}}>
            <ActivityIndicator 
                color='#00695c'
                size='large'
            />
        </View>
    </Modal>
);

export default componentName;

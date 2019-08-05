import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ConfirmDialog } from 'react-native-simple-dialogs';



export default function Confirm({...obj}) {
    return (
        <ConfirmDialog
            title={obj.title}
            message={obj.message}
            visible={true}
            positiveButton={{
                title: "Si",
                onPress: () => obj.delete(obj.uid)
            }}
            negativeButton={{
                title: "No",
                onPress: () => obj.cancel()
            }}
            
        />
    )
}
  

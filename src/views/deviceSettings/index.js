/* eslint-disable camelcase */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {
  Container,
} from 'native-base';
import { connect } from 'react-redux';
import SettingsPanel from './settingsPanel';
import Header from '../../components/Header';
import { getDeviceInfo } from '../../store/deviceSettins/deviceSettingsAction';
import Spinner from '../../components/Spinner';
import ErrorInfo from './errorInfo';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // eslint-disable-next-line react/sort-comp
  static navigationOptions = {
    header: null
  };


  componentDidMount = () => {
    this.props.getDeviceInfo();
  }


  render() {
    const { deviceInfo, screenProps } = this.props;
    return (
      <Container>
        <Header {...this.props} name="Settings Device" />
        {deviceInfo.status === 'waiting' && <Spinner />}
        {deviceInfo.status === 'error'
          && (
            <ErrorInfo
              getDeviceInfo={this.props.getDeviceInfo}
              screenProps={screenProps}
            />
          )}
        {deviceInfo.status === 'connected'
          && (
            <SettingsPanel
              deviceInfo={deviceInfo}
              screenProps={screenProps}
            />
          )}
      </Container>
    );
  }
}

const mapDispatchToProps = (state) => ({
  deviceInfo: state.device
});

export default connect(mapDispatchToProps, { getDeviceInfo })(index);

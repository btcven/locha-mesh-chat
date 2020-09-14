/* eslint-disable react/sort-comp */
/* eslint-disable camelcase */
import React from 'react';
import { Container } from 'native-base';
import { connect } from 'react-redux';
import SettingsPanel from './settingsPanel';
import Header from '../../components/Header';
import {
  getDeviceInfo, setApSettings,
  setStaSettings, activateOrDesactivate,
  changeCredentials, authDevice
}
  from '../../store/deviceSettins/deviceSettingsAction';
import Spinner from '../../components/Spinner';
import ErrorInfo from './errorInfo';
/**
 * main device panel component
 */

class DeviceSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleAlert: false
    };
  }

  // eslint-disable-next-line react/sort-comp
  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.props.getDeviceInfo();
  }

  closeAlert = () => {
    this.props.getDeviceInfo();
    this.setState({ visibleAlert: false });
  }

  render() {
    const { deviceInfo, screenProps } = this.props;
    return (
      <Container>
        <Header {...this.props} name={`${screenProps.t('DeviceSettings:headerTitle')}`} />
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
              setApConfig={this.props.setApSettings}
              setStaSettings={this.props.setStaSettings}
              activateOrDesactivate={this.props.activateOrDesactivate}
              changeCredentials={this.props.changeCredentials}
            />
          )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  deviceInfo: state.device
});

export default connect(mapStateToProps,
  {
    authDevice,
    changeCredentials,
    getDeviceInfo,
    setApSettings,
    setStaSettings,
    activateOrDesactivate
  })(DeviceSettings);

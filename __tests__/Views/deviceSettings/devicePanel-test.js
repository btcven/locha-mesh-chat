import '../../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { navigationPops } from '../../components/heder-test';
import SettingsPanel from '../../../src/views/deviceSettings/settingsPanel';

const screenProps = {
  t: (data) => data
};

const mockData = {
  voltaje: '',
  avg_current: '',
  temp: '',
  avg_power: '',
  free_memory: '',
  ap: {
    ssid: ''
  },
  sta: {
    ssid: '',
    enabled: false
  },
  status: 'waiting'
};

const setApConfig = jest.fn();
const setStaSettings = jest.fn();
const activateOrDesactivate = jest.fn();


test('render the main component', () => {
  const rendered = renderer.create(
    <SettingsPanel deviceInfo={mockData} screenProps={screenProps} navigation={navigationPops} />
  ).toJSON();
  expect(rendered).toBeTruthy();
});

describe('test to the device panel component', () => {
  const wrapper = shallow(
    <SettingsPanel
      deviceInfo={mockData}
      screenProps={screenProps}
      navigation={navigationPops}
      setApConfig={setApConfig}
      setStaSettings={setStaSettings}
      activateOrDesactivate={activateOrDesactivate}
    />
  );

  test('simulate function to change the wap name', () => {
    wrapper.instance().wapName('test', () => { });
    expect(setApConfig.mock.calls[0][0]).toEqual({
      ssid: 'test', password: null
    });
  });

  test('simulate function to change the wap password', () => {
    wrapper.instance().wapPassword('test', () => { });
    expect(setApConfig.mock.calls[1][0]).toEqual({
      ssid: null, password: 'test'
    });
  });

  test('simulate function to change the sta name', () => {
    wrapper.instance().staName('test', () => { });
    expect(setStaSettings.mock.calls[0][0]).toEqual({
      ssid: 'test', password: null
    });
  });

  test('simulate function to change the sta password', () => {
    wrapper.instance().staPasword('test', () => { });
    expect(setStaSettings.mock.calls[1][0]).toEqual({
      ssid: null, password: 'test'
    });
  });
});

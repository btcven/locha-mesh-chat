import '../../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import AddContact from '../../../src/views/contacts/AddContact';

const screenProps = {
  t: (data) => data
};

const closeFunction = jest.fn();
const saveContact = jest.fn();

test('render add contacts modal', () => {
  const rendered = renderer.create(
    <AddContact screenProps={screenProps} selected={[]} />
  ).toJSON();
  expect(rendered).toBeTruthy();
});


describe('test add contacts component', () => {
  const wrapper = shallow(
    <AddContact
      screenProps={screenProps}
      selected={[]}
      contacts={[]}
      userData={{ uid: 'test' }}
      saveContact={saveContact}
      open
      close={closeFunction}
    />
  );

  test('verify that the modal is visible', () => {
    expect(wrapper.find('Component').props().visible).toBeTruthy();
  });

  test('simulate closeButton', () => {
    wrapper.find('ForwardRef').first().props().onPress();
    expect(closeFunction.mock.calls.length).toBe(1);
  });

  test('save button must be disabled', () => {
    expect(wrapper.find('ForwardRef').at(1).props().disabled).toBeTruthy();
  });

  test('open view for qr code', () => {
    wrapper.find('ForwardRef').at(2).props().onPress();

    expect(wrapper.find('QRCodeScanner').exists()).toBeTruthy();
    wrapper.setState({ openQrCode: false });
  });

  test('remove disabled to save button', () => {
    wrapper.setState({
      name: 'test',
      uid: 'test',
      picture: null
    });

    expect(wrapper.find('ForwardRef').at(1).props().disabled).not.toBeTruthy();
  });

  test('simulate save function', async () => {
    await wrapper.find('ForwardRef').at(1).props().onPress();
    await Promise.resolve();

    expect(saveContact.mock.calls.length).toBe(1);
  });
});

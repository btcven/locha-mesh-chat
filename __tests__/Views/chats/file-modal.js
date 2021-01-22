import '../../../__Mocks__';
import React from 'react';
import { shallow } from 'enzyme';
import { navigationPops } from '../../components/heder-test';
import FileModal from '../../../src/views/home/fileModal';

const mockClose = jest.fn();
const setImageMock = jest.fn();
const screenProps = {
  t: (data) => data
};

describe('file modal component', () => {

  const wrapper = shallow(
    <FileModal
      open
      close={mockClose}
      screenProps={screenProps}
      setImageView={setImageMock}
    />
  );

  test('render component', async () => {
    expect(wrapper.instance()).toBeDefined();
    await wrapper.find('ForwardRef').first().props().onPress();
    await wrapper.find('ForwardRef').at(1).props().onPress();
  });


  test('pressing button for open gallery', () => {
    expect(setImageMock.mock.calls.length).toBe(2);
  });


  test('pressing button for open gallery', () => {
    expect(setImageMock.mock.calls.length).toBe(2);
  });
});

import '../../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import { navigationPops } from '../../components/heder-test';
import ImagesView from '../../../src/views/home/imagesView';


const screenProps = {
  t: (data) => data
};

describe('imagesView component', () => {
  test('render component', () => {
    const rendered = renderer.create(
      <ImagesView
        sendFileWithImage
        open
        images={[]}
        screenProps={screenProps}
        navigation={navigationPops}
      />
    ).toJSON();
    // expect(rendered).toBeTruthy();
  });
});

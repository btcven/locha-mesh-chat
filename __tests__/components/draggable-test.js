import '../../__Mocks__';
import React from 'react';
import renderer from 'react-test-renderer';
import Draggable from '../../src/components/Draggable';

test('draggable component', () => {
  const rendered = renderer.create(
    <Draggable>
      <> </>
    </Draggable>
  );
  expect(rendered).toBeTruthy();
});

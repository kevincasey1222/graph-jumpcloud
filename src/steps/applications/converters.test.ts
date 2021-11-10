import { createMockApplication } from '../../../test/mocks';
import { createApplicationEntity } from './converters';

describe('#createUserEntity', () => {
  test('should convert data', () => {
    expect(createApplicationEntity(createMockApplication())).toMatchSnapshot();
  });
});

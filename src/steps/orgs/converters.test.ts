import { createMockOrg } from '../../../test/mocks';
import { createOrgEntity } from './converters';

describe('#createUserEntity', () => {
  test('should convert data', () => {
    expect(createOrgEntity(createMockOrg())).toMatchSnapshot();
  });
});

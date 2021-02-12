import { createMockGroup } from "../../../test/mocks";
import { createGroupEntity } from "./converters";

describe('#createUserEntity', () => {
  test('should convert data', () => {
    expect(createGroupEntity(createMockGroup())).toMatchSnapshot();
  });
});

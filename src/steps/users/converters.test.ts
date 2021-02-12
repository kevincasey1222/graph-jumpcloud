import { createMockUser } from "../../../test/mocks";
import { createUserEntity } from "./converters";

describe('#createUserEntity', () => {
  test('should convert data', () => {
    expect(createUserEntity(createMockUser())).toMatchSnapshot();
  });
});

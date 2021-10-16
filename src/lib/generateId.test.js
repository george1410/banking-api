import { v4 as uuid4 } from 'uuid';
import generateId from './generateId';

jest.mock('uuid');

describe('Generate ID', () => {
  test('should generate an ID in the correct format', () => {
    uuid4.mockReturnValueOnce('75442486-0878-440c-9db1-a7006c25a39f');
    expect(generateId()).toEqual('3zhf6bx5iAWszCBQY7CQHB');

    uuid4.mockReturnValueOnce('b8e2c4bc-0e1d-43bd-bf54-7e4b9af266ff');
    expect(generateId()).toEqual('5CSdK36Yri0PwOX95Iv2gL');
  });
});

import { UserSchema } from './user.schema.js';

describe('UserSchema', () => {
  it('should be defined', () => {
    expect(new UserSchema()).toBeDefined();
  });
});

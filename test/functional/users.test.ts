import { User } from './../../src/models/user';
describe('User functional tests', () => {

  beforeAll(async () => {
    await User.deleteMany({});
  })

  describe('when creating a new user', () => {
    it('should successfuly create a new user', async () => {
      const newUser = {
        name: 'Jhon doe',
        email: 'jhon@gmail.com',
        password: '1234'
      };

      const response = await global.testRequest.post(
        '/users'
      ).send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining(newUser)
      );


    });

    it('should return 422 when there is a validation error', async () => {

      const newUser = {
        name: 1,
        email: 'jhon@gmail.com',
        password: '1234'
      };

      const response = await global.testRequest.post(
        '/users'
      ).send(newUser);

      expect(response.status).toBe(422);
      expect(response.body).toEqual(

        {
          code: 422,
          error: 'user validation failed: name: Path `name` (`1`) is shorter than the minimum allowed length (4).'
        }
      );

    });

    it('Should return 400 when there is a validation error', async () => {
      const newUser = {
        email: 'jhon@gmail.com',
        password: '1234'
      };

      const response = await global.testRequest.post(
        '/users'
      ).send(newUser);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'user validation failed: name: Path `name` is required.'
      });

    });

    it('should return 500 when there is any error other then validation error', async () => {
      const newUser = {
        name: 1,
        email: 'jhon@gmail.com',
        password: '1234'
      };

      jest
        .spyOn(User.prototype, 'save')
        .mockImplementationOnce(() => Promise.reject('fail to create user'))

      const response = await global.testRequest.post(
        '/users'
      ).send(newUser);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        code: 500,
        error: 'Something went wrong'
      });

    });

  });
})

import { User } from './../../src/models/user';
import AuthService from '@src/services/auth';


describe('User functional tests', () => {

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('when creating a new user', () => {
    it('should successfuly create a new user with encrypted password', async () => {
      const newUser = {
        name: 'Jhon doe',
        email: 'jhon@gmail.com',
        password: '1234'
      };

      const response = await global.testRequest.post(
        '/users'
      ).send(newUser);

      expect(response.status).toBe(201);
      await expect(AuthService.comparePasswords(newUser.password, response.body.password)).resolves.toBeTruthy()
      expect(response.body).toEqual(
        expect.objectContaining(
          {
            ...newUser, 
            ...{password: expect.any(String)}
          }
        )
      );
  
    });

    it('Should return 422 when there is a validation error', async () => {
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
        error: 'User validation failed: name: Path `name` is required.'
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

    it('Should return 409 when the email already exists', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };
      await global.testRequest.post('/users').send(newUser);
      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: 'User validation failed: email: already exists in the database.',
      });
    });
  });


  describe('When authenticating a user', () => {
    it.only('should generate token for a valid user', async() => {
      const newUser = {
        name: 'Jhon Doe',
        email: 'jhon@mail.com',
        password: '1234'
      };

      await new User(newUser).save();

      const response = await global.testRequest
      .post('/users/authenticate')
      .send({ email: newUser.email, password: newUser.password });

      expect(response.body).toEqual(
        expect.objectContaining({token: expect.any(String)})
      );
    });
  });

})
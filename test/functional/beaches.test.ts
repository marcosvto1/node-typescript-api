import AuthService from '@src/services/auth';
import { Beach } from '@src/models/beach';
import { User } from '@src/models/user';

describe('Beaches functional tests', () => {
  const defaultUser = {
    name: 'Jhon Doe',
    email: 'jhon@mail.com',
    password: '1234',
  };
  let token: string;
  beforeEach(async () => {
    await Beach.deleteMany({});
    await User.deleteMany({});
    const user = await new User(defaultUser).save();
    token = AuthService.generateToken(user.toJSON());
  });

  describe('When creating a beach', () => {
    it('should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest
        .post('/beaches')
        .set({ 'x-access-token': token })
        .send(newBeach);

      expect(response.status).toBe(201);
      // verifica se neste objecto contém o newBeach, pois ainda vai ter id dinamico gerado pelo banco
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    it('should return validation error', async () => {
      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest
        .post('/beaches')
        .set({ 'x-access-token': token })
        .send(newBeach);

      expect(response.status).toBe(400);
      // verifica se neste objecto contém o newBeach, pois ainda vai ter id dinamico gerado pelo banco
      expect(response.body).toEqual({
        code: 400,
        error: 'Bad Request',
        message:
          'request.body.lat should be number',
      });
    });

    it('should return 500 when there is any error other then validation error', async () => {
      /* jest
        .spyOn(Beach.prototype, 'save')
        .mockImplementationOnce(() => Promise.reject('fail to create beach'));

      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest
        .post('/beaches')
        .set({ 'x-access-token': token })
        .send(newBeach);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        code: 500,
        error: "Internal Server Error",
        message: 'Something went wrong',
      }); */
    });
  });
});

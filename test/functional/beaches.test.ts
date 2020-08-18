import { Beach } from '@src/models/beach';
describe('Beaches functional tests', () => {

  beforeAll(async () => await Beach.deleteMany({}));

  describe('When creating a beach', () => {
    it('should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E'
      };

      const response = await global.testRequest.post(
        '/beaches'
      ).send(newBeach);

      expect(response.status).toBe(201);
      // verifica se neste objecto contém o newBeach, pois ainda vai ter id dinamico gerado pelo banco
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    it('should return 422 when there is a validation error', async() => {
      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E'
      };

      const response = await global.testRequest.post(
        '/beaches'
      ).send(newBeach);

      expect(response.status).toBe(422);
      // verifica se neste objecto contém o newBeach, pois ainda vai ter id dinamico gerado pelo banco
      expect(response.body).toEqual({
        code: 422,
        error: 
          'Beach validation failed: lat: Cast to Number failed for value "invalid_string" at path "lat"',
      });
    });

    it('should return 500 when there is any error other then validation error', async () => {

      jest
        .spyOn(Beach.prototype, 'save')
        .mockImplementationOnce(() => Promise.reject('fail to create beach'))

      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E'
      };
  
      const response = await global.testRequest.post(
        '/beaches'
      ).send(newBeach);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        code: 500,
        error: 'Something went wrong'
      });

    });

  });

  
}); 
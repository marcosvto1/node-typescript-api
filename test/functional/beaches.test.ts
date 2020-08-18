describe('Beaches functional tests', () => {
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
  });
}); 
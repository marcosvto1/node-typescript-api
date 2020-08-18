describe('User functional tests', () => {
  describe('when creating a new user', () => {
    it('should successfuly create a new user', async () => {
      const newUser = {
        name: 'Jhon doe',
        email: 'jhon@gmail.com',
        passwrod: '1234'
      };

      const response = await global.testRequest.post(
        '/users'
      ).send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining(newUser)
      );

    
    });
  });
})
import {Client, expect} from '@loopback/testlab';
import {AppWithClient, setupApplication} from './test-helper';

describe('LocationController', () => {
   let app: AppWithClient;
   let client: Client;

   before('setupApplication', async () => {
      app = await setupApplication();
      client = app.client;
   });

   after(async () => {
      await app.app.stop();
   });

   it('should crate a new location', async () => {
      const newLocation = {
         locationName: 'New Location',
         address: 'Test Address',
         postalCode: '15151',
         city: 'Test City',
         country: 'Test Country',
      };
      const response = await client
         .post('/locations')
         .send(newLocation)
         .expect(200);

      expect(response.body.locationName).to.equal(newLocation.locationName);
      expect(response.body.address).to.equal(newLocation.address);
      expect(response.body.city).to.equal(newLocation.city);
   });
   it('should fetch all location', async () => {
      const response = await client.get('/locations').expect(200);
      expect(response.body).to.be.Array();
   });
   it('should fetch location by id', async () => {
      const newLocation = {
         locationName: 'New Location',
         address: 'Test Address',
         postalCode: '15151',
         city: 'Test City',
         country: 'Test Country',
      };
      const response = await client
         .post('/locations')
         .send(newLocation)
         .expect(200);
      const id = response.body.id;
      const getResponse = await client.get(`/locations/${id}`).expect(200);

      expect(getResponse.body.id).to.equal(id);
   });
   it('should replace location by id', async () => {
      const newLocation = {
         locationName: 'New Location',
         address: 'Test Address',
         postalCode: '15151',
         city: 'Test City',
         country: 'Test Country',
      };
      const response = await client
         .post('/locations')
         .send(newLocation)
         .expect(200);
      const updateLocation = {
         locationName: 'Update Location',
         address: 'Test Update Address',
         postalCode: '15151',
         city: 'Test Update City',
         country: 'Test Update Country',
      };
      await client
         .put(`/locations/${response.body.id}`)
         .send(updateLocation)
         .expect(204);
      const getResponse = await client
         .get(`/locations/${response.body.id}`)
         .expect(200);

      expect(getResponse.body.locationName).to.equal(
         updateLocation.locationName,
      );
      expect(getResponse.body.address).to.equal(updateLocation.address);
      expect(getResponse.body.city).to.equal(updateLocation.city);
   });
   it('should delete location by id', async () => {
      const newLocation = {
         locationName: 'New Location',
         address: 'Test Address',
         postalCode: '15151',
         city: 'Test City',
         country: 'Test Country',
      };
      const response = await client
         .post('/locations')
         .send(newLocation)
         .expect(200);
      const id = response.body.id;
      await client.delete(`/locations/${id}`).expect(204);
      await client.get(`/locations/${id}`).expect(404);
   });

   it('retrieves locations for a specific department', async () => {
      const newLocation = {
         locationName: 'New Location',
         address: 'Test Address',
         postalCode: '15151',
         city: 'Test City',
         country: 'Test Country',
      };
      const location = await client
         .post('/locations')
         .send(newLocation)
         .expect(200);
      const locationId = location.body.id;
      await client
         .post(`/departments`)
         .send({
            departmentName: 'Test Department',
            managerId: 1,
            locationId: locationId,
         })
         .expect(200);

      const response = await client
         .get(`/locations/${locationId}/departments`)
         .expect(200);
      expect(response.body).to.be.Array();
      expect(response.body).to.have.length(1);
      expect(response.body[0].departmentName).to.equal('Test Department');
   });
});

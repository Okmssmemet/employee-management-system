import {Client, expect} from '@loopback/testlab';
import {AppWithClient, setupApplication} from './test-helper';

describe('TitleHistoryController', () => {
   let app: AppWithClient;
   let client: Client;

   before('setupApplication', async () => {
      app = await setupApplication();
      client = app.client;
   });

   after(async () => {
      await app.app.stop();
   });

   it('should create a new title history', async () => {
      const newTitleHistory = {
         employeeId: 1,
         titleId: 1,
         departmentId: 1,
         startDate: '2023-01-01',
         endDate: '2023-12-31',
      };

      const response = await client
         .post('/title-histories')
         .send(newTitleHistory)
         .expect(200);

      expect(response.body).to.have.property('id');
      expect(response.body.employeeId).to.equal(newTitleHistory.employeeId);
      expect(response.body.titleId).to.equal(newTitleHistory.titleId);
      expect(response.body.departmentId).to.equal(newTitleHistory.departmentId);
      expect(response.body.startDate).to.equal(newTitleHistory.startDate);
      expect(response.body.endDate).to.equal(newTitleHistory.endDate);
   });

   it('should fetch all title histories', async () => {
      const response = await client.get('/title-histories').expect(200);
      expect(response.body).to.be.Array();
   });

   it('should fetch title history by id', async () => {
      const newTitleHistory = {
         employeeId: 1,
         titleId: 1,
         departmentId: 1,
         startDate: '2023-01-01',
         endDate: '2023-12-31',
      };

      const response = await client
         .post('/title-histories')
         .send(newTitleHistory)
         .expect(200);

      const id = response.body.id;

      const getResponse = await client
         .get(`/title-histories/${id}`)
         .expect(200);
      expect(getResponse.body).to.have.property('id', id);
      expect(getResponse.body.employeeId).to.equal(newTitleHistory.employeeId);
   });

   it('should update title history by id', async () => {
      const newTitleHistory = {
         employeeId: 1,
         titleId: 1,
         departmentId: 1,
         startDate: '2023-01-01',
         endDate: '2023-12-31',
      };

      const response = await client
         .post('/title-histories')
         .send(newTitleHistory)
         .expect(200);

      const updatedTitleHistory = {
         employeeId: 1,
         titleId: 2,
         departmentId: 2,
         startDate: '2024-01-01',
         endDate: '2024-12-31',
      };

      await client
         .put(`/title-histories/${response.body.id}`)
         .send(updatedTitleHistory)
         .expect(204);

      const getResponse = await client
         .get(`/title-histories/${response.body.id}`)
         .expect(200);

      expect(getResponse.body.titleId).to.equal(updatedTitleHistory.titleId);
      expect(getResponse.body.departmentId).to.equal(
         updatedTitleHistory.departmentId,
      );
   });

   it('should delete title history by id', async () => {
      const newTitleHistory = {
         employeeId: 1,
         titleId: 1,
         departmentId: 1,
         startDate: '2023-01-01',
         endDate: '2023-12-31',
      };

      const response = await client
         .post('/title-histories')
         .send(newTitleHistory)
         .expect(200);

      const id = response.body.id;

      await client.delete(`/title-histories/${id}`).expect(204);
      await client.get(`/title-histories/${id}`).expect(404);
   });
});

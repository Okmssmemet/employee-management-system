import {Client, expect} from '@loopback/testlab';
import {AppWithClient, setupApplication} from './test-helper';

describe('TitleController', () => {
   let app: AppWithClient;
   let client: Client;

   before('setupApplication', async () => {
      app = await setupApplication();
      client = app.client;
   });

   after(async () => {
      await app.app.stop();
   });

   it('should crate a new title', async () => {
      const newTitle = {name: 'Software Engineer'};
      const response = await client.post('/titles').send(newTitle).expect(200);

      expect(response.body).to.have.property('id');
      expect(response.body.name).to.equal('Software Engineer');
   });
   it('should fetch all titles', async () => {
      const response = await client.get('/titles').expect(200);

      expect(response.body).to.be.an.Array();
   });
   it('should fetch a title by id', async () => {
      const newTitle = {name: 'Backend Developer'};
      const response = await client.post('/titles').send(newTitle).expect(200);
      const id = response.body.id;

      const getResponse = await client.get(`/titles/${id}`).expect(200);

      expect(getResponse.body).to.have.property('id', id);
      expect(getResponse.body).to.have.property('name', 'Backend Developer');
   });
   it('should replace title by id', async () => {
      const newTitle = {name: 'New Title'};
      const response = await client.post('/titles').send(newTitle).expect(200);

      const updatedTitle = {name: 'Updated Title'};
      const id = response.body.id;

      await client.put(`/titles/${id}`).send(updatedTitle).expect(204);

      const getResponse = await client.get(`/titles/${id}`).expect(200);

      expect(getResponse.body).to.have.property('id', id);
      expect(getResponse.body).to.have.property('name', updatedTitle.name);
   });
   it('should delete title by id', async () => {
      const newTitle = {name: 'New Title'};
      const response = await client.post('/titles').send(newTitle).expect(200);
      const id = response.body.id;

      await client.delete(`/titles/${id}`).expect(204);

      const getResponse = await client.get(`/titles/${id}`).expect(404);
      expect(getResponse.status).to.equal(404);
   });
   it('retrieves employees for a specific title', async () => {
      const title = await client
         .post('/titles')
         .send({
            name: 'Software Engineer',
         })
         .expect(200);

      const titleId = title.body.id;

      await client
         .post('/employees')
         .send({
            name: 'John',
            surname: 'Doe',
            phone: '+1234567890',
            email: 'john.doe@example.com',
            startDate: '2023-01-01',
            salary: 50000,
            titleId: titleId,
            departmentId: 1,
         })
         .expect(200);

      await client
         .post('/employees')
         .send({
            name: 'Jane',
            surname: 'Smith',
            phone: '+0987654321',
            email: 'jane.smith@example.com',
            startDate: '2023-02-01',
            salary: 60000,
            titleId: titleId,
            departmentId: 1,
         })
         .expect(200);

      const res = await client.get(`/titles/${titleId}/employees`).expect(200);

      expect(res.body).to.be.Array();
      expect(res.body).to.have.length(2);
      expect(res.body[0]).to.containDeep({
         name: 'John',
         surname: 'Doe',
         email: 'john.doe@example.com',
      });
      expect(res.body[1]).to.containDeep({
         name: 'Jane',
         surname: 'Smith',
         email: 'jane.smith@example.com',
      });
   });
});

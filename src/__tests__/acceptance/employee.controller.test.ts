import {Client, expect} from '@loopback/testlab';
import {AppWithClient, setupApplication} from './test-helper';

describe('EmployeeController', () => {
   let app: AppWithClient;
   let client: Client;

   before('setupApplication', async () => {
      app = await setupApplication();
      client = app.client;
   });

   after(async () => {
      await app.app.stop();
   });

   it('should create a new employee', async () => {
      const newEmployee = {
         name: 'Test',
         surname: 'Employee',
         phone: '+1234567890',
         email: 'test@example.com',
         startDate: '2023-01-01',
         salary: 50000,
         departmentId: 1,
         titleId: 1,
         managerId: 1,
      };

      const response = await client
         .post('/employees')
         .send(newEmployee)
         .expect(200);

      expect(response.body).to.have.property('id');
      expect(response.body.name).to.equal('Test');
      expect(response.body.surname).to.equal('Employee');
      expect(response.body.phone).to.equal('+1234567890');
      expect(response.body.email).to.equal('test@example.com');

      const returnedDate = response.body.startDate.split('T')[0];
      expect(returnedDate).to.equal('2023-01-01');
   });
   it('should fetch all employee', async () => {
      const response = await client.get('/employees').expect(200);
      expect(response.body).to.have.Array();
   });
   it('should fetch employee by id', async () => {
      const newEmployee = {
         name: 'Test',
         surname: 'Employee',
         phone: '+1234567890',
         email: 'test@example.com',
         startDate: '2023-01-01',
         salary: 50000,
         departmentId: 1,
         titleId: 1,
         managerId: 1,
      };

      const response = await client
         .post('/employees')
         .send(newEmployee)
         .expect(200);
      const id = response.body.id;

      const getResponse = await client.get(`/employees/${id}`);
      expect(getResponse.body).to.have.property('id', id);
      expect(getResponse.body.name).to.equal(newEmployee.name);
   });
   it('should update employee by id', async () => {
      const newEmployee = {
         name: 'Test',
         surname: 'Employee',
         phone: '+1234567890',
         email: 'test@example.com',
         startDate: '2023-01-01',
         salary: 50000,
         departmentId: 1,
         titleId: 1,
         managerId: 1,
      };

      const response = await client
         .post('/employees')
         .send(newEmployee)
         .expect(200);
      const updateEmployee = {
         name: 'Test Update',
         surname: 'Employee',
         phone: '+1234567890',
         email: 'test_update@example.com',
         startDate: '2023-01-01',
         salary: 50000,
         departmentId: 1,
         titleId: 1,
         managerId: 1,
      };
      await client
         .put(`/employees/${response.body.id}`)
         .send(updateEmployee)
         .expect(204);
      const getResponse = await client
         .get(`/employees/${response.body.id}`)
         .expect(200);
      expect(getResponse.body.name).to.equal(updateEmployee.name);
      expect(getResponse.body.email).to.equal(updateEmployee.email);
   });
   it('should delete employee by id', async () => {
      const newEmployee = {
         name: 'Test',
         surname: 'Employee',
         phone: '+1234567890',
         email: 'test@example.com',
         startDate: '2023-01-01',
         salary: 50000,
         departmentId: 1,
         titleId: 1,
         managerId: 1,
      };

      const response = await client
         .post('/employees')
         .send(newEmployee)
         .expect(200);
      const id = response.body.id;

      await client.delete(`/employees/${id}`).expect(204);
      await client.get(`/employees/${id}`).expect(404);
   });
   it('retrieves department for a specific employee', async () => {
      const newDepartment = await client
         .post('/departments')
         .send({
            departmentName: 'IT Department',
            managerId: 1,
            locationId: 1,
         })
         .expect(200);

      const newEmployee = await client
         .post('/employees')
         .send({
            name: 'John',
            surname: 'Doe',
            phone: '+1234567890',
            email: 'john.doe@example.com',
            startDate: '2023-01-01',
            salary: 60000,
            departmentId: newDepartment.body.id,
            titleId: 1,
            managerId: 1,
         })
         .expect(200);

      const response = await client
         .get(`/employees/${newEmployee.body.id}/department`)
         .expect(200);

      expect(response.body).to.have.property('departmentName', 'IT Department');
   });
   it('retrieves manager for a specific employee', async () => {
      const manager = await client
         .post('/employees')
         .send({
            name: 'Jane',
            surname: 'Smith',
            phone: '+9876543210',
            email: 'jane.smith@example.com',
            startDate: '2022-01-01',
            salary: 80000,
            departmentId: 1,
            titleId: 1,
         })
         .expect(200);

      const employee = await client
         .post('/employees')
         .send({
            name: 'Emily',
            surname: 'Johnson',
            phone: '+1234509876',
            email: 'emily.johnson@example.com',
            startDate: '2023-02-01',
            salary: 50000,
            departmentId: 1,
            titleId: 1,
            managerId: manager.body.id,
         })
         .expect(200);

      const response = await client
         .get(`/employees/${employee.body.id}/employee`)
         .expect(200);

      expect(response.body).to.have.property('id', manager.body.id);
      expect(response.body.name).to.equal(manager.body.name);
      expect(response.body.surname).to.equal(manager.body.surname);
   });
   it('retrieves employee with title history', async () => {
      const employee = await client
         .post('/employees')
         .send({
            name: 'John',
            surname: 'Doe',
            phone: '+1234567890',
            email: 'john.doe@example.com',
            startDate: '2021-01-01',
            salary: 70000,
            departmentId: 1,
            titleId: 1,
         })
         .expect(200);

      const titleHistory1 = await client
         .post('/title-histories')
         .send({
            employeeId: employee.body.id,
            titleId: 1,
            startDate: '2021-01-01',
            endDate: '2022-01-01',
         })
         .expect(200);

      const titleHistory2 = await client
         .post('/title-histories')
         .send({
            employeeId: employee.body.id,
            titleId: 2,
            startDate: '2022-01-01',
            endDate: '2023-01-01',
         })
         .expect(200);

      const response = await client
         .get(`/employees/${employee.body.id}/with-title-history`)
         .expect(200);

      expect(response.body).to.have.property('id', employee.body.id);
      expect(response.body.name).to.equal('John');
      expect(response.body.surname).to.equal('Doe');
      expect(response.body.titleHistories).to.be.an.Array();
      expect(response.body.titleHistories).to.have.length(2);

      const [history1, history2] = response.body.titleHistories;
      expect(history1).to.have.property('titleId', titleHistory1.body.titleId);
      expect(history1.startDate).to.equal(titleHistory1.body.startDate);
      expect(history1.endDate).to.equal(titleHistory1.body.endDate);

      expect(history2).to.have.property('titleId', titleHistory2.body.titleId);
      expect(history2.startDate).to.equal(titleHistory2.body.startDate);
      expect(history2.endDate).to.equal(titleHistory2.body.endDate);
   });
});

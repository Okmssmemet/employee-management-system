import {Client, expect} from '@loopback/testlab';
import {AppWithClient, setupApplication} from './test-helper';

describe('DepartmentController', () => {
   let app: AppWithClient;
   let client: Client;

   before('setupApplication', async () => {
      app = await setupApplication();
      client = app.client;
   });

   after(async () => {
      await app.app.stop();
   });

   it('should create a new department', async () => {
      const newDepartment = {
         departmentName: 'New Department',
         managerId: 1,
         locationId: 1,
      };
      const response = await client
         .post('/departments')
         .send(newDepartment)
         .expect(200);

      expect(response.body.departmentName).to.equal(
         newDepartment.departmentName,
      );
      expect(response.body.managerId).to.equal(newDepartment.managerId);
      expect(response.body.locationId).to.equal(newDepartment.locationId);
   });
   it('should fetch all departments', async () => {
      const response = await client.get('/departments').expect(200);
      expect(response.body).to.be.Array();
   });
   it('should fetch departments by id', async () => {
      const newDepartment = {
         departmentName: 'New Department',
         managerId: 1,
         locationId: 1,
      };
      const response = await client
         .post('/departments')
         .send(newDepartment)
         .expect(200);

      const id = response.body.id;
      const getResponse = await client.get(`/departments/${id}`);
      expect(getResponse.body.id).to.equal(id);
      expect(getResponse.body.departmentName).to.equal(
         newDepartment.departmentName,
      );
   });
   it('should replace departments by id', async () => {
      const newDepartment = {
         departmentName: 'New Department',
         managerId: 1,
         locationId: 1,
      };
      const response = await client
         .post('/departments')
         .send(newDepartment)
         .expect(200);
      const id = response.body.id;

      const updatedDepartment = {
         departmentName: 'Updated Department',
         managerId: 2,
         locationId: 2,
      };
      await client
         .put(`/departments/${id}`)
         .send(updatedDepartment)
         .expect(204);
      const getResponse = await client.get(`/departments/${id}`);
      expect(getResponse.body.departmentName).to.equal(
         updatedDepartment.departmentName,
      );
      expect(getResponse.body.managerId).to.equal(updatedDepartment.managerId);
      expect(getResponse.body.locationId).to.equal(
         updatedDepartment.locationId,
      );
   });
   it('should delete department by id', async () => {
      const newDepartment = {
         departmentName: 'New Department',
         managerId: 1,
         locationId: 1,
      };
      const response = await client
         .post('/departments')
         .send(newDepartment)
         .expect(200);
      const id = response.body.id;
      await client.delete(`/departments/${id}`).expect(204);
      await client.get(`/departments/${id}`).expect(404);
   });
   it('should get location for a department', async () => {
      const newLocation = {
         locationName: 'Main Office',
         address: '1234 Main St',
         postalCode: '12345',
         city: 'CityName',
         country: 'CountryName',
      };

      const locationResponse = await client
         .post('/locations')
         .send(newLocation)
         .expect(200);

      const newDepartment = {
         departmentName: 'HR Department',
         managerId: 1,
         locationId: locationResponse.body.id,
      };

      const departmentResponse = await client
         .post('/departments')
         .send(newDepartment)
         .expect(200);

      const locationForDepartmentResponse = await client
         .get(`/departments/${departmentResponse.body.id}/location`)
         .expect(200);

      const locationData = locationForDepartmentResponse.body;

      expect(locationData).to.have.property(
         'locationName',
         newLocation.locationName,
      );
      expect(locationData).to.have.property('address', newLocation.address);
      expect(locationData).to.have.property(
         'postalCode',
         newLocation.postalCode,
      );
      expect(locationData).to.have.property('city', newLocation.city);
      expect(locationData).to.have.property('country', newLocation.country);
   });
   it('should get employee for a department', async () => {
      const newDepartment = {
         departmentName: 'New Department',
         managerId: 1,
         locationId: 1,
      };
      const departmentResponse = await client
         .post('/departments')
         .send(newDepartment)
         .expect(200);
      const newEmployee = {
         name: 'John',
         surname: 'Doe',
         phone: '+1234567890',
         email: 'john.doe@example.com',
         startDate: '2023-01-01',
         salary: 50000,
         titleId: 1,
         departmentId: departmentResponse.body.id,
      };
      await client.post('/employees').send(newEmployee).expect(200);

      const employeesResponse = await client
         .get(`/departments/${departmentResponse.body.id}/employees`)
         .expect(200);

      expect(employeesResponse.body).to.be.Array();
      expect(employeesResponse.body.length).to.be.greaterThan(0);
      const employee = employeesResponse.body[0];
      expect(employee).to.have.property('name', 'John');
      expect(employee).to.have.property('surname', 'Doe');
      expect(employee).to.have.property('email', 'john.doe@example.com');
   });
   it('should calculate salary averages for departments', async () => {
      const department1 = await client
         .post('/departments')
         .send({
            departmentName: 'Engineering',
            managerId: 1,
            locationId: 1,
         })
         .expect(200);

      const department2 = await client
         .post('/departments')
         .send({
            departmentName: 'Sales',
            managerId: 2,
            locationId: 1,
         })
         .expect(200);

      await client.post('/employees').send({
         name: 'Alice',
         surname: 'Smith',
         phone: '+1234567890',
         email: 'alice.smith@example.com',
         startDate: '2023-01-01',
         salary: 5000,
         titleId: 1,
         departmentId: department1.body.id,
      });

      await client.post('/employees').send({
         name: 'Bob',
         surname: 'Brown',
         phone: '+1234567891',
         email: 'bob.brown@example.com',
         startDate: '2023-01-01',
         salary: 7000,
         titleId: 1,
         departmentId: department1.body.id,
      });

      await client.post('/employees').send({
         name: 'Charlie',
         surname: 'Davis',
         phone: '+1234567892',
         email: 'charlie.davis@example.com',
         startDate: '2023-01-01',
         salary: 3000,
         titleId: 1,
         departmentId: department2.body.id,
      });

      const response = await client
         .get('/departments/salary-averages')
         .expect(200);

      const salaryAverages = response.body;
      expect(salaryAverages).to.have.property('Engineering', 6000);
      expect(salaryAverages).to.have.property('Sales', 3000);
   });
});

import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
   del,
   get,
   getModelSchemaRef,
   param,
   patch,
   post,
   put,
   requestBody,
   response,
} from '@loopback/rest';
import {Department, Employee, Location} from '../models';
import {DepartmentRepository, EmployeeRepository} from '../repositories';

export class DepartmentController {
   constructor(
      @repository(DepartmentRepository)
      public departmentRepository: DepartmentRepository,
      @repository(EmployeeRepository)
      public employeeRepository: EmployeeRepository,
   ) {}

   // CRUD operations for Department
   @post('/departments')
   @response(200, {
      description: 'Department model instance',
      content: {'application/json': {schema: getModelSchemaRef(Department)}},
   })
   async create(
      @requestBody({
         content: {
            'application/json': {
               schema: getModelSchemaRef(Department, {
                  title: 'NewDepartment',
                  exclude: ['id'],
               }),
            },
         },
      })
      department: Omit<Department, 'id'>,
   ): Promise<Department> {
      return this.departmentRepository.create(department);
   }

   @get('/departments')
   @response(200, {
      description: 'Array of Department model instances',
      content: {
         'application/json': {
            schema: {
               type: 'array',
               items: getModelSchemaRef(Department, {includeRelations: true}),
            },
         },
      },
   })
   async find(
      @param.filter(Department) filter?: Filter<Department>,
   ): Promise<Department[]> {
      return this.departmentRepository.find(filter);
   }

   @get('/departments/{id}')
   @response(200, {
      description: 'Department model instance',
      content: {
         'application/json': {
            schema: getModelSchemaRef(Department, {includeRelations: true}),
         },
      },
   })
   async findById(
      @param.path.number('id') id: number,
      @param.filter(Department, {exclude: 'where'})
      filter?: FilterExcludingWhere<Department>,
   ): Promise<Department> {
      return this.departmentRepository.findById(id, filter);
   }

   @patch('/departments/{id}')
   @response(204, {
      description: 'Department PATCH success',
   })
   async updateById(
      @param.path.number('id') id: number,
      @requestBody({
         content: {
            'application/json': {
               schema: getModelSchemaRef(Department, {partial: true}),
            },
         },
      })
      department: Department,
   ): Promise<void> {
      await this.departmentRepository.updateById(id, department);
   }

   @put('/departments/{id}')
   @response(204, {
      description: 'Department PUT success',
   })
   async replaceById(
      @param.path.number('id') id: number,
      @requestBody() department: Department,
   ): Promise<void> {
      await this.departmentRepository.replaceById(id, department);
   }

   @del('/departments/{id}')
   @response(204, {
      description: 'Department DELETE success',
   })
   async deleteById(@param.path.number('id') id: number): Promise<void> {
      await this.departmentRepository.deleteById(id);
   }

   @get('/departments/{id}/location', {
      responses: {
         '200': {
            description: 'Location belonging to Department',
            content: {
               'application/json': {
                  schema: getModelSchemaRef(Location),
               },
            },
         },
      },
   })
   async getLocation(
      @param.path.number('id') id: typeof Department.prototype.id,
   ): Promise<Location> {
      return this.departmentRepository.location(id);
   }

   @get('/departments/{id}/employees', {
      responses: {
         '200': {
            description: 'Array of Department has many Employee',
            content: {
               'application/json': {
                  schema: {type: 'array', items: getModelSchemaRef(Employee)},
               },
            },
         },
      },
   })
   async findEmployees(
      @param.path.number('id') id: number,
      @param.query.object('filter') filter?: Filter<Employee>,
   ): Promise<Employee[]> {
      return this.departmentRepository.employees(id).find(filter);
   }

   @get('/departments/salary-averages', {
      responses: {
         '200': {
            description: 'Departmanların maaş ortalamaları',
            content: {'application/json': {schema: {type: 'object'}}},
         },
      },
   })
   async getSalaryAverages(): Promise<{[key: string]: number}> {
      const departments = await this.departmentRepository.find();

      const salaryAverages: {[key: string]: number} = {};

      for (const department of departments) {
         const employees = await this.employeeRepository.find({
            where: {departmentId: department.id},
         });

         if (employees.length > 0) {
            const totalSalary = employees.reduce(
               (sum, employee) => sum + employee.salary,
               0,
            );
            const averageSalary = totalSalary / employees.length;

            salaryAverages[department.departmentName] = averageSalary;
         } else {
            salaryAverages[department.departmentName] = 0;
         }
      }

      return salaryAverages;
   }
}

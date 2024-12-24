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
import {Department, Employee, Title, TitleHistory} from '../models';
import {EmployeeRepository} from '../repositories';

export class EmployeeController {
   constructor(
      @repository(EmployeeRepository)
      public employeeRepository: EmployeeRepository,
   ) {}

   @post('/employees')
   @response(200, {
      description: 'Employee model instance',
      content: {'application/json': {schema: getModelSchemaRef(Employee)}},
   })
   async create(
      @requestBody({
         content: {
            'application/json': {
               schema: getModelSchemaRef(Employee, {
                  title: 'NewEmployee',
                  exclude: ['id'],
               }),
            },
         },
      })
      employee: Omit<Employee, 'id'>,
   ): Promise<Employee> {
      return this.employeeRepository.create(employee);
   }

   @get('/employees')
   @response(200, {
      description: 'Array of Employee model instances',
      content: {
         'application/json': {
            schema: {
               type: 'array',
               items: getModelSchemaRef(Employee, {includeRelations: true}),
            },
         },
      },
   })
   async find(
      @param.filter(Employee) filter?: Filter<Employee>,
   ): Promise<Employee[] | {message: string}> {
      const employees = await this.employeeRepository.find(filter);

      if (employees.length === 0) {
         return {message: 'Employee Not Found'};
      }
      return employees;
   }

   @get('/employees/{id}')
   @response(200, {
      description: 'Employee model instance',
      content: {
         'application/json': {
            schema: getModelSchemaRef(Employee, {includeRelations: true}),
         },
      },
   })
   async findById(
      @param.path.number('id') id: number,
      @param.filter(Employee, {exclude: 'where'})
      filter?: FilterExcludingWhere<Employee>,
   ): Promise<Employee> {
      return this.employeeRepository.findById(id, filter);
   }

   @patch('/employees/{id}')
   @response(204, {
      description: 'Employee PATCH success',
   })
   async updateById(
      @param.path.number('id') id: number,
      @requestBody({
         content: {
            'application/json': {
               schema: getModelSchemaRef(Employee, {partial: true}),
            },
         },
      })
      employee: Employee,
   ): Promise<void> {
      await this.employeeRepository.updateById(id, employee);
   }

   @put('/employees/{id}')
   @response(204, {
      description: 'Employee PUT success',
   })
   async replaceById(
      @param.path.number('id') id: number,
      @requestBody() employee: Employee,
   ): Promise<void> {
      await this.employeeRepository.replaceById(id, employee);
   }

   @del('/employees/{id}')
   @response(204, {
      description: 'Employee DELETE success',
   })
   async deleteById(@param.path.number('id') id: number): Promise<void> {
      await this.employeeRepository.deleteById(id);
   }

   @get('/employees/{id}/department', {
      responses: {
         '200': {
            description: 'Department belonging to Employee',
            content: {
               'application/json': {
                  schema: getModelSchemaRef(Department),
               },
            },
         },
      },
   })
   async getDepartment(
      @param.path.number('id') id: typeof Employee.prototype.id,
   ): Promise<Department> {
      return this.employeeRepository.department(id);
   }

   @get('/employees/{id}/employee', {
      responses: {
         '200': {
            description: 'Employee belonging to Employee',
            content: {
               'application/json': {
                  schema: getModelSchemaRef(Employee),
               },
            },
         },
      },
   })
   async getEmployee(
      @param.path.number('id') id: typeof Employee.prototype.id,
   ): Promise<Employee> {
      return this.employeeRepository.manager(id);
   }

   @get('/employees/{id}/title-histories', {
      responses: {
         '200': {
            description: 'Array of Employee has many TitleHistory',
            content: {
               'application/json': {
                  schema: {
                     type: 'array',
                     items: getModelSchemaRef(TitleHistory),
                  },
               },
            },
         },
      },
   })
   async findTitleHistory(
      @param.path.number('id') id: number,
      @param.query.object('filter') filter?: Filter<TitleHistory>,
   ): Promise<TitleHistory[]> {
      return this.employeeRepository.titleHistories(id).find(filter);
   }

   @get('/employees/{id}/title', {
      responses: {
         '200': {
            description: 'Title belonging to Employee',
            content: {
               'application/json': {
                  schema: getModelSchemaRef(Title),
               },
            },
         },
      },
   })
   async getTitle(
      @param.path.number('id') id: typeof Employee.prototype.id,
   ): Promise<Title> {
      return this.employeeRepository.title(id);
   }

   @get('/employees/hierarchy', {
      responses: {
         '200': {
            description: 'Hierarchical list of all employees',
            content: {
               'application/json': {
                  schema: {type: 'array', items: {'x-ts-type': Employee}},
               },
            },
         },
      },
   })
   async getHierarchy(): Promise<Employee[]> {
      return this.fetchHierarchy();
   }

   private async fetchHierarchy(): Promise<Employee[]> {
      const allEmployees = await this.employeeRepository.find();

      const employeeMap = new Map<number, Employee>();
      allEmployees.forEach(employee => {
         employeeMap.set(employee.id!, employee);
      });

      const hierarchy: Employee[] = [];

      allEmployees.forEach(employee => {
         if (employee.managerId) {
            const manager = employeeMap.get(employee.managerId);
            if (manager) {
               if (!manager.employees) {
                  manager.employees = [];
               }
               manager.employees.push(employee);
            }
         } else {
            hierarchy.push(employee);
         }
      });

      return hierarchy;
   }

   @get('/employees/{id}/with-title-history', {
      responses: {
         '200': {
            description: 'Employee with title history',
            content: {
               'application/json': {
                  schema: getModelSchemaRef(Employee, {
                     includeRelations: true,
                  }),
               },
            },
         },
      },
   })
   async findEmployeeWithTitleHistory(
      @param.path.number('id') id: number,
      @param.query.object('filter') filter?: Filter<Employee>,
   ): Promise<Employee> {
      return this.employeeRepository.findById(id, {
         ...filter,
         include: [{relation: 'titleHistories'}],
      });
   }
}

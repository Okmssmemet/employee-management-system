import {Getter, inject} from '@loopback/core';
import {
   BelongsToAccessor,
   DefaultCrudRepository,
   HasManyRepositoryFactory,
   repository,
} from '@loopback/repository';
import {ManagementSystemDbDataSource} from '../datasources';
import {
   Department,
   Employee,
   EmployeeRelations,
   Title,
   TitleHistory,
} from '../models';
import {DepartmentRepository} from './department.repository';
import {TitleHistoryRepository} from './title-history.repository';
import {TitleRepository} from './title.repository';

export class EmployeeRepository extends DefaultCrudRepository<
   Employee,
   typeof Employee.prototype.id,
   EmployeeRelations
> {
   public readonly department: BelongsToAccessor<
      Department,
      typeof Employee.prototype.id
   >;
   public readonly title: BelongsToAccessor<
      Title,
      typeof Employee.prototype.id
   >;
   public readonly titleHistories: HasManyRepositoryFactory<
      TitleHistory,
      typeof Employee.prototype.id
   >;
   public readonly manager: BelongsToAccessor<
      Employee,
      typeof Employee.prototype.id
   >;

   // Add the 'employees' relationship to access subordinates
   public readonly employees: HasManyRepositoryFactory<
      Employee,
      typeof Employee.prototype.id
   >;

   constructor(
      @inject('datasources.management_systemDB')
      dataSource: ManagementSystemDbDataSource,
      @repository.getter('DepartmentRepository')
      protected departmentRepositoryGetter: Getter<DepartmentRepository>,
      @repository.getter('TitleRepository')
      protected titleRepositoryGetter: Getter<TitleRepository>,
      @repository.getter('TitleHistoryRepository')
      protected titleHistoryRepositoryGetter: Getter<TitleHistoryRepository>,
      @repository.getter('EmployeeRepository')
      protected employeeRepositoryGetter: Getter<EmployeeRepository>,
   ) {
      super(Employee, dataSource);

      // Initialize relationships
      this.manager = this.createBelongsToAccessorFor(
         'manager',
         employeeRepositoryGetter,
      );
      this.registerInclusionResolver('manager', this.manager.inclusionResolver);

      this.titleHistories = this.createHasManyRepositoryFactoryFor(
         'titleHistories',
         titleHistoryRepositoryGetter,
      );
      this.registerInclusionResolver(
         'titleHistories',
         this.titleHistories.inclusionResolver,
      );

      this.title = this.createBelongsToAccessorFor(
         'title',
         titleRepositoryGetter,
      );
      this.registerInclusionResolver('title', this.title.inclusionResolver);

      this.department = this.createBelongsToAccessorFor(
         'department',
         departmentRepositoryGetter,
      );
      this.registerInclusionResolver(
         'department',
         this.department.inclusionResolver,
      );

      // Initialize the 'employees' relationship to access subordinates
      this.employees = this.createHasManyRepositoryFactoryFor(
         'employees',
         employeeRepositoryGetter,
      );
      this.registerInclusionResolver(
         'employees',
         this.employees.inclusionResolver,
      );
   }
}

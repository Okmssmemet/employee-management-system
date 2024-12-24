import {Getter, inject} from '@loopback/core';
import {
   BelongsToAccessor,
   DefaultCrudRepository,
   repository,
} from '@loopback/repository';
import {ManagementSystemDbDataSource} from '../datasources';
import {
   Department,
   Employee,
   Title,
   TitleHistory,
   TitleHistoryRelations,
} from '../models';
import {DepartmentRepository} from './department.repository';
import {EmployeeRepository} from './employee.repository';
import {TitleRepository} from './title.repository';

export class TitleHistoryRepository extends DefaultCrudRepository<
   TitleHistory,
   typeof TitleHistory.prototype.id,
   TitleHistoryRelations
> {
   public readonly employee: BelongsToAccessor<
      Employee,
      typeof TitleHistory.prototype.id
   >;

   public readonly title: BelongsToAccessor<
      Title,
      typeof TitleHistory.prototype.id
   >;

   public readonly department: BelongsToAccessor<
      Department,
      typeof TitleHistory.prototype.id
   >;

   constructor(
      @inject('datasources.management_systemDB')
      dataSource: ManagementSystemDbDataSource,
      @repository.getter('EmployeeRepository')
      protected employeeRepositoryGetter: Getter<EmployeeRepository>,
      @repository.getter('TitleRepository')
      protected titleRepositoryGetter: Getter<TitleRepository>,
      @repository.getter('DepartmentRepository')
      protected departmentRepositoryGetter: Getter<DepartmentRepository>,
   ) {
      super(TitleHistory, dataSource);
      this.department = this.createBelongsToAccessorFor(
         'department',
         departmentRepositoryGetter,
      );
      this.registerInclusionResolver(
         'department',
         this.department.inclusionResolver,
      );
      this.title = this.createBelongsToAccessorFor(
         'title',
         titleRepositoryGetter,
      );
      this.registerInclusionResolver('title', this.title.inclusionResolver);
      this.employee = this.createBelongsToAccessorFor(
         'employee',
         employeeRepositoryGetter,
      );
      this.registerInclusionResolver(
         'employee',
         this.employee.inclusionResolver,
      );
   }
}

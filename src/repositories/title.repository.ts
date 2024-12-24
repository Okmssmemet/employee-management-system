import {Getter, inject} from '@loopback/core';
import {
   DefaultCrudRepository,
   HasManyRepositoryFactory,
   repository,
} from '@loopback/repository';
import {ManagementSystemDbDataSource} from '../datasources';
import {Employee, Title, TitleHistory, TitleRelations} from '../models';
import {EmployeeRepository} from './employee.repository';
import {TitleHistoryRepository} from './title-history.repository';

export class TitleRepository extends DefaultCrudRepository<
   Title,
   typeof Title.prototype.id,
   TitleRelations
> {
   public readonly titleHistories: HasManyRepositoryFactory<
      TitleHistory,
      typeof Title.prototype.id
   >;

   public readonly employees: HasManyRepositoryFactory<
      Employee,
      typeof Title.prototype.id
   >;

   constructor(
      @inject('datasources.management_systemDB')
      dataSource: ManagementSystemDbDataSource,
      @repository.getter('TitleHistoryRepository')
      protected titleHistoryRepositoryGetter: Getter<TitleHistoryRepository>,
      @repository.getter('EmployeeRepository')
      protected employeeRepositoryGetter: Getter<EmployeeRepository>,
   ) {
      super(Title, dataSource);
      this.employees = this.createHasManyRepositoryFactoryFor(
         'employees',
         employeeRepositoryGetter,
      );
      this.registerInclusionResolver(
         'employees',
         this.employees.inclusionResolver,
      );
      this.titleHistories = this.createHasManyRepositoryFactoryFor(
         'titleHistories',
         titleHistoryRepositoryGetter,
      );
      this.registerInclusionResolver(
         'titleHistories',
         this.titleHistories.inclusionResolver,
      );
   }
}

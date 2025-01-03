import {Getter, inject} from '@loopback/core';
import {
   DefaultCrudRepository,
   HasManyRepositoryFactory,
   repository,
} from '@loopback/repository';
import {ManagementSystemDbDataSource} from '../datasources';
import {Department, Location, LocationRelations} from '../models';
import {DepartmentRepository} from './department.repository';

export class LocationRepository extends DefaultCrudRepository<
   Location,
   typeof Location.prototype.id,
   LocationRelations
> {
   public readonly departments: HasManyRepositoryFactory<
      Department,
      typeof Location.prototype.id
   >;

   constructor(
      @inject('datasources.management_systemDB')
      dataSource: ManagementSystemDbDataSource,
      @repository.getter('DepartmentRepository')
      protected departmentRepositoryGetter: Getter<DepartmentRepository>,
   ) {
      super(Location, dataSource);
      this.departments = this.createHasManyRepositoryFactoryFor(
         'departments',
         departmentRepositoryGetter,
      );
      this.registerInclusionResolver(
         'departments',
         this.departments.inclusionResolver,
      );
   }
}

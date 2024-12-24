import {
   belongsTo,
   Entity,
   hasMany,
   model,
   property,
} from '@loopback/repository';
import {Employee} from './employee.model';
import {Location} from './location.model';

@model({settings: {strict: true}})
export class Department extends Entity {
   @property({
      type: 'number',
      id: true,
      generated: true,
   })
   id?: number;

   @property({
      type: 'string',
      required: true,
      jsonSchema: {
         minLength: 3,
         maxLength: 100,
         pattern: '^[a-zA-ZçÇğĞıİöÖşŞüÜ ]+$',
         errorMessage: {
            minLength: 'Department name must be at least 3 characters long.',
            maxLength: 'Department name cannot exceed 100 characters.',
            pattern: 'Department name can only contain letters and spaces.',
         },
      },
   })
   departmentName: string;

   @property({
      type: 'number',
      required: true,
   })
   managerId: number;

   @belongsTo(() => Location)
   locationId: number;

   @hasMany(() => Employee)
   employees: Employee[];

   constructor(data?: Partial<Department>) {
      super(data);
   }
}

export interface DepartmentRelations {}

export type DepartmentWithRelations = Department & DepartmentRelations;

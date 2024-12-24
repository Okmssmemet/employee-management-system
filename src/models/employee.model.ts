import {
   belongsTo,
   Entity,
   hasMany,
   model,
   property,
} from '@loopback/repository';
import {Department} from './department.model';
import {TitleHistory} from './title-history.model';
import {Title} from './title.model';

@model({settings: {strict: true}})
export class Employee extends Entity {
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
         minLength: 2,
         maxLength: 50,
         pattern: '^[a-zA-ZçÇğĞıİöÖşŞüÜ ]+$',
         errorMessage: {
            minLength: 'Name must be at least 2 characters long.',
            maxLength: 'Name cannot exceed 50 characters.',
            pattern: 'Name can only contain letters and spaces.',
         },
      },
   })
   name: string;

   @property({
      type: 'string',
      required: true,
      jsonSchema: {
         minLength: 2,
         maxLength: 50,
         pattern: '^[a-zA-ZçÇğĞıİöÖşŞüÜ ]+$',
         errorMessage: {
            minLength: 'Surname must be at least 2 characters long.',
            maxLength: 'Surname cannot exceed 50 characters.',
            pattern: 'Surname can only contain letters and spaces.',
         },
      },
   })
   surname: string;

   @property({
      type: 'string',
      required: true,
      jsonSchema: {
         pattern: '^\\+?[0-9]{10,15}$',
         errorMessage: {
            pattern:
               'Phone number must be between 10 and 15 digits, optionally starting with "+".',
         },
      },
   })
   phone: string;

   @property({
      type: 'string',
      required: true,
      jsonSchema: {
         format: 'email',
         errorMessage: {
            format:
               'Email must be a valid email address (e.g., user@example.com).',
         },
      },
      unique: true,
   })
   email: string;

   @property({
      type: 'string',
      required: true,
      format: 'date',
      errorMessage: {
         format: 'Start date must be a valid date in the format "YYYY-MM-DD".',
      },
   })
   startDate: string;

   @property({
      type: 'number',
      required: true,
      jsonSchema: {
         minimum: 0,
         errorMessage: {
            minimum: 'Salary must be at least 0.',
         },
      },
   })
   salary: number;

   @belongsTo(() => Department)
   departmentId: number;

   @belongsTo(() => Title)
   titleId: number;

   @hasMany(() => TitleHistory)
   titleHistories: TitleHistory[];

   @belongsTo(() => Employee)
   managerId?: number;

   @hasMany(() => Employee, {keyTo: 'managerId'})
   employees: Employee[];

   constructor(data?: Partial<Employee>) {
      super(data);
   }
}

export interface EmployeeRelations {}

export type EmployeeWithRelations = Employee & EmployeeRelations;

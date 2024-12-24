import {Entity, hasMany, model, property} from '@loopback/repository';
import {Employee} from './employee.model';
import {TitleHistory} from './title-history.model';

@model({settings: {strict: true}})
export class Title extends Entity {
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
         maxLength: 50,
         pattern: '^[a-zA-ZçÇğĞıİöÖşŞüÜ0-9 ]+$',
         errorMessage: {
            minLength: 'Title must be at least 3 characters long.',
            maxLength: 'Title cannot exceed 50 characters.',
            pattern: 'Title can only contain letters, numbers, and spaces.',
         },
      },
   })
   name: string;

   @hasMany(() => TitleHistory)
   titleHistories: TitleHistory[];

   @hasMany(() => Employee)
   employees: Employee[];

   constructor(data?: Partial<Title>) {
      super(data);
   }
}

export interface TitleRelations {
   employees: Employee[];
   titleHistories: TitleHistory[];
}

export type TitleWithRelations = Title & TitleRelations;

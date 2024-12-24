import {Entity, hasMany, model, property} from '@loopback/repository';
import {Department} from './department.model';

@model({settings: {strict: true}})
export class Location extends Entity {
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
         pattern: '^[a-zA-Z0-9 ]+$',
         errorMessage: {
            minLength: 'Location name must be at least 3 characters.',
            maxLength: 'Location name cannot exceed 100 characters.',
            pattern:
               'Location name can only contain letters, numbers, and spaces.',
         },
      },
   })
   locationName: string;

   @property({
      type: 'string',
      required: true,
      jsonSchema: {
         minLength: 10,
         maxLength: 200,
         errorMessage: {
            minLength: 'Address must be at least 10 characters.',
            maxLength: 'Address cannot exceed 200 characters.',
         },
      },
   })
   address: string;

   @property({
      type: 'string',
      required: true,
      jsonSchema: {
         pattern: '^\\d{5}(-\\d{4})?$',
         errorMessage: {
            pattern: 'Postal code must be in the format 12345 or 12345-6789.',
         },
      },
   })
   postalCode: string;

   @property({
      type: 'string',
      required: true,
      jsonSchema: {
         minLength: 2,
         maxLength: 50,
         pattern: '^[a-zA-Z ]+$',
         errorMessage: {
            minLength: 'City name must be at least 2 characters.',
            maxLength: 'City name cannot exceed 50 characters.',
            pattern: 'City name can only contain letters and spaces.',
         },
      },
   })
   city: string;

   @property({
      type: 'string',
      required: true,
      jsonSchema: {
         minLength: 2,
         maxLength: 50,
         pattern: '^[a-zA-Z ]+$',
         errorMessage: {
            minLength: 'Country name must be at least 2 characters.',
            maxLength: 'Country name cannot exceed 50 characters.',
            pattern: 'Country name can only contain letters and spaces.',
         },
      },
   })
   country: string;

   @hasMany(() => Department)
   departments: Department[];

   constructor(data?: Partial<Location>) {
      super(data);
   }
}

export interface LocationRelations {
   // describe navigational properties here
}

export type LocationWithRelations = Location & LocationRelations;

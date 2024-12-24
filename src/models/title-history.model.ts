import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Department} from './department.model';
import {Employee} from './employee.model';
import {Title} from './title.model';

@model({settings: {strict: true}})
export class TitleHistory extends Entity {
   @property({
      type: 'number',
      id: true,
      generated: true,
   })
   id?: number;

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
      type: 'string',
      required: false,
      format: 'date',
      errorMessage: {
         format: 'Start date must be a valid date in the format "YYYY-MM-DD".',
      },
   })
   endDate?: string;

   @belongsTo(() => Employee)
   employeeId: number;

   @belongsTo(() => Title)
   titleId: number;

   @belongsTo(() => Department)
   departmentId: number;

   constructor(data?: Partial<TitleHistory>) {
      super(data);
   }
}

export interface TitleHistoryRelations {}

export type TitleHistoryWithRelations = TitleHistory & TitleHistoryRelations;

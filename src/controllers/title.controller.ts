import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
   del,
   get,
   getModelSchemaRef,
   param,
   post,
   put,
   requestBody,
   response,
} from '@loopback/rest';
import {Employee, Title, TitleHistory} from '../models';
import {TitleRepository} from '../repositories';

export class TitleController {
   constructor(
      @repository(TitleRepository)
      public titleRepository: TitleRepository,
   ) {}

   @post('/titles')
   @response(200, {
      description: 'Title model instance',
      content: {'application/json': {schema: getModelSchemaRef(Title)}},
   })
   async create(
      @requestBody({
         content: {
            'application/json': {
               schema: getModelSchemaRef(Title, {
                  title: 'NewTitle',
                  exclude: ['id'],
               }),
            },
         },
      })
      title: Omit<Title, 'id'>,
   ): Promise<Title> {
      return this.titleRepository.create(title);
   }

   @get('/titles')
   @response(200, {
      description: 'Array of Title model instances',
      content: {
         'application/json': {
            schema: {
               type: 'array',
               items: getModelSchemaRef(Title, {includeRelations: true}),
            },
         },
      },
   })
   async find(@param.filter(Title) filter?: Filter<Title>): Promise<Title[]> {
      return this.titleRepository.find(filter);
   }

   @get('/titles/{id}')
   @response(200, {
      description: 'Title model instance',
      content: {
         'application/json': {
            schema: getModelSchemaRef(Title, {includeRelations: true}),
         },
      },
   })
   async findById(
      @param.path.number('id') id: number,
      @param.filter(Title, {exclude: 'where'})
      filter?: FilterExcludingWhere<Title>,
   ): Promise<Title> {
      return this.titleRepository.findById(id, filter);
   }

   @put('/titles/{id}')
   @response(204, {
      description: 'Title PUT success',
   })
   async replaceById(
      @param.path.number('id') id: number,
      @requestBody() title: Title,
   ): Promise<void> {
      await this.titleRepository.replaceById(id, title);
   }

   @del('/titles/{id}')
   @response(204, {
      description: 'Title DELETE success',
   })
   async deleteById(@param.path.number('id') id: number): Promise<void> {
      await this.titleRepository.deleteById(id);
   }

   @get('/titles/{id}/employees', {
      responses: {
         '200': {
            description: 'Array of Title has many Employee',
            content: {
               'application/json': {
                  schema: {type: 'array', items: getModelSchemaRef(Employee)},
               },
            },
         },
      },
   })
   async findEmployees(
      @param.path.number('id') id: number,
      @param.query.object('filter') filter?: Filter<Employee>,
   ): Promise<Employee[]> {
      return this.titleRepository.employees(id).find(filter);
   }

   @get('/titles/{id}/title-histories', {
      responses: {
         '200': {
            description: 'Array of Title has many TitleHistory',
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
   async findTitleHistories(
      @param.path.number('id') id: number,
      @param.query.object('filter') filter?: Filter<TitleHistory>,
   ): Promise<TitleHistory[]> {
      return this.titleRepository.titleHistories(id).find(filter);
   }
}

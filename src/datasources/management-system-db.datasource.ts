import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as dotenv from 'dotenv';

// .env dosyasını yükle
dotenv.config();

export const config = {
   name: 'management_systemDB',
   connector: 'postgresql',
   url: process.env.DB_URL,
   host: process.env.DB_HOST,
   port: Number(process.env.DB_PORT),
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
};
@lifeCycleObserver('datasource')
export class ManagementSystemDbDataSource
   extends juggler.DataSource
   implements LifeCycleObserver
{
   static dataSourceName = 'management_systemDB';
   static readonly defaultConfig = config;

   constructor(
      @inject('datasources.config.management_systemDB', {optional: true})
      dsConfig: object = config,
   ) {
      super(dsConfig);
   }
}

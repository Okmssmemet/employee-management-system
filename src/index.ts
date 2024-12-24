import * as dotenv from 'dotenv';
import {ApplicationConfig, EmployeeManagementApplication} from './application';

// .env dosyasını yükle
dotenv.config();

export * from './application';

export async function main(options: ApplicationConfig = {}) {
   const app = new EmployeeManagementApplication(options);
   await app.boot();
   await app.migrateSchema();
   await app.start();

   const url = app.restServer.url;
   console.log(`Server is running at ${url}`);
   console.log(`Try ${url}/explorer`);

   return app;
}

if (require.main === module) {
   // Run the application
   const config = {
      rest: {
         port: +(process.env.PORT ?? 3000),
         host: process.env.HOST ?? '0.0.0.0',
         gracePeriodForClose: 5000,
         openApiSpec: {
            setServersFromRequest: true,
         },
      },
   };
   main(config).catch(err => {
      console.error('Cannot start the application.', err);
      process.exit(1);
   });
}

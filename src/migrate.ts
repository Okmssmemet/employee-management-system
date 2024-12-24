import {EmployeeManagementApplication} from './application';

export async function migrate(args: string[]) {
   const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
   console.log(`Migrating schemas (${existingSchema} mode)...`);

   const app = new EmployeeManagementApplication();
   await app.boot();

   try {
      await app.migrateSchema({existingSchema});
   } catch (err) {
      console.error('Error during migration:', err);
   }

   process.exit(0);
}

migrate(process.argv).catch(err => {
   console.error('Cannot migrate database schema', err);
   process.exit(1);
});

import dbConnection from "@src/config/database-connection";
import { Logger } from "@src/config/logger";

interface ConnectionOptions {
   maxRetries?: number;
   retryInterval?: number;
}

export async function databaseHeathy(options: ConnectionOptions = {}): Promise<boolean> {
   const { maxRetries = 5, retryInterval = 5000 } = options;

   let attempt = 1;

   while (attempt <= maxRetries) {
      try {
         await dbConnection.connection.$queryRaw`SELECT 1`;

         Logger.publishTo({
            level: 'info',
            context: 'database',
            args: [
               { message: `Database connection successful on attempt ${attempt}` },
               'checkDatabaseConnection'
            ],
         });
         return true;
      } catch (error) {
         Logger.error({
            error: error,
            message: `Database connection failed (Attempt ${attempt}/${maxRetries})`
         }, 'checkDatabaseConnection');

         if (attempt === maxRetries) {
            Logger.error({ message: "Maximum connection attempts reached. Aborting..." }, 'checkDatabaseConnection');
            return false;
         }

         await new Promise(resolve => setTimeout(resolve, retryInterval));
         attempt++;
      }
   }

   return false;
}
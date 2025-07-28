import Env from "./config/environment-variable";
import { Logger } from "./config/logger";
import { server } from "./services/server";
import { resolveSequencialPromises } from "./utils";
import { databaseHeathy } from "./utils/checkDatabaseConnection";

async function bootstrap() {
   try {
      server.listen(Env.SERVER_PORT, Env.SERVER_HOST, () => {
         Logger.info({
            port: Env.SERVER_PORT,
            host: Env.SERVER_HOST,
            message: `Server is running`
         });
      });

      resolveSequencialPromises();

      setInterval(async () => {
         try {
            const connected = await databaseHeathy({
               maxRetries: 10,
               // retryInterval: 60000
            });

            if (!connected) {
               process.exit(1);
            }
         } catch (error) {
            Logger.error({
               error: error,
               message: 'General error when checking the database connection'
            });
         }
      }, 60000);
   } catch (error) {
      Logger.error({
         error: error,
         message: 'Setting up bootstrap failed'
      });

      throw error;
   }
}

bootstrap()
   .catch((error) => {
      Logger.error({
         error: error,
         message: "Initialization failed",
      });

      process.exit(1);
   });
import { Sequelize } from "sequelize";
import { Logger } from "./logger";
import Env from "./environment-variable";

class DatabaseConnection {
    public connection: Sequelize;
    private readonly MAX_RETRIES = 5;
    private readonly RETRY_DELAY_MS = 1000;

    public constructor() {
        this.connection = new Sequelize(Env.DATABASE_URI, {
            username: Env.DB_USERNAME,
            password: Env.DB_PASSWORD,
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            logging(sql, timing) {
                Logger.publishTo({
                    level: 'debug',
                    context: 'database-queries',
                    args: [
                        { query: sql, timing: timing },
                        'DatabaseConnection.connection'
                    ]
                });
            },
        });
    }

    public async connect(): Promise<void> {
        let attempt = 1;
        while (attempt <= this.MAX_RETRIES) {
            try {
                await this.connection.authenticate();
                Logger.info(`Connected to Database successfully on attempt ${attempt}/${this.MAX_RETRIES}`, 'PrismaService');
                return;
            } catch (error) {
                Logger.error(
                    {
                        error: error,
                        message: `Failed to connect to Database on attempt ${attempt}/${this.MAX_RETRIES}`
                    },
                    'PrismaService'
                );
                attempt++;
                await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY_MS));
            }
        }

        Logger.warn(
            'Max retries reached. Could not connect to the Database.',
            'PrismaService',
        );

        throw new Error(`Database connection failed after ${this.MAX_RETRIES} attempts`);
    }

    public async close() {
        try {
            await this.connection.close();
        } catch (error) {
            Logger.error({ error: error });
        }
    }
}

const dbConnection = new DatabaseConnection();

process.on("SIGINT", async () => {
    await dbConnection.close();
    Logger.info({ message: "Prisma disconnected" });
    process.exit(0);
});

export default dbConnection;

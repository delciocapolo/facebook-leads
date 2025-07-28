import { PrismaClient } from "@prisma/client";
import { Logger } from "./logger";

class DatabaseConnection {
    public connection = new PrismaClient();
    private readonly MAX_RETRIES = 5;
    private readonly RETRY_DELAY_MS = 1000;

    public async connect(): Promise<void> {
        let attempt = 1;
        while (attempt <= this.MAX_RETRIES) {
            try {
                await this.connection.$connect();
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
            await this.connection.$disconnect();
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

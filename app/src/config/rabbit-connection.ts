import { Logger } from "./logger";
import Env from "./environment-variable";
import { AmqpConnectionManager, connect } from "amqp-connection-manager";

class RabbitConnection {
    private env = Env;
    public connection: AmqpConnectionManager | null = null;
    private readonly MAX_RETRIES = 5;
    private readonly BASE_DELAY_MS = 2000;

    public async connect(): Promise<AmqpConnectionManager | undefined> {
        let attempt = 1;
        while (attempt <= this.MAX_RETRIES) {
            try {
                const connection = connect(this.env.RABBITMQ_URI, { reconnectTimeInSeconds: 2 });

                connection.on('connect', ({ url }) => {
                    Logger.info(`Connected to RabbitMQ at ${url}`, "AMQP");
                });

                connection.on('disconnect', ({ err }) => {
                    Logger.warn(`Disconnected from RabbitMQ: ${err.message}`, "AMQP");
                });

                connection.on('blocked', ({ reason }) => {
                    Logger.warn(`RabbitMQ connection blocked: ${reason}`, "AMQP");
                });

                connection.on('error', (err) => {
                    Logger.error(`RabbitMQ error: ${err.message}`, "AMQP");
                });

                this.connection = connection;
                return connection;
            } catch (error) {
                Logger.error(`Failed to connect to RabbitMQ (Attempt ${attempt}/${this.MAX_RETRIES})`, "AMQP");
                const delay = this.BASE_DELAY_MS * Math.pow(2, attempt - 1);
                await new Promise(resolve => setTimeout(resolve, delay));
                attempt++;
            }
        }

        throw new Error("Failed to connect to RabbitMQ after multiple attempts.");
    }

    public async close(): Promise<void> {
        if (this.connection) {
            await this.connection.close();
            this.connection = null;
            Logger.info("RabbitMQ connection closed.")
        }
    }
}

const rabbitConnection = new RabbitConnection();

process.on("SIGINT", async () => {
    await rabbitConnection.close();
    process.exit(0);
});

export default rabbitConnection;

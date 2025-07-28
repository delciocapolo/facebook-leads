import { Logger } from "@src/config/logger";
import rabbitConnection from "@src/config/rabbit-connection";
import { AmqpConnectionManager, Channel, ChannelWrapper } from "amqp-connection-manager";

namespace NamespaceConsumer {
  export interface Message {
    dest: string;
    origin: string;
    msg: string;
    type: string;
    [k: string]: unknown;
  }

  export interface ConsumeArgs {
    topicName: string;
    queue: string;
    exchange?: "direct" | "topic" | "fanout" | "headers";
    onMessage(content: any): void;
  }
}

class ExchangeConsumerService {
  private connection: AmqpConnectionManager | null = null;
  private channelWrapper: ChannelWrapper | null = null;

  constructor() {
    process.on("SIGINT", async () => {
      try {
        Logger.info({ message: "Closing consumer..." }, "ExchangeConsumerService");

        if (this.channelWrapper) {
          await this.channelWrapper.close();
          Logger.info({ message: "Channel closed" }, "ExchangeConsumerService");
        }

        process.exit(0);
      } catch (error) {
        Logger.error(
          {
            error: error,
            message: "Error closing channel"
          },
          "ExchangeConsumerService"
        );
        process.exit(1);
      }
    });
  }

  private async bootstrap() {
    if (!rabbitConnection.connection) {
      await rabbitConnection.connect();
    }

    this.connection = rabbitConnection.connection;
  }

  async consume(args: NamespaceConsumer.ConsumeArgs): Promise<void> {
    try {
      await this.bootstrap();

      const { topicName, queue, exchange = 'direct', onMessage } = args;

      if (this.connection) {
        this.channelWrapper = this.connection.createChannel({
          json: true,
          setup: async (channel: Channel) => {
            const topic = topicName;
            await channel.assertExchange(topic, exchange, { durable: true });

            const q = await channel.assertQueue(queue, { durable: true });
            await channel.bindQueue(q.queue, topic, "");

            await channel.consume(q.queue, (msg: any) => {
              if (msg) {
                Logger.info(
                  {
                    data: msg,
                    topic: topicName,
                    message: `Message consumed`,
                  }
                );
                const payload = JSON.parse(msg.content.toString());
                onMessage(payload);

                channel.ack(msg);
              }
            });

            Logger.info({ message: `Listening on queue: ${queue}` }, "ExchangeConsumerService");
          }
        });
      } else {
        Logger.error({ error: "Rabbit Connection not defined" }, "ConsumerRabbitService");
      }
    } catch (error) {
      Logger.error(
        {
          error: error,
          message: "Error while consuming messages"
        },
        "ConsumerService"
      );
    }
  }
}

const consumer = new ExchangeConsumerService();

export {
  consumer,
  NamespaceConsumer,
  ExchangeConsumerService,
}
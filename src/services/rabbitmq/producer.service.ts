import { Logger } from "@src/config/logger";
import rabbitConnection from "@src/config/rabbit-connection";
import { AmqpConnectionManager } from "amqp-connection-manager";

namespace NamespaceProducer {
  export interface PublishArgs {
    topicName: string;
    payload: unknown;
    exchange?: "direct" | "topic" | "fanout" | "headers";
  }
}

class ExchangeProducerService {
  private connection: AmqpConnectionManager | null = null;

  private async bootstrap() {
    if (!rabbitConnection.connection) {
      await rabbitConnection.connect();
    }

    this.connection = rabbitConnection.connection;
  }

  async publish(args: NamespaceProducer.PublishArgs): Promise<void> {
    const { topicName, payload, exchange = 'direct' } = args;
    try {
      await this.bootstrap();

      if (this.connection) {
        this.connection.createChannel({
          json: true,
          setup: async (channel: any) => {
            const topic = topicName;
            await channel.assertExchange(topic, exchange, { durable: true });
            const result = await channel.publish(topic, '', Buffer.from(JSON.stringify(payload)));

            if (result) {
              Logger.info(
                {
                  payload: payload,
                  topic: topic,
                  message: `Payload sent to topic ${topic}`
                },
                'ExchangeProducerService',
              );

              await channel.close();
            }
            else {
              Logger.error(
                {
                  payload: payload,
                  topic: topic,
                  message: `The payload was not sent to topic ${topic}`
                },
                'ExchangeProducerService',
              );

              await channel.close();
            }
          },
        });
      }
      else {
        Logger.error({ error: 'Rabbit Connection not defined' }, 'ProducerRabbit Service');
      }
    } catch (error) {
      Logger.error(
        { error },
        'Failed to send message',
        'ExchangeProducerService',
      );
    }
  }
}

const producer = new ExchangeProducerService();

export {
  producer,
  NamespaceProducer,
  ExchangeProducerService,
}

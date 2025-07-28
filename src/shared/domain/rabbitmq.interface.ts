export abstract class BrokerConfig {
  abstract getRabbitHost(): string;
  abstract getRabbitUser(): string;
  abstract getRabbitPassword(): string;
  abstract getRabbitURIs(): string[];
  abstract getRabbitPort(): number;
}

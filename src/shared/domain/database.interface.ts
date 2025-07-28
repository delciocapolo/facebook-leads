export abstract class DatabaseConfig {
  abstract getDatabaseHost(): string;
  abstract getDatabasePort(): number;
  abstract getDatabaseUser(): string;
  abstract getDatabasePassword(): string;
  abstract getDatabaseName(): string;
  abstract getDatabaseSync(): boolean;
  abstract getDatabaseURI(): string;
}

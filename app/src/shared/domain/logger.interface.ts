export abstract class ILogger {
  abstract info(error: unknown, message: string, ...args: any[]): void;
  abstract error(error: unknown, message: string, ...args: any[]): void;
  abstract silent(error: unknown, message: string, ...args: any[]): void;
  abstract debug(error: unknown, message: string, ...args: any[]): void;
  abstract fatal(error: unknown, message: string, ...args: any[]): void;
  abstract warn(error: unknown, message: string, ...args: any[]): void;
  abstract trace(error: unknown, message: string, ...args: any[]): void;
}

import * as path from 'node:path';
import * as fs from 'node:fs';
import P from 'pino';
import { ILogger } from "../shared/domain/logger.interface";
import { formatInTimeZone } from 'date-fns-tz';
import Env from './environment-variable';

namespace NamespaceLogger {
    export type LevelType =
        | 'info'
        | 'error'
        | 'silent'
        | 'debug'
        | 'fatal'
        | 'warn'
        | 'trace';
    export interface InterfacePublishProps {
        level: LevelType;
        context: string;
        args: any[];
    }
}

class LoggerService implements ILogger {
    private config: P.Logger = {} as P.Logger;
    private env = Env;

    private setContext(context: string): void {
        const logFile = path.resolve(
            process.cwd(),
            'src',
            'storage',
            'logs',
            `${context}.log`,
        );
        const logDir = path.dirname(logFile);

        try {
            fs.mkdirSync(logDir, { recursive: true });

            if (!fs.existsSync(logFile)) {
                fs.writeFileSync(logFile, '');
            }

            this.config = P(
                { timestamp: () => `,"timestamp":"${formatInTimeZone(new Date(), this.env.TIMEZONE, 'yyyy-MM-dd HH:mm:ss')}"` },
                P.destination(logFile),
            );
        } catch (error) {
            console.error(
                `Failed to set context for LoggerService: ${context}`,
                error,
            );
        }
    }

    private logWithOptionalError(level: NamespaceLogger.LevelType, ...params: any[]): boolean {
        if (!this.config) {
            console.error(`LoggerService not initialized yet | Context: ${level}`);
            return false;
        }

        this.setContext(level);

        if (typeof params[0] === 'string') {
            // params[0] é a mensagem, sem erro [error]
            this.config[level](params[0], ...params.slice(1));
        } else {
            // params[0] é o erro, params[1] é a mensagem de erro
            this.config[level](params[0], params[1], ...params.slice(2));
        }
        return true;
    }

    publishTo({ level, context, args }: NamespaceLogger.InterfacePublishProps) {
        const logFile = path.resolve(
            process.cwd(),
            'src',
            'storage',
            'logs',
            `${context}.log`,
        );
        const logDir = path.dirname(logFile);

        try {
            fs.mkdirSync(logDir, { recursive: true });

            if (!fs.existsSync(logFile)) {
                fs.writeFileSync(logFile, '');
            }

            const config = P(
                { timestamp: () => `,"timestamp":"${formatInTimeZone(new Date(), this.env.TIMEZONE, 'yyyy-MM-dd HH:mm:ss')}"` },
                P.destination(logFile),
            );

            if (typeof args[0] === 'string') {
                config[level](args[0], ...args.slice(1));
            } else {
                config[level](args[0], args[1], ...args.slice(2));
            }
        } catch (error) {
            console.error(
                `Failed to set context for LoggerService: ${context}`,
                error,
            );
        }
    }

    info(message?: string, ...args: any[]): void;
    info(error: object, message?: string, ...args: any[]): void;
    info(...params: any[]): void {
        this.logWithOptionalError('info', ...params);
    }

    error(message?: string, ...args: any[]): void;
    error(error: object, message?: string, ...args: any[]): void;
    error(...params: any[]): void {
        this.logWithOptionalError('error', ...params);
    }

    silent(message?: string, ...args: any[]): void;
    silent(error: object, message?: string, ...args: any[]): void;
    silent(...params: any[]): void {
        this.logWithOptionalError('silent', ...params);
    }

    debug(message?: string, ...args: any[]): void;
    debug(error: object, message?: string, ...args: any[]): void;
    debug(...params: any[]): void {
        this.logWithOptionalError('debug', ...params);
    }

    fatal(message?: string, ...args: any[]): void;
    fatal(error: object, message?: string, ...args: any[]): void;
    fatal(...params: any[]): void {
        this.logWithOptionalError('fatal', ...params);
    }

    warn(message?: string, ...args: any[]): void;
    warn(error: object, message?: string, ...args: any[]): void;
    warn(...params: any[]): void {
        this.logWithOptionalError('warn', ...params);
    }

    trace(message?: string, ...args: any[]): void;
    trace(error: object, message?: string, ...args: any[]): void;
    trace(...params: any[]): void {
        this.logWithOptionalError('trace', ...params);
    }

    public makeWASocketLogger() {
        const context: string = 'whatsapp-socket';
        const logFile = path.resolve(
            process.cwd(),
            'src',
            'storage',
            'logs',
            `${context}.log`,
        );
        const logDir = path.dirname(logFile);

        fs.mkdirSync(logDir, { recursive: true });

        if (!fs.existsSync(logFile)) {
            fs.writeFileSync(logFile, '');
        }

        const logger = P(
            { timestamp: () => `,"timestamp":"${formatInTimeZone(new Date(), this.env.TIMEZONE, 'yyyy-MM-dd HH:mm:ss')}"` },
            P.destination(logFile),
        );

        return logger;
    }
}

const Logger = new LoggerService();

export {
    NamespaceLogger,
    LoggerService,
    Logger,
};

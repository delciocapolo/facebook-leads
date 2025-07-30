import { z } from "zod";

const environmentVariableSchema = z.object({
    SERVER_PORT: z.coerce.number().default(3333),
    SERVER_HOST: z.string().default('127.0.0.1'),
    RABBITMQ_HOST: z.string().min(1, { message: "EnvVar [RABBITMQ_HOST] is not defined" }),
    RABBITMQ_DEFAULT_USER: z.string().min(1, { message: "EnvVar [RABBITMQ_DEFAULT_USER] is not defined" }),
    RABBITMQ_DEFAULT_PASSWORD: z.string().min(1, { message: "EnvVar [RABBITMQ_DEFAULT_PASSWORD] is not defined" }),
    RABBITMQ_PORT: z.coerce.number().default(5672),
    RABBITMQ_QUEUE: z.string().min(1, { message: "EnvVar [RABBITMQ_QUEUE] is not defined" }),
    DB_HOST: z.string().min(1, { message: "EnvVar [DB_HOST] is not defined" }),
    DB_PORT: z.coerce.number().default(3306),
    DB_USERNAME: z.string().min(1, { message: "EnvVar [DB_USERNAME] is not defined" }),
    DB_PASSWORD: z.string().min(1, { message: "EnvVar [DB_PASSWORD] is not defined" }),
    DB_NAME: z.string().min(1, { message: "EnvVar [DB_NAME] is not defined" }),
    DATABASE_SYNC: z
        .union([
            z.literal('development'),
            z.literal('production'),
            z.literal('testing'),
        ])
        .default('production'),
    TIMEZONE: z.string().min(1, { message: "EnvVar [TIMEZONE] is not defined" }),
})
    .transform((env) => ({
        ...env,
        RABBITMQ_URI: `amqp://${env.RABBITMQ_DEFAULT_USER}:${env.RABBITMQ_DEFAULT_PASSWORD}@${env.RABBITMQ_HOST}:${env.RABBITMQ_PORT}`,
        DATABASE_URI: `mysql://${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
    }));

const schemaValidate = environmentVariableSchema.safeParse(process.env);

if (!schemaValidate.success) {
    throw new Error(schemaValidate.error.message);
}

const Env = schemaValidate.data;

export default Env;

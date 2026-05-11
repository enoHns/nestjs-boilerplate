import { Module } from "@nestjs/common";
import { ConfigService, ConfigModule as NestjsConfigModule } from "@nestjs/config";
import * as Joi from "joi";

@Module({
    imports: [
        NestjsConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                DATABASE_URL: Joi.string().required(),
                JWT_SECRET: Joi.string().required(),
                JWT_EXPIRES_IN: Joi.string().default('7d'),
                PORT: Joi.number().default(3000),
            }),
        }),
    ],
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigModule {}

import { NestFactory } from '@nestjs/core';
import {
    DocumentBuilder,
    SwaggerCustomOptions,
    SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import * as path from 'path';
import * as express from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors();

    const config = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Api Docs')
        .setDescription('Api Documentation for VoiceHealth Guide')
        .setVersion('1.0')
        .build();

    const option: SwaggerCustomOptions = {
        swaggerOptions: {
            docExpanstion: 'none',
        },
    };

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document, option);

    app.use('/public', express.static(path.join(__dirname, '..', 'public')));

    await app.listen(process.env.BACKEND_PORT || 8080);
}
bootstrap();

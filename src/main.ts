import { NestFactory } from '@nestjs/core';
import {
    DocumentBuilder,
    SwaggerCustomOptions,
    SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app/app.module';

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

    await app.listen(process.env.BACKEND_PORT);
}
bootstrap();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@/modules/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { HistoryModule } from '@/modules/history/history.module';
import { HttpModule } from '@nestjs/axios';
import { DrugModule } from '@/modules/drug/drug.module';
import { NewsModule } from '@/modules/news/news.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                pool: true,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            },
            template: {
                dir: path.resolve(__dirname + '../../templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        ServeStaticModule.forRoot({
            rootPath: path.join(__dirname, '..', 'public'),
            serveRoot: '/public',
            exclude: ['/api*'],
        }),
        AuthModule,
        HistoryModule,
        DrugModule,
        NewsModule,
        HttpModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
    ],
})
export class AppModule {}

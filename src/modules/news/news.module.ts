import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { JwtStrategy } from '@/common/guards/jwt';
import { PrismaService } from '@/providers/prisma';
import { MailService } from '@/providers/mail/mail.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';

@Module({
    controllers: [NewsController],
    providers: [
        NewsService,
        PrismaService,
        JwtStrategy,
        AuthService,
        MailService,
    ],
    imports: [
        PassportModule,
        HttpModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
        }),
        AuthModule,
    ],
})
export class NewsModule {}
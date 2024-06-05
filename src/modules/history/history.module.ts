import { JwtStrategy } from '@/common/guards/jwt';
import { PrismaService } from '@/providers/prisma';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HistoryController } from './history.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { MailService } from '@/providers/mail/mail.service';
import { historyService } from './history.service';

@Module({
    controllers: [HistoryController],
    providers: [
        PrismaService,
        JwtStrategy,
        historyService,
        AuthService,
        MailService,
    ],
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
        }),
        AuthModule,
    ],
})
export class HistoryModule {}

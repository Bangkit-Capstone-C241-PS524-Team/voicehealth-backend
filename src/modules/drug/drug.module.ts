import { JwtStrategy } from '@/common/guards/jwt';
import { PrismaService } from '@/providers/prisma';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { HttpModule } from '@nestjs/axios';
import { MailService } from '@/providers/mail/mail.service';
import { DrugService } from './drug.service';
import { DrugController } from './drug.controller';

@Module({
    controllers: [DrugController],
    providers: [
        PrismaService,
        JwtStrategy,
        AuthService,
        MailService,
        DrugService,
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
export class DrugModule {}

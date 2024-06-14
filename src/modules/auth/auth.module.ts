import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '@/common/guards/jwt';
import { PrismaService } from '@/providers/prisma';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailService } from '@/providers/mail/mail.service';
import { GoogleStrategy } from '@/common/guards/google';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        PrismaService,
        MailService,
        JwtStrategy,
        GoogleStrategy,
    ],
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
        }),
    ],
})
export class AuthModule {}

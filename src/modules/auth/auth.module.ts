import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '@/common/guards/jwt';
// import { MailingService } from '@/providers/mail/mail.service';
import { PrismaService } from '@/providers/prisma';

// import { UserModule } from '../user/user.module';
// import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        PrismaService,
        // MailingService,
        // UserService,
        JwtStrategy,
    ],
    imports: [
        // UserModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
        }),
    ],
})
export class AuthModule {}

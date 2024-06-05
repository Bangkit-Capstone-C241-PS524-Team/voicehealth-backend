import { Injectable, NotFoundException } from '@nestjs/common';
import { comparePassword, hashPassword } from 'src/common/helpers/hash.helper';
import { PrismaService } from 'src/providers/prisma';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '@/providers/mail/mail.service';
import { ResendVerificationDtos } from './dtos/accountMutation.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private jwtService: JwtService,
        private mailService: MailService,
    ) {}

    async register(registerDto: RegisterDto) {
        const { username, name, email, password, no_telp } = registerDto;

        const isUsernameExist = await this.prismaService.user.findUnique({
            where: {
                username: username,
            },
        });

        if (isUsernameExist) {
            throw new NotFoundException('User already exists');
        }

        const isEmailExist = await this.prismaService.user.findUnique({
            where: {
                email: email,
            },
        });

        if (isEmailExist) {
            throw new NotFoundException('Email already exists');
        }

        const isNoTelp = await this.prismaService.user.findUnique({
            where: {
                no_telp: no_telp,
            },
        });

        if (isNoTelp) {
            throw new NotFoundException('No Telp already exists');
        }

        const hashedPassword = await hashPassword(password);

        const res = await this.prismaService.user.create({
            data: {
                username,
                name,
                email,
                password: hashedPassword,
                no_telp,
                is_verified: 0,
            },
        });

        delete res.password;

        this.sendEmailVerification(res.id, res.email);

        return res;
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.prismaService.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            throw new NotFoundException('Email dan atau password salah');
        }

        const validatePassword = await comparePassword(password, user.password);

        if (!validatePassword) {
            throw new NotFoundException('Email dan atau password salah');
        }

        if (user.is_verified === 0) {
            throw new NotFoundException('Email tidak terverifikasi');
        }

        return {
            access_token: this.jwtService.sign({
                username: user.username,
                id: user.id,
            }),
        };
    }

    async validateToken(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) throw new NotFoundException('User Not Found');

        delete user.password;

        return user;
    }

    async resendVerification(resendVerification: ResendVerificationDtos) {
        const { email } = resendVerification;

        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) throw new NotFoundException('User Not Found');

        delete user.password;

        this.sendEmailVerification(user.id, user.email);

        return user;
    }

    async sendEmailVerification(user_id: string, email: string) {
        const token = this.jwtService.sign({ userId: user_id });

        const url = `${process.env.BACKEND_URL}/verification?token=${token}`;

        this.mailService.sendEmail(email, 'Verify Account', url);
    }
  
    async findOne(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) throw new NotFoundException('User Not Found');

        delete user.password;

        return user;
    }

    async verifyUser(token: string) {
        const { userId } = this.jwtService.verify(token);

        await this.findOne(userId);

        return await this.prismaService.user.update({
            where: {
                id: userId,
            },

            data: {
                is_verified: 1,
            },
        });
    }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { comparePassword, hashPassword } from 'src/common/helpers/hash.helper';
import { PrismaService } from 'src/providers/prisma';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private jwtService: JwtService,
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

        // NOTE: send email verification
        // this.sendEmailVerification(newUser.id, newUser.email);

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

        // NOTE: is verify user
        // if (user.is_verified === 0) {
        //     throw new NotFoundException('Email tidak terverifikasi');
        // }

        return {
            access_token: this.jwtService.sign({
                username: user.username,
                id: user.id,
            }),
        };
    }
}

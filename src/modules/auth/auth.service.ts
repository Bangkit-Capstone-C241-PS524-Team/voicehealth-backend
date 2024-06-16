import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { comparePassword, hashPassword } from 'src/common/helpers/hash.helper';
import { PrismaService } from 'src/providers/prisma';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '@/providers/mail/mail.service';
import { ResendVerificationDtos } from './dtos/accountMutation.dto';
import { OAuth2Client } from 'google-auth-library';
import { GoogleDtos } from './dtos/google.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';

@Injectable()
export class AuthService {
    private oauthClient: OAuth2Client;
    constructor(
        private readonly prismaService: PrismaService,
        private jwtService: JwtService,
        private mailService: MailService,
    ) {
        this.oauthClient = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
        );
    }

    async register(registerDto: RegisterDto) {
        const { username, name, email, password } = registerDto;

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

        // const isNoTelp = await this.prismaService.user.findUnique({
        //     where: {
        //         no_telp: no_telp,
        //     },
        // });

        // if (isNoTelp) {
        //     throw new NotFoundException('No Telp already exists');
        // }

        const hashedPassword = await hashPassword(password);

        const res = await this.prismaService.user.create({
            data: {
                username,
                name,
                email,
                password: hashedPassword,
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

        const url = `${process.env.BACKEND_URL}/auth/verification?token=${token}`;

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

    async resetPasswordRequest(
        resetPasswordRequestDto: ResendVerificationDtos,
    ) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: resetPasswordRequestDto.email,
            },
        });

        if (!user) throw new NotFoundException('User didnt exists');

        const token = this.jwtService.sign({ userId: user.id });

        const url = `${process.env.BACKEND_URL}/reset-password?token=${token}`;

        this.mailService.sendEmail(
            resetPasswordRequestDto.email,
            'Reset Password',
            url,
        );

        return {
            email: user.email,
        };
    }

    async verifyToken(token: string) {
        const { userId } = this.jwtService.verify(token);

        if (!userId) throw new NotFoundException('Token invalid');

        return {
            token,
            userId,
        };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto, token: string) {
        const { userId } = this.jwtService.verify(token);

        await this.findOne(userId);

        if (!userId) throw new NotFoundException('User didnt exists');

        const hashedPassword = await hashPassword(resetPasswordDto.password);

        return await this.prismaService.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    }

    async googleLogin(googleDtos: GoogleDtos) {
        const { idToken } = googleDtos;

        const ticket = await this.oauthClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            throw new UnauthorizedException('Invalid Google token');
        }

        const { email, given_name: firstName, family_name: lastName } = payload;

        let user = await this.prismaService.user.findUnique({
            where: { email },
        });

        if (!user) {
            user = await this.prismaService.user.create({
                data: {
                    email,
                    username: lastName,
                    name: `${firstName} ${lastName}`,
                    password: '',
                    is_verified: 1,
                },
            });
        }

        const access_token = this.jwtService.sign({
            username: user.username,
            id: user.id,
        });

        return {
            user,
            access_token,
        };
    }
}

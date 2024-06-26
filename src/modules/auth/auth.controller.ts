import {
    Body,
    Controller,
    Get,
    HttpCode,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { Token } from '@/common/decorators/token.decorators';
import { JwtAuthGuard } from '@/common/guards/jwt';
import { ResponseMessage } from '@/common/decorators/response.decorator';
import { ResendVerificationDtos } from './dtos/accountMutation.dto';
import { GoogleDtos } from './dtos/google.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(201)
    @ResponseMessage('Success register')
    async register(@Body() register: RegisterDto) {
        const res = await this.authService.register(register);
        return res;
    }

    @Post('login')
    @HttpCode(201)
    @ResponseMessage('Success login')
    async login(@Body() login: LoginDto) {
        const res = await this.authService.login(login);
        return res;
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(200)
    @ResponseMessage('Token valid')
    async validateToken(@Token('id') id: string) {
        const user = await this.authService.validateToken(id);
        return user;
    }

    @Post('send-verification')
    @HttpCode(201)
    @ResponseMessage('Success send verification')
    async sendVerification(@Body() resendVerification: ResendVerificationDtos) {
        const user =
            await this.authService.resendVerification(resendVerification);
        return {
            email: user.email,
        };
    }

    @Get('verification')
    @HttpCode(200)
    @ResponseMessage('User successfully verified')
    async verifyUser(@Query('token') token: string) {
        const user = await this.authService.verifyUser(token);
        return {
            email: user.email,
        };
    }

    @Post('reset-password-request')
    @ResponseMessage('Email successfully sent')
    async resetPasswordRequest(
        @Body() resetPasswordRequest: ResendVerificationDtos,
    ) {
        const sendEmail =
            await this.authService.resetPasswordRequest(resetPasswordRequest);
        return sendEmail;
    }

    @Get('reset-password')
    @HttpCode(200)
    @ResponseMessage('Success get reset password token')
    async getResetPassword(@Query('token') token: string) {
        const res = await this.authService.verifyToken(token);
        return res;
    }

    @Patch('reset-password')
    @HttpCode(200)
    @ResponseMessage('Success update password')
    async resetPassword(
        @Body() resetPasswordDto: ResetPasswordDto,
        @Query('token') token: string,
    ) {
        const reset = await this.authService.resetPassword(
            resetPasswordDto,
            token,
        );
        return reset;
    }

    @Post('google')
    async googleAuthRedirect(@Body() googleDtos: GoogleDtos) {
        return this.authService.googleLogin(googleDtos);
    }
}

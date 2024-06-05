import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
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
}

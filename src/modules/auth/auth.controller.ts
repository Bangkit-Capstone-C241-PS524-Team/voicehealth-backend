import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(201)
    async register(@Body() register: RegisterDto) {
        const res = await this.authService.register(register);
        return res;
    }

    @Post('login')
    @HttpCode(201)
    async login(@Body() login: LoginDto) {
        const res = await this.authService.login(login);
        return res;
    }
}

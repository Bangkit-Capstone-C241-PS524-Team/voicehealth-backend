import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendVerificationDtos {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        example: 'mail@mail.com',
    })
    email: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        example: 'user_name',
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: 'password',
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        example: 'name name',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    // @ApiProperty({
    //     example: '+62812123123',
    // })
    // @IsPhoneNumber()
    // @IsNotEmpty()
    // no_telp: string;

    @ApiProperty({
        example: 'newuser@gmail.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

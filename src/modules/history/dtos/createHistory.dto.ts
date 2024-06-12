import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHistoryDto {
    // TODO: add fields
    @ApiProperty({
        example: 'name',
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}

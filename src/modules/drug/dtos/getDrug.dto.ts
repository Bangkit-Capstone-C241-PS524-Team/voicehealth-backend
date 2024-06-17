import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetDrugDtos {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'I got diarrhea',
    })
    keluhan: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetDrugDtos {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'I got diarrhea and potentially bloody in severe cases',
    })
    keluhan: string;
}
